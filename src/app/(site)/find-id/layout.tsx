import {buildPageMetadata} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Find ID',
  description: 'Recover your Kaisa Blog account email.',
  path: '/find-id/',
  index: false,
});

export default function FindIdLayout({children}: {children: React.ReactNode}) {
  return children;
}
