import { NextRequest, NextResponse } from 'next/server';
import { fetchMatchDetailPayload } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' };

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await fetchMatchDetailPayload(id);
  if (!payload) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(payload, { headers: HEADERS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await fetchMatchDetailPayload(id);
  if (!payload) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(payload, { headers: HEADERS });
}
