export type NavItem = {
  id: string;
  label: string;
  href: string;
  library: string;
};

export const NAV_ITEMS: NavItem[] = [
  {id: 'overview', label: '운영 현황', href: '/example/example4', library: 'Recharts'},
  {id: 'sales', label: '운송 실적', href: '/example/example4/sales', library: 'ECharts'},
  {id: 'traffic', label: '도크 가동', href: '/example/example4/traffic', library: 'Chart.js'},
  {id: 'mix', label: '화주 구성', href: '/example/example4/mix', library: 'Nivo'},
  {id: 'cost', label: '비용 추이', href: '/example/example4/cost', library: 'ApexCharts'},
  {id: 'tree', label: '로케이션', href: '/example/example4/tree', library: 'DnD'},
];

export function isNavActive(href: string, pathname: string) {
  if (href === '/example/example4') {
    return pathname === href || pathname === '/example/example4/';
  }
  return pathname.startsWith(href);
}
