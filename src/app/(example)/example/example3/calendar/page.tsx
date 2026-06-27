import type {Metadata} from 'next';
import Example3CalendarPage from '@/modules/example/example3/example3-calendar-page';

export const metadata: Metadata = {
  title: 'example3 — Calendar',
};

export default function Page() {
  return <Example3CalendarPage />;
}
