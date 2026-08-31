import {apiPost} from '@/config/api-config';
import type {BoardItem, BoardListResponse} from '@/types/board';

export async function fetchBoardList(params?: {
  categoryId?: number;
  keyword?: string;
  title?: string;
  page?: number;
  pageSize?: number;
}): Promise<BoardListResponse> {
  const res = await apiPost<BoardListResponse>('bl/get-board-list', params || {}, null);
  return res.data;
}

export async function fetchBoard(boardNo: number, countView: 'Y' | 'N' = 'Y'): Promise<BoardItem> {
  const res = await apiPost<BoardItem>('bl/get-board', {boardNo, countView}, null);
  return res.data;
}

export async function createBoard(payload: {
  title: string;
  content: string;
  categoryId?: number;
  keyword?: string;
  excerpt?: string;
}): Promise<BoardItem> {
  const res = await apiPost<BoardItem>('bl/set-board', {mode: 'C', ...payload}, 'member');
  return res.data;
}

export async function updateBoard(payload: {
  boardNo: number;
  title: string;
  content: string;
  categoryId?: number;
  keyword?: string;
  excerpt?: string;
}): Promise<BoardItem> {
  const res = await apiPost<BoardItem>('bl/set-board', {mode: 'U', ...payload}, 'member');
  return res.data;
}

export async function deleteBoard(boardNo: number): Promise<void> {
  await apiPost('bl/set-board', {mode: 'D', boardNo}, 'member');
}
