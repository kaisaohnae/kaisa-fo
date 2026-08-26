import Example2SettingsPage from '@/modules/example/example2/example2-settings-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example2 — 설정', description: 'example2 — 설정 — Kaisa portfolio example', path: '/example/example2/settings/' });

export default function Page() {
  return <Example2SettingsPage />;
}
