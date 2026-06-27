import type {Metadata} from 'next';
import Example3LoadingPage from '@/modules/example/example3/example3-loading-page';

export const metadata: Metadata = {
  title: 'example3 — Loading',
};

export default function Page() {
  return <Example3LoadingPage />;
}
