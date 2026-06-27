import type {Metadata} from 'next';
import Example3TextareaPage from '@/modules/example/example3/example3-textarea-page';

export const metadata: Metadata = {
  title: 'example3 — Textarea',
};

export default function Page() {
  return <Example3TextareaPage />;
}
