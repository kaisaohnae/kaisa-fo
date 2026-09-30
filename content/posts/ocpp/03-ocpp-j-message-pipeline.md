---
slug: ocpp-03
order: 3
category: ocpp
categoryLabel: OCPP
title: "OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지"
summary: "Spring WebSocket으로 OCPP-J 서버를 직접 구현하며 정한 설계를 정리한다. 서브프로토콜 거부, 충전기 식별, 프레임 파싱, 스키마 대신 디코더를 쓴 이유, null 제거, 서버발 요청의 상관관계와 타임아웃까지 다룬다."
publishedAt: 2026-09-08
tags: ["ocpp", "websocket", "spring-boot", "json", "csms"]
---

# OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지

> 요약: Spring WebSocket으로 OCPP-J 서버를 직접 구현하며 정한 설계를 정리한다. 서브프로토콜 거부, 충전기 식별, 프레임 파싱, 스키마 대신 디코더를 쓴 이유, null 제거, 서버발 요청의 상관관계와 타임아웃까지 다룬다.

---

## 들어가며

OCPP 서버를 만들 때 선택지는 크게 두 가지다. 오픈소스 OCPP 프레임워크의 서버를 통째로 쓰거나, WebSocket은 직접 다루고 메시지 모델만 가져다 쓰거나. 나는 후자를 택했다. Java 진영의 OCPP 라이브러리에서 **요청·응답 모델 클래스와 `validate()`만 쓰고**, 전송·프레이밍·상관관계는 Spring WebSocket 위에 직접 만들었다.

이유는 운영 요구사항 때문이었다. 충전기 식별을 DB로 확인하고, 보안 프로파일별로 인증을 다르게 하고, 충전기의 잘못된 입력을 필드 단위로 관대하게 받고, 서버발 요청을 REST에서 호출하는 흐름을 프레임워크 안에서 맞추기가 더 어려웠다. 이 글은 그렇게 만든 파이프라인을 순서대로 따라간다.

## 1. 핸드셰이크: 연결을 받기 전에 걸러낸다

```
충전기 ──HTTP Upgrade──▶ [서브프로토콜 인터셉터] ─▶ [충전기 ID·인증 인터셉터] ─▶ [핸드셰이크 핸들러] ─▶ 연결
```

### 1.1 서브프로토콜: 안 맞으면 반드시 거절한다

충전기는 `Sec-WebSocket-Protocol: ocpp1.6` 같은 헤더로 원하는 버전을 알린다. 서버는 지원하는 것 하나를 골라 응답 헤더에 넣는다.

여기서 함정을 하나 밟았다. **Spring의 기본 핸드셰이크 핸들러는 서브프로토콜 협상이 실패해도 업그레이드를 완료할 수 있다.** 서버가 프로토콜을 고르지 않은 채 연결이 열리는 것이다. 인증 시험에는 `ocpp0.1` 같은 엉터리 프로토콜로 접속해서 서버가 거절하는지 보는 항목이 있고, 여기서 바로 떨어졌다.

그래서 핸드셰이크 전에 인터셉터를 하나 더 둔다.

```java
// 헤더가 있는데 지원 버전이 하나도 없으면 400으로 끊는다
List<String> offered = parseProtocols(request.getHeaders().get("Sec-WebSocket-Protocol"));
if (!offered.isEmpty() && offered.stream().noneMatch(p -> p.equalsIgnoreCase("ocpp1.6"))) {
    response.setStatusCode(HttpStatus.BAD_REQUEST);
    return false;
}
```

- 대소문자는 구분하지 않는다. 현장 충전기 중에 `OCPP1.6`을 보내는 기종이 있었다.
- **헤더가 아예 없는 경우는 허용했다.** 규격대로라면 거절해야 하지만 오래된 충전기 일부가 헤더 없이 붙는다. 시험에서는 "잘못된 값"만 거절하면 통과한다.
- 2.0.1 서버는 `ocpp2.0.1`과 `ocpp2.1`을 알고, 우선순위를 설정으로 둔다. Spring 6.2에서 서브프로토콜 선택 메서드 이름이 바뀌었으니 버전 올릴 때 확인하자.

