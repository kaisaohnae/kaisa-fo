---
slug: react-native-07
order: 7
category: react-native
categoryLabel: React Native
title: "애니메이션·제스처·사용자 경험"
summary: "Reanimated와 Gesture Handler로 터치 피드백을 만들고, 햅틱·접근성까지 맞춘다."
publishedAt: 2025-11-17
tags: ["react-native"]
---

# 애니메이션·제스처·사용자 경험

> 요약: Reanimated와 Gesture Handler로 터치 피드백을 만들고, 햅틱·접근성까지 맞춘다.

---

## 1. 왜 Reanimated인가

웹은 CSS transition과 메인 스레드가 가깝다. RN에서 `setState`로 매 프레임 위치를 바꾸면 JS 스레드가 막혀 터치가 늦다.

복잡한 제스처와 60fps 애니메이션은 **react-native-reanimated**와 **react-native-gesture-handler**가 표준이다. 값을 UI 스레드에서 읽는다. Expo 템플릿에 이미 들어 있는 경우가 많다.

모든 화면에 모션을 넣지 않는다. 누르기, 스와이프 삭제, 모달처럼 **의미가 있는 피드백**만 남긴다.

---

## 2. 핵심 개념

- `useSharedValue`: UI 스레드가 읽는 값
- `useAnimatedStyle`: 그 값 → 스타일
- `withSpring` / `withTiming`: 목표까지 보간
- worklet: UI 스레드에서 도는 함수

제스처는 `GestureDetector`에 제스처 객체를 넘긴다. `Pan`, `Pinch`, `Tap`을 `Simultaneous` / `Exclusive`로 조합한다.

레이아웃 애니메이션(`entering`/`exiting`)은 리스트 추가·삭제에 쓰면 이해가 된다. 매 화면 페이드는 피로하다.

Expo Router의 native stack 전환은 기본으로 충분하다. 커스텀 트랜지션은 필요할 때만.

OS “동작 줄이기”가 켜져 있으면 큰 애니메이션을 건너뛴다.

---

## 3. 예제

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

Babel의 `reanimated/plugin`은 **마지막**에 둔다. 루트는 `GestureHandlerRootView`로 감싼다.

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* app */}
    </GestureHandlerRootView>
  );
}
```

누르는 동안 살짝 줄어드는 버튼:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

export function BounceButton({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}
```

드래그:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export function Draggable() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const pan = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[{ width: 80, height: 80, backgroundColor: '#38bdf8' }, style]}
      />
    </GestureDetector>
  );
}
```

실무에서 자주 쓰는 조합: 하단 시트, 스와이프 삭제, 핀치 줌.

```tsx
Gesture.Simultaneous(pan, pinch);
Gesture.Exclusive(native, swipe);
```

리스트 행이 들어올 때:

```tsx
import Animated, { LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition}>
  ...
</Animated.View>
```

모달 화면:

```tsx
<Stack.Screen name="compose" options={{ presentation: 'modal' }} />
```

약한 햅틱:

```bash
npx expo install expo-haptics
```

```tsx
import * as Haptics from 'expo-haptics';

await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

성공·삭제·토글에만 쓴다. 스크롤마다 울리면 방해다.

로딩은 스피너보다 스켈레톤이 목록에서 체감이 낫다. mutation은 낙관적 업데이트 후 실패 시 롤백한다.

최소 피드백은 opacity만으로도 된다.

```tsx
style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
```

접근성: `accessibilityLabel`, 포커스 순서, 동작 줄이기.

---

## 4. 흔한 실수

| 실수 | 대안 |
|------|------|
| `setState`로 매 프레임 좌표 | `useSharedValue` |
| 루트에 GestureHandlerRootView 없음 | `_layout`에서 감싼다 |
| Reanimated 플러그인 순서 | Babel 마지막 |
| 모든 화면에 FadeIn | CTA·제스처만 |
| worklet 안에서 `console.log` 남발 | 디버그 때만 |
| 햅틱 남용 | 의미 있는 한두 곳 |

애니메이션 중 무거운 JS(JSON 파싱, 큰 리스트 필터)는 버벅임의 원인이다. 이미지·그림자 과다도 같다. 리스트 행은 `memo`로 보호한다.

---

## 5. 정리

모션은 장식이 아니라 **터치가 먹혔다는 신호**다. UI 스레드에서 돌리고, 접근성과 햅틱을 같이 본다.

- Reanimated + Gesture Handler가 기본 조합이다.
- 내비 전환은 native stack, 화면은 `presentation: 'modal'`.
- 동작 줄이기가 켜져 있으면 큰 스프링을 끈다.

## 연습

1. Pressable 스프링 스케일 버튼을 만든다.
2. 스와이프로 지울 수 있는 리스트 행을 구현한다.
3. `presentation: 'modal'` 화면을 추가한다.
4. 주요 CTA에 약한 햅틱을 붙인다.
