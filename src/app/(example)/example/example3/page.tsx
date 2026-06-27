import type {Metadata} from 'next';
import Example3OverviewPage from '@/modules/example/example3/example3-overview-page';

export const metadata: Metadata = {
  title: 'example3 — UI Components',
  description: 'Kaisa 공통 UI 컴포넌트 쇼케이스',
};

export default function Example3Page() {
  return <Example3OverviewPage />;
}
