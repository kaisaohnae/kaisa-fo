import type {MetadataRoute} from 'next';
import {absoluteUrl} from '@/config/site';
import {PUBLIC_ROUTES} from '@/data/public-routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_ROUTES.map(path => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/example/') ? 0.5 : 0.8,
  }));
}
