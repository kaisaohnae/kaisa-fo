---
slug: vue-03
order: 3
category: vue
categoryLabel: Vue
title: "컴포넌트 props·emits·슬롯"
summary: "부모는 props로 값을 내리고 자식은 이벤트로 알리며, 슬롯으로 자리를 열어 컴포넌트를 조립한다."
publishedAt: 2024-06-03
tags: ["vue"]
---

# 컴포넌트 props·emits·슬롯

> 요약: 부모는 props로 값을 내리고 자식은 이벤트로 알리며, 슬롯으로 자리를 열어 컴포넌트를 조립한다.

---

## 1. 왜 계약을 좁히는가

화면을 한 파일에 두면 수정이 한곳에 몰린다. 카드·검색창·모달처럼 **같은 UI를 여러 곳에서** 쓸 때 컴포넌트로 나눈다.

데이터는 한 방향으로만 흐른다.

| 방향 | 이름 | 한 줄 |
|------|------|--------|
| 부모 → 자식 | props | 부모가 자식에게 내려주는 값. 자식은 읽기만 한다 |
| 자식 → 부모 | emits | 자식이 부모에게 보내는 알림. 값은 이벤트로 올린다 |
| 부모 → 자식 UI | slots | 자식 템플릿의 구멍. 부모가 마크업을 채운다 |

자식이 `props`를 직접 바꾸면 부모가 가진 진실과 어긋난다. 바꿀 일이 있으면 이벤트를 올려 부모가 상태를 고친다.

---

## 2. 핵심 문법 (script setup)

`<script setup>`에서는 컴파일러 매크로를 쓴다. import 하지 않는다.

```ts
const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  select: [id: string]
  close: []
}>()
```

- `title`은 필수, `count`는 선택
- `select`는 문자열 인자 하나, `close`는 인자 없음
- 매크로 결과는 런타임에 컴포넌트 옵션으로 옮겨진다

Vue 3.5+에서는 `defineProps`에 기본값을 `withDefaults`로 붙인다.

```ts
const props = withDefaults(
  defineProps<{ title: string; count?: number }>(),
  { count: 0 },
)
```

---

## 3. 동작하는 예: 사용자 카드

`src/components/UserCard.vue`:

```vue
<script setup lang="ts">
export type User = { id: string; name: string; role: string }

defineProps<{
  user: User
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <article :class="{ selected }">
    <h2>{{ user.name }}</h2>
    <p>{{ user.role }}</p>
    <slot name="actions">
      <button type="button" @click="emit('select', user.id)">선택</button>
    </slot>
    <button type="button" @click="emit('remove', user.id)">삭제</button>
  </article>
</template>

<style scoped>
.selected {
  outline: 2px solid #2563eb;
}
</style>
```

`src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UserCard, { type User } from './components/UserCard.vue'

const users = ref<User[]>([
  { id: '1', name: '김하늘', role: '편집' },
  { id: '2', name: '이준', role: '보기' },
])
const selectedId = ref<string | null>(null)

function onSelect(id: string) {
  selectedId.value = id
}

function onRemove(id: string) {
  users.value = users.value.filter((u) => u.id !== id)
  if (selectedId.value === id) selectedId.value = null
}
</script>

<template>
  <UserCard
    v-for="user in users"
    :key="user.id"
    :user="user"
    :selected="user.id === selectedId"
    @select="onSelect"
    @remove="onRemove"
  >
    <template #actions>
      <button type="button" @click="onSelect(user.id)">이 사람 선택</button>
    </template>
  </UserCard>
</template>
```

- `:user="user"` — props로 객체 전달
- `@select="onSelect"` — emit 이름이 이벤트 이름
- `#actions` — named slot. 자식이 기본 버튼을 넣었고, 부모가 덮어쓴다
- `v-for`의 `key`는 안정적인 `id`. 인덱스는 목록이 줄면 잘못 재사용된다

---

## 4. v-model과 defineModel

검색창처럼 **자식 입력이 부모 상태와 같아야** 하면 `v-model`을 쓴다. 실제로는 props + emit 관례다.

부모:

```vue
<SearchInput v-model="query" />
```

자식 (Vue 3.4+):

```vue
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

축약:

```vue
<template>
  <input v-model="model" />
</template>
```

`defineModel`은 `modelValue` props와 `update:modelValue` emit을 대신 만든다. 팀이 Vue 3.4 미만이면 수동으로 같은 계약을 적는다.

```ts
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
```

---

## 5. 슬롯 세 종류

| 종류 | 용도 |
|------|------|
| default | `<slot>` 한 곳. 태그 사이 내용 |
| named | `#header`, `#actions`처럼 구역을 나눔 |
| scoped | 자식이 슬롯에 데이터를 넘겨 부모가 마크업을 그림 |

scoped 예:

```vue
<!-- 자식 -->
<slot name="item" :row="row" />

<!-- 부모 -->
<template #item="{ row }">
  <strong>{{ row.name }}</strong>
</template>
```

레이아웃·디자인 시스템에서 슬롯이 재사용의 핵심이다. props로 HTML을 넘기지 않는다.

---

## 6. 주의 / 흔한 실수

- **자식에서 `props.user.name = 'x'`.** 단방향이 깨진다. emit으로 올리고 부모가 배열을 교체한다.
- **이벤트 이름을 동사 없이.** `select`, `remove`, `update:modelValue`처럼 의도를 적는다. `change`만 있으면 무엇이 변했는지 모른다.
- **props 객체/배열을 자식이 `push`.** 참조를 공유하므로 부모 상태를 몰래 바꾼다. 새 배열을 만들어 emit한다.
- **`v-for`에 `key` 없음.** 슬롯·입력이 엉뚱한 행에 남는다.
- **슬롯 대신 `v-html`로 부모 HTML 주입.** XSS(크로스 사이트 스크립팅) 위험이 크다. 슬롯을 쓴다.

---

## 정리

컴포넌트 API는 기능 나열이 아니다. **props / emits / slots 세 계약을 좁고 분명하게** 적는 일이다.

- 내려줄 값 → props (읽기 전용)
- 올릴 일 → emits
- 채울 UI → slots
- 입력 동기화 → `v-model` / `defineModel`

---

## 연습

1. `AlertBanner.vue`에 `message: string` props와 `close` emit을 넣고, 부모가 닫으면 배너를 제거한다.
2. `SearchInput.vue`에 `defineModel<string>()`을 연결해 부모 `query`와 양방향으로 맞춘다.
3. 카드에 `#footer` named slot을 추가하고, 부모에서 수정 링크를 넣는다.
