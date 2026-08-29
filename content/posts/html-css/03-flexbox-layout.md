---
slug: html-css-03
order: 3
category: html-css
categoryLabel: HTML/CSS
title: "Flexbox로 한 줄 레이아웃 잡기"
summary: "한 줄 또는 한 열로 아이템을 나열할 때 Flexbox로 축·정렬·간격을 맞춰 내비·툴바·카드 액션을 배치한다."
publishedAt: 2024-05-01
tags: ["html-css"]
---

# Flexbox로 한 줄 레이아웃 잡기

> 요약: 한 줄 또는 한 열로 아이템을 나열할 때 Flexbox로 축·정렬·간격을 맞춰 내비·툴바·카드 액션을 배치한다.

---

## 언제 Flexbox를 쓰는가

한 줄 또는 한 열로 아이템을 나열하고 정렬할 때 Flexbox를 쓴다. 축을 정한 뒤 정렬과 간격만 맞추면 된다.

내비, 툴바, 폼 한 줄, 카드 안의 제목과 버튼이 해당한다. 행과 열을 동시에 설계해야 하면 Grid를 본다. Flex는 1차원 도구이다.

---

## 축을 먼저 정한다

부모에 `display: flex`를 주면 자식이 flex 아이템이 된다. `flex-direction`이 주축이다. 기본값은 `row`(가로). `column`이면 세로가 주축이다.

교차축은 주축에 수직인 방향이다. `row`면 교차축은 세로이다.

| 속성 | 하는 일 |
|------|---------|
| `flex-direction` | 주축을 가로로 둘지 세로로 둘지 |
| `justify-content` | 주축 방향 여백을 어떻게 나눌지 |
| `align-items` | 교차축에서 아이템을 어디에 붙일지 |
| `flex-wrap` | 공간 부족 시 다음 줄로 넘길지 |
| `gap` | 아이템 사이 간격. margin을 아이템마다 주지 않는다 |

`justify-content: space-between`은 양 끝을 붙이고 남는 가로 여백을 사이에 넣는다. `center`는 남는 여백을 양쪽에 균등히 둔다. `flex-start`는 여백을 끝으로 몰고 아이템을 시작점에 붙인다.

`align-items: center`는 세로(교차축) 가운데에 맞춘다. 높이가 다른 아이콘과 텍스트를 한 줄에 둘 때 자주 쓴다.

---

## 툴바 예제

왼쪽은 제목, 오른쪽은 버튼 두 개이다. 세로로는 가운데 맞춘다.

```html
<div class="bar">
  <h1 class="bar__title">설정</h1>
  <div class="bar__actions">
    <button type="button">취소</button>
    <button type="submit">저장</button>
  </div>
</div>
```

```css
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bar__actions {
  display: flex;
  gap: 8px;
}
```

아이템을 한쪽으로 몰고 나머지를 밀어내려면 `margin-left: auto`를 쓴다. `justify-content`로 전체를 나누지 않아도 된다.

```css
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar__actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
```

가운데 정렬 한 박스이다.

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
}
```

---

## 아이템이 늘어나고 줄어드는 방식

아이템 쪽 속성은 `flex-grow`, `flex-shrink`, `flex-basis`이다. 단축은 `flex`이다.

```css
.grow {
  flex: 1 1 auto;
}

.fixed {
  flex: 0 0 240px;
}
```

| 값 | 의미 |
|----|------|
| `flex-grow` | 남는 공간을 얼마나 가져갈지. `1`이면 남는 폭을 나눠 가진다 |
| `flex-shrink` | 공간이 부족할 때 얼마나 줄어들지. `0`이면 줄어들지 않는다 |
| `flex-basis` | 배치 전 기본 크기. `240px`이면 그 너비를 먼저 잡는다 |

검색창은 늘어나고 버튼은 고정인 한 줄이다.

```html
<form class="search">
  <input class="search__input" type="search" name="q" />
  <button type="submit">검색</button>
</form>
```

```css
.search {
  display: flex;
  gap: 8px;
}

.search__input {
  flex: 1 1 auto;
  min-width: 0;
}
```

텍스트나 입력창이 부모를 뚫고 나가면 자식에 `min-width: 0`을 준다. Flex 아이템의 최소 너비 기본값이 내용 너비라서 그렇다.

---

## 흔한 실수

- 2차원 페이지 골격을 Flex로 짠다. 행과 열이 같이 필요하면 Grid이다.
- `justify-content`와 `align-items`를 바꿔 쓴다. 주축 여백이 `justify`, 교차축 붙임이 `align`이다.
- 아이템마다 `margin-right`로 간격을 준다. 부모 `gap`으로 통일한다.
- 긴 제목이 옆 버튼을 밀어 낸다. 제목에 `min-width: 0`과 `overflow: hidden`을 검토한다.
- `flex: 1`만 쓰고 basis를 잊는다. 고정 폭이 필요하면 `flex: 0 0 240px`처럼 명시한다.

---

## 정리

Flex는 만능 그리드가 아니다. 한 줄 또는 한 열에서 여백을 나누는 도구이다. 주축을 정하고, `justify-content`로 그 방향 여백을 나누고, `align-items`와 `gap`으로 나머지 맞추면 된다.

---

## 연습

1. 로고·링크 묶음·로그인 버튼이 있는 헤더를 Flex로 만든다. 링크는 왼쪽에 붙이고 버튼만 오른쪽으로 민다.
2. `flex-direction: column`인 사이드바에서 `justify-content`를 바꿔 가며 항목이 어디에 붙는지 확인한다.
3. Flex 행 안의 긴 파일명을 `text-overflow: ellipsis`로 자르되, 잘리지 않으면 `min-width: 0`을 추가한다.
