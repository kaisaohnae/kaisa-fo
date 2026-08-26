import Example1ReservationsPage from '@/modules/example/example1/example1-reservations-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 예약 관리', description: 'Kaisa 펜션 예약 관리 샘플', path: '/example/example1/reservations/' });

export default function Example1ReservationsRoute() {
  return <Example1ReservationsPage />;
}
