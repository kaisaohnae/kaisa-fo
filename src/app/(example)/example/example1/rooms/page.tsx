import type {Metadata} from 'next';
import Example1RoomsPage from '@/modules/example/example1/example1-rooms-page';

export const metadata: Metadata = {
  title: 'example1 — 객실 현황',
  description: 'Kaisa 펜션 객실 관리 샘플',
};

export default function Example1RoomsRoute() {
  return <Example1RoomsPage />;
}
