import {buildPageMetadata} from '@/lib/seo';
import PortfolioPage from '@/components/home/portfolio-page';

export const metadata = buildPageMetadata({
  title: 'Works',
  description: '2005년부터 현재까지, 함께해 온 프로젝트 기록입니다.',
  path: '/works/',
});

export default function Page() {
  return <PortfolioPage />;
}
