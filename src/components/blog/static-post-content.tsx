import 'bytemd/dist/index.css';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';
import {renderMarkdown} from '@/lib/markdown';

function looksLikeHtml(content: string) {
  return /^<[a-z][\s\S]*>/i.test(content.trim());
}

/** Server-rendered post body (included in the static export). */
export default function StaticPostContent({content, className = 'blog-post__body'}: {content: string; className?: string}) {
  if (!content.trim()) return null;
  if (looksLikeHtml(content)) {
    return <div className={className} dangerouslySetInnerHTML={{__html: content}} />;
  }
  return (
    <div className={`${className} blog-post__body--markdown`}>
      <div className="markdown-body" dangerouslySetInnerHTML={{__html: renderMarkdown(content)}} />
    </div>
  );
}
