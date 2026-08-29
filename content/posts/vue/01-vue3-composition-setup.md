---
slug: vue-01
order: 1
category: vue
categoryLabel: Vue
title: "Vue 3 Composition API로 시작하기"
summary: "한 파일에 화면·로직·스타일을 두고, script setup으로 Vue 3 컴포넌트를 시작한다."
publishedAt: 2023-04-25
tags: ["vue"]
---

# Vue 3 Composition API로 시작하기

> 요약: 한 파일에 화면·로직·스타일을 두고, script setup으로 Vue 3 컴포넌트를 시작한다.

---

## 1. 언제 Vue 3인가

Vue는 HTML 템플릿에 상태를 연결해 화면을 그리는 프레임워크다. 값이 바뀌면 해당 부분만 다시 그린다.

신규 프로젝트는 **Vue 3 + TypeScript + `<script setup>`** 을 기본선으로 둔다. Vue 2는 유지보수만 한다.

| 항목 | Vue 2 | Vue 3 |
|------|-------|-------|
| 기본 API | Options (`data`, `methods`) | Composition (`setup`, `ref`) |
| 반응형 | `Object.defineProperty` | Proxy |
| 파일 | Options SFC | SFC(단일 파일 컴포넌트) + script setup |
| TypeScript | 보조 | 공식 경로 |

Composition API(조합형 API)는 관련 코드를 함수 단위로 모아 재사용하기 쉽게 만든 방식이다. Options는 `data`/`methods`/`computed`로 역할이 갈라져, 한 기능이 파일 여러 곳에 흩어진다.

---

## 2. 핵심 구조

SFC는 한 파일에 로직·마크업·스타일을 담는다.

```
Counter.vue
├── <script setup>   상태와 동작
├── <template>       화면
└── <style scoped>   이 컴포넌트만의 스타일
```

| 개념 | 한 줄 |
|------|--------|
| `createApp` | 앱을 만들고 `#app`에 붙인다 |
| SFC | `.vue` 한 장이 컴포넌트 하나다 |
| `<script setup>` | setup의 축약. 최상위 변수·함수가 템플릿에 노출된다 |
| `scoped` | 스타일이 이 파일 밖으로 새지 않는다 |

파일명은 `UserCard.vue`처럼 PascalCase로 둔다.

---

## 3. 프로젝트 생성

```bash
npm create vue@latest my-app
cd my-app
npm install
npm run dev
```

선택 시 TypeScript, Vue Router, Pinia는 이후 글에서 다룬다. 지금은 Vue + TS만으로도 충분하다.

진입점은 `main.ts`다.

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

`index.html`의 `<div id="app"></div>`가 마운트 지점이다.

---

## 4. 동작하는 예: 카운터

`src/components/Counter.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const label = computed(() => (count.value === 0 ? '시작' : `${count.value}회`))

function increment() {
  count.value += 1
}

function reset() {
  count.value = 0
}
</script>

<template>
  <section>
    <p>{{ label }}</p>
    <button type="button" @click="increment">증가</button>
    <button type="button" @click="reset">초기화</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
```

`src/App.vue`:

```vue
<script setup lang="ts">
import Counter from './components/Counter.vue'
</script>

<template>
  <main>
    <h1>카운터</h1>
    <Counter />
  </main>
</template>
```

`ref(0)`은 **값이 바뀌면 화면을 다시 그릴 상자**다. script에서는 `count.value`로 열고, 템플릿에서는 `{{ count }}`로 쓴다. Vue가 템플릿에서 상자를 자동으로 연다(언래핑).

`<script setup>`은 `setup()` 함수의 문법 설탕이다. `export` 없이 선언한 이름만 템플릿이 본다.

---

## 5. Options와 무엇을 다르게 쓰는가

Options API 예:

```vue
<script lang="ts">
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count += 1
    },
  },
}
</script>
```

동작은 같다. 다만 기능이 커지면 `data`와 `methods`가 멀어진다. Composition은 카운터 관련 코드를 한 블록에 둔다. 기존 Options 코드는 점진 이관하면 된다. 신규는 script setup만 쓴다.

---

## 6. 주의 / 흔한 실수

- **Vue 2 문법으로 시작하기.** `new Vue()`는 Vue 3가 아니다. `createApp`을 쓴다.
- **script에서 `count`만 쓰기.** `ref`는 `.value`가 실제 값이다. `count++`는 상자를 증가시키지 않는다.
- **`<script setup>`과 `export default`를 섞기.** setup 블록은 컴포넌트 옵션 객체가 아니다.
- **전역 CSS로 컴포넌트 스타일 잡기.** `scoped`를 기본으로 둔다. 테마만 전역에 둔다.
- **한 SFC에 화면 여러 개를 넣기.** 파일 하나 = 책임 하나.

---

## 정리

Vue 3 시작은 버전 비교가 아니다. **SFC + `<script setup>` + `ref`** 세 가지를 고정하면 나머지는 이 위에 쌓인다.

- 화면 조각 → `.vue` 파일
- 변하는 값 → `ref` / `computed`
- 앱 시작 → `createApp(App).mount('#app')`

---

## 연습

1. `npm create vue@latest`로 프로젝트를 만들고 `Counter.vue`를 붙여 증가·초기화가 동작하는지 확인한다.
2. `label` computed를 바꿔 10 이상이면 문구를 `많음`으로 표시한다.
3. `HelloName.vue`를 만들어 입력한 이름을 `<p>`에 출력한다. 상태는 `ref('')` 하나로 둔다.
