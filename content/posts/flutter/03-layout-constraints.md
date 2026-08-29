---
slug: flutter-03
order: 3
category: flutter
categoryLabel: Flutter
title: "Row·Column·제약으로 레이아웃 잡기"
summary: "레이아웃은 위젯 이름이 아니라 부모가 내려 준 제약 상자에서 결정된다."
publishedAt: 2024-04-04
tags: ["flutter"]
---

# Row·Column·제약으로 레이아웃 잡기

> 요약: 레이아웃은 위젯 이름이 아니라 부모가 내려 준 제약 상자에서 결정된다.

---

## 1. 왜 / 언제

노란-검은 줄이 보이면 위젯을 더 감싸기 전에 멈춘다. 그 줄은 overflow다. 원인은 거의 항상 **제약을 무시한 자식**이다.

웹의 흐름 레이아웃과 다르다. Flutter는 “부모가 허용한 상자 안에서 자식이 크기를 고른다”. `Row`에 긴 텍스트를 그냥 넣으면 상자가 터진다. `Column` 안에 `ListView`를 무방비로 넣으면 높이가 무한대가 된다.

레이아웃을 고칠 때는 위젯 이름보다 **누가 얼마의 폭·높이를 허용했는가**를 본다.

---

## 2. 핵심

제약은 부모가 자식에게 내리는 규칙이다. 최소 너비, 최대 너비, 최소 높이, 최대 높이다.

레이아웃은 세 단계로 끝난다.

1. 부모가 자식에게 제약을 내려 준다.
2. 자식은 그 범위 안에서 자기 크기를 고른다.
3. 부모는 그 크기를 보고 자식의 위치를 정한다.

자식이 최대보다 크게 그려지려 하면 overflow다. 반대로 부모가 무한 제약을 주는데 자식이 “가능한 한 크게”를 원하면 예외가 난다. `ListView`가 대표적이다. 스크롤 뷰는 부모가 유한한 높이를 줘야 한다.

| 위젯 | 주축 | 역할 |
|------|------|------|
| `Column` | 세로 | 위→아래 나열 |
| `Row` | 가로 | 왼쪽→오른쪽 나열 |
| `Stack` | 겹침 | 좌표로 포개기 |
| `Wrap` | 줄바꿈 | 주축이 부족하면 다음 줄 |
| `Expanded` | Flex 남은 공간 | `Row`/`Column` 자식만 |

`Row`의 주축은 가로다. 자식들의 고유 너비 합이 부모 최대 너비를 넘으면 overflow다. 남는 공간을 나눠 가질 자식에게 `Expanded` 또는 `Flexible`을 준다.

`Padding`은 안쪽 여백이다. `SafeArea`는 노치·시스템 바를 피한다. 간격은 `SizedBox`로 명시한다. 임의 margin을 여러 겹 쌓지 않는다.

---

## 3. 예제

### Row에서 텍스트가 줄어들게

```dart
class TitleRow extends StatelessWidget {
  const TitleRow({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.star),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            title,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ],
    );
  }
}
```

아이콘은 고유 너비를 갖는다. `Expanded`가 남은 가로를 텍스트에 준다. 텍스트는 그 안에서 줄임표를 쓴다. `Expanded` 없이 `Text`만 두면 긴 제목이 overflow를 만든다.

### Column + 스크롤 목록

무한 높이(`Column`이 스크롤 없이 자식 고유 높이를 잴 때) 안에 `ListView`를 두면 실패한다. 목록은 유한한 높이를 받아야 한다.

```dart
class FeedBody extends StatelessWidget {
  const FeedBody({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text('피드'),
        ),
        Expanded(
          child: ListView(
            children: children,
          ),
        ),
      ],
    );
  }
}
```

바깥이 `Scaffold`의 `body`면 높이가 유한하다. `Expanded`가 그 남은 높이를 `ListView`에 넘긴다.

`shrinkWrap: true`는 목록이 자식 높이만큼만 차지하게 한다. 긴 목록에서 가상화를 포기하므로 기본값으로 쓰지 않는다.

### 정렬과 여백

```dart
class CenterCard extends StatelessWidget {
  const CenterCard({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: child,
          ),
        ),
      ),
    );
  }
}
```

`Center`는 남는 공간의 가운데다. `Align`은 위치를 고른다. `ConstrainedBox`는 자식에게 추가 최대 너비를 준다. 넓은 화면에서 본문이 늘어지는 것을 막는다.

### 디버그

```dart
import 'package:flutter/rendering.dart';

void main() {
  debugPaintSizeEnabled = true;
  runApp(const MyApp());
}
```

테두리와 여백이 보인다. overflow 줄이 보이면 위젯을 더 넣기 전에 제약부터 고친다.

---

## 4. 흔한 실수

| 실수 | 일어나는 일 | 대안 |
|------|-------------|------|
| `Row`에 긴 `Text`만 넣는다 | 가로 overflow | `Expanded` / `Flexible` |
| `Column` 안에 `ListView` | 세로 무한 제약 예외 | `Expanded` 또는 바깥을 스크롤 |
| `width: double.infinity` 남발 | 부모가 무한이면 깨진다 | 제약에 맞게 `Expanded` |
| 모든 간격을 `margin` | 누가 공간을 쓰는지 안 보인다 | `Padding` + `SizedBox` |
| `Stack` 자식을 제약 없이 둔다 | 크기 0 또는 화면 전체 | `Positioned` + 명시 크기 |

`Flexible`은 자식이 작으면 작아도 된다. `Expanded`는 `flex` 비율로 남은 공간을 채운다. 텍스트 한 줄은 보통 `Expanded`다.

`Wrap`은 칩·태그처럼 줄바꿈이 자연스러울 때 쓴다. `Row` overflow의 만능 대체는 아니다. 한 줄 제목은 `Expanded`가 맞다.

---

## 정리

레이아웃 버그는 위젯 이름에서 시작하지 않는다. **누가 얼마의 폭·높이를 허용했는가**에서 시작한다. 부모는 제약을 주고, 자식은 그 안에서 크기를 고른다.

---

## 연습

1. 아이콘 + 긴 제목 `Row`를 만들고, `Expanded` 전후에 overflow를 비교한다.
2. `Column` 헤더 아래 `ListView`를 `Expanded`로 넣어 스크롤되게 한다.
3. `debugPaintSizeEnabled`로 여백과 제약 상자를 확인한다.
4. `shrinkWrap: true` 목록을 긴 데이터로 바꿔 보고, 왜 빌더 리스트로 바꿔야 하는지 적는다.
