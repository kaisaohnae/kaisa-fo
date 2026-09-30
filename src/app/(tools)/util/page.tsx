import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/util/password/');

export default function UtilIndexPage() {
  return <Redirect href="/util/password/" />;
}
