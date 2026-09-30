---
slug: ocpp-08
order: 8
category: ocpp
categoryLabel: OCPP
title: "Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일"
summary: "국내에서 막 시작된 PnC 1차 테스트를 진행하며 터득한 것을 정리한다. V2G 루트·CPO 서브 CA·계약 인증서로 이어지는 PKI 구조, OCPP 1.6 DataTransfer와 2.0.1 네이티브 메시지, OCSP 검증을 fail-closed로 설계한 이유, 목 PKI를 만들며 배운 것, 현장에서 발견한 버그들."
publishedAt: 2026-09-23
tags: ["ocpp", "plug-and-charge", "iso15118", "pki", "ocsp", "v2g"]
---

# Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일

> 요약: 국내에서 막 시작된 PnC 1차 테스트를 진행하며 터득한 것을 정리한다. V2G 루트·CPO 서브 CA·계약 인증서로 이어지는 PKI 구조, OCPP 1.6 DataTransfer와 2.0.1 네이티브 메시지, OCSP 검증을 fail-closed로 설계한 이유, 목 PKI를 만들며 배운 것, 현장에서 발견한 버그들.

---

## 들어가며

Plug & Charge(PnC)는 케이블을 꽂기만 하면 차량이 스스로 인증하고 충전·결제까지 끝나는 방식이다. 카드도 앱도 필요 없다. 기술적으로는 ISO 15118의 인증서 기반 인증이고, 국내에서는 공용 PKI를 운영하는 기관의 가이드라인에 따라 사업자들이 1차 연동 테스트를 진행하고 있다.

이 테스트에 참여하며 가장 크게 깨달은 것은 이것이다. **PnC 프로젝트에서 CSMS 개발자는 사실상 PKI 통합 담당자가 된다.** 차량과 충전기 사이의 15118 메시지(EXI)는 충전기 개발자의 일이지만, CSR 발급, 인증서 체인 전달, 갱신, 폐기, OCSP 검증은 모두 CSMS를 거친다.

## 1. 인증서 체계 한 장으로 보기

```
V2G Root CA ── CPO Sub-CA 1 ── CPO Sub-CA 2 ── SECC 리프 (충전기)

MO Root CA  ── MO Sub-CA 1  ── MO Sub-CA 2  ── 계약 인증서 (차량, EMAID)

OEM Root CA ── OEM Sub-CA   ── OEM 프로비저닝 인증서 (차량 출고 시, PCID)
```

- **V2G 루트**: 충전 생태계 전체의 신뢰 기준. 충전기에 설치돼 있어야 한다.
- **CPO(충전 사업자) 서브 CA → SECC 리프**: 충전기가 차량과 TLS를 맺을 때 내미는 인증서. 충전기가 CSR을 만들고 CSMS를 거쳐 발급받는다.
- **MO(e-모빌리티 사업자) 루트 → 계약 인증서**: 차량이 "나는 어느 사업자의 어느 계약(EMAID)"이라고 증명하는 인증서.
- **OEM 프로비저닝 인증서(PCID)**: 차량 제조 시 들어간 인증서. 계약 인증서를 설치받을 때 신원 증명으로 쓴다.
- **OCSP 응답기**: 각 인증서의 폐기 여부를 알려준다. 주소는 인증서의 AIA 확장에 있다(`openssl x509 -text`로 확인).

충전기가 가지는 것: SECC 리프 + 개인 키, V2G 루트, (필요 시) MO 루트. 차량이 가지는 것: 계약 인증서 + 개인 키, OEM 프로비저닝 인증서.

## 2. CSMS가 처리하는 흐름 다섯 가지

### 2.1 충전기 인증서 발급 (SignCertificate)

충전기가 `certificateType=V2GCertificate`로 CSR을 보내면, CSMS는 PKI의 리프 발급 API를 호출해 체인을 받아 CertificateSigned로 돌려준다(7편의 흐름과 같다). PnC에서 추가로 챙긴 것:

- 가이드라인이 요구하는 필드(도메인 구분, 15118 버전, CSR은 헤더 없는 base64 DER)를 정확히.
- 발급 시리얼·만료일 저장, 만료 임박 배치로 재발급 트리거.
- 충전기가 보고하는 자기 인증서 해시와 마지막 발급 시리얼이 다르면 재발급을 유도하는 안전망(가이드라인에 없는, 운영자 쪽 판단).

### 2.2 계약 인증서 설치·갱신 (Get15118EVCertificate)

차량이 계약 인증서를 요청하면, 충전기는 차량이 보낸 EXI 요청을 그대로 base64로 담아 CSMS에 보낸다. CSMS는 이걸 **해석하지 않고** PKI(계약 인증서 풀)로 넘기고, 받은 EXI 응답을 충전기로 돌려준다.

