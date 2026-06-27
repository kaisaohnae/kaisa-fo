import type {Metadata} from 'next';
import Example2SessionsPage from '@/modules/example/example2/example2-sessions-page';

export const metadata: Metadata = {
  title: 'example2 — 충전 이력',
};

export default function Page() {
  return <Example2SessionsPage />;
}
