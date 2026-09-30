import type {Metadata} from 'next';
import {absoluteUrl} from '@/config/site';

/** /illustration/ only redirects to /works/ (the gallery section lives there). */
export const metadata: Metadata = {
  alternates: {canonical: absoluteUrl('/works/')},
  robots: {index: false, follow: true},
};

export default function IllustrationLayout({children}: {children: React.ReactNode}) {
  return children;
}
