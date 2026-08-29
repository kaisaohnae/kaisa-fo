---
slug: angular-03
order: 3
category: angular
categoryLabel: Angular
title: "시그널·서비스·의존성 주입"
summary: "signal로 화면 상태를 두고, providedIn 서비스와 inject로 공유 로직을 연결하는 Angular 상태·DI 패턴을 정리한다."
publishedAt: 2024-06-13
tags: ["angular"]
---

# 시그널·서비스·의존성 주입

> 요약: signal로 화면 상태를 두고, providedIn 서비스와 inject로 공유 로직을 연결하는 Angular 상태·DI 패턴을 정리한다.

---

## 1. 왜 시그널과 서비스인가

컴포넌트 필드는 그 화면만 안다. 로그인 사용자처럼 **여러 화면이 같은 값**을 보면 서비스로 올린다.

시그널(signal)은 **값이 바뀌면 그 값을 읽는 템플릿만 다시 그리는 상자**다. Vue의 `ref`와 역할이 비슷하다. 읽을 때 `count()`처럼 함수로 연다.

DI(의존성 주입)는 **클래스가 `new AuthService()`를 하지 않고, Angular가 인스턴스를 넣어 주는 방식**이다. 테스트에서 가짜 구현으로 갈아끼우기 쉽다.

| 층 | 역할 |
|----|------|
| `signal` / `computed` | 이 화면 또는 서비스의 상태·파생 값 |
| `effect` | 값이 바뀔 때 로그·연동. 남용하지 않는다 |
| `@Injectable` 서비스 | 공유 로직·HTTP·인증 |
| `inject()` | 생성자 대신 현재 주입 컨텍스트에서 꺼내 온다 |

---

## 2. 핵심 API

```ts
import { signal, computed, effect } from '@angular/core';

const count = signal(0);
const double = computed(() => count() * 2);

effect(() => {
  console.log('count', count());
});

count.set(1);
count.update((n) => n + 1);
```

| API | 한 줄 |
|-----|--------|
| `signal(init)` | 쓰기 가능한 상자. `set` / `update` |
| `computed(() => ...)` | 다른 시그널에서 계산. 직접 `set`하지 않는다 |
| `effect(() => ...)` | 읽은 시그널이 바뀔 때 부수 효과 |

`effect`로 HTTP를 반복 호출하면 루프·중복 요청이 나기 쉽다. 데이터 로드는 이벤트·라우트 resolver·리소스 API 쪽을 검토한다.

---

## 3. 동작하는 예: 인증 서비스 + HTTP

`src/app/auth.service.ts`:

```ts
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = signal<string | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly displayName = computed(() => this.user() ?? '게스트');

  login(name: string) {
    this.user.set(name);
  }

  logout() {
    this.user.set(null);
  }
}
```

`providedIn: 'root'`는 **앱에 인스턴스 하나**다. 어느 컴포넌트에서 `inject`해도 같은 상자다.

`src/app/app.config.ts`에 HTTP를 등록한다.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
```

`src/app/user.service.ts`:

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

export type UserDto = { id: number; name: string };

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  readonly users = signal<UserDto[]>([]);
  readonly error = signal<string | null>(null);

  load() {
    this.error.set(null);
    this.http.get<UserDto[]>('https://jsonplaceholder.typicode.com/users').subscribe({
      next: (rows) => this.users.set(rows),
      error: () => this.error.set('목록을 불러오지 못했다'),
    });
  }
}
```

`src/app/home/home.ts`:

```ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <p>{{ auth.displayName() }}</p>
    <button type="button" (click)="auth.login('demo')">로그인</button>
    <button type="button" (click)="auth.logout()">로그아웃</button>
    <button type="button" (click)="users.load()">목록</button>
    @if (users.error()) {
      <p>{{ users.error() }}</p>
    }
    <ul>
      @for (row of users.users(); track row.id) {
        <li>{{ row.name }}</li>
      }
    </ul>
  `,
})
export class Home {
  readonly auth = inject(AuthService);
  readonly users = inject(UserService);
}
```

구독은 서비스 한곳에서 시그널로 접는다. 컴포넌트가 `subscribe`를 들고 있으면 `destroy` 때 해제를 잊기 쉽다. `async` 파이프를 쓸 때는 템플릿에서 구독 수명을 맡긴다.

생성자 주입도 된다. `inject()`가 필드 초기화와 짧다. `inject`는 생성자·필드 초기화·`runInInjectionContext` 안에서만 호출한다. 임의 클릭 핸들러에서 부르면 실패한다.

---

## 4. 제공 범위

| 범위 | 언제 |
|------|------|
| `providedIn: 'root'` | 앱 전역 싱글톤. 인증·HTTP 래퍼 |
| 컴포넌트 `providers: [X]` | 그 컴포넌트 트리만. 위저드 로컬 상태 |
| 라우트 `providers` | 그 기능 라우트만. NgModule 대체 |

테스트:

```ts
TestBed.configureTestingModule({
  providers: [{ provide: AuthService, useValue: fakeAuth }],
});
```

DI가 있는 이유다. `new AuthService()`를 컴포넌트 안에 쓰면 테스트가 실제 네트워크를 탄다.

---

## 5. 주의 / 흔한 실수

- **시그널을 `count`로 출력.** 템플릿도 `count()`다.
- **`computed`에 대입.** 파생 값이다. 쓰기는 원본 `signal`.
- **`effect`에서 다른 시그널을 `set`해 연쇄 갱신.** 순환이 난다. 이벤트 핸들러에서 갱신한다.
- **컴포넌트에서 `HttpClient`를 직접 구독하고 해제 생략.** 라우트를 나가도 콜백이 산다.
- **`providedIn: 'root'` 서비스를 컴포넌트 `providers`에 또 등록.** 인스턴스가 둘이라 로그인이 화면에 안 보인다.

---

## 정리

상태는 **시그널**, 공유 로직은 **서비스**, 연결은 **DI**다.

- 화면 국소 값 → 컴포넌트 `signal`
- 앱 공유 값 → `providedIn: 'root'` + `signal`
- 꺼내기 → `inject(AuthService)` (생성자·필드에서만)

---

## 연습

1. `AuthService`의 `login`/`logout` 후 `isLoggedIn()`이 헤더와 홈에서 같이 바뀌는지 확인한다.
2. `UserService.load` 실패 시 `error` 문구가 보이는지, 성공 시 목록이 바뀌는지 확인한다.
3. `Home`에 `providers: [AuthService]`를 잠시 넣고, 헤더와 홈의 로그인 상태가 어긋나는지 본 뒤 제거한다.
