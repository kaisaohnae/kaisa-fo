import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '게시판',
  description: '자유롭게 소통하고 의견을 공유하는 커뮤니티 게시판입니다.',
  // Member/community page rendered in the browser only (no text in the static HTML) — keep it out of the index.
  robots: {index: false, follow: true},
};

export default function BoardLayout({children}: {children: React.ReactNode}) {
  return children;
}
