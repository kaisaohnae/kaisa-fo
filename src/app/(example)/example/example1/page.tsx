import Example1Dashboard from '@/modules/example/example1/example1-dashboard';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 펜션 관리 Example1', description: 'Kaisa 펜션 관리자 대시보드 샘플', path: '/example/example1/' });

export default function Example1Page() {
  return <Example1Dashboard />;
}
