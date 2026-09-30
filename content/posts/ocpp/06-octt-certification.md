---
slug: ocpp-06
order: 6
category: ocpp
categoryLabel: OCPP
title: "OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것"
summary: "OCA의 적합성 시험 도구 OCTT로 OCPP 1.6과 2.0.1 CSMS 인증을 받으며 정리한 준비 과정과 반복되는 실패 유형을 공유한다. 수동 액션 자동화, 프롬프트 값 그대로 쓰기, 보안 프로파일 맞추기, 인증서·ISO 15118 시험 설정까지."
publishedAt: 2026-09-17
tags: ["ocpp", "octt", "certification", "testing", "csms"]
---

# OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것

> 요약: OCA의 적합성 시험 도구 OCTT로 OCPP 1.6과 2.0.1 CSMS 인증을 받으며 정리한 준비 과정과 반복되는 실패 유형을 공유한다. 수동 액션 자동화, 프롬프트 값 그대로 쓰기, 보안 프로파일 맞추기, 인증서·ISO 15118 시험 설정까지.

---

## 들어가며

OCTT(OCPP Compliance Test Tool)는 Open Charge Alliance(OCA)가 제공하는 적합성 시험 도구다. CSMS를 시험할 때 OCTT는 **가상 충전기**가 되어 서버에 붙고, 시험 케이스마다 정해진 메시지를 보내고, 서버의 응답과 서버가 보내는 요청을 규격과 비교한다.

1.6과 2.0.1 두 버전의 CSMS 인증을 완료하면서 느낀 점은 이렇다. **OCTT는 규격서보다 정확한 선생님이다.** 규격서를 읽고 "이 정도면 되겠지" 했던 해석이 시험에서 하나씩 깨졌고, 그때마다 코드가 규격에 가까워졌다. 개발 막바지가 아니라 **초기부터** 돌리기를 권한다.

## 1. 시험 범위 감 잡기

### 1.1 OCPP 1.6

CSMS 쪽 시험은 기능 프로파일을 따라간다. Core(부팅, 인증, 트랜잭션, 상태), Remote(원격 시작·중지, 리셋, 언락), Configuration, 인증 캐시, Local List, Firmware·Diagnostics, Reservation, Trigger, Smart Charging, 그리고 보안 확장(보안 프로파일, 인증서 설치·삭제, 서명 펌웨어, 보안 이벤트, 로그 조회)이다. 우리는 CSMS 측 시험 케이스마다 문서 한 장씩, 77개의 절차 문서를 만들어 가며 진행했다.

### 1.2 OCPP 2.0.1

2.0.1은 규격 파트 구조를 따라 섹션 문자로 나뉜다.

| 섹션 | 내용 | CSMS 시험 수(대략) |
|---|---|---|
| A | Security (보안 프로파일, 인증서, 보안 이벤트) | 13 |
| B | Provisioning (부팅, Device Model, 리셋, 네트워크 프로파일) | 22 |
| C | Authorization (인증 캐시, 로컬 리스트, ISO 15118 인증) | 16 |
| D | Local Authorization List | 6 |
| E | Transactions | 27 |
| F | Remote Control | 15 |
| G | Availability | 10 |
| H | Reservation | 9 |
| I | Tariff and Cost | 2 |
| J | Meter Values | 9 |
| K | Smart Charging | 32 |
| L | Firmware Management | 19 |
| M | ISO 15118 Certificate Management | 18 |
| N | Diagnostics (모니터링, 로그, 고객 정보) | 30 |
| O | Display Message | 21 |
| P | DataTransfer | 2 |

지원하겠다고 선언한 기능(PICS)에 따라 실제로 도는 시험이 달라진다. 모든 섹션을 다 할 필요는 없지만 A·B·C·E·F처럼 필수에 가까운 섹션은 빠짐없이 봐야 한다. 공식 PDF에서 시험 케이스 목록을 뽑아 표로 만들고, 각 케이스를 "수신형(충전기가 보내고 서버가 응답)", "발신형(서버가 보내야 함)", "수동 액션형(시험자가 서버를 조작)", "재사용 상태형"으로 태깅해 두니 계획 세우기가 쉬웠다.

## 2. 시험 환경: 수동 액션을 자동화하라

