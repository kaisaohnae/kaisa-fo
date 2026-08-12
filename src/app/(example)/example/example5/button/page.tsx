import type {Metadata} from 'next';
import Example5ButtonPage from '@/modules/example/example5/example5-button-page';

export const metadata: Metadata = {
  title: 'example5 — Button',
};

export default function Page() {
  return <Example5ButtonPage />;
}
