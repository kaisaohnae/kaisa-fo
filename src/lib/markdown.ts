import {Marked, type Tokens} from 'marked';
import hljs from 'highlight.js';

/**
 * Build-time Markdown → HTML for posts, so the article body is part of the static HTML
 * (previously the ByteMD viewer rendered it client-side only with ssr: false,
 * leaving crawlers and the AdSense review with an empty article).
 * Output matches the ByteMD viewer: GFM + highlight.js classes inside .markdown-body.
 */
const marked = new Marked({
  gfm: true,
  renderer: {
    code({text, lang}: Tokens.Code) {
      const language = (lang || '').trim().split(/\s+/)[0];
      const highlighted =
        language && hljs.getLanguage(language)
          ? hljs.highlight(text, {language, ignoreIllegals: true}).value
          : hljs.highlightAuto(text).value;
      const cls = language ? ` class="hljs language-${language}"` : ' class="hljs"';
      return `<pre><code${cls}>${highlighted}</code></pre>\n`;
    },
  },
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, {async: false}) as string;
}