CSMS 시험의 상당수는 **"서버가 충전기에 X를 보내라"**는 케이스다. OCTT 화면에 "CSMS가 RemoteStartTransaction을 보내도록 하세요" 같은 프롬프트가 뜨고, 시험자가 서버를 조작한 뒤 Continue를 누른다.

이걸 매번 관리 화면에서 손으로 하면 너무 느리고 실수가 많다. 그래서 **시험 전용 REST API**를 서버에 만들었다.

```
POST /api/ocpp/{chargePointId}/octt/remote-start
POST /api/ocpp/{chargePointId}/octt/set-charging-profile?testCase=TC_K_01
POST /api/ocpp/{chargePointId}/octt/install-certificate    (JSON 또는 text/plain PEM)
```

- 각 액션은 시험 케이스에 맞는 페이로드를 만드는 빌더를 가진다. 케이스마다 요구 값이 달라서 `testCase` 파라미터로 변형을 고른다.
- 시험 설정은 `octt.enabled` 같은 플래그 뒤에 둔다. 운영에서는 꺼진다.
- 로컬에서 서버를 띄우고 curl로 호출했다. PowerShell의 `Invoke-RestMethod`는 로컬 TLS 설정과 맞지 않아 실패하는 경우가 있어 `curl.exe`를 썼다.
- **순서가 핵심이다: API를 먼저 부르고, 그다음 Continue.** Continue를 먼저 누르면 OCTT는 "Waiting for XRequest"에서 멈추거나 시간 초과로 떨어진다.

## 3. 반복되는 실패 유형 여덟 가지

시험 문서를 모아 보니 실패 원인이 몇 가지로 수렴했다.

### 3.1 프롬프트 값을 그대로 써라

OCTT 프롬프트에는 이번 실행에서 쓸 값(transactionId, idTag, 설정 키·값, 만료 시각, reservationId, 타임스탬프)이 적혀 있다. 코드에 고정값을 넣어 두면 실패한다. 예를 들어 서버가 `transactionId=1`을 보냈는데 프롬프트는 129를 요구하는 식이다. 스마트 충전 시험 중에는 **타임스탬프 세 개를 모두 프롬프트 값으로** 넣어야 하는 것도 있다. 시험용 API는 이런 값을 전부 파라미터로 받게 만들자.

### 3.2 생략하라면 생략하라

선택 필드를 "친절하게" 채우면 떨어지는 케이스가 있다. 예약 시험에서 `evseId`를 빼야 하거나, 디스플레이 메시지 시험에서 `state`를 빼야 하거나, 인증서 조회에서 `certificateType`을 아예 빼야(모든 타입을 나열하면 실패) 한다. 그리고 앞서 말했듯 **null로 보내는 것도 생략이 아니다.**

### 3.3 맞는 메시지 변형을 골라라

- 트랜잭션 프로파일이 필요한 원격 시작은 SetChargingProfile을 따로 보내는 게 아니라 **RemoteStartTransaction 안에 프로파일을 넣어야** 한다.
- 서명 펌웨어 시험에는 UpdateFirmware가 아니라 **SignedUpdateFirmware**.
- 테스트 이름만 보고 페이로드를 짐작하면 틀린다. 절차서를 끝까지 읽는다.

### 3.4 순서와 개수를 지켜라

- 예약 취소 시험에서 Reserve 없이 Cancel을 먼저 보내면 "Received unexpected request message"로 즉시 실패.
- 충전 프로파일 삭제 시험은 Set을 세 번 보낸 뒤 ID로 삭제, 조건으로 삭제, 전체 삭제 순서다.
- SendLocalList 후 요청을 하나 더 보내면 "예상치 못한 요청"으로 실패한다.
- 인증서 설치·삭제를 SHA-256/384로 번갈아 하는 시험은 OCTT가 10초 기다리는 동안 보내면 실패한다.

### 3.5 보안 프로파일을 양쪽이 맞춰라

OCTT 설정의 보안 프로파일과 서버의 실제 프로파일이 다르면 시험이 시작도 안 하고 INCONCLUSIVE가 된다("Configured 'Security Profile' should be '3'"). 시험 묶음마다 요구하는 프로파일이 달라서 **서버 설정을 바꾸고 재시작하는 일**이 잦다.

