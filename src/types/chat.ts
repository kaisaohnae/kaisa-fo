export interface ChatRoomInfo {
  roomNo: number;
  roomName: string;
  description: string;
}

export interface ChatUserInfo {
  nickname: string;
  isMember?: boolean;
  maskedIp: string;
  status: string;
  joinDt?: string;
  lastActiveDt?: string;
}

export interface ChatMessage {
  id: string;
  type: 'chat' | 'system';
  nickname: string;
  isMember?: boolean;
  maskedIp: string;
  content: string;
  timestamp: string;
}

export interface ChatRoomData {
  room: ChatRoomInfo;
  clientIp: string;
  maskedClientIp: string;
  isMember?: boolean;
  memberNickname?: string | null;
  activeUserCount: number;
  activeUsers: ChatUserInfo[];
}

export interface ChatSyncData {
  messages: ChatMessage[];
  activeUserCount: number;
  activeUsers: ChatUserInfo[];
}
