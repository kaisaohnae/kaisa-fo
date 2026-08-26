import Example2ChargersPage from '@/modules/example/example2/example2-chargers-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 충전기 현황', description: 'example2 — 충전기 현황 — Kaisa portfolio example', path: '/example/example2/chargers/' });

export default function Page() {
  return <Example2ChargersPage />;
}
