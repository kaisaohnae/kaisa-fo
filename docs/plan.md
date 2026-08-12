# kaisa-fo UI/UX Example Plan

kaisa-fo는 포트폴리오 홈(`(site)`)과 **계속 늘어나는 UI/UX 샘플**(`(example)`)을 함께 운영한다.  
이 문서는 새 샘플을 같은 기준으로 빠르게 추가하기 위한 계획이다.

관련: [example1.md](./example1.md) · [example2.md](./example2.md) · [example3.md](./example3.md) · [example4.md](./example4.md) · [example5.md](./example5.md)

샘플 종류는 고정이 아니다. 지금은 세 갈래다.

- **관리화면** — example1, example2
- **컴포넌트** — example3, example5
- **대시보드** — example4

이후 칸반·스토어·앱 셸 등이 붙으면 종류만 더하면 된다. Hero 라벨은 `관리화면 example1` / `컴포넌트 example3` / `대시보드 example4` 형식을 유지한다.

---

## 1. 무엇을 어필하는가

목표는 기능 완성도가 아니다. **UI/UX 전문성 + 다양성**이다.

방문자가 Hero에서 샘플을 몇 개만 눌러 봐도 이렇게 느껴져야 한다.

- 톤·타이포·밀도·컬러가 샘플마다 다르다
- IA와 인터랙션이 다르다 (사이드바 어드민 ≠ 카드 커머스 ≠ 칸반 ≠ 앱 셸 ≠ 랜딩)
- 디테일(여백, 위계, 상태 색, 모바일)이 “만들어 본 사람”처럼 보인다

example은 **끝내지 않는다.** 1~3은 시작점이고, 4·5·6…을 계속 붙인다.  
한 샘플을 깊게 키우기보다, **다른 패턴의 화면을 더 보여 주는 쪽**이 우선이다.

### 하는 것

- 시각·레이아웃·마이크로인터랙션으로 설득력 있는 화면
- mock 데이터로 “이런 제품의 UI”를 한눈에
- 샘플마다 뚜렷한 한 가지 UX 포인트

### 하지 않는 것

- example1~3에 CRUD·권한·실시간·설정 폼 등을 무겁게 붙이기
- 모든 버튼이 실제로 동작하게 만들기 (보이는 데모면 충분)
- 백엔드 / 인증 / 실결제 / 실장비
- 같은 IA를 업종만 바꿔 반복 양산 (테마 스위칭이 목적이면 그때만)

---

## 2. example1~3의 위치

1~3은 **갤러리의 첫 칸**이다. 완성본이 아니고, 앞으로 고도화 투자도 하지 않는다.

| 샘플 | 보여주는 UX | 유지 방침 |
|---|---|---|
| example1 | 따뜻한 톤 숙박 **어드민** — 사이드바, KPI, 차트, 그리드 | 현상 유지. 시각만 다듬을 수 있음 |
| example2 | 쿨톤 충전 **어드민** — 같은 셸, 다른 도메인/팔레트 | 현상 유지. “업종·테마 변형”으로 읽히게만 |
| example3 | **UI Kit** — 부품 상태 카탈로그 | 새 primitive가 필요할 때만 페이지 추가 |
| example5 | **UI Kit** 인터랙션 변형 — 3과 같은 IA | 현상 유지. 동작(플로팅 라벨·카드 라디오 등)으로 읽히게만 |

1~3에 넣지 말 것: 죽은 CTA 전부 연결, 설정 편집 폼, 실시간 시뮬레이션, 관제형 재구성, 코드 스니펫 문서화, 공유 셸 대규모 리팩터.

그런 노력은 **새 example**에 쓴다.

---

## 3. 현재 지형

```
(site)     포트폴리오 홈 / works / illustration
(example)
  example1  관리화면 · 펜션 어드민
  example2  관리화면 · 충전소 어드민
  example3  컴포넌트 · UI Kit
  example4  대시보드 · 차트 5화면 + 로케이션 트리 DnD
  example5  컴포넌트 · Interaction Kit (3과 같은 IA, 독립 인터랙션 컨트롤)
  example6+ 계속 추가
```

