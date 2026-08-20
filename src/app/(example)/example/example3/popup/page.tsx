import type {Metadata} from 'next';
import Example3PopupPage from '@/modules/example/example3/example3-popup-page';

export const metadata: Metadata = {
  title: 'Example3 — Popup',
};

export default function Page() {
  return <Example3PopupPage />;
}
