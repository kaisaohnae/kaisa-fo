---
slug: ocpp-01
order: 1
category: ocpp
categoryLabel: OCPP
title: "OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가"
summary: "전기차 충전기와 관제 서버(CSMS)가 대화하는 규격 OCPP를 실무 관점에서 정리한다. 1.6J에서 2.0.1, 2.1로 넘어가며 바뀐 메시지 구조, 트랜잭션 모델, Device Model, 보안과 ISO 15118을 비교한다."
publishedAt: 2026-09-02
tags: ["ocpp", "ev-charging", "csms", "ocpp1.6", "ocpp2.0.1", "ocpp2.1"]
---

# OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가

> 요약: 전기차 충전기와 관제 서버(CSMS)가 대화하는 규격 OCPP를 실무 관점에서 정리한다. 1.6J에서 2.0.1, 2.1로 넘어가며 바뀐 메시지 구조, 트랜잭션 모델, Device Model, 보안과 ISO 15118을 비교한다.

---

## 들어가며

충전 인프라 일을 하며 답답한일이 많았다. 규격 문서가 영어로만 있고, 예제 코드가 없고, 현장 충전기는 규격을 다르게 구현하고, 

여러 버전을 동시에 받아야 했다.

특히 기존 개발자가 작업해 놓은 2만줄 이상의 파이썬 레거시 코드를 이어가야 했으니

두손 두발 들며 어필한 후 결국 Spring Boot 로 변경하였다.

여러 프레임워크 선택지가 많았으나 주위 다른 개발자들과 함께 할수 있고 안정적인 길을 택했다.

enabled 플래그를 주입(Dependency Injection)이나 인터페이스 단에서 분기 처리하여 핵심 비즈니스 로직은 깔끔하게 정리하였고 

코딩 레이어화(Layering)을 하며 적당히 계층화 하였다.

블로킹 코드들을 제거하며 멀티 쓰레드 방식으로 바꾸며 

2천여대의 충전기지만 기존 성능에 비하면 엄청 안정적으로 개선 되었으며 기존 에러도 어마어마하게 수정했다.

1.6과 2.0.1 CSMS를 직접 만들고 OCA의 적합성 시험 도구(OCTT)로 두 버전 인증을 받은 뒤, 국내에서 막 시작된 Plug & Charge(PnC) 1차 필드 테스트까지 진행하면서 겪은 일을 정리한 기록이다. 

첫 글에서는 전체 지도를 그린다. 이후 글에서 아키텍처, 메시지 파이프라인, 세션 운영, 트랜잭션, 인증 시험, 보안·인증서, PnC, 관리 화면, 충전기 HMI까지 하나씩 깊게 들어간다.

## 1. OCPP는 어디에 있는가

충전 서비스를 계층으로 나누면 대략 이렇다.

```
[전기차] ──ISO 15118 / IEC 61851── [충전기(Charging Station)] ──OCPP── [CSMS] ──OCPI 등── [로밍·결제·다른 사업자]
```

- **OCPP(Open Charge Point Protocol)**: 충전기와 관제 서버(CSMS, Charging Station Management System) 사이의 규격. 부팅, 상태, 인증, 충전 시작·종료, 계량값, 원격 제어, 펌웨어, 보안을 다룬다.
- **ISO 15118 / IEC 61851**: 차량과 충전기 사이. PnC(차량이 인증서로 스스로 인증)는 15118의 영역이지만, 인증서를 발급·검증하는 길은 결국 OCPP를 타고 CSMS까지 온다.
- **OCPI 등**: 사업자 간 로밍. 이 시리즈의 범위 밖이다.

실무에서 기억할 점은 하나다. **CSMS 개발자는 충전기 펌웨어도, 차량 통신도 직접 만들지 않지만, 두 영역에서 생긴 문제는 전부 CSMS 로그에서 먼저 보인다.** 그래서 규격 경계를 정확히 알아야 "이건 충전기 쪽 문제다"라고 말할 수 있다.

하지만 이것저것 도와주며 같이하다보면 도움이 많이 된다.

## 2. 전송 방식: OCPP-J는 WebSocket 위의 JSON 배열이다

1.6부터 사실상의 표준이 된 OCPP-J는 WebSocket 연결 하나에 JSON 배열을 주고받는다. 1.5까지 쓰이던 SOAP 방식은 이제 현장에서 거의 보지 못했다.

```json
[2, "a1b2c3", "BootNotification", {"chargePointVendor": "Example", "chargePointModel": "X1"}]
[3, "a1b2c3", {"status": "Accepted", "currentTime": "2026-09-01T00:00:00Z", "interval": 1800}]
[4, "a1b2c3", "FormationViolation", "payload is not valid", {}]
```

