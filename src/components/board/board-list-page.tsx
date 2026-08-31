'use client';

import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import BlogPagination from '@/components/blog/blog-pagination';
import {useT} from '@/i18n/locale-context';
import {fetchBoardList} from '@/services/board-service';
import useMemberStore from '@/store/use-member-store';
import type {BoardItem} from '@/types/board';
import {KaisaButton, KaisaInput} from '@/ui-kit';

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default function BoardListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();
  const member = useMemberStore((s) => s.member);
  const hydrated = useMemberStore((s) => s.hydrated);

  const queryPage = Number(searchParams.get('page')) || 1;
  const queryQ = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<BoardItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(queryPage);
  const [lastPage, setLastPage] = useState(1);
  const [searchInput, setSearchInput] = useState(queryQ);

  const loadData = useCallback(async (page: number, keyword: string) => {
    setLoading(true);
    try {
      const res = await fetchBoardList({
        page,
        keyword: keyword.trim() || undefined,
        pageSize: 15,
      });
      setList(res.list || []);
      setTotalCount(res.totalCount || 0);
      setCurrentPage(res.currentPage || 1);
      setLastPage(res.lastPage || 1);
    } catch {
      setList([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(queryPage, queryQ);
  }, [loadData, queryPage, queryQ]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set('q', searchInput.trim());
    }
    router.push(`/board/${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (queryQ) params.set('q', queryQ);
    if (page > 1) params.set('page', String(page));
    return `/board/${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const handleWriteClick = () => {
    if (hydrated && !member) {
      router.push('/login?returnUrl=/board/write');
    } else {
      router.push('/board/write');
    }
  };

  return (
    <main className="blog-main">
      <div className="site-shell">
        <div className="site-shell__inner board-container">
          <section className="blog-hero">
            <p className="blog-hero__eyebrow">{t('Board')}</p>
            <h1 className="blog-hero__title">{t('Community Board')}</h1>
            <p className="blog-hero__desc">자유롭게 소통하고 의견을 공유하는 공간입니다.</p>
          </section>

          <div className="board-top-bar">
            <form className="board-top-bar__search" onSubmit={onSearchSubmit}>
              <div className="board-top-bar__search-inner">
                <KaisaInput
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  uiSize="md"
                />
                <KaisaButton type="submit" variant="secondary" uiSize="md">
                  {t('Search')}
                </KaisaButton>
              </div>
            </form>

            <div className="board-top-bar__actions">
              <KaisaButton type="button" variant="primary" uiSize="md" onClick={handleWriteClick}>
                {t('Write')}
              </KaisaButton>
            </div>
          </div>

          <div className="board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th className="board-table__no">{t('No.')}</th>
                  <th className="board-table__title">{t('Title')}</th>
                  <th className="board-table__author">{t('Author')}</th>
                  <th className="board-table__date">{t('Date')}</th>
                  <th className="board-table__views">{t('Views')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="board-table__empty" style={{height: '160px'}} />
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="board-table__empty">
                      {queryQ ? `"${queryQ}"에 대한 검색 결과가 없습니다.` : '등록된 게시글이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  list.map((item) => {
                    const authorName = item.member?.memberName || item.creator || '익명';
                    return (
                      <tr key={item.boardNo} onClick={() => router.push(`/board/detail/?boardNo=${item.boardNo}`)}>
                        <td className="board-table__no">{item.boardNo}</td>
                        <td className="board-table__title">
                          <Link
                            href={`/board/detail/?boardNo=${item.boardNo}`}
                            className="board-table__title-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.title}
                          </Link>
                          <div className="board-table__meta-mobile">
                            <span>{authorName}</span>
                            <span>·</span>
                            <span>{formatDate(item.createDt)}</span>
                            <span>·</span>
                            <span>조회 {item.viewCount}</span>
                          </div>
                        </td>
                        <td className="board-table__author">{authorName}</td>
                        <td className="board-table__date">{formatDate(item.createDt)}</td>
                        <td className="board-table__views">{item.viewCount}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && lastPage > 1 && (
            <div className="blog-list-footer" style={{marginTop: '28px'}}>
              <BlogPagination currentPage={currentPage} lastPage={lastPage} buildHref={buildHref} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
