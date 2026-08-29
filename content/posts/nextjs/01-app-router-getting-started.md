---
slug: nextjs-01
order: 1
category: nextjs
categoryLabel: Next.js
title: "Next.js App Router로 프로젝트 시작하기"
summary: "App Router와 TypeScript로 Next.js 프로젝트를 만들고, 폴더·페이지·레이아웃의 역할을 구분한다."
publishedAt: 2023-03-20
tags: ["nextjs"]
---

# Next.js App Router로 프로젝트 시작하기

> 요약: App Router와 TypeScript로 Next.js 프로젝트를 만들고, 폴더·페이지·레이아웃의 역할을 구분한다.

---

## 1. 왜 이 주제가 필요한가

Next.js는 React로 웹을 만들 때 라우팅·렌더·배포를 한 프레임워크에서 처리한다.

예전에는 `pages/` 폴더가 URL이 되는 **Pages Router**를 썼다. 지금은 **App Router**가 기본이다. `app/` 폴더 구조가 URL이 되고, 레이아웃을 중첩할 수 있으며, 컴포넌트는 서버에서 먼저 돈다.

신규 프로젝트는 Pages Router를 기본선으로 두지 않는다. 레거시 코드에서만 만난다.

실무 기본 조합은 **Next.js 15/16 + TypeScript + App Router**다.

---

## 2. 한 줄 규칙

폴더가 곧 URL이다. `page.tsx`가 있는 폴더만 공개 주소가 된다.

호스팅을 먼저 고른다. 서버가 있는 배포(Vercel 등)와 HTML만 올리는 정적 배포는 쓸 수 있는 기능이 다르다.

---

## 3. 예제

### 프로젝트 생성

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

권장 옵션: TypeScript, ESLint, App Router, Tailwind는 팀 취향.

`src/` 디렉터리 여부는 팀 규칙이다. 이 글은 `src/app/` 기준으로 적는다. `app/`이 프로젝트 루트에 있어도 규칙은 같다.

브라우저에서 `http://localhost:3000`이 열리면 준비된 것이다.

### 디렉터리

```
src/app/
├── layout.tsx       # 모든 페이지의 바깥 껍질
├── page.tsx         # URL /
├── about/
│   └── page.tsx     # URL /about
├── posts/
│   ├── page.tsx     # URL /posts
│   └── [slug]/
│       └── page.tsx # URL /posts/hello 같은 동적 주소
├── loading.tsx      # 해당 구간이 기다릴 때
├── error.tsx        # 해당 구간에서 에러가 날 때
├── not-found.tsx    # 404
└── globals.css
```

| 파일 | 역할 |
|------|------|
| `page.tsx` | 그 URL의 화면 |
| `layout.tsx` | 네비·푸터처럼 하위 페이지가 공유하는 셸 |
| `loading.tsx` | 데이터 기다리는 동안의 UI |
| `error.tsx` | 구간 에러 UI. Client Component여야 한다 |
| `not-found.tsx` | 없는 주소 |

`layout.tsx`만 있고 `page.tsx`가 없으면 그 경로는 주소가 아니다.

### 루트 레이아웃과 첫 페이지

```tsx
// src/app/layout.tsx
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js App Router 예제',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ko">
      <body>
        <header>
          <Link href="/">홈</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
```

루트 레이아웃은 `<html>`과 `<body>`를 가진다. 앱에 루트 레이아웃은 하나다.

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Hello, Next.js</h1>
    </main>
  );
}
```

`app/` 아래 파일은 기본이 서버 컴포넌트다. `useState`나 `onClick`이 없으면 `'use client'`를 붙이지 않는다.

### 렌더 모드를 먼저 고른다

페이지가 HTML을 언제 만드는지가 배포를 가른다.

| 모드 | 의미 | 언제 |
|------|------|------|
| 정적(SSG) | 빌드할 때 HTML을 미리 만든다 | 문서, 마케팅, 블로그 |
| 동적(SSR) | 요청마다 서버가 HTML을 만든다 | 로그인 사용자마다 다른 화면 |
| 혼합 | 목록은 정적, 일부만 동적 | 공개 글 + 관리자 |

GitHub Pages처럼 서버 없이 HTML만 올리면 `output: 'export'`를 검토한다. 정적 내보내기는 Route Handler·미들웨어·요청마다 다시 그리는 기능이 제한된다. 호스팅과 함께 결정한다.

```ts
// next.config.ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // 정적 호스팅이 필요할 때만 켠다
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
```

`trailingSlash: true`면 주소 끝이 `/`다. 링크와 CDN 설정을 같은 규칙으로 맞춘다.

---

## 4. 흔한 실수

| 실수 | 결과 | 대안 |
|------|------|------|
| 페이지를 `pages/`에 만든다 | App Router가 그 주소를 모른다 | `app/` 아래 `page.tsx` |
| `page.tsx` 없이 폴더만 만든다 | URL이 생기지 않는다 | 공개할 경로에 `page.tsx` |
| 첫 파일부터 `'use client'` | 서버에서 데이터를 못 읽는다 | 상호작용 있는 잎만 Client |
| 정적 호스팅인데 API Route를 넣는다 | 빌드가 깨지거나 런타임이 없다 | 호스팅을 먼저 고른다 |
| 루트 레이아웃에서 `<html>`을 뺀다 | 문서 뼈대가 깨진다 | 루트에만 `<html>` / `<body>` |

---

## 정리

App Router 시작은 폴더 이름 = URL, `page` = 화면, `layout` = 공통 셸이다.

정적 HTML만 올릴지, 서버가 있는 플랫폼에 올릴지를 프로젝트 첫날에 적는다. 그 선택이 데이터 페칭·인증·API 설계를 가른다.

---

## 연습

1. `create-next-app`으로 TypeScript + App Router 프로젝트를 만든다.
2. `/about`용 `app/about/page.tsx`와 공통 헤더가 있는 루트 `layout.tsx`를 추가한다.
3. 팀 호스팅이 정적 내보내기인지 서버인지 한 줄로 적고, `output: 'export'`가 필요한지 결정한다.
