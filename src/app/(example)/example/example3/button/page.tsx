import type {Metadata} from 'next';
import Example3ButtonPage from '@/modules/example/example3/example3-button-page';

export const metadata: Metadata = {
  title: 'example3 — Button',
};

export default function Page() {
  return <Example3ButtonPage />;
}
