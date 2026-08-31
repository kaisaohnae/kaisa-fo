'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchCountryAndIp, peekStoredIp} from '@/i18n/detect';
import {useT} from '@/i18n/locale-context';
import {
  fetchChatRoom,
  getChatStreamUrl,
  joinChatRoom,
  leaveChatRoom,
  sendChatMessage,
} from '@/services/chat-service';
import useMemberStore from '@/store/use-member-store';
import type {ChatMessage, ChatRoomData, ChatUserInfo} from '@/types/chat';
import {KaisaButton, KaisaInput} from '@/ui-kit';

const SAVED_GUEST_NICK_KEY = 'kaisa_chat_guest_nickname';

function generateDefaultGuestNick() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `손님_${rand}`;
}

function formatTime(isoStr: string) {
  try {
    const d = new Date(isoStr);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export default function ChatRoomPage() {
  const t = useT();
  const member = useMemberStore((s) => s.member);
  const hydrated = useMemberStore((s) => s.hydrated);
  const isMember = Boolean(hydrated && member?.memberName);

  const [roomData, setRoomData] = useState<ChatRoomData | null>(null);
  const [clientIp, setClientIp] = useState<string>(() => peekStoredIp() || '');
  const [nickname, setNickname] = useState('');
  const [inputNick, setInputNick] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ChatUserInfo[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMsgIdRef = useRef<string>('');
  const clientIpRef = useRef<string>(peekStoredIp() || '');

  // 1. 다중언어(i18n)에서 사용한 api.country.is IP 정보 가져오기 및 방 정보 로드
  useEffect(() => {
    const cachedIp = peekStoredIp();
    if (cachedIp) {
      setClientIp(cachedIp);
      clientIpRef.current = cachedIp;
      fetchChatRoom(1, cachedIp)
        .then((data) => {
          setRoomData(data);
          setActiveUsers(data.activeUsers || []);
          setOnlineCount(data.activeUserCount || 0);
        })
        .catch(() => {});
    } else {
      fetchCountryAndIp().then(({ip}) => {
        const resolvedIp = ip || '';
        if (resolvedIp) {
          setClientIp(resolvedIp);
          clientIpRef.current = resolvedIp;
        }
        fetchChatRoom(1, resolvedIp || undefined)
          .then((data) => {
            setRoomData(data);
            setActiveUsers(data.activeUsers || []);
            setOnlineCount(data.activeUserCount || 0);
          })
          .catch(() => {});
      });
    }
  }, []);

  // 2. 닉네임 기본값 (회원은 고정 회원명, 비회원은 손님_XXXX)
  useEffect(() => {
    if (!hydrated) return;
    if (isMember && member?.memberName) {
      setInputNick(member.memberName);
    } else {
      const saved = localStorage.getItem(SAVED_GUEST_NICK_KEY);
      if (saved) {
        setInputNick(saved);
      } else {
        setInputNick(generateDefaultGuestNick());
      }
    }
  }, [hydrated, isMember, member]);

  // 스크롤 맨 아래로 이동
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 3. 입장 처리
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalNick = isMember && member?.memberName ? member.memberName : inputNick.trim();
    if (!finalNick) {
      alert('닉네임을 입력해 주세요.');
      return;
    }

    try {
      const currentIp = clientIpRef.current || clientIp;
      await joinChatRoom({roomNo: 1, nickname: finalNick, ip: currentIp || undefined});
      setNickname(finalNick);
      setIsJoined(true);
      if (!isMember) {
        localStorage.setItem(SAVED_GUEST_NICK_KEY, finalNick);
      }
    } catch (err: any) {
      alert(err.message || '입장에 실패했습니다.');
    }
  };

  // 4. 퇴장 처리
  const handleLeave = useCallback(async () => {
    if (!isJoined) return;
    try {
      const currentIp = clientIpRef.current || clientIp;
      await leaveChatRoom(1, currentIp || undefined);
    } catch {
      /* ignore */
    }
    setIsJoined(false);
  }, [clientIp, isJoined]);

  // 브라우저 닫거나 이탈 시 퇴장 처리
  useEffect(() => {
    const onBeforeUnload = () => {
      if (isJoined) {
        const currentIp = clientIpRef.current || clientIp;
        leaveChatRoom(1, currentIp || undefined);
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (isJoined) {
        const currentIp = clientIpRef.current || clientIp;
        leaveChatRoom(1, currentIp || undefined);
      }
    };
  }, [clientIp, isJoined]);

  // 5. SSE (Server-Sent Events) 실시간 스트림 연결 & 하트비트
  useEffect(() => {
    if (!isJoined) return;

    let eventSource: EventSource | null = null;
    let isCleanedUp = false;

    const connectSse = () => {
      if (isCleanedUp) return;

      const currentIp = clientIpRef.current || clientIp;
      const streamUrl = getChatStreamUrl(1, lastMsgIdRef.current || '', currentIp || undefined);
      eventSource = new EventSource(streamUrl);

      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.messages && data.messages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const fresh = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));
              if (fresh.length === 0) return prev;
              return [...prev, ...fresh];
            });
            lastMsgIdRef.current = data.messages[data.messages.length - 1].id;
          }
        } catch {
          /* ignore parse error */
        }
      });

      eventSource.addEventListener('users', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.activeUsers) {
            setActiveUsers(data.activeUsers);
            setOnlineCount(data.activeUserCount || 0);
          }
        } catch {
          /* ignore */
        }
      });

      eventSource.onerror = () => {
        // 연결이 종료되거나 에러 발생 시 정리 후 재연결 (EventSource 자체 재연결 또는 1.5초 후 재시도)
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!isCleanedUp) {
          setTimeout(connectSse, 1500);
        }
      };
    };

    connectSse();

    return () => {
      isCleanedUp = true;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [clientIp, isJoined]);

  // 6. 메시지 전송 (낙관적 UI: 내 화면에 0초 즉시 반영 후 백그라운드 전송)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    // 즉시 임시 메시지 ID로 화면에 먼저 띄움 (체감 지연 0초)
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      type: 'chat',
      nickname,
      isMember,
      maskedIp: roomData?.maskedClientIp || '',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');
    setSending(true);

    try {
      const currentIp = clientIpRef.current || clientIp;
      const msg = await sendChatMessage({
        roomNo: 1,
        nickname,
        message: text,
        ip: currentIp || undefined,
      });

      // 서버 응답 ID로 교체
      setMessages((prev) => prev.map((m) => (m.id === tempId ? msg : m)));
      lastMsgIdRef.current = msg.id;
    } catch (err: any) {
      // 실패 시 롤백
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert(err.message || '메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="blog-main">
      <div className="site-shell">
        <div className="site-shell__inner chat-container">
          <section className="blog-hero" style={{marginBottom: '28px'}}>
            <p className="blog-hero__eyebrow">{t('Chat')}</p>
            <h1 className="blog-hero__title">{t('Live Chat')}</h1>
            <p className="blog-hero__desc">대화 내용은 저장되지 않는 휘발성 채팅방</p>
          </section>

          {!isJoined ? (
            /* 닉네임 입력 및 입장 카드 */
            <div className="chat-login-card">
              <h2 className="chat-login-card__title">채팅방 입장</h2>
              <p className="chat-login-card__desc">실시간 대화에 참여할 닉네임 정보를 확인해 주세요.</p>

              <div className="chat-login-card__badge-row">
                {!isMember && <span className="chat-badge chat-badge--guest">비회원 손님</span>}
                {roomData?.maskedClientIp && (
                  <span className="chat-login-card__ip-info">IP: {roomData.maskedClientIp}</span>
                )}
              </div>

              <form onSubmit={handleJoin} style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                {isMember ? (
                  /* 회원: 고정 닉네임 표시 */
                  <div className="chat-login-card__fixed-name">
                    <span>{member?.memberName}</span>
                  </div>
                ) : (
                  /* 비회원: 닉네임 입력 (손님_XXXX 기본 제공) */
                  <KaisaInput
                    value={inputNick}
                    onChange={(e) => setInputNick(e.target.value)}
                    placeholder="비회원 닉네임 입력 (예: 손님_1234)"
                    uiSize="lg"
                    required
                    maxLength={20}
                  />
                )}

                <KaisaButton type="submit" variant="primary" uiSize="lg">
                  채팅방 입장하기
                </KaisaButton>
              </form>
            </div>
          ) : (
            /* 실시간 채팅창 */
            <div className="chat-card">
              {/* 상단 룸 바 */}
              <div className="chat-card__header">
                <div className="chat-card__title-group">
                  <h3 className="chat-card__room-name">{roomData?.room.roomName || '실시간 채팅방'}</h3>
                </div>

                <div className="chat-card__user-info">
                  <button
                    type="button"
                    className="chat-leave-icon-btn"
                    onClick={handleLeave}
                    aria-label="나가기"
                    title="나가기"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 본문: 대화창 + 접속자 목록 */}
              <div className="chat-card__body">
                {/* 메시지 영역 */}
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div style={{textAlign: 'center', color: 'var(--color-text-muted)', margin: 'auto'}}>
                      대화가 시작되었습니다. 메시지를 입력해 보세요!
                    </div>
                  ) : (
                    messages.map((m) => {
                      if (m.type === 'system') {
                        return (
                          <div key={m.id} className="chat-msg--system">
                            {m.content}
                          </div>
                        );
                      }

                      const isMine = m.nickname === nickname;
                      return (
                        <div key={m.id} className={`chat-msg ${isMine ? 'chat-msg--mine' : 'chat-msg--other'}`}>
                          <div className="chat-msg__meta">
                            {!isMine && (
                              m.isMember ? (
                                <span className="chat-badge chat-badge--member">회원</span>
                              ) : (
                                <span className="chat-badge chat-badge--guest">손님</span>
                              )
                            )}
                            {!isMine && <span className="chat-msg__sender">{m.nickname}</span>}
                            {!isMine && m.maskedIp && <span>({m.maskedIp})</span>}
                            <span>{formatTime(m.timestamp)}</span>
                          </div>
                          <div className="chat-msg__bubble">{m.content}</div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 접속자 리스트 사이드바 */}
                <aside className="chat-sidebar">
                  <div className="chat-sidebar__header">참여자 ({activeUsers.length})</div>
                  <ul className="chat-sidebar__list">
                    {activeUsers.map((u, idx) => (
                      <li key={idx} className="chat-sidebar__item">
                        <div className="chat-sidebar__item-name">
                          {u.isMember ? (
                            <span className="chat-badge chat-badge--member">회원</span>
                          ) : (
                            <span className="chat-badge chat-badge--guest">손님</span>
                          )}
                          <span className="chat-sidebar__name">
                            {u.nickname} {u.nickname === nickname && '(나)'}
                          </span>
                        </div>
                        <span className="chat-sidebar__ip">{u.maskedIp}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              {/* 입력창 바 */}
              <form className="chat-card__input-bar" onSubmit={handleSendMessage}>
                <KaisaInput
                  className="chat-card__input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="메시지를 입력하세요 (Enter로 전송)..."
                  uiSize="md"
                  autoFocus
                />
                <KaisaButton type="submit" variant="primary" uiSize="md" disabled={sending || !inputText.trim()}>
                  전송
                </KaisaButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
