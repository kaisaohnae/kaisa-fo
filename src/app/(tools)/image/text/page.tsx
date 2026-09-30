import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/image/stroke/');

export default function Page() {
  return <Redirect href="/image/stroke/" />;
}
