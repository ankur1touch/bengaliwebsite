import { NextRequest, NextResponse } from 'next/server';
import { fetchMatches } from '@/lib/football-api';

export const revalidate = 60;

const HEADERS = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      tab?: 'live' | 'upcoming' | 'results' | 'all';
      countryId?: string;
    };
    const matches = await fetchMatches({ tab: body.tab ?? 'all', countryId: body.countryId });
    return NextResponse.json(matches, { headers: HEADERS });
  } catch {
    const matches = await fetchMatches();
    return NextResponse.json(matches, { headers: HEADERS });
  }
}

export async function GET() {
  const matches = await fetchMatches();
  return NextResponse.json(matches, { headers: HEADERS });
}
