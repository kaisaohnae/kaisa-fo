import type {Metadata} from 'next';
import Example3SelectPage from '@/modules/example/example3/example3-select-page';

export const metadata: Metadata = {
  title: 'example3 — Select',
};

export default function Page() {
  return <Example3SelectPage />;
}
