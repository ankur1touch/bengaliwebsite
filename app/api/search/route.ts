import { NextRequest, NextResponse } from 'next/server';
import { fetchGlobalSearch } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { q = '' } = await req.json().catch(() => ({ q: '' }));
  const results = await fetchGlobalSearch(String(q));
  return NextResponse.json(results, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } });
}
