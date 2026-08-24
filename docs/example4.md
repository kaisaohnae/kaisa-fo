# example4 — 대시보드

경로: `/example/example4`  
모듈: `src/modules/example/example4`  
종류: **대시보드** (관리화면·컴포넌트와 별도)

## 이 샘플이 보여 주는 것

물류센터 운영실의 **차트 대시보드 5화면** + 로케이션 트리 DnD.  
메뉴마다 차트 라이브러리를 다르게 쓰고, **한 화면 안에서도 차트 종류를 여러 개** 보여 준다.

기능·CRUD 없음. 숫자는 mock. UI는 라이트 사이드바, 얇은 보더, 큰 타이틀 없이.

차트 외에 기간/필터 칩, KPI 스파크라인, 이슈 스트립, 목표·예산 바, 도크 평면도를 같이 둔다.

## 구성

| 메뉴 | 경로 | 라이브러리 | 차트 | 기타 UI |
|---|---|---|---|---|
| 운영 현황 | `/example/example4` | Recharts | Line · Bar · Area · Pie · Radar · Treemap | 기간/센터 칩 · 스파크라인 · 이슈 스트립 |
| 운송 실적 | `/sales` | ECharts | Bar+Line · Pie · Funnel · Scatter · Gauge · Heatmap | 전월 대비 · 목표 바 |
| 도크 가동 | `/traffic` | Chart.js | Bar · Line · Doughnut · Radar · Polar Area · Scatter | 센터 평면도 |
| 화주 구성 | `/mix` | Nivo | Pie · Bar · Heatmap · Radar · Treemap · Line | 화주/품목 필터 · empty |
| 비용 추이 | `/cost` | ApexCharts | Area · Stacked Bar · Donut · Radial · Heatmap · Radar | 예산 소진 바 |
| 로케이션 | `/tree` | HTML5 DnD | 순서 · 편성 · 배정 · 제약 | 폴더 개폐 · 1~100% 슬라이더 · 트리 끌기 |

도메인: 세진로지스 인천센터 (가상).  
톤: 종이색 배경 `#f3f1eb`, accent `#2c4a3e`.

## 관련

- `src/modules/example/example4/*`
- `src/app/(example)/example/example4/**`
- 전체 방향: [plan.md](./plan.md)
