# example1 — 펜션 관리 어드민 UI

경로: `/example/example1`  
모듈: `src/modules/example/example1`  
종류: **관리화면** (`EXAMPLE_LINKS.kind: admin`)  
축: 업무 어드민 — 따뜻한 톤, 사이드바, KPI·차트·그리드

## 이 샘플이 보여 주는 것

숙박 관리자 화면의 **분위기와 IA**.  
체크인/객실/시즌 같은 도메인 카피로 “이런 콘솔”이 보이게 한다.

기능 데모가 목적이 아니다. 그리드 편집·시즌 배율은 화면을 그럴듯하게 채우기 위한 소품이다.

## 구성

| 페이지 | 경로 | UI 포인트 |
|---|---|---|
| 대시보드 | `/example/example1` | KPI 카드, 차트, 객실 상태, 캘린더, 일정 |
| 예약 관리 | `/reservations` | AG Grid 목록 |
| 객실 현황 | `/rooms` | 인벤토리 테이블 |
| 시즌 설정 | `/season` | 칩 필터 + 요금 그리드 |
| 매출 리포트 | `/revenue` | 읽기 그리드 |
| 설정 | `/settings` | 설정 리스트 레이아웃 |

셸: 다크 사이드바 + 베이지 캔버스, accent `#ff4d00`.  
모바일: `example-responsive.css` 햄버거.

## 유지 방침

- **현상 유지.** 1~3에 기능을 더 얹지 않는다.
- 시각만 손볼 수는 있다 (여백, 타입, 홈 링크, Hero 라벨).
- 하지 않음: CTA 전부 연결, 설정 폼화, `UiCalendar` 교체, 실시간 LIVE, 공유 셸 추출을 위한 대규모 리팩터.

example2가 같은 셸의 쿨톤 변형이다. 어드민 축은 이 두 개로 충분하다. 다음 어드민은 새 샘플로 열지 않는다.

## 관련

- `src/modules/example/example1/*`
- `src/app/(example)/example/example1/**`
- 전체 방향: [ai-plan.md](plan.md)
