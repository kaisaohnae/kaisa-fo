export type KaisaSite = 'fo';

/** Top-level paths served by the tool pages (src/app/(tools)). */
const TOOL_PATH_PREFIXES = ['/image/', '/pdf/', '/format/', '/edit/', '/util/', '/photo/'];
function navUrl(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return fallback;
    if (process.env.NODE_ENV === 'production' && ['localhost', '127.0.0.1'].includes(url.hostname)) return fallback;
    return value;
  } catch { return fallback; }
}
/** kaisa-fo header: Posts, Tools (migrated from kaisa-tool, same-site routes) and Works. */
export const KAISA_NAV = [
  {id: 'posts', label: 'Posts', href: navUrl(process.env.NEXT_PUBLIC_NAV_POSTS_URL, 'https://kaisa.co.kr/')},
  {id: 'tool', label: 'Tools', href: '/image/compress/'},
  {id: 'works', label: 'Works', href: navUrl(process.env.NEXT_PUBLIC_NAV_WORKS_URL, 'https://kaisa.co.kr/works')}
] as const;
export const KAISA_HOME_URL = navUrl(process.env.NEXT_PUBLIC_NAV_HOME_URL, 'https://kaisa.co.kr/');
export function activeKaisaNav(_site: KaisaSite, pathname: string) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (TOOL_PATH_PREFIXES.some(prefix => path.startsWith(prefix))) return 'tool';
  return path.startsWith('/works/') || path.startsWith('/illustration/') ? 'works' : 'posts';
}

export const KAISA_NAV_LABELS = {
  en: {posts: 'POST', tool: 'TOOL', works: 'WORK'},
  ko: {posts: '포스트', tool: '도구', works: '작업'},
  zh: {posts: '文章', tool: '工具', works: '作品'},
  hi: {posts: 'पोस्ट', tool: 'टूल', works: 'कार्य'}
} as const;
