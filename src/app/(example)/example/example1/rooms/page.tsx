import Example1RoomsPage from '@/modules/example/example1/example1-rooms-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 객실 현황', description: 'Kaisa 펜션 객실 관리 샘플', path: '/example/example1/rooms/' });

export default function Example1RoomsRoute() {
  return <Example1RoomsPage />;
}
