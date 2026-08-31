'use client';

import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import PostContent from '@/components/blog/post-content';
import {useT} from '@/i18n/locale-context';
import {isBoardRead, markBoardAsRead} from '@/lib/read-board-storage';
import {deleteBoard, fetchBoard} from '@/services/board-service';
import useMemberStore from '@/store/use-member-store';
import type {BoardItem} from '@/types/board';
import {KaisaButton} from '@/ui-kit';

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function BoardDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardNo = Number(searchParams.get('boardNo'));
  const t = useT();
  const member = useMemberStore((s) => s.member);
  const hydrated = useMemberStore((s) => s.hydrated);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<BoardItem | null>(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!boardNo) {
      setError('게시글 번호가 올바르지 않습니다.');
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);

    const alreadyRead = isBoardRead(boardNo);
    const countView = alreadyRead ? 'N' : 'Y';

    fetchBoard(boardNo, countView)
      .then((data) => {
        if (mounted) {
          setItem(data);
          if (!alreadyRead) {
            markBoardAsRead(boardNo);
          }
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || '게시글을 불러올 수 없습니다.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [boardNo]);

  const handleDelete = async () => {
    if (!boardNo) return;
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await deleteBoard(boardNo);
      alert('게시글이 삭제되었습니다.');
      router.push('/board/');
    } catch (err: any) {
      alert(err.message || '삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  if (loading) {
    return null;
  }

  if (error || !item) {
    return (
      <main className="blog-main">
        <div className="site-shell">
          <div className="site-shell__inner board-detail" style={{textAlign: 'center', padding: '80px 0'}}>
            <p className="form-error" style={{fontSize: '18px', marginBottom: '24px'}}>
              {error || '게시글이 존재하지 않습니다.'}
            </p>
            <Link href="/board/">
              <KaisaButton variant="primary">{t('List')}</KaisaButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isAuthor = Boolean(hydrated && member && member.memberId === item.creator);
  const authorName = item.member?.memberName || item.creator || '익명';

  return (
    <main className="blog-main">
      <div className="site-shell">
        <div className="site-shell__inner board-detail">
          <div className="board-detail__header">
            <p className="blog-hero__eyebrow">{item.category?.categoryName || t('Board')}</p>
            <h1 className="board-detail__title">{item.title}</h1>
            <div className="board-detail__meta">
              <span className="board-detail__author">{authorName}</span>
              <span className="board-detail__divider">|</span>
              <span>{formatDate(item.createDt)}</span>
              <span className="board-detail__divider">|</span>
              <span>
                {t('Views')} {item.viewCount}
              </span>
            </div>
          </div>

          <div className="board-detail__body">
            <PostContent content={item.content || ''} />
          </div>

          <div className="board-detail__actions">
            <div className="board-detail__group-left">
              <Link href="/board/">
                <KaisaButton variant="secondary">{t('List')}</KaisaButton>
              </Link>
            </div>

            {isAuthor && (
              <div className="board-detail__group-right">
                <Link href={`/board/edit/?boardNo=${item.boardNo}`}>
                  <KaisaButton variant="secondary">{t('Edit')}</KaisaButton>
                </Link>
                <KaisaButton variant="danger" disabled={deleting} onClick={handleDelete}>
                  {deleting ? '삭제 중...' : t('Delete')}
                </KaisaButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BoardDetailPage() {
  return (
    <Suspense fallback={null}>
      <BoardDetailContent />
    </Suspense>
  );
}
