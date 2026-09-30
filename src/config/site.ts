export const SITE_NAME = 'Kaisa';

export const SITE_DESCRIPTION =
  '2005년부터 웹·앱을 만들어 온 개발자의 기술 포스트(Next.js, Spring Boot, Flutter, AWS 등)와 설치 없이 브라우저에서 쓰는 이미지·PDF·개발 도구.';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:8887';
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}
