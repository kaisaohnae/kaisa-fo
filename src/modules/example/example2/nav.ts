export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  {id: 'dashboard', label: '대시보드', href: '/example/example2'},
  {id: 'sessions', label: '충전 이력', href: '/example/example2/sessions'},
  {id: 'chargers', label: '충전기 현황', href: '/example/example2/chargers'},
  {id: 'pricing', label: '요금 설정', href: '/example/example2/pricing'},
  {id: 'revenue', label: '매출 리포트', href: '/example/example2/revenue'},
  {id: 'settings', label: '설정', href: '/example/example2/settings'},
];

export function isNavActive(href: string, pathname: string) {
  if (href === '/example/example2') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
