'use client';

import {Suspense} from 'react';
import ChatRoomPage from '@/components/chat/chat-room-page';

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatRoomPage />
    </Suspense>
  );
}
