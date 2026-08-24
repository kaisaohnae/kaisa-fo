import type {Metadata} from 'next';
import Example4SalesPage from '@/modules/example/example4/example4-sales-page';

export const metadata: Metadata = {
  title: 'example4 — 운송 실적',
  description: '세진로지스 운송 실적 대시보드 · ECharts',
};

export default function Example4SalesRoute() {
  return <Example4SalesPage />;
}
