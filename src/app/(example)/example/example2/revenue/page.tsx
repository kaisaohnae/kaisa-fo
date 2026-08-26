import Example2RevenuePage from '@/modules/example/example2/example2-revenue-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 매출 리포트', description: 'example2 — 매출 리포트 — Kaisa portfolio example', path: '/example/example2/revenue/' });

export default function Page() {
  return <Example2RevenuePage />;
}
