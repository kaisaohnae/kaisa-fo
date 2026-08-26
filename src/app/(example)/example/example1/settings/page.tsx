import Example1SettingsPage from '@/modules/example/example1/example1-settings-page';
import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({ title: 'example1 — 설정', description: 'Kaisa 펜션 설정 샘플', path: '/example/example1/settings/' });

export default function Example1SettingsRoute() {
  return <Example1SettingsPage />;
}
