import { NextRequest, NextResponse } from 'next/server';
import { fetchRankings } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { countryId?: string; leagueId?: number };
    const payload = await fetchRankings({ countryId: body.countryId, leagueId: body.leagueId });
    return NextResponse.json(payload, { headers: HEADERS });
  } catch {
    const payload = await fetchRankings();
    return NextResponse.json(payload, { headers: HEADERS });
  }
}

export async function GET() {
  const payload = await fetchRankings();
  return NextResponse.json(payload, { headers: HEADERS });
}
