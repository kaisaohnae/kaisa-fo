import Redirect from '@/components/redirect';
import {redirectPageMetadata} from '@/lib/seo';

export const metadata = redirectPageMetadata('/edit/compare/');

export default function EditIndexPage() {
  return <Redirect href="/edit/compare/" />;
}
