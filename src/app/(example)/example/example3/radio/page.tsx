import type {Metadata} from 'next';
import Example3RadioPage from '@/modules/example/example3/example3-radio-page';

export const metadata: Metadata = {
  title: 'example3 — Radio',
};

export default function Page() {
  return <Example3RadioPage />;
}
