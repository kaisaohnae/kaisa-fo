export const SITE_NAME = 'Kaisa';

export const SITE_DESCRIPTION =
  'Full-stack creative developer. Plan, design, and develop in one flow.';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:8688';
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}
