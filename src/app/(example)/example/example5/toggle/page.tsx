import type {Metadata} from 'next';
import Example5TogglePage from '@/modules/example/example5/example5-toggle-page';

export const metadata: Metadata = {
  title: 'example5 — Toggle',
};

export default function Page() {
  return <Example5TogglePage />;
}
