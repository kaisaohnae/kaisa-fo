import type {Metadata} from 'next';
import Example5LoadingPage from '@/modules/example/example5/example5-loading-page';

export const metadata: Metadata = {
  title: 'example5 — Loading',
};

export default function Page() {
  return <Example5LoadingPage />;
}
