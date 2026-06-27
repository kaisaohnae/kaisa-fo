import type {Metadata} from 'next';
import Example3ColorpickerPage from '@/modules/example/example3/example3-colorpicker-page';

export const metadata: Metadata = {
  title: 'example3 — Colorpicker',
};

export default function Page() {
  return <Example3ColorpickerPage />;
}