- `2` = CALL(요청), `3` = CALLRESULT(응답), `4` = CALLERROR(오류). 2.1에서는 여기에 응답이 필요 없는 알림용 `SEND`(6) 등이 추가됐다.
- 두 번째 요소는 요청과 응답을 짝짓는 `uniqueId`다. 양방향 모두 요청을 보낼 수 있으므로 **서버도 충전기에 CALL을 보내고 응답을 기다린다.**
- 충전기 식별은 보통 접속 URL의 마지막 경로(`wss://csms.example.com/ocpp/CP001`)로 한다.
- 버전 협상은 WebSocket 핸드셰이크의 `Sec-WebSocket-Protocol` 헤더(`ocpp1.6`, `ocpp2.0.1`, `ocpp2.1`)로 한다.

이 단순함 덕분에 구현 진입 장벽은 낮지만, 그만큼 "규격이 정하지 않은 부분"을 구현체마다 다르게 채운다. 충전기 제조사마다 조금씩 다른 해석을 받아내는 것이 CSMS의 일상이다.

spring 에 장점!! 배포는 야물딱지게 야물파일로 불가피한 버전들은 나눠 젠킨스로 배포했다. 

- application-prod.yml
- application-prod-profile2.yml
- application-prod-profile3.yml

로그도 logback 으로 나누고 중앙로그서버에 전송한다. 
- logback-prod.xml
- logback-prod-profile2.xml
- logback-prod-profile3.xml

## 3. 현장의 기본값

1.6은 2015년에 나왔고, 이후 보안 백서(Security Whitepaper)로 보안 프로파일·인증서 관리·서명 펌웨어가 확장됐다. 국내외 현장 충전기 대부분이 여전히 1.6 일듯하다.

**기능 프로파일**로 메시지를 묶는다.

| 프로파일 | 대표 메시지 |
|---|---|
| Core | BootNotification, Heartbeat, StatusNotification, Authorize, StartTransaction, StopTransaction, MeterValues, DataTransfer, RemoteStart/StopTransaction, ChangeConfiguration, GetConfiguration, Reset, UnlockConnector |
| Firmware Management | UpdateFirmware, GetDiagnostics, FirmwareStatusNotification, DiagnosticsStatusNotification |
| Local Auth List | GetLocalListVersion, SendLocalList |
| Reservation | ReserveNow, CancelReservation |
| Smart Charging | SetChargingProfile, ClearChargingProfile, GetCompositeSchedule |
| Remote Trigger | TriggerMessage |
| (보안 확장) | SignCertificate, CertificateSigned, InstallCertificate, GetInstalledCertificateIds, DeleteCertificate, SignedUpdateFirmware, GetLog, SecurityEventNotification, ExtendedTriggerMessage |

1.6의 특징을 실무 관점에서 요약하면 이렇다.

- **충전기 = 커넥터 목록.** `connectorId` 0은 충전기 전체, 1..N이 각 커넥터다. EVSE라는 중간 계층이 없다.
- **트랜잭션은 Start/Stop 두 메시지.** StartTransaction 응답으로 서버가 정수 `transactionId`를 발급한다. 서버가 ID를 만들기 때문에 오프라인 상황과 중복 전송에서 문제가 많이 생긴다(5편에서 다룬다).
- **설정은 키-값.** `GetConfiguration`/`ChangeConfiguration`으로 문자열 키(`HeartbeatInterval`, `MeterValueSampleInterval` 등)를 읽고 쓴다. 제조사 확장 키가 자유롭게 섞인다.
- **표준에 없는 건 전부 DataTransfer.** 요금, 결제, QR, 부가 상태 같은 사업 로직이 `vendorId` + `messageId` + 자유 형식 `data`로 오간다. 뒤에서 보겠지만 1.6에서 PnC도 DataTransfer로 싣는다.

## 4. 2.0.1: 모델이 바뀐 버전

2.0(2018)을 거쳐 2020년에 나온 2.0.1은 사실상 새 규격이다. 메시지 이름이 비슷해 보여도 **데이터 모델이 다르기 때문에 1.6 코드를 고쳐서 쓰는 방식으로는 오래 못 간다.** 직접 겪은 차이를 중요한 순서로 정리한다.

### 4.1 트랜잭션: TransactionEvent 하나로 통합

```
1.6:  StartTransaction → MeterValues … → StopTransaction
2.0.1: TransactionEvent(Started) → TransactionEvent(Updated) … → TransactionEvent(Ended)
```

