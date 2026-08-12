import type {Metadata} from 'next';
import Example4MixPage from '@/modules/example/example4/example4-mix-page';

export const metadata: Metadata = {
  title: 'example4 — 화주 구성',
  description: '세진로지스 화주 구성 대시보드 · Nivo',
};

export default function Example4MixRoute() {
  return <Example4MixPage />;
}
