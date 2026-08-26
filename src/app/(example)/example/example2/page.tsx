import Example2Dashboard from '@/modules/example/example2/example2-dashboard';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 충전소 관리 Example2', description: 'Kaisa EV 충전소 관리자 대시보드 샘플', path: '/example/example2/' });

export default function Example2Page() {
  return <Example2Dashboard />;
}
