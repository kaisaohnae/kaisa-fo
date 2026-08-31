import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '채팅',
  description: '누구나 닉네임을 설정하여 자유롭게 대화할 수 있는 실시간 채팅 공간입니다.',
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
  return children;
}
