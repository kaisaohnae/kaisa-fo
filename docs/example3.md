# example3 — UI Kit 쇼케이스

경로: `/example/example3`  
모듈: `src/modules/example/example3`  
소스: `src/ui-components`  
종류: **컴포넌트** (`EXAMPLE_LINKS.kind: component`)  
축: UI Kit — 부품의 상태·사이즈·variant

## 이 샘플이 보여 주는 것

공통 UI를 한곳에서 훑어보는 **카탈로그**.  
이후 화면 샘플(example4+)이 부품을 가져다 쓸 수 있게 한다.

문서 사이트나 풀 디자인 시스템 포털로 키우지 않는다. 필요한 부품이 생기면 페이지만 보탠다.

## 구성

| 페이지 | UI 포인트 |
|---|---|
| 개요 | 컴포넌트 카드 인덱스 |
| Input / Select / Textarea | size · 상태(disabled / readOnly / invalid) |
| Radio / Checkbox / Toggle | 그룹 · description |
| Calendar / Datepicker / Colorpicker | 피커 패턴 |
| Button | variant · loading |
| Alert / Popup / Loading | 오버레이 피드백 |

## 유지 방침

- **필요할 때만 확장.** 1·2에 이식하거나, 코드 스니펫·Composition 페이지를 지금 만들지 않는다.
- 새 화면 샘플이 Tabs / Toast / Badge 등을 쓰면 그때 example3에 페이지를 추가한다.
- 하지 않음: 전 컴포넌트 문서화, 다크 모드 토글, 1·2 CTA를 키트에 맞추는 작업.

화면의 다양성은 example4+가 담당한다. example3은 부품 선반이다.  
인터랙션 변형은 [example5.md](./example5.md).

## 관련

- `src/modules/example/example3/*`
- `src/ui-components/**`
- 전체 방향: [ai-plan.md](plan.md)
