import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/mdx';
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://footballbarta.vercel.app';
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((a) => ({
    url: `${BASE}/news/${a.slug}`, lastModified: new Date(a.publishedAt),
  }));
  const statics = ['', '/news', '/matches', '/standings', '/players', '/teams', '/transfers', '/search', '/world-cup',
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));
  return [...statics, ...articles];
}
