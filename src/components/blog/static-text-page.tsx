import StaticPostContent from '@/components/blog/static-post-content';

/** Simple server-rendered text page (About, Privacy) using the post article styles. */
export default function StaticTextPage({title, updated, markdown}: {title: string; updated?: string; markdown: string}) {
  return (
    <main className="blog-main">
      <div className="site-shell">
        <article className="blog-post site-shell__inner">
          {updated && (
            <div className="blog-post__meta">
              <span>{updated}</span>
            </div>
          )}
          <h1 className="blog-post__title">{title}</h1>
          <StaticPostContent content={markdown} />
        </article>
      </div>
    </main>
  );
}
