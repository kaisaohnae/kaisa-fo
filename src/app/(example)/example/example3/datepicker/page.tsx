import type {Metadata} from 'next';
import Example3DatepickerPage from '@/modules/example/example3/example3-datepicker-page';

export const metadata: Metadata = {
  title: 'example3 — Datepicker',
};

export default function Page() {
  return <Example3DatepickerPage />;
}
