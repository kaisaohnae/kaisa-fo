import type {Metadata} from 'next';
import Example5PopupPage from '@/modules/example/example5/example5-popup-page';

export const metadata: Metadata = {
  title: 'example5 — Popup',
};

export default function Page() {
  return <Example5PopupPage />;
}
