---
slug: angular-04
order: 4
category: angular
categoryLabel: Angular
title: "라우팅과 리액티브 폼"
summary: "provideRouter와 lazy loadComponent로 화면을 나누고, 가드·FormBuilder로 진입 조건과 입력 검증을 구성하는 방법을 정리한다."
publishedAt: 2024-10-07
tags: ["angular"]
---

# 라우팅과 리액티브 폼

> 요약: provideRouter와 lazy loadComponent로 화면을 나누고, 가드·FormBuilder로 진입 조건과 입력 검증을 구성하는 방법을 정리한다.

---

## 1. 왜 라우터와 폼인가

SPA에서 주소는 화면의 이름이다. 새로고침·공유 링크가 같은 화면을 열어야 한다.

폼은 입력을 클래스로 들고 검증한다. 템플릿의 `ngModel`만으로는 필드가 늘고 조건이 겹치면 추적이 어렵다. **복잡한 검증·동적 필드**는 Reactive Forms(리액티브 폼)가 맞다. 검색 한 칸은 `ngModel`로도 충분하다.

| 구성 | 역할 |
|------|------|
| `Routes` | path ↔ 컴포넌트 |
| `loadComponent` | 그 화면 JS를 나중에 받는다 |
| `CanActivateFn` | 이동 전에 로그인·권한을 검사한다 |
| `FormGroup` | 필드 묶음. 값·유효·에러를 한 객체로 본다 |

---

## 2. 핵심 라우팅

`src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./post/post').then((m) => m.Post),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
```

`src/app/app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
```

`withComponentInputBinding()`은 라우트 `:id`를 컴포넌트 `input()`과 같은 이름으로 연결한다. `ActivatedRoute.snapshot.paramMap`을 직접 읽지 않아도 된다.

`src/app/post/post.ts`:

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: true,
  template: `<h1>글 {{ id() }}</h1>`,
})
export class Post {
  id = input.required<string>();
}
```

`src/app/auth.guard.ts`:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], {
    queryParams: { redirect: state.url },
  });
};
```

가드에서 목록 API를 기다리면 전환이 느려진다. 세션 존재 여부만 본다.

템플릿 이동:

```html
<a routerLink="/">홈</a>
<a [routerLink]="['/posts', '42']">글 42</a>
```

`RouterLink`를 해당 컴포넌트 `imports`에 넣는다.

---

## 3. 동작하는 예: 로그인 폼

`src/app/login/login.ts`:

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="email">이메일</label>
      <input id="email" type="email" formControlName="email" [attr.aria-describedby]="emailErr ? 'email-err' : null" />
      @if (emailErr) {
        <p id="email-err">{{ emailErr }}</p>
      }

      <label>
        <input type="checkbox" formControlName="agree" />
        약관 동의
      </label>
      @if (form.controls.agree.touched && form.controls.agree.invalid) {
        <p>동의해야 진행한다</p>
      }

      <button type="submit" [disabled]="form.invalid">로그인</button>
      <a routerLink="/">홈</a>
    </form>
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    agree: [false, Validators.requiredTrue],
  });

  get emailErr(): string | null {
    const c = this.form.controls.email;
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return '이메일을 입력한다';
    if (c.hasError('email')) return '이메일 형식이 아니다';
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.login(this.form.getRawValue().email);
    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
    void this.router.navigateByUrl(redirect);
  }
}
```

- `[formGroup]` / `formControlName` — 템플릿 필드와 모델이 같은 이름
- `nonNullable.group` — `getRawValue()`가 `string` / `boolean`으로 남는다 (`string | null`이 아니다)
- `disabled`만으로 제출을 막지 않는다. 엔터 제출 시 `invalid`면 `markAllAsTouched`로 문구를 연다

`label`의 `for`와 `input`의 `id`를 맞춘다. 에러는 `aria-describedby`로 필드와 연결한다.

---

## 4. 템플릿 주도 vs 리액티브

| | 템플릿 주도 | 리액티브 |
|--|-------------|----------|
| 모델 | `ngModel` | `FormGroup` |
| 모듈 | `FormsModule` | `ReactiveFormsModule` |
| 맞는 규모 | 필드 1~2개 | 검증·교차 필드·동적 배열 |

둘을 한 폼에 섞지 않는다.

---

## 5. 주의 / 흔한 실수

- **`loadComponent` 없이 모든 페이지를 정적 import.** 초기 번들에 관리자 화면이 포함된다.
- **가드에서 `true`/`false`만 반환하고 URL을 안 바꿈.** `false`는 이동만 취소한다. 로그인 페이지로 보내려면 `UrlTree`를 반환한다.
- **라우트 `id`와 `input()` 이름 불일치.** `withComponentInputBinding`은 이름이 같아야 한다.
- **`form.value.email`이 `string | undefined`.** `nonNullable` 또는 `getRawValue()`를 쓴다. disabled 컨트롤은 `value`에서 빠진다.
- **제출 버튼을 `invalid`로만 disable.** 오류 문구가 안 보여 사용자가 이유를 모른다. `touched`와 메시지를 병행한다.

---

## 정리

URL은 라우터가, 입력은 폼 모델이 책임진다.

- 화면 분할 → `loadComponent`
- 진입 조건 → `CanActivateFn` + `createUrlTree`
- 파라미터 → `withComponentInputBinding` + `input()`
- 검증 → `FormBuilder` + `Validators`

---

## 연습

1. `/posts/1`에 비로그인으로 진입해 `/login?redirect=...`로 가는지 확인한다. 로그인 후 원래 글로 돌아오게 한다.
2. 이메일 형식이 틀릴 때 `emailErr` 문구가 필드 아래에 붙는지 확인한다.
3. `agree`를 끄면 제출이 막히고, 체크하면 `getRawValue()`에 `true`가 들어오는지 확인한다.
