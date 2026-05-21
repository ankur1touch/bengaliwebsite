import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedNews } from '@/lib/rss';
import countries from '@/data/countries.json';
import type { Country, NewsItem } from '@/types';

function matchesCountry(item: NewsItem, country: Country): boolean {
  const h = `${item.title} ${item.excerpt ?? ''} ${item.tag ?? ''}`.toLowerCase();
  return country.keywords.some((k) => h.includes(k.toLowerCase()));
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const country = (countries as Country[]).find((c) => c.id === id);
  if (!country) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const filtered = (await getAggregatedNews()).filter((i) => matchesCountry(i, country));
  return NextResponse.json(filtered, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}
