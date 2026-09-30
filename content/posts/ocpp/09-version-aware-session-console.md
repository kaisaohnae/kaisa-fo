---
slug: ocpp-09
order: 9
category: ocpp
categoryLabel: OCPP
title: "OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에"
summary: "1.6과 2.0.1 서버를 동시에 운영하며 만든 세션 관리 콘솔의 설계를 정리한다. 왜 버전별 화면이 필요한지, 페이지는 공유하고 설정만 바꾸는 구조, 응답 정규화, 액션 카탈로그를 세 층으로 나눈 방법, 브라우저를 가상 충전기로 쓰는 시험 도구까지."
publishedAt: 2026-09-26
tags: ["ocpp", "nextjs", "frontend", "admin", "websocket", "testing"]
---

# OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에

> 요약: 1.6과 2.0.1 서버를 동시에 운영하며 만든 세션 관리 콘솔의 설계를 정리한다. 왜 버전별 화면이 필요한지, 페이지는 공유하고 설정만 바꾸는 구조, 응답 정규화, 액션 카탈로그를 세 층으로 나눈 방법, 브라우저를 가상 충전기로 쓰는 시험 도구까지.

---

## 들어가며

OCPP 서버를 만들고 나면 곧바로 이런 질문이 쏟아진다. "이 충전기 지금 붙어 있어요?", "어느 서버에 붙어 있어요?", "원격으로 리셋 좀 해 주세요", "부팅이 Pending에서 안 넘어가요", "이 인증서 설치됐어요?" 로그 검색과 curl로 답하다 보면 개발자가 관제 요원이 된다.

그래서 **버전별 세션 관리 콘솔**을 만들었다. 운영자가 쓰는 관제 화면이면서, 개발자가 쓰는 시험 도구이고, 인증 시험(OCTT)과 PnC 테스트의 조종석이기도 하다.

## 1. 왜 "버전별" 화면인가

처음엔 한 화면에서 모든 충전기를 보여 주려 했다. 곧 네 가지 이유로 나눴다.

1. **백엔드가 다르다.** 1.6(보안 프로파일 2/3), 1.6(프로파일 1), 2.0.1 서버가 따로 있고, 세션 레지스트리도 서버마다 따로다. 1.6은 같은 버전 안에서도 프로파일별로 대상이 둘이라 `?profile=1|2`로 고른다.
2. **명령 세트가 다르다.** 1.6은 RemoteStart/StopTransaction, ChangeConfiguration, GetDiagnostics를 쓴다. 2.0.1은 RequestStart/StopTransaction, SetVariables, SetVariableMonitoring, CustomerInformation, 디스플레이 메시지, CostUpdated, 펌웨어 게시, 네트워크 프로파일을 쓴다. 같은 버튼에 버전 분기를 넣으면 폼이 엉망이 된다. 우리 카탈로그 기준으로 1.6이 30개, 2.0.1이 41개 액션이다.
3. **보이는 상태가 다르다.** 2.0.1은 부팅 등록 상태(Accepted/Pending)가 중요한 운영 정보이고, 1.6은 커넥터별 상태 코드가 중심이다.
4. **식별 모델이 다르다.** 현장 1.6 충전기 일부는 **커넥터마다 별도 OCPP ID**로 붙는다(충전기 ID + A/B 채널 접미사). 화면은 이걸 "회사 → 사이트 → 충전기 → 커넥터" 물리 계층으로 다시 묶어 보여 줘야 한다. 2.0.1은 한 연결 안에 EVSE/커넥터가 들어 있다.

결론적으로 **"같은 화면 구조, 다른 설정"**이 필요했다.

## 2. 구조: 페이지는 공유하고, 설정만 버전별로

Next.js 앱 라우터로 버전별 라우트 트리를 두 개 만들되, 실제 로직은 공유 컴포넌트에 둔다.

```
app/
 ├─ ocpp16/
 │   ├─ layout.tsx          <OcppShell version="ocpp16"><AuthGate>…
 │   ├─ ws-sessions/page.tsx   → <WsSessionsPageView {...OCPP_CONFIGS.ocpp16} />
 │   ├─ test-cases/page.tsx
 │   └─ pnc/page.tsx
 └─ ocpp21/
     ├─ layout.tsx
     ├─ ws-sessions/page.tsx   → <WsSessionsPageView {...OCPP_CONFIGS.ocpp21} showRemoteSessions />
     └─ …
components/pages/WsSessionsPageView.tsx   ← 모든 로직
```

