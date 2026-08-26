import PortfolioPage from '@/components/home/portfolio-page';
import JsonLd from '@/components/seo/json-ld';
import {homeJsonLd, homePageMetadata} from '@/lib/seo';

export const metadata = homePageMetadata();

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <PortfolioPage initialSection="home" />
    </>
  );
}
