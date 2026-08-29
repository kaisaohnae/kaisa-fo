---
slug: html-css-07
order: 7
category: html-css
categoryLabel: HTML/CSS
title: "폼·포커스·접근성 기본"
summary: "label 연결, 보이는 포커스, 네이티브 컨트롤로 키보드와 스크린 리더가 쓸 수 있는 폼을 만든다."
publishedAt: 2025-12-06
tags: ["html-css"]
---

# 폼·포커스·접근성 기본

> 요약: label 연결, 보이는 포커스, 네이티브 컨트롤로 키보드와 스크린 리더가 쓸 수 있는 폼을 만든다.

---

## 언제 이 기준을 적용하는가

입력·버튼·메뉴가 있는 화면은 마우스만 전제로 두지 않는다. Tab으로 이동하고, Enter·Space로 실행하고, 스크린 리더가 이름을 읽어야 한다.

접근성은 배포 직전 덧칠이 아니다. `label`과 `button`을 처음부터 올바르게 쓰면 대부분의 기본선은 채워진다. ARIA(접근 가능한 리치 인터넷 애플리케이션)는 네이티브 태그가 부족한 곳에만 보탠다.

---

## 폼의 최소 규칙

모든 입력에는 보이는 레이블이 있다. `placeholder`는 힌트이지 레이블이 아니다.

```html
<form action="/signup" method="post">
  <label for="email">이메일</label>
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    required
  />
  <p id="email-error" class="error" hidden>올바른 이메일을 입력한다.</p>

  <button type="submit">가입</button>
</form>
```

`label`의 `for`와 `input`의 `id`가 같아야 클릭이 입력으로 연결된다. `name`은 서버로 나가는 필드 이름이다.

에러는 입력 바로 아래에 텍스트로 둔다. 테두리 색만 바꾸면 스크린 리더와 색각 사용자에게 전달되지 않는다. 에러를 보여줄 때 `aria-describedby="email-error"`로 입력과 문구를 잇는다.

아이콘만 있는 버튼에는 접근 가능한 이름을 준다.

```html
<button type="button" aria-label="검색">
  <svg aria-hidden="true">…</svg>
</button>
```

장식 아이콘은 `aria-hidden="true"`이다. 스크린 리더가 아이콘 파일명을 읽지 않게 한다.

`div`로 만든 가짜 체크박스는 키보드·역할·상태를 직접 구현해야 한다. 네이티브 `input type="checkbox"`를 먼저 쓴다.

---

## 포커스가 보여야 한다

키보드로 이동 중일 때 지금 어디인지 보여 줘야 한다. `outline: none`만 남기고 대체 스타일을 안 주면 Tab 사용자는 위치를 잃는다.

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

`:focus-visible`은 키보드 포커스에 가깝다. 마우스 클릭마다 두꺼운 테두리가 생기는 것을 피하면서, Tab 이동에는 윤곽을 남긴다.

커스텀 포커스를 디자인하더라도 대비가 되는 선이나 배경이 있어야 한다. 색 차이만 2%인 테두리는 포커스가 아니다.

---

## 상태와 오버레이

네이티브로 부족한 위젯에만 ARIA를 붙인다.

| 상황 | 하는 일 |
|------|---------|
| 펼침 메뉴 | 트리거 버튼에 `aria-expanded="true\|false"` |
| 모달 | 열릴 때 포커스를 모달로 옮기고, `Esc`로 닫고, 바깥은 클릭·Tab으로 빠져나가지 못하게 한다 |
| 필수 | `required`와 시각 표시(별표+텍스트)를 같이 둔다 |
| 로딩 버튼 | `disabled`와 “저장 중” 같은 상태 텍스트 |

```html
<button type="button" aria-expanded="false" aria-controls="menu">
  메뉴
</button>
<ul id="menu" hidden>
  <li><a href="/profile">프로필</a></li>
</ul>
```

모달을 `div`로만 띄우면 뒤 페이지가 그대로 Tab 순회에 남는다. 포커스 트랩과 닫기 버튼을 같이 구현한다.

---

## 움직임과 대비

애니메이션이 불편한 사용자를 위해 시스템 설정을 존중한다.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

색 대비와 텍스트 확대(200% 전후)를 실제 브라우저에서 한 번 확인한다. 확대 시 버튼이 잘리거나 가로 스크롤만 생기면 레이아웃을 고친다.

---

## 흔한 실수

- `placeholder="이메일"`만 두고 `label`을 생략한다. 값이 채워지면 이름이 사라진다.
- `outline: none`만 넣고 포커스 대체 스타일이 없다.
- 클릭 가능한 `div`로 체크박스·탭을 만든다. 네이티브 또는 역할·키보드를 모두 구현해야 한다.
- 오류를 `alert()`나 토스트만으로 보여 주고 입력 옆 문구가 없다.
- `aria-label`을 보이는 텍스트와 다르게 적어 스크린 리더와 화면이 어긋난다.

---

## 정리

접근성의 상당수는 HTML을 역할에 맞게 쓰는 습관이다. 레이블을 연결하고, 포커스를 보이게 하고, 네이티브 컨트롤을 우선하면 된다. ARIA는 그다음에 필요한 칸만 채운다.

---

## 연습

1. 로그인 폼을 `label for`·`id`로 연결하고, 잘못된 비밀번호 오류를 입력 아래 텍스트로 보여 준다.
2. 사이트 전역에서 `outline: none`을 검색한 뒤, 있으면 `:focus-visible` 스타일로 대체한다.
3. 키보드만으로 헤더 내비 → 본문 링크 → 푸터까지 이동되는지 확인하고, 막히는 커스텀 위젯을 목록으로 적는다.
