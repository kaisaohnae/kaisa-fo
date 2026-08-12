import type {Metadata} from 'next';
import Example5RadioPage from '@/modules/example/example5/example5-radio-page';

export const metadata: Metadata = {
  title: 'example5 — Radio',
};

export default function Page() {
  return <Example5RadioPage />;
}
