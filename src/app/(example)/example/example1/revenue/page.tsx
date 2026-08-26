import Example1RevenuePage from '@/modules/example/example1/example1-revenue-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 매출 리포트', description: 'Kaisa 펜션 매출 리포트 샘플', path: '/example/example1/revenue/' });

export default function Example1RevenueRoute() {
  return <Example1RevenuePage />;
}
