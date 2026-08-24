import type {Metadata} from 'next';
import Example2SettingsPage from '@/modules/example/example2/example2-settings-page';

export const metadata: Metadata = {
  title: 'example2 — 설정',
};

export default function Page() {
  return <Example2SettingsPage />;
}
