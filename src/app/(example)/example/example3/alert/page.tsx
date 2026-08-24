import type {Metadata} from 'next';
import Example3AlertPage from '@/modules/example/example3/example3-alert-page';

export const metadata: Metadata = {
  title: 'Example3 — Alert',
};

export default function Page() {
  return <Example3AlertPage />;
}
