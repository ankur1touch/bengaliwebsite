import { NextResponse } from 'next/server';
import { fetchFifaRankings } from '@/lib/football-api';

export const revalidate = 86400;

const HEADERS = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' };

export async function GET() {
  const rankings = await fetchFifaRankings();
  return NextResponse.json(rankings, { headers: HEADERS });
}

export async function POST() {
  const rankings = await fetchFifaRankings();
  return NextResponse.json(rankings, { headers: HEADERS });
}
