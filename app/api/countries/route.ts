import { NextResponse } from 'next/server';
import countries from '@/data/countries.json';
export async function POST() {
  return NextResponse.json(countries, { headers: { 'Cache-Control': 's-maxage=3600' } });
}
