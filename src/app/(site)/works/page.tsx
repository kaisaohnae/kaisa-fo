import PortfolioPage from '@/components/home/portfolio-page';
import JsonLd from '@/components/seo/json-ld';
import {buildPageMetadata, pageJsonLd} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Works',
  description: 'Selected web and product work by Kaisa.',
  path: '/works/',
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={pageJsonLd('Works', 'Selected web and product work by Kaisa.', '/works/')}
      />
      <PortfolioPage initialSection="works" />
    </>
  );
}
