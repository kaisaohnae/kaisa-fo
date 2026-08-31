import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '게시판',
  description: '자유롭게 소통하고 의견을 공유하는 커뮤니티 게시판입니다.',
};

export default function BoardLayout({children}: {children: React.ReactNode}) {
  return children;
}
