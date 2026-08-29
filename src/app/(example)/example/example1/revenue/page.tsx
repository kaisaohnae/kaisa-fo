import type {Metadata} from 'next';
import Example1RevenuePage from '@/modules/example/example1/example1-revenue-page';

export const metadata: Metadata = {
  title: 'example1 — 매출 리포트',
  description: 'Kaisa 펜션 매출 리포트 샘플',
};

export default function Example1RevenueRoute() {
  return <Example1RevenuePage />;
}