- 처음에는 PCID(차량 식별)를 미리 알아야 조회할 수 있는 API를 썼다. 카드 태깅 같은 사전 단계가 필요했다. 가이드라인의 "설치 요청 자체로 검색" 엔드포인트로 바꾸면서, PKI가 EXI에서 프로비저닝 인증서를 꺼내 PCID·EMAID와 서명된 계약 데이터를 돌려주게 됐다. **순수하게 꽂기만 해서 설치**가 가능해졌다.
- 이 API에는 **MO(모빌리티 사업자) 식별자**를 보내야 한다. CPO 식별자를 보내면 빈 응답이 온다. 한 회사가 CPO와 MO를 겸하면 헷갈리기 쉽다.
- 받은 PCID/EMAID가 우리 회원 차량이거나 로밍 대상일 때만 응답을 전달한다.
- 응답은 `Accepted + exiResponse` 또는 `Failed + 빈 문자열`. 두 필드 모두 스키마상 필수다.

### 2.3 계약 인증서로 인증 (Authorize)

차량이 계약 인증서로 인증하면 충전기는 Authorize를 보낸다. 두 가지 형태가 있다.

- **해시 데이터(`iso15118CertificateHashData`)**: 충전기가 체인 각 단계의 해시와 OCSP 주소를 보낸다. CSMS가 OCSP로 확인한다.
- **PEM 인증서(`certificate`)**: 충전기가 인증서를 통째로 보내고 CSMS가 검증한다.

응답에는 `idTokenInfo.status`뿐 아니라 **`certificateStatus`를 반드시** 넣는다. `idTokenInfo`만 Accepted로 보내 시험에서 떨어진 적이 있다.

### 2.4 인증서 상태 조회 (GetCertificateStatus)

충전기가 자기 체인(서브 CA)의 폐기 여부를 확인하려고 OCSP 요청 데이터를 보낸다. CSMS는 RFC 6960 `OCSPRequest`를 직접 만들어 응답기에 POST하고, DER 응답을 base64로 돌려준다.

```java
CertificateID id = new CertificateID(
    digestCalculator(hashAlgorithm),                 // 충전기가 쓴 SHA-256/384/512 그대로
    issuerNameHash, issuerKeyHash, new BigInteger(serialHex, 16));
OCSPReq req = new OCSPReqBuilder().addRequest(id).build();
// POST application/ocsp-request → responderURL
```

`Accepted`로 응답하면 `ocspResult`가 **반드시** 있어야 한다. 비워 보내 시험에서 떨어졌다.

### 2.5 루트 인증서 동기화와 폐기

- 매일 새벽 PKI에서 V2G·MO 루트 목록을 받아, 바뀐 것만 연결된 충전기에 `InstallCertificate`로 내린다. 루트 폐기·만료 웹훅이 오면 즉시 `DeleteCertificate`.
- 폐기 순서는 가이드라인대로 **PKI에서 먼저 폐기 → 충전기에서 삭제**. 반대로 하면 충전기엔 없는데 PKI에서는 유효한 틈이 생긴다. 두 단계는 독립적으로 재시도할 수 있게 만든다.
- 웹훅은 공개 도메인을 가진 API 허브가 받는다. HMAC 서명을 검증하고, 모든 OCPP 서버에 재동기화를 팬아웃하고, **항상 200을 돌려준다**(보내는 쪽이 재시도 폭주하지 않게).

## 3. OCPP 1.6에서 PnC: DataTransfer로 싣기

1.6에는 PnC 메시지가 없다. OCA가 1.6용으로 정의한 방식은 **DataTransfer에 2.0.1 메시지를 그대로 싣는 것**이다.

```json
[2, "id-1", "DataTransfer", {
  "vendorId": "org.openchargealliance.iso15118pnc",
  "messageId": "Authorize",
  "data": "{\"idToken\":{...},\"iso15118CertificateHashData\":[...]}"
}]
```

현장 테스트에서 얻은 가장 큰 교훈이 여기 있었다.

- 처음에는 **자체 vendorId와 `authorize.req` 같은 자체 messageId**로 구현했다. 우리 충전기(HMI)끼리는 잘 됐다.
- 다른 제조사 충전기로 필드 테스트를 하자 인증 메시지가 오지 않거나 거절됐다. **표준 vendorId와 접미사 없는 messageId(`Authorize`, `Get15118EVCertificate`, `GetCertificateStatus`, `SignCertificate`)만 아는 충전기**였다.
- 지금은 서버가 두 형태를 모두 받아 같은 업무 로직으로 보내고, 서버가 보내는 쪽(CertificateSigned, InstallCertificate, TriggerMessage)은 표준 형태로 보낸다.

**표준이 있는 곳에서는 표준 이름을 쓰자.** 자체 방언은 우리 생태계 안에서만 통한다.

