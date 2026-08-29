---
slug: vue-04
order: 4
category: vue
categoryLabel: Vue
title: "Vue Router와 Pinia로 화면·상태 구성"
summary: "URL과 화면을 라우터로 맞추고, 여러 화면이 공유하는 상태는 Pinia 스토어에 두는 SPA 구성 방법을 정리한다."
publishedAt: 2024-09-23
tags: ["vue"]
---

# Vue Router와 Pinia로 화면·상태 구성

> 요약: URL과 화면을 라우터로 맞추고, 여러 화면이 공유하는 상태는 Pinia 스토어에 두는 SPA 구성 방법을 정리한다.

---

## 1. 왜 둘을 나누는가

SPA(단일 페이지 애플리케이션)는 페이지를 통째로 새로고침하지 않고 화면만 바꾼다.

- **Vue Router** — URL ↔ 화면. 주소가 북마크·뒤로 가기의 진실이다.
- **Pinia** — 여러 화면이 공유하는 클라이언트 상태 창고. 로그인 사용자, UI 설정처럼 서버에 없는 값.

폼 입력, 모달 열림처럼 **한 화면만** 아는 값은 컴포넌트 `ref`에 둔다. 목록 캐시처럼 서버 데이터는 나중 단계에서 TanStack Query 등을 검토한다. 모든 것을 Pinia에 넣지 않는다.

---

## 2. 핵심 개념

| 개념 | 한 줄 |
|------|--------|
| `routes` | `path`와 컴포넌트를 짝짓는다 |
| lazy import | 해당 화면 JS를 필요할 때 받는다 |
| `beforeEach` | 이동 전에 로그인·권한을 검사하는 가드 |
| Pinia 스토어 | `defineStore`로 만든 공유 상태. setup 함수와 같은 모양 |
| `useRoute` / `useRouter` | 현재 URL, 프로그래밍 방식 이동 |

Vue 3의 상태 라이브러리는 Vuex가 아니라 **Pinia**가 기본 권장이다.

---

## 3. 동작하는 예: 라우터 + 인증 스토어

`src/stores/auth.ts`:

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  function login(name: string) {
    user.value = name
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
```

setup 스토어는 Composition API와 같다. `return`한 것만 바깥에서 쓴다.

`src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: () => import('../pages/PostView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
```

`props: true`면 `:id`가 컴포넌트 props `id`로 들어간다.

`src/main.ts`:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

Pinia를 라우터보다 먼저 `use`한다. 가드에서 스토어를 쓰기 때문이다.

`src/App.vue`:

```vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/posts/42">글 42</RouterLink>
    </nav>
    <span v-if="auth.isLoggedIn">{{ auth.user }}</span>
    <button v-else type="button" @click="auth.login('demo')">로그인</button>
  </header>
  <RouterView />
</template>
```

`src/pages/PostView.vue`:

```vue
<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <article>
    <h1>글 {{ id }}</h1>
  </article>
</template>
```

`src/pages/LoginView.vue`:

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function submit() {
  auth.login('demo')
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect)
}
</script>

<template>
  <form @submit.prevent="submit">
    <button type="submit">데모 로그인</button>
  </form>
</template>
```

가드에서 무거운 API를 매 이동마다 호출하면 전환이 느려진다. 토큰 존재 여부처럼 최소 정보만 본다.

---

## 4. 상태를 어디에 둘 것인가

| 상태 | 위치 |
|------|------|
| 입력 중인 검색어 | 페이지 컴포넌트 `ref` |
| 로그인 세션 | Pinia (+ httpOnly 쿠키는 서버) |
| 현재 글 id | URL `params` (스토어 복제 금지) |
| 서버 목록 캐시 | 페칭 라이브러리 검토. Pinia에 수동 복사하지 않음 |

URL에 있는 값을 스토어에 또 넣으면 둘이 어긋난다. `id`는 라우트만 진실로 둔다.

---

## 5. 주의 / 흔한 실수

- **라우터보다 Pinia를 늦게 등록.** `beforeEach`에서 `useAuthStore()`가 실패한다.
- **가드에서 `next()` (Vue Router 3).** Vue Router 4는 `return { name: 'login' }` 또는 아무것도 반환하지 않으면 통과다.
- **모든 페이지를 한 번에 import.** `() => import(...)` lazy가 초기 번들을 줄인다.
- **스토어에서 컴포넌트 `useRouter()`로 화면을 바꾸기.** 스토어는 데이터. 이동은 뷰/가드.
- **Pinia에 서버 리스트를 미러링.** 중복·만료·페이지네이션이 한 창고에 섞인다.

---

## 정리

Router는 **주소와 화면**, Pinia는 **공유 클라이언트 상태**다. 경계를 지키면 SPA가 단순해진다.

- 화면 전환 → `routes` + `RouterView`
- 인증 문 → `meta` + `beforeEach`
- 공유 상태 → setup 스토어 `return { ... }`

---

## 연습

1. `/about` 라우트를 lazy 컴포넌트로 추가하고 홈에서 `RouterLink`로 이동한다.
2. `requiresAuth` 메타를 홈에도 걸고, 로그아웃 후 홈 진입이 로그인으로 리다이렉트되는지 확인한다.
3. `useCounterStore`를 만들어 홈과 다른 페이지에서 같은 `count`가 보이는지 확인한다.
