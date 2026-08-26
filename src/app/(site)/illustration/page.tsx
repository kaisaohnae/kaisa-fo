import PortfolioPage from '@/components/home/portfolio-page';
import JsonLd from '@/components/seo/json-ld';
import {buildPageMetadata, pageJsonLd} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Illustration',
  description: 'Illustration and visual work by Kaisa.',
  path: '/illustration/',
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={pageJsonLd(
          'Illustration',
          'Illustration and visual work by Kaisa.',
          '/illustration/',
        )}
      />
      <PortfolioPage initialSection="illustration" />
    </>
  );
}