1.6에서는 SignCertificate·CertificateSigned·InstallCertificate도 DataTransfer로 오가지만, 인증 시험(OCTT 1.6 보안 확장)에는 네이티브 SignCertificate가 있으므로 둘 다 유지했다. 특히 V2G/MO 루트 설치는 1.6 네이티브 InstallCertificate의 타입으로 표현할 수 없어서 DataTransfer가 필요하다.

## 4. 검증은 fail-closed로

인증 판단은 돈과 직결된다. 설계 원칙을 명확히 했다.

- **체인 전체를 본다.** `iso15118CertificateHashData`는 리프와 서브 CA들의 배열이다. 초기 코드는 첫 번째(리프)만 확인해서, **폐기된 서브 CA를 놓쳤다.** 지금은 모든 항목을 확인하고 하나라도 실패하면 거절한다.
- **확인 불가 = 거절.** OCSP 응답이 없거나 UNKNOWN이면 거절한다. 단, "폐기 확정"과 "확인 불가"를 로그에서 구분해 원인을 찾을 수 있게 한다.
- **자리표시자를 걸러낸다.** 루트 항목처럼 `issuerKeyHash`에 `"None"`, `"null"`, `"-"`가 오는 경우는 건너뛰되, 리프에 그런 값이 오면 거절한다. 확인할 수 있는 항목이 하나도 없는 체인도 거절한다.
- **디코더를 두 개로 나눈다.** 충전기 화면 표시용 상태 해석은 실패 시 "good"(fail-open), 인증용은 실패 시 "unknown"(fail-closed). 같은 함수를 공유하면 언젠가 인증에 fail-open이 섞인다.
- **로밍 계약**: 다른 MO의 EMAID는 회원 매칭 없이 OCSP 결과만으로 받고 정산은 나중에 한다. 우리 MO의 EMAID는 회원 차량과 매칭한다.
- **입력 형태 관대화**: idToken이 문자열로 오거나 객체로 오거나, 해시 데이터 필드가 단수형이거나 옛 복수형 이름이거나. 문자열 idToken이 들어오자 형변환 예외로 죽은 적이 있다.

## 5. 목(mock) PKI를 만들며 배운 것

연동 초기에 운영기관 테스트 서버에 붙을 수 없어서 **가이드라인을 따르는 자체 목 PKI**를 만들었다. 처음엔 고정 응답이었는데, 그걸로는 잡히지 않는 버그가 너무 많아 점점 "진짜"에 가까워졌다.

1. **인메모리 → DB.** 재시작하면 발급 상태가 사라졌다. PKI가 소유하는 데이터(루트, 리프, 프로비저닝, 계약, 웹훅)는 CPO 쪽 테이블과 분리된 PKI 전용 테이블로 옮겼다.
2. **고정 시리얼 → 랜덤 시리얼.** 모든 발급이 같은 시리얼이면 "발급 → 폐기 → 재폐기"를 구분할 수 없다. 모르는 시리얼 폐기는 404.
3. **고정 PEM → 실제 CSR 서명.** 고정 인증서는 대응하는 개인 키가 어디에도 없어 충전기가 쓸 수 없다. BouncyCastle로 실제 서명하고, CA 키는 부팅마다 새로 만들지 말고 파일로 한 번만 만들어 재사용한다(재시작 전 발급분이 다른 루트에 묶이는 문제).
4. **체인 깊이 버그.** 충전기(SECC) 로그에 "Cert chain count error"가 찍혔다. 가이드라인은 SECC↔차량 TLS 체인을 **리프, 서브 CA 2, 서브 CA 1** 순서로 요구하고 루트는 별도로 설치한다. 목 서버는 루트→리프 2단계에 루트를 체인 자리에 넣고 있었다. 루트 → 서브 CA 1 → 서브 CA 2 → 리프 4단계로 바꾸고, 체인은 **아래에서 위로, 루트 제외**로 돌려주게 고쳤다.
5. **고정 OCSP → 서명된 OCSP 응답.** OCPP 서버는 응답이 "있는지"만 봤기 때문에 고정 blob으로도 "동작"했다. 실제로 서명된 `BasicOCSPResp`를 만들고, 요청의 CertID(해시 알고리즘, issuerNameHash, issuerKeyHash, 시리얼)를 그대로 써서 충전기가 짝을 맞출 수 있게 했다. 폐기된 인증서에는 정상 서명된 "revoked"를 주고, "응답 없음"은 장애 상황에만 쓴다.
6. **규격에 없는 정책을 만들지 마라.** "같은 CN으로 유효 인증서가 있으면 409" 규칙을 만들었다가 주석 처리했다. 가이드라인에 없고, 실서버에서 자동 폐기가 필요한 인증서를 날릴 수 있다. **목 서버는 규격만큼만 정직해야 한다.**
7. **강제 실패 키워드.** 입력에 `REVOKED`, `FAIL`, `NOTFOUND` 같은 키워드가 있으면 해당 실패 경로를 먼저 태운다. 준비 없이 QA가 실패 케이스를 재현할 수 있다.

