import Example2SessionsPage from '@/modules/example/example2/example2-sessions-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 충전 이력', description: 'example2 — 충전 이력 — Kaisa portfolio example', path: '/example/example2/sessions/' });

export default function Page() {
  return <Example2SessionsPage />;
}
