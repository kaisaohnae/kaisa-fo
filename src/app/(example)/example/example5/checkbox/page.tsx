import type {Metadata} from 'next';
import Example5CheckboxPage from '@/modules/example/example5/example5-checkbox-page';

export const metadata: Metadata = {
  title: 'example5 — Checkbox',
};

export default function Page() {
  return <Example5CheckboxPage />;
}
