---
slug: nextjs-04
order: 4
category: nextjs
categoryLabel: Next.js
title: "데이터 페칭과 캐시 전략"
summary: "서버 컴포넌트에서 데이터를 읽고, 캐시할지 매 요청 최신으로 둘지 옵션으로 명시한다."
publishedAt: 2024-11-18
tags: ["nextjs"]
---

# 데이터 페칭과 캐시 전략

> 요약: 서버 컴포넌트에서 데이터를 읽고, 캐시할지 매 요청 최신으로 둘지 옵션으로 명시한다.

---

## 1. 왜 이 주제가 필요한가

화면이 비어 있고 브라우저가 API를 다시 치면, 검색엔진과 SNS 미리보기는 본문을 못 본다. 느리다.

App Router에서는 **Server Component**가 데이터를 먼저 읽는다. HTML에 본문이 담긴 채로 나간다.

문제는 “얼마나 자주 다시 읽느냐”다. 매번 최신이면 서버·원본 API 부하가 커진다. 너무 오래 캐시하면 수정한 글이 안 보인다.

---

## 2. 한 줄 규칙

서버에서 읽고, `fetch` 옵션을 명시한다.

Next.js 15부터 `fetch` 기본값은 캐시하지 않음(`no-store`)이다. 정적 페이지를 만들 때는 `cache: 'force-cache'` 또는 `next: {revalidate: N}`을 적는다. 팀 표준을 코드에 남긴다.

---

## 3. 예제

### 서버에서 fetch

```tsx
// lib/post.ts
export type Post = {
  title: string;
  body: string;
};

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: {revalidate: 60, tags: ['post', `post:${slug}`]},
  });
  if (!res.ok) {
    throw new Error(`글 로드 실패: ${slug}`);
  }
  return res.json() as Promise<Post>;
}
```

```tsx
// app/posts/[slug]/page.tsx
import {getPost} from '@/lib/post';

type Props = {
  params: Promise<{slug: string}>;
};

export default async function PostPage({params}: Props) {
  const {slug} = await params;
  const post = await getPost(slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

`revalidate: 60`은 **ISR(Incremental Static Regeneration, 만들어 둔 HTML을 N초 뒤에 다시 생성하는 방식)** 에 가깝다. 60초 안은 캐시, 이후 요청을 계기로 백그라운드에서 갱신한다.

### 옵션 치트시트

| 옵션 | 의미 |
|------|------|
| `cache: 'force-cache'` | 가능하면 캐시. 빌드 때 읽기에 가깝다 |
| `cache: 'no-store'` | 요청마다 원본을 친다 |
| `next: {revalidate: N}` | N초 후 재검증 |
| `next: {tags: ['post']}` | 태그로 묶었다가 한 번에 무효화 |

페이지 단위로 재검증 주기를 정할 수도 있다.

```tsx
export const revalidate = 60;
export const dynamic = 'force-static';
```

`cookies()`나 `headers()`를 읽으면 그 라우트는 동적이 된다. 요청마다 달라져야 하는 값이 있을 때만 쓴다.

### 태그 무효화

글 저장 후 목록·상세 캐시를 깨고 싶을 때 태그를 쓴다.

```ts
// app/posts/actions.ts
'use server';

import {revalidateTag} from 'next/cache';

export async function afterSavePost() {
  // Next.js 15: revalidateTag('post')
  // Next.js 16: 두 번째 인자(캐시 프로파일)가 필요하다
  revalidateTag('post', 'max');
}
```

정적 내보내기(`output: 'export'`)에서는 런타임 재검증이 없다. 빌드할 때 읽을 수 있는 데이터만 맞다. 로컬 마크다운, 공개 API가 그 예다.

### 로컬 파일

블로그·문서 사이트는 파일을 서버에서 읽는다.

```ts
// lib/markdown.ts
import fs from 'node:fs';
import path from 'node:path';

export function loadMarkdown(slug: string): string {
  const file = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);
  return fs.readFileSync(file, 'utf8');
}

export function listSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'posts');
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}
```

이 코드는 Server Component나 `lib`에서만 호출한다. Client에 import하지 않는다.

### 클라이언트 페칭은 언제

서버가 담당하기 어려운 경우만 Client에서 가져온다.

- 로그인한 사용자만의 실시간 숫자
- 무한 스크롤, 입력할 때마다 바뀌는 검색
- `localStorage` 등 브라우저 값에 의존하는 요청

초기 본문·목록·SEO에 필요한 HTML은 서버가 채운다. 그 위에 검색창만 Client로 얹는다.

### 로딩·에러 구간

```tsx
// app/posts/[slug]/loading.tsx
export default function Loading() {
  return <p>글을 불러오는 중</p>;
}
```

```tsx
// app/posts/[slug]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>글을 읽지 못했다.</p>
      <button type="button" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
```

`error.tsx`는 Client Component다. `reset`으로 해당 구간만 다시 렌더한다. `notFound()`는 `not-found.tsx`로 간다. 데이터 없음과 서버 실패를 구분한다.

---

## 4. 흔한 실수

| 실수 | 결과 | 대안 |
|------|------|------|
| `fetch` 옵션을 안 적는다 | Next 15에선 매번 원본. 의도와 다를 수 있다 | `cache` / `revalidate` / `tags`를 명시 |
| 정적 내보내기인데 `no-store` | 빌드가 동적 라우트로 실패하거나 HTML이 비어 있다 | 빌드 시점에 읽히는 소스만 |
| Client에서 시크릿 헤더 fetch | 키가 브라우저에 노출 | 서버에서 프록시·직접 호출 |
| `loading.tsx` 없이 느린 await | 빈 화면이 길다 | 구간 `loading` / `Suspense` |
| 파일 읽기를 Client에 둠 | `fs` 번들 에러 | 서버 `lib` + props |

---

## 정리

데이터는 서버에서 읽는다. 캐시 여부는 추측하지 않고 옵션으로 적는다.

공개 문서는 빌드 때 읽고, 개인화·검색 타이핑만 클라이언트로 남긴다. 정적 호스팅이면 “빌드 타임에 존재하는 데이터”가 유일한 소스다.

---

## 연습

1. 같은 URL에 `revalidate: 60` fetch와 `cache: 'no-store'` fetch를 번갈아 넣고, 빌드 로그의 정적/동적 표시를 비교한다.
2. `content/` 마크다운을 읽어 목록 페이지를 만든다.
3. 현재 배포가 `export`면 런타임 재검증을 빼고, 데이터 소스를 “빌드 때 읽기”로만 정리한다.
