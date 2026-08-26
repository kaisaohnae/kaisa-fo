import Example2PricingPage from '@/modules/example/example2/example2-pricing-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 요금 설정', description: 'example2 — 요금 설정 — Kaisa portfolio example', path: '/example/example2/pricing/' });

export default function Page() {
  return <Example2PricingPage />;
}