버전 설정은 한 파일에 모았다.

```ts
export const OCPP_CONFIGS = {
  ocpp16: {
    version: 'ocpp16',
    restGatewayPrefix: '/gateway/ocpp16',
    wsBase: '/wsgateway/ocpp16',
    wsTargets: [
      {id: 'profile2', label: 'Profile 2', restGatewayPrefix: '/gateway/ocpp16'},
      {id: 'profile1', label: 'Profile 1', restGatewayPrefix: '/gateway/ocpp16-profile1'},
    ],
  },
  ocpp21: {version: 'ocpp21', restGatewayPrefix: '/gateway/ocpp21', wsBase: '/wsgateway/ocpp21'},
} as const;
```

장점은 분명했다. 버그를 한 번 고치면 두 버전에 반영되고, 새 버전(2.1)은 설정 한 줄과 라우트 폴더 하나로 붙는다. 도메인 어댑터 계층을 거창하게 만드는 것보다 **"설정으로 차이를 표현하고, 차이가 크면 그때 분기한다"**가 실용적이었다.

## 3. 세션 화면: 트리, 상태, 원격 제어

메인 화면(`ws-sessions`)은 세 영역이다.

- **왼쪽 트리**: 회사 → 사이트 → 충전기 → 커넥터. 연결 상태를 색으로, 커넥터별 상태 코드를 배지로.
- **가운데 목록**: 선택한 범위의 세션. 접속 시각, 원격 IP, 부팅 상태(2.0.1), 충전 이력 패널.
- **오른쪽 원격 제어 패널**: 선택한 충전기에 보낼 수 있는 액션 목록과 폼, 요청·응답 JSON.

실무에서 다듬은 것들:

- **URL에 선택 상태를 담는다**(`?cmpId&csId&ocppId&profile`). 운영자가 링크 하나로 "이 충전기 좀 봐 주세요"를 전달할 수 있다.
- **새로고침은 필터를 유지**하고, "전체 조회" 버튼만 필터를 초기화한다. 둘을 같은 버튼으로 만들었다가 운영자에게 욕을 먹었다.
- **2커넥터 충전기 판정**: A와 B 채널 ID가 모두 있으면 한 대의 2커넥터 충전기로 묶어 센다. 연결된 충전기 수를 셀 때 커넥터 소켓 수로 세면 두 배가 된다.
- **자동 폴링 없음**: 세션 목록은 진입 시와 새로고침 버튼으로만 읽는다. 수천 대 목록을 몇 초마다 다시 읽는 건 서버에도 화면에도 부담이었다. 실시간이 필요한 건 개별 충전기의 라이브 콘솔로 해결했다(5장).

## 4. 응답 정규화: 화면이 백엔드 차이를 흡수한다

서버마다, 버전마다 응답이 조금씩 달랐다. 세션 목록이 배열로 오기도 하고 `{sessions: []}`나 `{chargePointIds: []}`로 오기도 하고, 접속 시각 필드가 `connectedAt`이기도 하고 `connectedAtEpochMillis`이기도 했다. 게이트웨이 오류는 JSON이 아니라 평문으로 오기도 했다.

화면 쪽에 **정규화 함수**를 한 겹 두었다.

```ts
export function normalizeSessions(raw: unknown): SessionRow[] {
  const list = Array.isArray(raw) ? raw
    : Array.isArray((raw as any)?.sessions) ? (raw as any).sessions
    : Array.isArray((raw as any)?.chargePointIds) ? (raw as any).chargePointIds.map((id: string) => ({chargePointId: id}))
    : [];
  return list.map(toSessionRow);   // connectedAt | connectedAtEpochMillis → Date
}
```

백엔드를 맞추는 게 정답이지만, 여러 서버를 순차적으로 고치는 동안 화면이 깨지지 않게 하는 완충재로 충분히 값을 했다. 2.0.1 화면은 전체 세션 목록(`/all-sessions`)에 원격 세션 목록(`/sessions`)을 합쳐 부팅 상태를 붙인다.

