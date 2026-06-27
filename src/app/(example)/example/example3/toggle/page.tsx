import type {Metadata} from 'next';
import Example3TogglePage from '@/modules/example/example3/example3-toggle-page';

export const metadata: Metadata = {
  title: 'example3 — Toggle',
};

export default function Page() {
  return <Example3TogglePage />;
}
