'use client';

import {Suspense} from 'react';
import BoardListPage from '@/components/board/board-list-page';

export default function BoardPage() {
  return (
    <Suspense fallback={null}>
      <BoardListPage />
    </Suspense>
  );
}
