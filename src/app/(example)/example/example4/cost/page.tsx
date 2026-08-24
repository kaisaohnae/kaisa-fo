import type {Metadata} from 'next';
import Example4CostPage from '@/modules/example/example4/example4-cost-page';

export const metadata: Metadata = {
  title: 'example4 — 비용 추이',
  description: '세진로지스 비용 대시보드 · ApexCharts',
};

export default function Example4CostRoute() {
  return <Example4CostPage />;
}
