import type {Metadata} from 'next';
import Example2PricingPage from '@/modules/example/example2/example2-pricing-page';

export const metadata: Metadata = {
  title: 'example2 — 요금 설정',
};

export default function Page() {
  return <Example2PricingPage />;
}