### 1.2 충전기 식별과 인증

- ID는 URL 마지막 경로에서 꺼내고 `^[A-Za-z0-9_-]+$`로 검증한다.
- **DB에 없는 충전기는 403**, DB 조회 자체가 실패하면 **503**. 둘을 구분해야 장애 때 충전기가 "등록 안 됨"으로 오해받지 않는다.
- 보안 프로파일 1/2는 HTTP Basic. 사용자명은 충전기 ID와 같아야 하고, 비밀번호는 `MessageDigest.isEqual`로 상수 시간 비교한다. 헤더가 없으면 401(시험 항목이다).
- 프로파일 3은 mTLS라 Authorization 헤더가 없어도 받는다. 클라이언트 인증서 검증은 TLS 계층이 한다.
- 브라우저 시험 클라이언트는 헤더를 못 넣으므로 쿼리 파라미터로 받는 우회로를 두되, 운영 설정에서는 끌 수 있게 한다.

## 2. 프레임 파싱: 네 칸짜리 배열을 정확히 읽는다

수신 메시지는 이 순서로 처리한다.

1. JSON 파싱. 실패하면 uniqueId를 모르므로 `"unknown"`으로 CALLERROR를 보낸다.
2. **응답(3) 또는 오류(4)인지 먼저 본다.** 그렇다면 서버가 보낸 요청의 응답이므로, 대기 중인 Future를 완료시키고 아무것도 보내지 않는다(4장).
3. 요청(2)이면 형태를 엄격히 검사한다. 배열, 길이 4, 비어 있지 않은 문자열 uniqueId, 문자열 action, 객체 payload. 어기면 `FormationViolation`, 타입 번호가 이상하면 `NotSupported`.
4. (2.0.1) **부팅이 Accepted되기 전에는** BootNotification과 Heartbeat 외의 요청을 `SecurityError`로 거절한다. 이것도 시험 항목이다.
5. 액션 이름으로 핸들러를 찾는다. 모든 핸들러를 스프링 빈으로 만들어 `Map<String, Handler>`로 모아 두면 새 액션 추가가 클래스 하나로 끝난다. 없으면 `NotSupported`.

## 3. 검증: JSON 스키마 대신 액션별 디코더

OCA는 액션별 JSON 스키마를 제공한다. 처음에는 스키마 검증기를 붙이려 했지만, 결국 **런타임에는 쓰지 않고 참고 자료로만 저장소에 두었다.** 대신 액션마다 손으로 쓴 디코더가 있다.

```java
class StartTransactionRequestDecoder extends AbstractOcppActionRequestDecoder<StartTransactionRequest> {
    StartTransactionRequest decode(JsonNode p) {
        var req = new StartTransactionRequest();
        req.setConnectorId(requiredInt(p, "connectorId"));
        req.setIdTag(optionalText(p, "idTag"));          // 규격은 필수지만 현장 편차 때문에 관대하게
        req.setMeterStart(requiredInt(p, "meterStart"));
        req.setTimestamp(requiredDateTime(p, "timestamp"));
        return req;
    }
}
```

디코드 후에는 라이브러리 모델의 `validate()`를 한 번 더 돌린다. 디코더를 택한 이유는 현장 때문이다.

- **필수 필드가 비어 오는 충전기가 있다.** BootNotification의 `chargePointVendor`가 빈 문자열인 기종을 스키마대로 거절하면, 그 충전기는 영원히 부팅하지 못한다. 디코더에서 `"-"`로 채워 받고 경고를 남긴다.
- **별칭과 느슨한 enum.** 필드 이름 오타, 대소문자가 다른 enum 값을 필드 단위로 흡수할 수 있다.
- **인증 모드와 현장 모드를 나눌 수 있다.** 2.0.1 서버는 enum 파싱을 `requiredEnumValue`(엄격, 인증 시험용)와 `safeEnumValue`(관대, 현장·2.1용)로 나눴다.

