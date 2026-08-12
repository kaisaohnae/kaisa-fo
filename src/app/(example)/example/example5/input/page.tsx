import type {Metadata} from 'next';
import Example5InputPage from '@/modules/example/example5/example5-input-page';

export const metadata: Metadata = {
  title: 'example5 — Input',
};

export default function Page() {
  return <Example5InputPage />;
}
