import type {Metadata} from 'next';
import Example3CheckboxPage from '@/modules/example/example3/example3-checkbox-page';

export const metadata: Metadata = {
  title: 'example3 — Checkbox',
};

export default function Page() {
  return <Example3CheckboxPage />;
}
