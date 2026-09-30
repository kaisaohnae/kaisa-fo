import type {Metadata} from 'next';
import type {BlogPost} from '@/data/blog-posts';
import {getToolByHref} from '@/data/tools';
import {TOOL_GUIDES} from '@/data/tool-guides';
import {TOOL_SEO_TITLES} from '@/data/tool-seo';
import {absoluteUrl, SITE_DESCRIPTION, SITE_NAME} from '@/config/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  index?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  ogType = 'website',
  index = true,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const isSiteRoot = title === SITE_NAME;

  return {
    title: isSiteRoot ? {absolute: SITE_NAME} : title,
    description,
    alternates: {canonical: url},
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      title: isSiteRoot ? SITE_NAME : `${title} · ${SITE_NAME}`,
      description,
      url,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary',
      title: isSiteRoot ? SITE_NAME : `${title} · ${SITE_NAME}`,
      description,
    },
    robots: index ? {index: true, follow: true} : {index: false, follow: false},
  };
}

export const HOME_TITLE = `${SITE_NAME} — 실무 개발 포스트와 브라우저 도구`;

export function homePageMetadata(): Metadata {
  const meta = buildPageMetadata({title: SITE_NAME, description: SITE_DESCRIPTION, path: '/'});
  return {
    ...meta,
    title: {absolute: HOME_TITLE},
    openGraph: {...meta.openGraph, title: HOME_TITLE},
    twitter: {...meta.twitter, title: HOME_TITLE},
  };
}

export function postPageMetadata(post: BlogPost): Metadata {
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/posts/${post.slug}/`,
    ogType: 'article',
  });
}

export function postJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        url: absoluteUrl(`/posts/${post.slug}/`),
        author: {'@type': 'Organization', name: SITE_NAME},
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        articleSection: post.category,
        keywords: post.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl('/')},
          {'@type': 'ListItem', position: 2, name: 'Posts', item: absoluteUrl('/posts/')},
          {'@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/posts/${post.slug}/`)},
        ],
      },
    ],
  };
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
  };
}

/** Metadata for a tool page — title/description aligned with on-page H1 (English). */
export function toolPageMetadata(href: string): Metadata {
  const tool = getToolByHref(href);
  if (!tool) {
    return buildPageMetadata({title: SITE_NAME, description: SITE_DESCRIPTION, path: href});
  }
  const intro = TOOL_GUIDES[tool.id]?.intro;
  return buildPageMetadata({
    title: TOOL_SEO_TITLES[tool.id] ?? tool.title,
    description: intro ? clip(intro, 155) : tool.description,
    path: tool.href,
  });
}

/** Category hubs and legacy tool URLs only redirect: keep them out of the index, point to the target. */
export function redirectPageMetadata(target: string): Metadata {
  return {
    alternates: {canonical: absoluteUrl(target)},
    robots: {index: false, follow: true},
  };
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('다. '));
  return (lastStop > 60 ? cut.slice(0, lastStop + 1) : cut.trimEnd() + '…').trim();
}

export function toolJsonLd(href: string) {
  const tool = getToolByHref(href);
  if (!tool) return null;

  const pageUrl = absoluteUrl(tool.href);
  const toolsUrl = absoluteUrl('/image/compress/');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.title} · ${SITE_NAME}`,
        description: tool.description,
        url: pageUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
        isPartOf: {'@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/')},
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl('/')},
          {'@type': 'ListItem', position: 2, name: 'Tools', item: toolsUrl},
          {'@type': 'ListItem', position: 3, name: tool.title, item: pageUrl},
        ],
      },
    ],
  };
}