- 프로파일 3(mTLS) 시험은 서버가 클라이언트 인증서를 **반드시** 요구하도록(`client-auth: need`) 설정해야 한다.
- 프로파일 3로 바꾸면 시험용 REST API도 클라이언트 인증서를 요구하게 되니 curl에 인증서를 붙이자.
- "보안 프로파일 올리기" 시험은 이미 프로파일 3이면 돌릴 수 없다. 순서를 계획하자.
- 기본 시험은 프로파일 2로 돌리고, 필요한 묶음만 3으로 올렸다가 되돌리는 흐름이 편했다.
- 키는 ECDSA를 권장한다. 같은 포트에서 RSA와 ECDSA를 섞을 수 없다.

### 3.6 시험 도구의 상태도 시험 대상이다

- Device Model 시험 중 `AuthorizeRemoteStart=false`로 바꾸는 케이스를 돌리면, 가상 충전기에 그 값이 남는다. 다음 원격 제어 시험이 "Central을 받았는데 NoAuthorization을 기대함"으로 떨어진다. **시험 사이에 초기화**가 필요하다.
- 부팅 Pending 시험은 서버가 부팅 상태를 Redis에 캐시하는 구조라면, 서버 재시작 때 DB 값으로 다시 덮여 Pending 설정이 사라질 수 있다.
- 인증서 신뢰 저장소 시험 일부는 **OCTT 자체 truststore에 특정 alias가 있어야** 한다. 서버 코드 문제가 아니다.

### 3.7 PEM은 바이트 단위로 같아야 한다

서명 펌웨어 시험에서 서명 인증서 PEM을 붙여 넣었는데, 끝의 줄바꿈 하나가 빠져 1999 바이트 대 2000 바이트로 불일치가 났다. 지금은 PEM을 받으면 **LF 통일, 64자 줄바꿈, 마지막 개행**으로 정규화하고, 보낸 PEM의 SHA-256을 로그로 남긴다. 인증서 설치 결과가 Rejected면 대개 "이미 설치됨"이니 먼저 삭제하고 다시 시도한다.

### 3.8 추가한 핸들러는 재시작해야 반영된다

당연한 얘기지만 자주 겪었다. 보안 이벤트 알림이나 로그 상태 알림 핸들러를 추가하고 시험했는데 계속 NotSupported. 서버를 재시작하지 않아서였다. 시험 체크리스트에 "코드 바꿨으면 재시작"을 넣자.

## 4. 2.0.1에서 특히 챙길 것

### 4.1 Device Model 최소 구현

B 섹션은 GetVariables/SetVariables/GetBaseReport를 서버가 보내고 응답·NotifyReport를 받는 시험이다. 서버가 Device Model을 **저장하지 않아도** 요청·수신만 정확하면 통과한다. 주의할 것:

- SetVariables의 attributeType은 생략하거나 `Actual`이어야 하는 케이스가 있다. `Target`을 넣으면 실패.
- 통신 설정(`OCPPCommCtrlr.OfflineThreshold`), 인증 설정(`AuthCtrlr.AuthorizeRemoteStart`), 한 메시지당 항목 수(`DeviceDataCtrlr.ItemsPerMessage`) 같은 표준 변수 이름을 정확히.

### 4.2 부팅 전 요청 거절

BootNotification이 Accepted되기 전에 다른 요청이 오면 `SecurityError`로 거절해야 한다. 서버발 요청도 Pending 상태에서 허용되는 것만 보낸다.

### 4.3 idToken 규칙

`Central` 타입의 빈 idToken은 FormationViolation이다. 빈 값이 허용되는 건 `NoAuthorization` 타입뿐이다.

### 4.4 인증서 관리(M 섹션)

- PDF에는 수신형으로 적힌 케이스 일부가 실제 도구에서는 **서버가 InstallCertificate를 먼저 보내는 수동 액션형**이다.
- GetInstalledCertificateIds는 케이스별로 요청 타입이 달라서 `testCase` 파라미터로 나눴다. 기본값만 보내면 여러 케이스가 실패한다.
- 삭제 시험은 해시 값을 GetInstalledCertificateIds 결과와 **정확히** 맞춰야 한다.
- 인증서 해시 필드에는 길이 제한이 있다(시리얼 40자, 해시 128자). 이보다 긴 값을 저장해 두면 나중 삭제 요청이 제약 위반으로 실패한다.