Hero 노출: `src/modules/example/index.ts` → `EXAMPLE_LINKS`.

이미 있는 재료:

- `(example)` 라우트 그룹
- 사이드바 + 모바일 햄버거 (`shared/example-mobile-nav`, `example-responsive.css`)
- AG Grid 래퍼 (어드민 샘플용)
- `src/ui-components` + overlay 스토어

참고만 (고치지 않아도 됨):

- example1/2 레이아웃·CSS 복제 — 새 샘플은 복사하지 않으면 된다
- `(example)/layout.tsx`의 CSS 일괄 import — 새 샘플 layout에서 자기 CSS만 넣으면 된다
- Hero 라벨이 `exampleN` 위주 — 새 링크부터 도메인/패턴명이 보이게

---

## 4. 다양성 축 (새 샘플은 여기 빈칸을 채운다)

같은 축을 굳이 두 번 열지 않는다. 축은 늘려도 된다.

| 축 | UX로 보이는 것 | 상태 |
|---|---|---|
| A. 업무 어드민 | 사이드바 · 테이블 · KPI | example1, example2 |
| B. 관제 / 다크 ops | 높은 밀도, 상태 점, 타임라인 | 없음 → 후보 |
| C. UI Kit | 컴포넌트 상태 | example3, example5 |
| D. 차트 대시보드 | 화면마다 다른 차트 라이브러리 | example4 |
| E. 커머스 / 서비스 | 카드 그리드, 필터, 드로어 | 없음 → 후보 |
| F. 마케팅 랜딩 | 스크롤, 모션, 히어로 | 홈과 톤이 다를 때만 |
| G. 보드 / 워크플로 | 칸반, DnD, 카드 | 없음 → 후보 |
| H. 모바일 앱 셸 | bottom nav, 시트, 폰 프레임 | 없음 → 후보 |
| I. 읽기 / 콘텐츠 | 타이포, 목차, 기사 | 없음 → 후보 |
| J. 온보딩 / 위저드 | 스텝, 진행률, 큰 폼 | 없음 → 후보 |
| K. 검색 / 탐색 | 커맨드 팔레트, 필터 칩, 맵 | 없음 → 후보 |
| L. 예약 / 캘린더 고객향 | 슬롯 선택, 날짜 그리드 | 없음 → 후보 |
| M. 프로필 / 세팅 라이트 | 리스트+토글 | 없음 → 후보 |

한 샘플 = **1 audience + 1 primary interaction + 1 visual tone**.  
기능은 그 인터랙션을 보여 줄 만큼만.

---

## 5. 새 샘플 규칙 (가볍게)

### Do

- `src/app/(example)/example/exampleN/` + `src/modules/example/exampleN/`
- `docs/exampleN.md`를 짧게: 보여주는 UX 한 줄, 페이지 목록, 톤(컬러/밀도)
- `EXAMPLE_LINKS`에 **패턴이 보이는 label** (`스토어프론트`, `칸반`, `앱 셸` …)
- 화면 수 3~6이면 충분. 대시보드 하나에 모든 위젯을 넣지 않아도 된다
- 색은 `--exN-*` 토큰. 샘플마다 팔레트·타이포·radius가 달라야 한다
- 가능하면 `ui-components` 사용. 없어도 화면이 먼저, 키트 추가는 필요할 때
- mock은 `data.ts`. 동작은 hover / 탭 전환 / 드로어 열림 정도면 OK
- 960px에서 깨지지 않게. 완벽한 a11y 스펙은 필수가 아님

### Don’t

- example1/2를 통째로 복사해 색만 바꾸지 않는다 (A축은 이미 2개)
- AG Grid를 습관적으로 넣지 않는다. 어드민 목록이 포인트일 때만
- 1~3을 “제대로” 만든 뒤에 4를 시작하지 않는다
- 한 샘플에 결제·권한·실시간·검색을 동시에 넣지 않는다
- 실 API / 개인정보 / 결제 연동 금지

---

## 6. 폴더 템플릿

