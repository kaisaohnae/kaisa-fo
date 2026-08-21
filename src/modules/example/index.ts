/** 샘플 성격 — 관리화면 / 컴포넌트 / 대시보드. 종류는 계속 늘릴 수 있다. */
export type ExampleKind = 'admin' | 'component' | 'dashboard';

export type ExampleLink = {
  id: string;
  label: string;
  href: string;
  kind: ExampleKind;
  /** false면 Hero 등에서 숨김 (기본: true) */
  show?: boolean;
  /** true면 새 창으로 열기 */
  external?: boolean;
};

/** 포트폴리오 Hero 등에서 노출할 example 링크 목록 — 제거 시 이 배열만 수정 */
export const EXAMPLE_LINKS: ExampleLink[] = [
  {
    id: 'example1',
    label: '관리화면 example1',
    href: '/example/example1',
    kind: 'admin',
    show: true
  },
  {
    id: 'example2',
    label: '관리화면 example2',
    href: '/example/example2',
    kind: 'admin',
    show: true
  },
  {
    id: 'example3',
    label: '컴포넌트 example3',
    href: '/example/example3',
    kind: 'component',
    show: true
  },
  {
    id: 'example4',
    label: '대시보드 example4',
    href: '/example/example4',
    kind: 'dashboard',
    show: true
  },
  {
    id: 'kaisa-kids',
    label: 'Kaisa Kids',
    href: 'https://game.kaisa.co.kr/',
    kind: 'dashboard',
    show: true,
    external: true
  },
  {
    id: 'kaisa-blog',
    label: 'Kaisa Blog',
    href: 'https://kaisa.co.kr/',
    kind: 'dashboard',
    show: true,
    external: true
  }
];

export const getVisibleExampleLinks = () =>
  EXAMPLE_LINKS.filter((item) => item.show !== false);

export const isExamplePath = (pathname: string) => pathname.startsWith('/example');

/** Windows 데스크톱 앱 다운로드 (Google Drive) — Hero example 링크 아래 노출 */
export type WindowsAppDownload = {
  id: string;
  label: string;
  href: string;
  /** CSS modifier: logger | uploader */
  tone: 'logger' | 'uploader';
};

export const WINDOWS_APP_DOWNLOADS: WindowsAppDownload[] = [
  {
    id: 'kaisa-logger',
    label: 'Kaisa Logger',
    href: 'https://drive.google.com/uc?export=download&id=1koGd-TKoZLAWm1AQ2DVAkOVFz4DnvJpe',
    tone: 'logger'
  },
  {
    id: 'kaisa-uploader',
    label: 'Kaisa Uploader',
    href: 'https://drive.google.com/uc?export=download&id=1t-pnSedsU0lZZDlEfshExwPw_X8NG6v0',
    tone: 'uploader'
  }
];