### 4.5 ISO 15118 시험 설정

PnC 관련 시험(계약 인증서 설치 등)에서 **OCPP 메시지 하나 없이 즉시 ERROR**가 나면 서버 문제가 아니다. 가상 충전기가 15118 시퀀스를 시작하지 못한 것이다. 확인할 것:

- 시험 도구의 "Use custom ISO15118 certificates" 설정과 15118용 keystore/truststore(JKS) 업로드
- keystore의 alias 이름 규칙(예: `_ecdsa`로 끝나는 V2G 루트, MO 루트, 계약 인증서, CPO 서브 CA 1·2). RSA 세트를 올리면 오류가 여러 개 난다.
- PICS에서 ISO 15118 항목 활성화
- 설치 시험은 "설치 안 됨", 갱신 시험은 "설치됨" 상태로 시작
- 같은 워치리스트의 다른 PnC 시험에서 메시지가 오간다면 WebSocket은 정상이다.

OCSP 시험은 `Accepted` 응답에 `ocspResult`가 반드시 있어야 한다. 서버가 시험 랩의 OCSP 응답기에 접근할 수 있어야 한다(8편).

## 5. 인증을 준비하며 만든 습관

1. **케이스마다 절차 문서 한 장.** 목적, 프롬프트, 호출할 API와 파라미터, 예상 메시지, 결과, 실패 원인. 두 번째 실행부터 속도가 완전히 다르다.
2. **실패 로그는 OCTT 쪽과 서버 쪽을 같이 저장.** 한쪽만 보면 원인을 반대로 짚기 쉽다.
3. **시험용 코드를 운영 코드와 분리.** 시험 빌더, 시험 전용 키스토어, 시험 허용 목록은 플래그 뒤에 두고, 켜져 있으면 로그로 경고한다. 현장 테스트에 시험 모드가 켜진 채 나가는 사고를 막는다.
4. **시험 통과 ≠ 기능 완성.** 계량값 해석처럼 시험이 보지 않는 부분은 따로 검증한다(5편).
5. **충전기 측 시험도 대비.** 우리는 충전기(HMI) 측 시험 케이스 골격도 만들어 두었다. 서버와 충전기를 같이 만드는 팀이라면 양쪽 관점으로 보면 규격 이해가 빨라진다.

## 정리

- OCTT는 규격서보다 정확하다. **초기부터** 돌리자.
- 수동 액션은 **시험용 REST API로 자동화**하고, API를 먼저 부른 뒤 Continue.
- 실패는 대부분 "프롬프트 값 무시, 생략 규칙 위반, 메시지 변형 착오, 순서·개수, 보안 프로파일 불일치, 시험 도구 상태, PEM 바이트, 재시작 누락"이다.
- 2.0.1은 Device Model·부팅 전 거절·idToken 규칙·인증서 해시·15118 설정을 특히 챙긴다.
- 시험 코드는 플래그 뒤에, 시험 통과 너머의 데이터 정확성은 별도로.

다음 글에서는 시험의 A 섹션과 PnC의 기반이 되는 보안 프로파일과 인증서 운영을 다룬다.

---

## OCPP 시리즈

1. [OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가](/posts/ocpp-01/)
2. [CSMS 아키텍처 — 버전별 OCPP 서버, API 허브, 레거시 공존](/posts/ocpp-02/)
3. [OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지](/posts/ocpp-03/)
4. [충전기 수천 대의 WebSocket 세션 운영기 — 중복 접속, 배포 끊김, NAT, 좀비 세션](/posts/ocpp-04/)
5. [트랜잭션과 계량값의 함정 — 멱등 처리, 늦게 온 Stop, 충전기 편차 정규화](/posts/ocpp-05/)
6. **OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것** (현재 글)
7. [OCPP 보안 프로파일과 인증서 운영 — Basic 인증부터 mTLS, SignCertificate까지](/posts/ocpp-07/)
8. [Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일](/posts/ocpp-08/)
9. [OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에](/posts/ocpp-09/)
10. [충전기 HMI를 WPF로 만들기 — 계층화, 정규화, 키오스크 UI, 무중단 업데이트](/posts/ocpp-10/)
