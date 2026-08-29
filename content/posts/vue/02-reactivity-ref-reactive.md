---
slug: vue-02
order: 2
category: vue
categoryLabel: Vue
title: "ref와 reactive로 반응형 상태 다루기"
summary: "값이 바뀌면 화면이 다시 그려지도록 ref로 상태를 두고, 계산 값과 감시 로직을 나눈다."
publishedAt: 2024-02-07
tags: ["vue"]
---

# ref와 reactive로 반응형 상태 다루기

> 요약: 값이 바뀌면 화면이 다시 그려지도록 ref로 상태를 두고, 계산 값과 감시 로직을 나눈다.

---

## 1. 왜 반응형인가

일반 변수 `let n = 0`은 값이 바뀌어도 화면이 모른다. Vue의 반응형은 **값이 바뀌면 그 값을 쓰는 템플릿을 다시 그리게** 만든다.

언제 무엇을 쓰는가.

| 상황 | 선택 |
|------|------|
| 숫자, 문자열, 불리언, 한 객체 참조 | `ref` |
| 서로 붙어 다니는 필드 묶음 | `reactive` 또는 `ref({ ... })` |
| 다른 상태에서 계산만 하는 값 | `computed` |
| 값이 바뀔 때 API 호출 등 | `watch` / `watchEffect` |

실무 기본선은 **거의 모든 상태를 `ref`로 두고**, 필드가 많은 폼만 `reactive`를 검토한다.

---

## 2. 핵심 개념

| API | 한 줄 |
|-----|--------|
| `ref` | 값이 바뀌면 화면을 다시 그릴 상자. script에서는 `.value` |
| `reactive` | 객체 전체에 Proxy를 씌운다. 프로퍼티는 바로 읽는다 |
| 언래핑 | 템플릿은 `ref` 상자를 자동으로 연다 |
| `computed` | 다른 상태에 의존하는 캐시된 파생 값 |
| `watch` | 특정 상자가 바뀔 때 부수 효과를 실행한다 |

`ref`로 객체를 담아도 된다. `user.value.name = 'a'`처럼 연 뒤 필드를 바꾼다. Vue 3는 객체 `ref`의 안쪽도 반응형이다.

---

## 3. 동작하는 예: 프로필 폼

`src/components/ProfileForm.vue`:

```vue
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

const count = ref(0)

const form = reactive({
  name: '',
  age: 0,
})

const summary = computed(() => {
  if (!form.name) return '이름을 입력한다'
  return `${form.name} (${form.age}세), 저장 ${count.value}회`
})

watch(
  () => form.name,
  (next, prev) => {
    if (prev && next !== prev) {
      count.value = 0
    }
  },
)

function save() {
  if (!form.name.trim()) return
  count.value += 1
}

function reset() {
  form.name = ''
  form.age = 0
  count.value = 0
}
</script>

<template>
  <form @submit.prevent="save">
    <label>
      이름
      <input v-model="form.name" type="text" autocomplete="name" />
    </label>
    <label>
      나이
      <input v-model.number="form.age" type="number" min="0" />
    </label>
    <p>{{ summary }}</p>
    <button type="submit">저장</button>
    <button type="button" @click="reset">초기화</button>
  </form>
</template>
```

- `count`는 단일 숫자 → `ref`
- `form`은 이름·나이가 함께 움직임 → `reactive`
- `summary`는 둘을 읽어 문장을 만든다 → `computed` (직접 할당하지 않는다)
- 이름이 바뀌면 저장 횟수를 0으로 → `watch`

템플릿의 `v-model="form.name"`은 `form.name`에 직접 붙는다. `v-model="count"`는 템플릿 언래핑 덕분에 `.value` 없이 동작한다.

---

## 4. 구조 분해와 교체

`reactive` 객체를 구조 분해하면 반응형이 끊긴다.

```ts
const form = reactive({ name: '', age: 0 })
const { name } = form // name은 일반 문자열. 이후 form.name 변경이 이 변수에 안 온다
```

필드를 따로 쓰려면 `toRefs`를 쓴다.

```ts
import { reactive, toRefs } from 'vue'

const form = reactive({ name: '', age: 0 })
const { name, age } = toRefs(form) // name.value, age.value
```

객체 통째 교체도 `reactive`의 약점이다.

```ts
let state = reactive({ name: 'a' })
state = reactive({ name: 'b' }) // 새 객체. 템플릿이 옛 Proxy를 보고 있을 수 있다
```

통째 교체가 필요하면 `ref`로 담는다.

```ts
const state = ref({ name: 'a' })
state.value = { name: 'b' } // 상자 안만 갈아끼운다
```

---

## 5. computed와 watch 구분

```ts
import { ref, computed, watch, watchEffect } from 'vue'

const price = ref(1000)
const qty = ref(2)
const total = computed(() => price.value * qty.value)

watch(qty, (n) => {
  if (n < 1) qty.value = 1
})

watchEffect(() => {
  console.log('합계', total.value)
})
```

| | `computed` | `watch` |
|--|------------|---------|
| 목적 | 파생 **값** | 부수 **효과** |
| 캐시 | 의존이 같으면 재계산 안 함 | 매번 콜백 |
| 쓰기 | 기본은 읽기 전용 | 값 변경·API·로그 |

화면 표시용 계산은 `computed`다. 저장 API, `localStorage`, 포커스 이동은 `watch`다.

---

## 6. 주의 / 흔한 실수

- **script에서 `.value` 누락.** `count = 1`은 `ref` 상자를 숫자로 덮어 반응형이 죽는다. `count.value = 1`이다.
- **`reactive`에 원시값.** `reactive(0)`은 객체가 아니라서 기대한 추적이 안 된다. 원시는 `ref`.
- **`reactive` 변수 재할당.** 위 4절. 교체가 필요하면 `ref`.
- **deep `watch` 남용.** `{ deep: true }`는 큰 객체에서 비용이 크다. 경로를 좁힌다.
- **`computed` 안에서 상태 변경.** 파생만 한다. 쓰기는 `watch`나 이벤트 핸들러.

---

## 정리

상태를 만들 때 질문 하나는 이것이다. **값 하나인가, 필드 묶음인가.**

- 하나 → `ref`
- 묶음 → `reactive` 또는 `ref({ ... })`
- 파생 → `computed`
- 부수 효과 → `watch`

거의 모든 신규 코드는 `ref`만으로도 충분하다.

---

## 연습

1. `ref`로 `score`를 두고, `computed`로 60 이상이면 `통과` 아니면 `재시험`을 표시한다.
2. `reactive` 주소 객체 `{ city, street }`를 만들고 `toRefs`로 템플릿에 나눠 바인딩한다.
3. `watch`로 `score`가 100이 되면 `console.log('만점')`을 한 번 출력한다.
