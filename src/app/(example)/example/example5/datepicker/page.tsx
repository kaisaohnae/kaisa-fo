import type {Metadata} from 'next';
import Example5DatepickerPage from '@/modules/example/example5/example5-datepicker-page';

export const metadata: Metadata = {
  title: 'example5 — Datepicker',
};

export default function Page() {
  return <Example5DatepickerPage />;
}