```
docs/exampleN.md                 ← 짧은 UX 스펙

src/app/(example)/example/exampleN/
  layout.tsx                     ← 이 샘플 CSS만 import
  page.tsx
  (하위 페이지는 필요할 때만)

src/modules/example/exampleN/
  nav.ts                         ← 있으면
  data.ts
  exampleN.css                   ← 이 샘플의 톤·레이아웃
  exampleN-layout.tsx
  *-page.tsx
```

공유 모듈(`shared/`)은 **이미 있는 것만 재사용**한다.  
새 샘플 때문에 1~3을 리팩터하지 않는다. 셸을 뽑고 싶어지면 그때, 그리고 새 샘플부터 적용.

`EXAMPLE_LINKS` 권장 필드:

```ts
{
  id: 'example4',
  label: '대시보드 example4',
  href: '/example/example4',
  kind: 'dashboard', // admin | component | dashboard | …
  show: true,
}
```

`show: false`로 Hero에서 숨길 수 있다. 샘플이 많아지면 홈에 전부 노출하지 않고, works/갤러리 페이지로 넘겨도 된다.

---

## 7. 백로그 (계속 늘린다)

순서는 다양성이 빨리 보이게. 확정이 아니라 **다음에 고르기 쉬운 목록**.

| 후보 | 축 | 한 줄 |
|---|---|---|
| example4 대시보드 | D | 완료. 차트 5 + 로케이션 트리 DnD |
| example5 Interaction Kit | C | 완료. example3과 같은 IA · 독립 인터랙션 컨트롤 키트 |
| example6 Kanban | G | 컬럼·카드 DnD |
| example7 App shell | H | 폰 프레임 + bottom tab |
| example8 Storefront | E | 카드 · 필터 · 장바구니 시트 |
| example9 Dark ops | B | 다크, 상태 점, 로그 |
| example10 Wizard | J | 3 step 온보딩 |
| example11 Editorial | I | 목차 + 타이포 |

새 아이디어가 생기면 이 표에 행만 추가한다. “몇 개로 끝”이 아니다.

당장은 피하기:

- 또 다른 사이드바+AG Grid 업종 스킨
- 홈과 비슷한 풀페이지 마케팅 (차별이 약하면)

---

## 8. AI 체크리스트 (새 exampleN)

시작 전

1. 4절 축 중 **빈칸 하나**를 골랐는가? (1·2와 같은 어드민 복제 아닌가)
2. `docs/exampleN.md`에 UX 한 줄 + 톤 + 페이지 2~6개가 있는가?
3. 이번 샘플에서 **보여 줄 인터랙션 1개**가 정해졌는가? (드로어 / DnD / 스텝 / 탭 …)

구현

4. 1~3 CSS·layout을 복사하지 않았는가?
5. 화면이 먼저인가, 기능이 먼저인가? (기능이면 줄인다)
6. Hero label이 패턴을 말하는가?
7. 모바일에서 레이아웃이 무너지지 않는가?

완료

8. `docs/exampleN.md`를 구현과 맞춘다
9. `EXAMPLE_LINKS`에 넣고, 필요하면 `show`로 Hero 노출만 조절
10. 1~3 리팩터 커밋이 섞이지 않았는가?

---

## 9. 문서

| 파일 | 역할 |
|---|---|
| `docs/ai-plan.md` | 방향, 축, 백로그, 규칙 |
| `docs/exampleN.md` | 그 샘플이 보여 주는 UX (짧게) |
| `README.md` | 설치·배포만 |

커밋 힌트: `feat(exampleN): …`, `docs: exampleN`.  
1~3 대규모 `refactor(example)`는 기본 경로가 아니다.

---

## 10. 다음에 할 일

1. example4·5는 들어갔다. 다음 샘플(칸반·스토어·앱 셸 등)을 같은 리듬으로 추가한다.
2. example3·5는 새 샘플에 부품이 필요할 때만 페이지를 보탠다.
3. example1~3은 건드리지 않거나, 라벨 같은 **얇은 진입 UX**만.