## 5. 액션 카탈로그: 세 층으로 나누기

원격 제어 패널에 보여 줄 액션은 성격이 세 가지다.

| 층 | 의미 | 예 |
|---|---|---|
| `csms` | 서버 자체의 REST 기능 | 세션 목록, 인증서 서명 트리거, 오프라인 임계값 설정 |
| `chargepoint` | 서버가 충전기에 보내는 OCPP 요청 | RemoteStart, Reset, SetVariables, InstallCertificate |
| `datatransfer` | 벤더 확장 메시지 | 요금, 사용자 유형, QR, 충전 이력, EVCC 정보 |

모든 액션을 하나의 타입으로 기술한다.

```ts
type SessionControlAction =
  | {kind: 'octt'; layer: 'chargepoint'; action: string; params: OcttActionParam[]}
  | {kind: 'rest'; layer: 'csms'; method: 'GET' | 'POST'; path: string; params: OcttActionParam[]}
  | {kind: 'datatransfer'; layer: 'datatransfer'; vendorId: string; messageId: string; params: OcttActionParam[]};

type OcttActionParam = {name: string; type: 'string' | 'number' | 'boolean' | 'enum' | 'json' | 'pem'; required?: boolean; options?: string[]};
```

`buildSessionControlCatalog(version)`이 버전에 맞는 목록을 만들고, 폼은 `params` 정의로 **자동 렌더링**한다. 새 액션을 추가할 때 화면 코드를 건드릴 필요가 없다. 벤더 DataTransfer 카탈로그는 두 버전이 공유한다.

이 카탈로그는 인증 시험에도 그대로 쓰인다. 6편의 "시험용 REST API"를 화면에서 파라미터를 채워 부르는 게 곧 OCTT 수동 액션이다. `testCase` 파라미터도 폼에서 고른다.

## 6. 브라우저를 가상 충전기로

콘솔의 두 번째 역할은 **시험 도구**다. API 허브의 WebSocket 게이트웨이(2편) 덕분에 브라우저가 실제 서버에 충전기로 붙을 수 있다.

- **WS 클라이언트**: `sendAndWait()`가 CALL을 보내고 uniqueId로 CALLRESULT/CALLERROR를 매칭한다. 타임아웃이 있고, 최근 500개 메시지를 링 버퍼로 보관해 화면에 보여 준다.
- **목(mock) 케이스**: 버전별 폴더에 메시지 빌더를 둔다. 1.6은 StartTransaction/StopTransaction/DiagnosticsStatusNotification…, 2.0.1은 TransactionEvent(Started/Updated/Ended), NotifyReport, NotifyEVChargingNeeds, Get15118EVCertificate…. JSON은 Monaco 에디터에서 고쳐 보낼 수 있다.
- **일괄 접속 패널**: 가상 충전기 수백 개를 한 번에 붙이고 각자 BootNotification을 보낸다. 서버 부하와 세션 레지스트리를 확인할 때 썼다.
- **시나리오 러너**: `send`(보내기), `wait_incoming`(서버발 요청 기다렸다가 자동 응답), `delay`, `reusable`(공통 절차 재사용) 단계로 시험 시나리오를 기술하고 실행한다. OCTT 시험 전에 우리끼리 먼저 돌려 보는 용도다.

## 7. PnC 화면

PnC 테스트 동안 가장 많이 쓴 화면이다.

- EMAID 생성기(체크 디지트 계산 포함), CSR 생성기
- PKI API 테스터(게이트웨이를 거쳐 호출, 요청·응답 로그)
- 계약 사전 등록·폐기 배치, 충전기 인증서 만료 배치 수동 실행
- 웹훅 등록 관리
- 흐름도: SignCertificate, Get15118EVCertificate, Authorize, GetCertificateStatus 순서도를 화면에 붙여 두니 협력사와 회의할 때 유용했다.

## 8. 화면을 만들며 겪은 함정