대가도 분명하다. **손으로 쓴 디코더는 필드를 조용히 빠뜨릴 수 있다.** 실제로 겪은 사례들이다.

- 빈 배열이 정상인 필드를 "비어 있으면 안 됨"으로 막아 시험에서 떨어졌다.
- `Authorize`의 `certificate` 필드를 아예 읽지 않아 PnC 중앙 검증 시험이 실패했다.
- 계량값 샘플을 만들 때 `value`만 옮기고 `measurand`·`unit`·`phase`를 버리는 코드가 있으면, 서버는 정상 응답하고 시험도 통과하지만 **저장되는 데이터는 틀린다.** 시험은 "응답했는가"를 볼 뿐 "제대로 해석했는가"를 보지 않는다.

그래서 디코더에는 **입력 JSON → 도메인 객체의 필드 단위 비교 테스트**를 꼭 붙이자. 특히 MeterValues·TransactionEvent처럼 중첩 배열이 있는 메시지는 필수다.

## 4. 응답 만들기: null을 보내지 마라

응답은 라이브러리 모델(Confirmation)로 만들고, 보내기 직전에 `validate()`로 확인한다. 실패하면 `InternalError`를 보낸다. 직렬화에서 중요한 두 가지:

- **선택 필드는 생략해야 한다. `null`로 보내면 스키마 위반이다.** 시험 도구는 `"parentIdTag": null` 같은 값을 거절한다. Jackson에 `NON_NULL`을 걸고, 2.0.1 쪽은 중첩 객체까지 재귀적으로 null을 제거한다.
- **필드 없는 응답은 `{}`여야 한다.** ClearCache 같은 빈 모델을 직렬화할 때 예외가 나지 않도록 `FAIL_ON_EMPTY_BEANS=false`. 라이브러리 내부용 필드가 직렬화에 섞여 나가지 않는지도 확인하자.

## 5. 서버발 요청: 상관관계와 타임아웃

원격 시작, 설정 변경, 인증서 설치처럼 서버가 충전기에 요청하는 흐름은 보통 REST에서 시작된다. 운영자가 화면에서 버튼을 누르면 API 허브를 거쳐 OCPP 서버의 REST가 호출되고, 서버는 충전기에 CALL을 보낸 뒤 응답을 기다려 REST 응답으로 돌려준다.

```java
public CompletableFuture<JsonNode> sendRequest(String chargePointId, String action, Object payload, Duration timeout) {
    String uniqueId = UUID.randomUUID().toString();
    CompletableFuture<JsonNode> future = pendingRegistry.register(sessionId, uniqueId);
    send(session, "[2,\"" + uniqueId + "\",\"" + action + "\"," + toJson(payload) + "]");
    return future.orTimeout(timeout.toSeconds(), TimeUnit.SECONDS);
}
```

- 대기 목록의 키는 **(세션 ID, uniqueId)**. 충전기 ID가 아니라 세션 기준이어야 재접속 후 옛 응답이 새 요청에 붙지 않는다.
- CALLERROR는 예외(`OcppCallErrorException(errorCode, description)`)로 완료시켜 호출자가 구분할 수 있게 한다.
- **소켓이 닫히면 그 세션의 대기 요청을 전부 취소한다.** 안 하면 REST 호출이 타임아웃까지 매달린다.
- 타임아웃은 액션별로 다르게. 기본 60초, 서명 펌웨어처럼 충전기 쪽 처리가 긴 것은 3분까지 늘렸다.
- **BootNotification이 Accepted되기 전에는 서버발 요청을 막는다.** 단, Pending 상태에서 허용되는 요청(TriggerMessage, Get/ChangeConfiguration, Reset 등)은 예외로 둔다.

