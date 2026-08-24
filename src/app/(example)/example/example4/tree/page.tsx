import type {Metadata} from 'next';
import Example4TreePage from '@/modules/example/example4/example4-tree-page';

export const metadata: Metadata = {
  title: 'example4 — Location tree',
  description: 'Sejin logistics location tree · drag and drop cases',
};

export default function Example4TreeRoute() {
  return <Example4TreePage />;
}