- **여러 줄 PEM이 JSON을 깬다.** PEM/CSR 텍스트를 JSON 본문에 넣을 때 제어 문자 이스케이프를 빠뜨려 서버가 파싱 오류를 냈다. `JSON.stringify(v).slice(1, -1)`로 이스케이프하고, 전송 전에 `JSON.parse`로 한 번 검증한다.
- **길이 제한 필드가 조용히 무시된다.** 40자를 넘는 인증서 시리얼이 서버에서 저장되지 않아, 폐기 시험의 전제 조건이 성립하지 않았다. 화면에서 규격 길이를 넘으면 경고를 띄운다.
- **정적 배포의 제약.** 콘솔은 `output: 'export'`로 정적 배포했다. 서버 코드가 없으니 모든 호출이 브라우저에서 나가고, 그래서 게이트웨이와 CORS, 인증(JWT) 설계가 중요하다. 대신 배포와 호스팅은 아주 단순하다.
- **상태 관리는 최소로.** 전역 상태는 요청 중 스피너 카운터 정도만 두고, 나머지는 컴포넌트 상태, URL 쿼리, 로컬 스토리지, 짧은 TTL 캐시로 충분했다.
- **숨긴 메뉴를 정리하자.** 초기에 만든 API 명세 화면, 시험 실행 화면 몇 개가 메뉴에서 주석 처리된 채 남아 있다. 쓰지 않는 화면은 코드도 지우는 편이 유지보수에 좋다.

## 9. 콘솔이 준 것

- 운영자가 개발자 없이 **충전기 연결 여부·위치·상태를 확인하고 원격 조치**를 한다.
- 개발자는 **서버 변경을 가상 충전기로 즉시 확인**한다. 실제 충전기 없이 시나리오를 돌린다.
- 인증 시험과 PnC 테스트에서 **같은 액션 카탈로그**를 쓰니, 시험에서 검증한 흐름이 곧 운영 기능이 된다.

## 정리

- 버전별 세션 화면이 필요한 이유는 **백엔드, 명령 세트, 상태, 식별 모델**이 다르기 때문이다.
- **라우트는 버전별, 페이지 컴포넌트는 공유, 차이는 설정으로.** 2.1은 설정 한 줄로 붙는다.
- 백엔드 응답 차이는 화면의 **정규화 함수**로 흡수한다.
- 액션은 **csms / chargepoint / datatransfer 세 층**의 카탈로그로 기술하고 폼은 자동 렌더링한다.
- 브라우저를 **가상 충전기**로 만들면 시험 속도가 달라진다.

마지막 글에서는 서버 반대편, 충전기 안에서 도는 WPF HMI의 구조와 UI 노하우, 여러 버전과 하드웨어를 계층화로 받아낸 방법을 다룬다.

---

## OCPP 시리즈

1. [OCPP 한눈에 보기 — 1.6J, 2.0.1, 2.1은 무엇이 다른가](/posts/ocpp-01/)
2. [CSMS 아키텍처 — 버전별 OCPP 서버, API 허브, 레거시 공존](/posts/ocpp-02/)
3. [OCPP-J 메시지 파이프라인 구현 — 핸드셰이크부터 응답 매칭까지](/posts/ocpp-03/)
4. [충전기 수천 대의 WebSocket 세션 운영기 — 중복 접속, 배포 끊김, NAT, 좀비 세션](/posts/ocpp-04/)
5. [트랜잭션과 계량값의 함정 — 멱등 처리, 늦게 온 Stop, 충전기 편차 정규화](/posts/ocpp-05/)
6. [OCTT 인증 통과기 — OCPP 1.6과 2.0.1 CSMS 적합성 시험에서 배운 것](/posts/ocpp-06/)
7. [OCPP 보안 프로파일과 인증서 운영 — Basic 인증부터 mTLS, SignCertificate까지](/posts/ocpp-07/)
8. [Plug & Charge 1차 필드 테스트 — ISO 15118 인증서 체계와 CSMS가 해야 할 일](/posts/ocpp-08/)
9. **OCPP 버전별 세션 관리 화면이 필요한 이유 — 관제·원격 명령·시험을 한 콘솔에** (현재 글)
10. [충전기 HMI를 WPF로 만들기 — 계층화, 정규화, 키오스크 UI, 무중단 업데이트](/posts/ocpp-10/)
