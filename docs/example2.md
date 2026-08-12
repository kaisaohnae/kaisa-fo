# example2 — 충전소 관리 어드민 UI

경로: `/example/example2`  
모듈: `src/modules/example/example2`  
종류: **관리화면** (`EXAMPLE_LINKS.kind: admin`)  
축: 업무 어드민 테마 변형 — example1과 같은 IA, 쿨톤·인프라 카피

## 이 샘플이 보여 주는 것

같은 관리자 셸에 **다른 업종·팔레트**를 입히면 인상이 어떻게 바뀌는지.  
틸/네이비 `#0096c7`, 충전기·kWh·OCPP 용어.

example1의 기능 복제가 아니라, **톤 스위칭 예시**로 읽으면 된다.

## 구성

| 페이지 | 경로 | UI 포인트 |
|---|---|---|
| 대시보드 | `/example/example2` | KPI, 충전량 차트, 상태 도넛, 이벤트 리스트 |
| 충전 이력 | `/sessions` | 세션 그리드 |
| 충전기 현황 | `/chargers` | 인벤토리 테이블 |
| 요금 설정 | `/pricing` | 부하 티어 칩 + 그리드 |
| 매출 리포트 | `/revenue` | 읽기 그리드 |
| 설정 | `/settings` | 설정 리스트 레이아웃 |

그리드 훅은 example1을 import한다. 의도된 공유이지, 지금 정리할 대상이 아니다.

## 유지 방침

- **현상 유지.** 관제형으로 재구성하지 않는다. 그건 새 축(B. Dark ops) 샘플에서 한다.
- 시각만 손볼 수는 있다 (라벨, 홈 링크).
- 하지 않음: 맵·스트리밍·원격제어, 설정 폼, 1과 셸 통합 리팩터, CTA 전부 연결.

어드민  Diversification은 여기서 끝낸다. 다음 샘플은 다른 IA.

## 관련

- `src/modules/example/example2/*`
- `src/app/(example)/example/example2/**`
- 전체 방향: [ai-plan.md](plan.md)
