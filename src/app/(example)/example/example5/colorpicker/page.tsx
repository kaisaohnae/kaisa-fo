import type {Metadata} from 'next';
import Example5ColorpickerPage from '@/modules/example/example5/example5-colorpicker-page';

export const metadata: Metadata = {
  title: 'example5 — Colorpicker',
};

export default function Page() {
  return <Example5ColorpickerPage />;
}
