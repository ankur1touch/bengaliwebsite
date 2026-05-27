import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedNews } from '@/lib/rss';
import { getAllArticlesAsync } from '@/lib/articles';
import { filterArticlesByLocale, mapInternalArticle } from '@/lib/news-locale';

export async function POST(req: NextRequest) {
  const { category, locale = 'bn' } = await req.json().catch(() => ({})) as {
    category?: string;
    locale?: string;
  };

  const [rssItems, allArticles] = await Promise.all([
    getAggregatedNews(),
    getAllArticlesAsync(),
  ]);

  const internalItems = filterArticlesByLocale(allArticles, locale).map((a) =>
    mapInternalArticle(a, locale),
  );

  let merged = [...internalItems, ...rssItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (category && category !== 'all') {
    merged = merged.filter((i) => i.tag === category);
  }

  return NextResponse.json(merged, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  });
}
