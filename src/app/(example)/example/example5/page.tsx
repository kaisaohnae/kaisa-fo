import type {Metadata} from 'next';
import Example5OverviewPage from '@/modules/example/example5/example5-overview-page';

export const metadata: Metadata = {
  title: 'example5 ? Flash UI Kit',
  description: 'Independent flashy UI kit, same IA as example3',
};

export default function Example5Page() {
  return <Example5OverviewPage />;
}
