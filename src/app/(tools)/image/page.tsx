import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/image/compress/');

export default function ImageIndexPage() {
  return <Redirect href="/image/compress/" />;
}
