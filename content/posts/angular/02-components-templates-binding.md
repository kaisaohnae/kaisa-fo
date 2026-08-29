---
slug: angular-02
order: 2
category: angular
categoryLabel: Angular
title: "컴포넌트·템플릿·데이터 바인딩"
summary: "템플릿에 값을 넣고 클릭을 받으며, @if/@for와 input/output으로 화면과 클래스를 연결한다."
publishedAt: 2024-01-17
tags: ["angular"]
---

# 컴포넌트·템플릿·데이터 바인딩

> 요약: 템플릿에 값을 넣고 클릭을 받으며, @if/@for와 input/output으로 화면과 클래스를 연결한다.

---

## 1. 왜 바인딩인가

템플릿은 HTML처럼 보이지만 **클래스 필드를 화면에 붙인 계약**이다. 클래스가 진실이고, 템플릿은 표시와 클릭만 담당한다.

언제 어떤 문법을 쓰는가.

| 문법 | 방향 | 용도 |
|------|------|------|
| `{{ expr }}` | 클래스 → 뷰 | 텍스트 |
| `[attr]` / `[prop]` | 클래스 → DOM·자식 | disabled, src, 자식 input |
| `(event)` | 뷰 → 클래스 | click, submit, 자식 output |
| `[(ngModel)]` | 양방향 | 작은 폼. `FormsModule` 필요 |

복잡한 검증은 4편 Reactive Forms를 쓴다. 여기서는 표시·클릭·자식 계약만 고정한다.

---

## 2. 핵심 개념

| 개념 | 한 줄 |
|------|--------|
| 인터폴레이션 | `{{ title }}` — 값을 텍스트로 넣는다 |
| 프로퍼티 바인딩 | `[disabled]="loading"` — DOM 속성/프로퍼티에 연결한다 |
| 이벤트 바인딩 | `(click)="save()"` — 브라우저 이벤트에 메서드를 붙인다 |
| `@if` / `@for` | 내장 제어 흐름. `*ngIf` / `*ngFor` 대신 신규 기본 |
| `input()` | 부모가 내려주는 값. 시그널이라 읽을 때 `name()` |
| `output()` | 자식이 부모에게 보내는 이벤트 |

`track`은 리스트에서 **같은 행을 DOM에 재사용하기 위한 id**다. 없으면 배열이 바뀔 때마다 행을 다시 만든다.

---

## 3. 동작하는 예: 목록과 카드

`src/app/user-card/user-card.ts`:

```ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <article>
      <p>{{ name() }}</p>
      <button type="button" (click)="select.emit(name())">선택</button>
    </article>
  `,
})
export class UserCard {
  name = input.required<string>();
  select = output<string>();
}
```

`input.required`는 부모가 값을 안 주면 컴파일·런타임에서 드러난다. `name()`은 시그널을 **호출해 현재 값**을 읽는다. `name`만 쓰면 시그널 함수 자체가 나온다.

`src/app/home/home.ts`:

```ts
import { Component } from '@angular/core';
import { UserCard } from '../user-card/user-card';

type User = { id: string; name: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserCard],
  template: `
    <button type="button" [disabled]="loading" (click)="reload()">
      {{ loading ? '불러오는 중' : '다시 불러오기' }}
    </button>

    @if (selected) {
      <p>선택: {{ selected }}</p>
    } @else {
      <p>아직 선택 없음</p>
    }

    <ul>
      @for (user of users; track user.id) {
        <li>
          <app-user-card [name]="user.name" (select)="onSelect($event)" />
        </li>
      } @empty {
        <li>사용자 없음</li>
      }
    </ul>
  `,
})
export class Home {
  loading = false;
  selected: string | null = null;
  users: User[] = [
    { id: '1', name: '김하늘' },
    { id: '2', name: '이준' },
  ];

  reload() {
    this.loading = true;
    this.loading = false;
  }

  onSelect(name: string) {
    this.selected = name;
  }
}
```

- `[name]="user.name"` — 자식 input에 문자열을 넣는다
- `(select)="onSelect($event)"` — `$event`가 `output`으로 내보낸 값
- `@empty` — 배열이 비었을 때 `@for` 전용 분기

`UserCard`를 템플릿에서 쓰려면 부모 `imports`에 넣는다. standalone의 핵심이다.

---

## 4. 옛 문법과의 대응

| 신규 | 옛 |
|------|-----|
| `@if (user) { }` | `*ngIf="user"` |
| `@for (x of xs; track x.id)` | `*ngFor="let x of xs; trackBy: trackId"` |
| `name = input.required<string>()` | `@Input() name!: string` |
| `select = output<string>()` | `@Output() select = new EventEmitter<string>()` |

옛 문법도 동작한다. 신규 화면은 내장 제어 흐름과 `input()`/`output()`을 쓴다. 한 파일에 둘을 섞지 않는 편이 읽기 쉽다.

`[(ngModel)]`은 `FormsModule`을 `imports`에 넣어야 한다. 필드가 늘면 Reactive Forms로 옮긴다.

---

## 5. 주의 / 흔한 실수

- **템플릿에서 `name`만 출력.** 시그널 input은 `name()`이다. 안 부르면 `[object Function]`에 가깝게 보인다.
- **`track` 생략.** 큰 목록에서 행 상태가 엉킨다. `track $index`는 최후 수단이다.
- **템플릿에 구독·필터 로직 남발.** `users.filter(...)`를 템플릿에 두면 변경 감지마다 새 배열이 생긴다. 클래스의 `computed`나 메서드 캐시를 쓴다.
- **`[innerHTML]`에 사용자 입력.** XSS다. 텍스트는 `{{ }}`다.
- **`ChangeDetectionStrategy.OnPush`만 켜고 객체를 mutate.** OnPush는 참조가 바뀌거나 시그널이 갱신될 때 잘 맞는다. 배열 `push`만으로는 화면이 안 바뀔 수 있다.

---

## 정리

템플릿은 뷰의 계약이다. **표시는 바인딩, 분기는 @if/@for, 부모·자식은 input/output**으로 좁힌다.

- 텍스트·속성 → `{{ }}` / `[ ]`
- 클릭 → `(click)`
- 목록 → `@for` + `track`
- 내려주기·올리기 → `input()` / `output()`

---

## 연습

1. `loading`이 true일 때 버튼 문구와 `disabled`가 함께 바뀌는지 확인한다.
2. `users`에 항목을 추가·삭제하는 버튼을 넣고 `@empty`가 보이는지 확인한다.
3. `UserCard`에 `role = input<string>('일반')`을 추가하고 부모에서 한 명만 다른 role을 넘긴다.
