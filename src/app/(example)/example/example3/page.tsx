import type {Metadata} from 'next';
import Example3OverviewPage from '@/modules/example/example3/example3-overview-page';

export const metadata: Metadata = {
  title: 'Example3 — Flash UI Kit',
  description: 'Independent flashy UI kit, same IA as example3',
};

export default function Example3Page() {
  return <Example3OverviewPage />;
}