- `transactionId`를 **충전기가 문자열(UUID 등)로 만든다.** 서버 발급 정수가 사라지면서 오프라인 시작이 자연스러워졌다.
- 이벤트마다 `seqNo`가 붙어 중복·순서 역전을 판별할 수 있다.
- `triggerReason`(CablePluggedIn, Authorized, EnergyLimitReached…)과 `chargingState`로 "왜 이 이벤트가 왔는지"를 알려준다.
- 케이블을 먼저 꽂으면 인증 전에 Started가 온다. 즉 **트랜잭션 시작 = 인증 성공이 아니다.** 1.6식 사고로 접근하면 여기서 가장 많이 헤맨다.

### 4.2 EVSE 계층

```
Charging Station ─┬─ EVSE 1 ─┬─ Connector 1 (CCS1)
                  │          └─ Connector 2 (CHAdeMO)
                  └─ EVSE 2 ─── Connector 1
```

EVSE는 "동시에 한 대만 충전할 수 있는 단위", 커넥터는 물리적인 건(gun)이다. 1.6의 `connectorId` 하나로 표현하던 것을 `evseId` + `connectorId`로 나눈다. 기존 DB가 "충전기 채널 번호" 한 칸으로 설계돼 있다면 매핑 규칙을 반드시 문서로 남겨야 한다.

### 4.3 Device Model: 설정의 구조화

1.6의 평평한 키-값 대신 **Component / Variable / Attribute** 구조를 쓴다.

```
Component: OCPPCommCtrlr   Variable: OfflineThreshold   Attribute: Actual  → "120"
Component: AuthCtrlr       Variable: AuthorizeRemoteStart Attribute: Actual → "true"
Component: EVSE(evseId=1)  Variable: Power              Attribute: MaxSet → "50000"
```

`GetVariables`/`SetVariables`로 개별 값을, `GetBaseReport`(ConfigurationInventory, FullInventory, SummaryInventory)로 전체 목록을 받고, 충전기는 `NotifyReport`로 결과를 여러 번에 나눠 보낸다. `SetVariableMonitoring`과 `NotifyEvent`로 값의 변화를 감시할 수도 있다. 제대로 쓰려면 서버가 충전기별 Device Model 저장소를 가져야 하는데, 처음부터 다 만들 필요는 없다. 인증 시험에 필요한 요청 기능부터 만들고 저장은 뒤로 미뤄도 된다.

### 4.4 보안이 본문으로 들어옴

1.6에서 백서로 따로 있던 보안 프로파일(0~3), 인증서 관리, 서명 펌웨어, 보안 이벤트가 2.0.1에서는 규격 본문이다. 인증 시험도 보안 섹션(A)부터 시작한다. 7편에서 자세히 다룬다.

### 4.5 ISO 15118(PnC) 네이티브 지원

1.6에서는 DataTransfer로 우회하던 PnC 메시지가 정식 액션이 됐다.

- `Authorize`에 `iso15118CertificateHashData` 또는 계약 인증서 PEM
- `Get15118EVCertificate`(차량 계약 인증서 설치·갱신), `GetCertificateStatus`(OCSP)
- `SignCertificate` / `CertificateSigned`(충전기 인증서), `InstallCertificate` / `DeleteCertificate` / `GetInstalledCertificateIds`
- `NotifyEVChargingNeeds` → `SetChargingProfile`(15118 기반 스마트 충전)

### 4.6 그 밖에 체감이 큰 변화

- **디스플레이 메시지**: `SetDisplayMessage`로 충전기 화면에 문구를 띄운다.
- **요금 표시**: `CostUpdated`, `TransactionEvent` 응답의 `totalCost`.
- **로컬 제어기, 네트워크 프로파일**: `SetNetworkProfile`로 접속 정보를 원격 변경.
- **메시지 수**가 1.6의 약 두 배로 늘었고 JSON 스키마가 훨씬 엄격하다. 선택 필드에 `null`을 넣으면 스키마 위반이다(3편).

## 5. 2.1: 2.0.1의 확장판

2.1은 2025년 초에 공개됐다. 2.0.1과 하위 호환을 목표로 만들어져서 대부분의 메시지가 그대로이고, 필드와 기능이 추가됐다.

- **양방향 충전(V2X)**, 로컬 에너지 관리, 배터리 교환
- **요금(Tariff) 모델 강화**, 선불·임시 결제 흐름
- `allowedEnergyTransfer`, `tariffId`, `operationMode` 같은 필드 추가
- 응답 없는 메시지 타입, 대량 메시지 처리 개선

