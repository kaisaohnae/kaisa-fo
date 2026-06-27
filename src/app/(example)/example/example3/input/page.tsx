import type {Metadata} from 'next';
import Example3InputPage from '@/modules/example/example3/example3-input-page';

export const metadata: Metadata = {
  title: 'example3 — Input',
};

export default function Page() {
  return <Example3InputPage />;
}
