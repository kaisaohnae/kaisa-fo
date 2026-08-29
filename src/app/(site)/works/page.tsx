import type {Metadata} from 'next';
import PortfolioPage from '@/components/home/portfolio-page';

export const metadata: Metadata = {
  title: 'Works',
  description: '2005년부터 현재까지, 함께해 온 프로젝트 기록입니다.',
};

export default function Page() {
  return <PortfolioPage />;
}
