import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/format/json/');

export default function FormatIndexPage() {
  return <Redirect href="/format/json/" />;
}
