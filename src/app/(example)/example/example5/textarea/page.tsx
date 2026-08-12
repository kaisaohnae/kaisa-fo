import type {Metadata} from 'next';
import Example5TextareaPage from '@/modules/example/example5/example5-textarea-page';

export const metadata: Metadata = {
  title: 'example5 — Textarea',
};

export default function Page() {
  return <Example5TextareaPage />;
}
