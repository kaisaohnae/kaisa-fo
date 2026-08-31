'use client';

import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Suspense, useMemo} from 'react';
import BlogPagination from '@/components/blog/blog-pagination';
import BlogSearchBar from '@/components/blog/blog-search-bar';
import type {BlogPostSummary} from '@/data/blog-posts';

const PAGE_SIZE = 10;

type Category = {id: string; label: string; count: number};

export function buildPostsListHref(params: {
  page: number;
  category?: string;
  q?: string;
}): string {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.q) search.set('q', params.q);
  if (params.page > 1) search.set('page', String(params.page));
  const qs = search.toString();
  return qs ? `/posts/?${qs}` : '/posts/';
}

function PostCard({post}: {post: BlogPostSummary}) {
  return (
    <Link href={`/posts/${post.slug}/`} className="blog-card">
      <div className="blog-card__meta">
        <span className="blog-card__date">{post.publishedAt}</span>
      </div>
      <h2 className="blog-card__title">{post.title}</h2>
      <p className="blog-card__excerpt">{post.excerpt}</p>
    </Link>
  );
}

function MdPostsHomeContent({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category')?.trim() || '';
  const queryParam = searchParams.get('q')?.trim() || '';
  const pageParam = Number(searchParams.get('page') || '1');
  const requestedPage =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  const filtered = useMemo(() => {
    let result = posts;

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (queryParam) {
      const q = queryParam.toLowerCase();
      result = result.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inExcerpt = p.excerpt.toLowerCase().includes(q);
        const inTags = p.tags.some((tag) => tag.toLowerCase().includes(q));
        const inCategory = p.categoryLabel.toLowerCase().includes(q);
        return inTitle || inExcerpt || inTags || inCategory;
      });
    }

    return result;
  }, [posts, categoryFilter, queryParam]);

  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, lastPage);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <main className="blog-main">
      <div className="site-shell">
        <div className="site-shell__inner blog-home">
          <div className="blog-search-area">
            <BlogSearchBar className="blog-search--home" listBasePath="/posts/" />
            <nav className="blog-category-filter" aria-label="포스트 카테고리">
              <Link
                href={buildPostsListHref({page: 1, q: queryParam || undefined})}
                className={[
                  'blog-category-filter__item',
                  !categoryFilter && 'blog-category-filter__item--active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={!categoryFilter ? 'true' : undefined}
              >
                전체
                <span className="blog-category-filter__count"> ({posts.length})</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildPostsListHref({
                    page: 1,
                    category: cat.id,
                    q: queryParam || undefined,
                  })}
                  className={[
                    'blog-category-filter__item',
                    categoryFilter === cat.id && 'blog-category-filter__item--active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={categoryFilter === cat.id ? 'true' : undefined}
                >
                  {cat.label}
                  <span className="blog-category-filter__count"> ({cat.count})</span>
                </Link>
              ))}
            </nav>
            {queryParam && filtered.length > 0 && (
              <p className="blog-search__summary">
                <strong>&quot;{queryParam}&quot;</strong> 검색 결과 <strong>{filtered.length}</strong>건
              </p>
            )}
          </div>

          <section className="blog-list" aria-label="Markdown posts">
            {pageItems.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
            {pageItems.length === 0 && (
              <p className="muted empty-state">
                {queryParam ? `'${queryParam}'에 대한 검색 결과가 없습니다.` : '표시할 포스트가 없습니다.'}
              </p>
            )}
          </section>

          {lastPage > 1 && (
            <div className="blog-list-footer">
              <BlogPagination
                currentPage={currentPage}
                lastPage={lastPage}
                buildHref={(page) =>
                  buildPostsListHref({
                    page,
                    category: categoryFilter || undefined,
                    q: queryParam || undefined,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function MdPostsHomePage({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: Category[];
}) {
  return (
    <Suspense fallback={<main className="blog-main" aria-busy="true" />}>
      <MdPostsHomeContent posts={posts} categories={categories} />
    </Suspense>
  );
}
