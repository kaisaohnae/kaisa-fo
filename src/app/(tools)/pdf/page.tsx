import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/pdf/compress/');

export default function PdfIndexPage() {
  return <Redirect href="/pdf/compress/" />;
}