알고도 남겨 둔 한계가 두 가지 있다. OCPP-J는 **방향별로 동시에 하나의 CALL만 진행**하도록 권고하지만 우리 구현은 직렬화하지 않았고, REST 스레드가 `join()`으로 기다린다. 요청량이 적은 관리 기능이라 감수했지만, 대량 원격 명령이 필요해지면 충전기별 송신 큐를 먼저 만들 것이다.

## 6. 동시 전송: 세션 하나에 한 번에 하나씩

배포 직후 "blocking send를 기다리던 스레드가 인터럽트됨" 로그가 쏟아진 적이 있다. 톰캣의 blocking send는 **한 세션에서 동시 전송을 허용하지 않는데**, 핑 스케줄러와 응답 전송, 서버발 요청이 같은 세션에 동시에 쓰고 있었다. 모든 전송과 종료를 `synchronized (session)`으로 감싸 해결했다. Spring의 `ConcurrentWebSocketSessionDecorator`를 써도 된다. 핵심은 **세션에 쓰는 경로를 하나로 모으는 것**이다.

## 7. DataTransfer 라우팅

표준 밖의 메시지는 DataTransfer로 온다. 처리 규칙을 정해 두면 편하다.

- `vendorId`로 먼저 나눈다. 모르는 벤더는 `UnknownVendorId`, 알지만 모르는 messageId는 `UnknownMessageId`.
- `data`는 JSON으로 파싱을 시도하고, 안 되면 `{"raw": "..."}`로 감싸서 넘긴다. 문자열 안에 JSON을 넣어 보내는 충전기와 객체를 그대로 보내는 충전기가 섞여 있다.
- **messageId는 대소문자 무시, `.req` 접미사 유무도 무시.** 같은 메시지를 `tariff.req`, `Tariff`, `tariff`로 보내는 구현이 공존했다.
- 표준 PnC vendorId(`org.openchargealliance.iso15118pnc`)는 별도 라우트로 보내 네이티브 PnC와 같은 업무 로직을 태운다(8편).

## 정리

- 서브프로토콜은 **인터셉터에서 명시적으로 거절**하자. 프레임워크 기본값이 업그레이드를 통과시킬 수 있다.
- 충전기 식별은 경로, 인증은 보안 프로파일별로. "등록 안 됨(403)"과 "조회 실패(503)"를 나눈다.
- 스키마 검증 대신 **액션별 디코더**로 현장 편차를 필드 단위로 흡수했다. 대신 디코더의 필드 누락을 잡는 테스트가 반드시 필요하다.
- 응답에서 **null은 생략**, 빈 응답은 `{}`.
- 서버발 요청은 (세션, uniqueId)로 매칭하고, 세션 종료 시 일괄 취소, 액션별 타임아웃.
- 세션 쓰기는 한 곳으로 모아 **직렬화**한다.

다음 글에서는 이렇게 연결된 수천 개의 세션을 운영하면서 겪은 일, 중복 접속·배포 중 끊김·NAT 타임아웃·좀비 세션을 다룬다.

---

## OCPP 시리즈

1. [OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가](/posts/ocpp-01/)
2. [CSMS 아키텍처 — 버전별 OCPP 서버, API 허브, 레거시 공존](/posts/ocpp-02/)
3. **OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지** (현재 글)
4. [충전기 수천 대의 WebSocket 세션 운영기 — 중복 접속, 배포 끊김, NAT, 좀비 세션](/posts/ocpp-04/)
5. [트랜잭션과 계량값의 함정 — 멱등 처리, 늦게 온 Stop, 충전기 편차 정규화](/posts/ocpp-05/)
6. [OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것](/posts/ocpp-06/)
7. [OCPP 보안 프로파일과 인증서 운영 — Basic 인증부터 mTLS, SignCertificate까지](/posts/ocpp-07/)
8. [Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일](/posts/ocpp-08/)
9. [OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에](/posts/ocpp-09/)
10. [충전기 HMI를 WPF로 만들기 — 계층화, 정규화, 키오스크 UI, 무중단 업데이트](/posts/ocpp-10/)
