export const READ_BOARD_KEY = 'kaisa_board_read_items';

function readBoardIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READ_BOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
}

function writeBoardIds(ids: number[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READ_BOARD_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function isBoardRead(boardNo: number): boolean {
  if (!boardNo) return false;
  const ids = readBoardIds();
  return ids.includes(boardNo);
}

export function markBoardAsRead(boardNo: number) {
  if (!boardNo) return;
  const ids = readBoardIds();
  if (ids.includes(boardNo)) return;
  const next = [...ids, boardNo].slice(-500);
  writeBoardIds(next);
}
