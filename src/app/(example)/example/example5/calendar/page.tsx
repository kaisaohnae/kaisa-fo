import type {Metadata} from 'next';
import Example5CalendarPage from '@/modules/example/example5/example5-calendar-page';

export const metadata: Metadata = {
  title: 'example5 — Calendar',
};

export default function Page() {
  return <Example5CalendarPage />;
}
