import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '채팅',
  description: '누구나 닉네임을 설정하여 자유롭게 대화할 수 있는 실시간 채팅 공간입니다.',
  // Member/community page rendered in the browser only (no text in the static HTML) — keep it out of the index.
  robots: {index: false, follow: true},
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
  return children;
}
