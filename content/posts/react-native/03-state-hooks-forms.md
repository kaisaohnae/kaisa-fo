---
slug: react-native-03
order: 3
category: react-native
categoryLabel: React Native
title: "상태·훅·폼 — 사용자 입력과 데이터 흐름"
summary: "화면 상태는 훅에 두고, 폼 입력은 검증과 키보드 UX까지 한 흐름으로 만든다."
publishedAt: 2024-03-13
tags: ["react-native"]
---

# 상태·훅·폼 — 사용자 입력과 데이터 흐름

> 요약: 화면 상태는 훅에 두고, 폼 입력은 검증과 키보드 UX까지 한 흐름으로 만든다.

---

## 1. 왜 상태를 나누나

입력은 로컬 상태다. 게시글 목록은 서버 상태다. 둘을 `useState` 하나로 섞으면 로딩·동기화 버그가 난다.

웹과 같은 React 훅을 쓴다. 차이는 **키보드, 자동완성, 포커스 이동**이 폼 UX의 중심이라는 점이다.

필드가 두세 개면 `useState`로 충분하다. 필드가 늘고 검증이 생기면 `react-hook-form` + zod가 기본선이다.

---

## 2. 핵심 개념

| 범위 | 수단 |
|------|------|
| 한 화면 UI | `useState` |
| 부모→자식 | props |
| 멀리 공유 | Context, Zustand |
| 서버 데이터 | React Query (다음 글) |
| 다필드 폼 | `react-hook-form` |

계산으로 나오는 값은 state로 두지 않는다.

```tsx
const [count, setCount] = useState(0);
const doubled = count * 2;
```

객체는 이전 값을 펼친다.

```tsx
setUser((prev) => ({ ...prev, name }));
```

`useRef`는 DOM이 아니라 **컴포넌트 인스턴스**다. `TextInput`에 포커스를 옮길 때 쓴다. 렌더와 무관한 이전 값 보관에도 쓴다.

`useEffect`는 구독과 정리용이다. 마운트마다 `fetch` + `setState`로 서버를 따라가는 패턴은 지양한다.

---

## 3. 예제

로그인 필드 두 개:

```tsx
import { useState } from 'react';
import { TextInput, Text, View, Pressable, ActivityIndicator } from 'react-native';

export function LoginForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      setError('이메일 형식을 확인하세요');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {error ? <Text style={{ color: 'tomato' }}>{error}</Text> : null}
      <Pressable onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text>로그인</Text>}
      </Pressable>
    </View>
  );
}
```

`textContentType` / `autoComplete`는 비밀번호 매니저 대응에 도움이 된다.

다음 필드로 포커스:

```tsx
const passwordRef = useRef<TextInput>(null);

<TextInput
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
/>
<TextInput ref={passwordRef} secureTextEntry />
```

검증이 커지면 스키마를 한곳으로 모은다.

```bash
npx expo install react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput value={value} onBlur={onBlur} onChangeText={onChange} />
        )}
      />
      {errors.email ? <Text>{errors.email.message}</Text> : null}
      <Pressable onPress={handleSubmit((data) => console.log(data))} />
    </>
  );
}
```

키보드 UX 체크:

- `returnKeyType="next" | "done"`
- `onSubmitEditing`으로 다음 포커스
- `Keyboard.dismiss()`
- `ScrollView`에 `keyboardShouldPersistTaps="handled"`
- 제출 중 버튼 비활성

반복 UI 로직만 훅으로 뺀다.

```tsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, toggle, setOn };
}
```

---

## 4. 흔한 실수

| 실수 | 대안 |
|------|------|
| 서버 목록을 `useEffect` + `setState` | React Query |
| 파생 값을 또 `useState` | 렌더 중 계산 |
| `onChange` (웹) | `onChangeText` |
| 로딩 중에도 제출 가능 | `disabled` + 스피너 |
| 모든 필드를 전역 스토어 | 폼은 로컬. 제출 결과만 공유 |
| `useEffect`로 입력값을 다른 state에 복사 | 한 곳만 진실로 둔다 |

구독은 정리 함수를 같이 둔다.

```tsx
useEffect(() => {
  const sub = AppState.addEventListener('change', onChange);
  return () => sub.remove();
}, []);
```

---

## 5. 정리

상태는 **누가 소유하는가**가 먼저다. 입력은 화면, 서버 데이터는 Query, 세션만 전역에 가깝게 둔다.

- 작은 폼: `useState` + 에러 메시지.
- 큰 폼: `react-hook-form` + zod.
- 키보드는 `returnKeyType`, 포커스, AvoidingView가 한 세트다.

## 연습

1. 이메일·비밀번호·에러·로딩이 있는 로그인 폼을 만든다.
2. zod + react-hook-form으로 회원가입 검증을 붙인다.
3. `useRef`로 비밀번호 필드 자동 포커스를 구현한다.
4. `useToggle`로 비밀번호 표시/숨김을 만든다.
