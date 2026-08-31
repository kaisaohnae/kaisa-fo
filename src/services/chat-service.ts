import {apiPost} from '@/config/api-config';
import type {ChatRoomData, ChatSyncData, ChatMessage} from '@/types/chat';

export async function fetchChatRoom(roomNo = 1, ip?: string): Promise<ChatRoomData> {
  const res = await apiPost<ChatRoomData>('bl/get-chat-room', {roomNo, ip}, null);
  return res.data;
}

export async function joinChatRoom(params: {
  roomNo?: number;
  nickname: string;
  ip?: string;
}): Promise<{roomNo: number; nickname: string; ip: string; maskedIp: string; status: string}> {
  const res = await apiPost<any>('bl/join-chat-room', params, null);
  return res.data;
}

export async function leaveChatRoom(roomNo = 1, ip?: string): Promise<void> {
  await apiPost('bl/leave-chat-room', {roomNo, ip}, null);
}

export async function sendChatMessage(params: {
  roomNo?: number;
  nickname: string;
  message: string;
  ip?: string;
}): Promise<ChatMessage> {
  const res = await apiPost<ChatMessage>('bl/send-chat-message', params, null);
  return res.data;
}

export function getChatStreamUrl(roomNo = 1, lastId = '', ip?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const query = new URLSearchParams({
    roomNo: String(roomNo),
    lastId: lastId || '',
    ...(ip ? {ip} : {}),
  });
  return `${baseUrl}/bl/chat-stream?${query.toString()}`;
}
