import type {Metadata} from 'next';
import Example2ChargersPage from '@/modules/example/example2/example2-chargers-page';

export const metadata: Metadata = {
  title: 'example2 — 충전기 현황',
};

export default function Page() {
  return <Example2ChargersPage />;
}
