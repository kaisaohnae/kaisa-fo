import type {Metadata} from 'next';
import Example5SelectPage from '@/modules/example/example5/example5-select-page';

export const metadata: Metadata = {
  title: 'example5 — Select',
};

export default function Page() {
  return <Example5SelectPage />;
}
