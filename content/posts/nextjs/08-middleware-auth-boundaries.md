---
slug: nextjs-08
order: 8
category: nextjs
categoryLabel: Next.js
title: "미들웨어와 인증 경계"
summary: "요청이 페이지에 닿기 전에 경로를 가리고, 실제 권한은 서버 레이아웃에서 다시 확인한다."
publishedAt: 2026-03-06
tags: ["nextjs"]
---

# 미들웨어와 인증 경계

> 요약: 요청이 페이지에 닿기 전에 경로를 가리고, 실제 권한은 서버 레이아웃에서 다시 확인한다.

---

## 1. 왜 이 주제가 필요한가

관리자 URL을 아는 사람만 막아도 부족하다. 주소가 열리기 전에 한 번 거르고, 페이지·API에서 세션을 다시 본다.

**미들웨어**는 요청이 라우트 핸들러·페이지에 들어가기 전, 네트워크 경계에서 돌아가는 함수다. 리다이렉트·헤더·매처로 경로를 가른다. DB를 깊게 조회하는 자리가 아니다.

인증 정보(세션 쿠키 vs 토큰)를 어디에 둘지가 XSS·CSRF 표면을 가른다.

---

## 2. 한 줄 규칙

미들웨어는 거친 차단(로그인 여부, 경로 prefix)만 한다. 역할·권한은 서버 레이아웃이나 Route Handler에서 다시 검사한다.

토큰은 HttpOnly 쿠키가 기본선이다. `localStorage`에 액세스 토큰만 두면 XSS에 그대로 노출된다.

---

## 3. 예제

### middleware.ts (Next.js 15)

프로젝트 루트 또는 `src/middleware.ts`다. `app/` 안이 아니다.

```ts
// middleware.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const isManager = request.nextUrl.pathname.startsWith('/manager');

  if (isManager && !token) {
    const login = new URL('/login/', request.url);
    login.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manager/:path*'],
};
```

`matcher`로 검사할 경로만 지정한다. 모든 정적 파일에 미들웨어를 태우면 비용만 는다.

쿠키 존재만 본다. 서명 검증·DB 조회는 레이아웃으로 미룬다. 만료된 쿠키를 들고 온 사용자는 미들웨어를 통과한 뒤 레이아웃에서 `redirect`된다.

Next.js 16은 같은 역할을 `proxy.ts`로 옮기는 방향이다. 파일 이름과 런타임 기본값이 다를 수 있다. “경로를 가르는 네트워크 경계”라는 역할은 같다. 프로젝트 버전의 파일명을 확인한다.

### 인증 정보 위치

| 저장 | 장점 | 주의 |
|------|------|------|
| HttpOnly + Secure 쿠키 | JS가 못 읽음. XSS에 상대적으로 안전 | SameSite, CSRF, 도메인 |
| 메모리(React state) | XSS 표면이 작음 | 새로고침 시 소실. 쿠키와 조합 |
| `localStorage` | 구현이 쉬움 | XSS 시 토큰 탈취 |

Next 풀스택이면 쿠키 세션 + Server Component에서 `cookies()`로 읽는 구성이 흔하다. SPA + 별도 API면 쿠키 또는 Authorization 헤더. 헤더만 쓰면 CSRF는 줄어들고 XSS 위험은 커진다.

### 레이아웃에서 가드

```ts
// lib/auth.ts
import {cookies} from 'next/headers';

export type Session = {userId: string; role: 'admin' | 'user'};

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get('session')?.value;
  if (!token) return null;
  // 서명 검증·만료 확인. 실패하면 null
  return verifySessionToken(token);
}

async function verifySessionToken(token: string): Promise<Session | null> {
  void token;
  return null;
}
```

Next.js 15에서 `cookies()`는 Promise다. `await`한다.

```tsx
// app/manager/layout.tsx
import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {getSession} from '@/lib/auth';

export default async function ManagerLayout({children}: {children: ReactNode}) {
  const session = await getSession();
  if (!session) redirect('/login/');
  if (session.role !== 'admin') redirect('/');
  return <div>{children}</div>;
}
```

미들웨어(prefix 차단) + 레이아웃(정확한 권한)이 한 쌍이다. 하나만 있으면 구멍 난다.

관리자 API도 같은 `getSession`을 탄다. UI만 숨기고 API가 열려 있으면 의미가 없다.

```ts
// app/api/manager/stats/route.ts
import {NextResponse} from 'next/server';
import {getSession} from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({error: 'forbidden'}, {status: 403});
  }
  return NextResponse.json({ok: true});
}
```

### 정적 내보내기와의 관계

`output: 'export'`면 미들웨어·서버 세션이 제한되거나 없다.

그때의 선택:

- 관리자만 서버가 있는 호스팅으로 분리
- 공개 글은 정적 HTML, 이슈·관리자는 별도 API + Client 가드

Client 가드만 있으면 소스에 화면이 남아 있다. API가 401/403을 내야 데이터가 막힌다. UI 숨김은 편의일 뿐 보안이 아니다.

로그인·회원가입 페이지는 `robots: {index: false}`로 색인에서 뺀다.

---

## 4. 흔한 실수

| 실수 | 결과 | 대안 |
|------|------|------|
| 미들웨어에서만 막고 API는 열어둠 | 직접 호출로 우회 | Handler·Action에서 세션 재검증 |
| 미들웨어에서 DB 조회 | 지연·엣지 제약 | 쿠키 존재만, 검증은 서버 |
| `localStorage` 토큰 + 공개 API | XSS 시 계정 탈취 | HttpOnly 쿠키 또는 짧은 수명 |
| matcher를 너무 넓게 | 정적 자산까지 통과 | `/manager/:path*`처럼 제한 |
| export인데 서버 세션을 가정 | 빌드 실패 또는 빈 보호 | 호스팅을 나누거나 API 가드 |
| 로그아웃 후 캐시된 관리자 HTML | 뒤로 가기로 내용이 보임 | 쿠키 삭제 + Cache-Control |

---

## 정리

미들웨어는 문을 닫는 역할이다. 열쇠가 맞는지(서명·역할)는 서버 컴포넌트와 API가 본다.

공개 페이지는 정적 HTML, 관리자는 서버 또는 별도 API. 이 경계를 호스팅 선택과 같이 적는다.

---

## 연습

1. Node 호스팅에서 `/manager/*` 미들웨어 리다이렉트를 만들고, 세션 쿠키가 없으면 `/login/`으로 보낸다.
2. `app/manager/layout.tsx`에서 `getSession()`이 없으면 `redirect`한다. 일반 사용자 role도 막는다.
3. 정적 내보내기 배포라면 Client 가드와 API 401 처리 순서를 문서 한 줄로 적는다.
