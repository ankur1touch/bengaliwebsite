import type { MetadataRoute } from 'next';
import { getAllArticlesAsync } from '@/lib/articles';
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://footballbarta.vercel.app';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = (await getAllArticlesAsync()).map((a) => ({
    url: `${BASE}/news/${a.slug}`, lastModified: new Date(a.publishedAt),
  }));
  const statics = ['', '/news', '/matches', '/standings', '/players', '/teams', '/transfers', '/search', '/world-cup',
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));
  return [...statics, ...articles];
}
