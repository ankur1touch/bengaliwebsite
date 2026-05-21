import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedNews } from '@/lib/rss';
import { getAllArticles } from '@/lib/mdx';
import type { NewsItem } from '@/types';

export async function POST(req: NextRequest) {
  const { category } = await req.json().catch(() => ({}));
  const [rssItems, articles] = await Promise.all([
    getAggregatedNews(),
    Promise.resolve(getAllArticles().map((a): NewsItem => ({
      id: a.slug, title: a.title, excerpt: a.excerpt,
      url: `/news/${a.slug}`, imageUrl: a.imageUrl, source: 'ফুটবলবার্তা',
      tag: a.tag, publishedAt: a.publishedAt, isInternal: true, slug: a.slug,
    }))),
  ]);
  let merged = [...articles, ...rssItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (category && category !== 'all') merged = merged.filter((i) => i.tag === category);
  return NextResponse.json(merged, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}
