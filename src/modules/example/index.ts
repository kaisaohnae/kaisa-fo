export type ExampleLink = {
  id: string;
  label: string;
  href: string;
  /** false면 Hero 등에서 숨김 (기본: true) */
  show?: boolean;
};

/** 포트폴리오 Hero 등에서 노출할 example 링크 목록 — 제거 시 이 배열만 수정 */
export const EXAMPLE_LINKS: ExampleLink[] = [
  {
    id: 'example1',
    label: '펜션 관리 example1',
    href: '/example/example1',
    show: false
  }
];

export const getVisibleExampleLinks = () =>
  EXAMPLE_LINKS.filter((item) => item.show !== false);

export const isExamplePath = (pathname: string) => pathname.startsWith('/example');
