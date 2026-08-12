import type {Metadata} from 'next';
import Example4OverviewPage from '@/modules/example/example4/example4-overview-page';

export const metadata: Metadata = {
  title: 'example4 — 운영 현황',
  description: '세진로지스 인천센터 운영 대시보드 · Recharts',
};

export default function Example4Page() {
  return <Example4OverviewPage />;
}
