import type {Metadata} from 'next';
import Example1ReservationsPage from '@/modules/example/example1/example1-reservations-page';

export const metadata: Metadata = {
  title: 'example1 — 예약 관리',
  description: 'Kaisa 펜션 예약 관리 샘플',
};

export default function Example1ReservationsRoute() {
  return <Example1ReservationsPage />;
}
