import type {Metadata} from 'next';
import Example4TrafficPage from '@/modules/example/example4/example4-traffic-page';

export const metadata: Metadata = {
  title: 'example4 — 도크 가동',
  description: '세진로지스 도크 가동 대시보드 · Chart.js',
};

export default function Example4TrafficRoute() {
  return <Example4TrafficPage />;
}
