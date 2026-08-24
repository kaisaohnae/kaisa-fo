export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  {id: 'dashboard', label: '대시보드', href: '/example/example1'},
  {id: 'reservations', label: '예약 관리', href: '/example/example1/reservations'},
  {id: 'rooms', label: '객실 현황', href: '/example/example1/rooms'},
  {id: 'season', label: '시즌 설정', href: '/example/example1/season'},
  {id: 'revenue', label: '매출 리포트', href: '/example/example1/revenue'},
  {id: 'settings', label: '설정', href: '/example/example1/settings'},
];

export function isNavActive(href: string, pathname: string) {
  if (href === '/example/example1') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
