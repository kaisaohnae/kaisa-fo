import type {Metadata} from 'next';
import Example2RevenuePage from '@/modules/example/example2/example2-revenue-page';

export const metadata: Metadata = {
  title: 'example2 — 매출 리포트',
};

export default function Page() {
  return <Example2RevenuePage />;
}
