import type {MetadataRoute} from 'next';
import {absoluteUrl} from '@/config/site';
import {getAllBlogPostSummaries} from '@/data/blog-posts';
import {TOOLS} from '@/data/tools';

export const dynamic = 'force-static';

// Account pages (login/register/…) are noindex and intentionally left out.
const PUBLIC_PAGES = ['/', '/works/', '/about/', '/privacy/'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = PUBLIC_PAGES.map(path => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' || path === '/posts/' ? 'daily' : 'monthly',
    priority:
      path === '/' || path === '/posts/'
        ? 1
        : path === '/works/'
          ? 0.7
          : 0.4,
  }));

  const posts: MetadataRoute.Sitemap = getAllBlogPostSummaries().map(post => ({
    url: absoluteUrl(`/posts/${post.slug}/`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Tool pages migrated from kaisa-tool (category hubs only redirect, so they are excluded)
  const tools: MetadataRoute.Sitemap = TOOLS.map(tool => ({
    url: absoluteUrl(tool.href),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...posts, ...tools];
}