실무에서 내린 결정은 **"2.0.1 모델로 구현하고, 2.1 필드는 스위치 하나 뒤에 숨긴다"**였다. 서브프로토콜 협상 우선순위를 `ocpp2.0.1`로 두고, 2.1 확장 파싱은 코드로는 준비하되 기본값 꺼짐으로 둔다. 현장 충전기가 2.1을 말하기 시작할 때 설정만 바꾸면 된다. 다만 저장소 이름을 "ocpp21"로 지어 놓으면 "우리 2.1 된다"로 오해받기 쉬우니, README에 "현재 협상 프로토콜은 2.0.1"이라고 분명히 적어 두는 편이 좋다.

## 6. 버전별 비교표

| 항목 | 1.6J | 2.0.1 | 2.1 |
|---|---|---|---|
| 서브프로토콜 | `ocpp1.6` | `ocpp2.0.1` | `ocpp2.1` |
| 장치 모델 | 충전기 + 커넥터 | 충전기 + EVSE + 커넥터 | 동일 |
| 트랜잭션 | Start/StopTransaction, 서버 발급 정수 ID | TransactionEvent, 충전기 발급 문자열 ID, seqNo | 동일 + 확장 필드 |
| 설정 | 키-값 Configuration | Device Model(Component/Variable) | 동일 |
| 보안 | 백서(확장) | 본문 | 본문 |
| ISO 15118 PnC | DataTransfer로 우회 | 네이티브 | 네이티브 + 확장 |
| 요금 | DataTransfer | CostUpdated, totalCost | Tariff 모델 강화 |
| 인증 시험 | OCTT 1.6 | OCTT 2.0.1 | 준비 중인 곳이 많음 |

## 7. 어떤 버전부터 만들까

두 버전을 모두 만들어 본 경험으로 정리하면 이렇다.

1. **현장에 1.6 충전기가 있다면 1.6부터.** 매출은 1.6에서 나온다. 보안 확장(프로파일 2/3, SignCertificate)까지 넣어야 앞으로의 입찰 요건을 맞춘다.
2. **2.0.1은 별도 서버(또는 별도 모듈)로.** 공통 로직(회원, 요금, 이력 저장)은 공유하되, 프로토콜 계층은 버전별로 분리하는 편이 결과적으로 덜 아팠다. 1.6 코드에 2.0.1을 끼워 넣으면 `if (version == ...)`이 끝없이 늘어난다.
3. **내부 도메인 모델을 먼저 정한다.** "트랜잭션", "충전 채널", "계량 샘플"을 버전 중립적으로 정의하고, 각 버전 파서가 그 모델로 변환하게 한다. 이걸 늦게 하면 2.0.1의 TransactionEvent를 1.6의 Start/Stop으로 억지로 쪼개는 코드가 생기고, 결국 이름만 1.6인 로직(`meterStart`, `StopTransactionFeeCalculator`)이 2.0.1 서버에 남는다. 우리도 그랬다.
4. **인증 시험(OCTT)을 개발 초기에 돌린다.** 규격 해석이 맞는지 가장 빨리 알려주는 도구다. 6편에서 자세히 다룬다.

## 정리

- OCPP-J는 WebSocket 위의 `[타입, id, 액션, 페이로드]` 배열이다. 단순하지만 규격 밖의 해석 차이를 받아내는 것이 CSMS의 몫이다.
- 1.6은 현장의 기본값, 2.0.1은 모델이 다른 새 규격, 2.1은 2.0.1의 확장이다.
- 버전 간 가장 큰 차이는 트랜잭션 모델(Start/Stop vs TransactionEvent), 장치 계층(EVSE), 설정 구조(Device Model), 보안·PnC의 위치다.
- 버전 중립 도메인 모델을 먼저 세우고 프로토콜 계층을 버전별로 분리하자.

다음 글에서는 이 버전들을 한 시스템 안에서 어떻게 나눠 배치했는지, CSMS 전체 아키텍처를 다룬다.

---

## OCPP 시리즈

1. **OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가** (현재 글)
2. [CSMS 아키텍처 — 버전별 OCPP 서버, API 허브, 레거시 공존](/posts/ocpp-02/)
3. [OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지](/posts/ocpp-03/)
4. [충전기 수천 대의 WebSocket 세션 운영기 — 중복 접속, 배포 끊김, NAT, 좀비 세션](/posts/ocpp-04/)
5. [트랜잭션과 계량값의 함정 — 멱등 처리, 늦게 온 Stop, 충전기 편차 정규화](/posts/ocpp-05/)
6. [OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것](/posts/ocpp-06/)
7. [OCPP 보안 프로파일과 인증서 운영 — Basic 인증부터 mTLS, SignCertificate까지](/posts/ocpp-07/)
8. [Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일](/posts/ocpp-08/)
9. [OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에](/posts/ocpp-09/)
10. [충전기 HMI를 WPF로 만들기 — 계층화, 정규화, 키오스크 UI, 무중단 업데이트](/posts/ocpp-10/)
