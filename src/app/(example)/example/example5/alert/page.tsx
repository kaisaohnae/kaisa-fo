import type {Metadata} from 'next';
import Example5AlertPage from '@/modules/example/example5/example5-alert-page';

export const metadata: Metadata = {
  title: 'example5 — Alert',
};

export default function Page() {
  return <Example5AlertPage />;
}