## 6. 현장 테스트에서 발견한 것들

- **EMAID 중복**: 회원 ID로 EMAID를 만들었더니 차량을 여러 대 가진 회원의 모든 차량이 같은 EMAID를 가졌다. **차량(PCID) 등록 단위로** 만들어야 한다. 체크 디지트도 고정 접미사가 아니라 가이드라인의 알고리즘으로 계산한다.
- **OCSP 폴백 비대칭**: 충전기 인증서 경로에는 RFC 6960 직접 조회 폴백이 있었는데 계약 인증서 인증 경로에는 없었다. 게이트웨이가 막히면 모든 PnC 인증이 거절될 뻔했다.
- **시리얼 절단**: 삭제 요청의 시리얼이 40자에서 36자로 잘려 왔다. 길이 제한 필드는 양쪽 로그로 확인한다.
- **429 응답**: PKI의 호출 제한. 토큰 캐시와 재시도 간격이 필요하다.
- **토큰 캐시**: client_credentials 토큰을 역할별(CPO/MO)로 Redis에 캐시하고, 만료 전 여유를 두고, Redis 장애 시에는 직접 발급한다. 인증 헤더는 게이트웨이가 항상 덮어써서 OCPP 서버가 비밀을 들고 있지 않게 했다.
- **테스트 설정 되돌리기**: 테스트 서버를 가리키는 설정을 운영에 남기지 않도록 체크리스트에 넣었다. 시험용 허용 목록(특정 EMAID·시리얼만 수락)이 켜져 있으면 로그로 경고한다.
- **추측한 엔드포인트**: 초기에 게이트웨이 이름에서 추측한 경로가 목 서버에만 있었다. 가이드라인 문서 경로로 전부 바꿨다. **추측한 API는 목에서만 동작한다.**

## 7. 앞으로 할 것

- 1.6 충전기의 PnC는 DataTransfer 방식이라 제조사별 호환성 확인이 계속 필요하다. 2.0.1 충전기가 늘면 네이티브 메시지로 옮겨 간다.
- 15118 기반 스마트 충전(`NotifyEVChargingNeeds` → `SetChargingProfile`)은 인증 시험 수준으로만 구현했다. 실제 스케줄링은 다음 단계다.
- 계약 인증서 사전 등록(신규 PCID에 대해 미리 계약 등록), 인증서 만료 모니터링을 배치로 돌리고 있다. 결과가 로그에만 남으므로 알림을 붙여야 한다.

## 정리

- PnC에서 **CSMS는 PKI 통합 지점**이다. EXI는 해석하지 않고 전달하되, CSR·체인·갱신·폐기·OCSP는 전부 책임진다.
- 1.6은 **표준 vendorId(`org.openchargealliance.iso15118pnc`)의 DataTransfer**로, 2.0.1은 네이티브로. 자체 방언은 필드에서 깨진다.
- 인증은 **체인 전체, fail-closed**. 표시용과 인증용 판단을 분리한다.
- 체인은 **리프 → 서브 CA 2 → 서브 CA 1, 루트 제외**. 순서와 깊이가 틀리면 충전기가 거절한다.
- 목 PKI는 실제 서명·실제 OCSP·실제 체인 깊이를 갖추되, 규격에 없는 정책은 만들지 않는다.
- EMAID는 차량 단위로, 길이 제한 필드는 양쪽에서 확인한다.

다음 글에서는 이 모든 것을 운영하고 시험하는 도구, 버전별 세션 관리 화면을 왜 만들었고 어떻게 설계했는지 다룬다.

---

## OCPP 시리즈

1. [OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가](/posts/ocpp-01/)
2. [CSMS 아키텍처 — 버전별 OCPP 서버, API 허브, 레거시 공존](/posts/ocpp-02/)
3. [OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지](/posts/ocpp-03/)
4. [충전기 수천 대의 WebSocket 세션 운영기 — 중복 접속, 배포 끊김, NAT, 좀비 세션](/posts/ocpp-04/)
5. [트랜잭션과 계량값의 함정 — 멱등 처리, 늦게 온 Stop, 충전기 편차 정규화](/posts/ocpp-05/)
6. [OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것](/posts/ocpp-06/)
7. [OCPP 보안 프로파일과 인증서 운영 — Basic 인증부터 mTLS, SignCertificate까지](/posts/ocpp-07/)
8. **Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일** (현재 글)
9. [OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에](/posts/ocpp-09/)
10. [충전기 HMI를 WPF로 만들기 — 계층화, 정규화, 키오스크 UI, 무중단 업데이트](/posts/ocpp-10/)
