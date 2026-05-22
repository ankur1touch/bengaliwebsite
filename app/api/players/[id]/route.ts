import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerDetailPayload } from '@/lib/football-api';

export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' };

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await fetchPlayerDetailPayload(id);
  if (!payload) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(payload, { headers: HEADERS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await fetchPlayerDetailPayload(id);
  if (!payload) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(payload, { headers: HEADERS });
}
