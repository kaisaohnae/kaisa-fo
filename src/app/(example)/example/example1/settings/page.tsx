import type {Metadata} from 'next';
import Example1SettingsPage from '@/modules/example/example1/example1-settings-page';

export const metadata: Metadata = {
  title: 'example1 — 설정',
  description: 'Kaisa 펜션 설정 샘플',
};

export default function Example1SettingsRoute() {
  return <Example1SettingsPage />;
}
