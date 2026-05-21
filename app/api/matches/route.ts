import { NextRequest, NextResponse } from 'next/server';
import {
  getLiveFixtures,
  getUpcomingFixtures,
  mapFixtureToLiveMatch,
  LEAGUE_IDS,
  CURRENT_SEASON,
} from '@/lib/football-proxy';
import type { LiveMatch } from '@/types';

const HEADERS = { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' };

const now = () => new Date().toISOString();
const offset = (h: number) => new Date(Date.now() + h * 3600 * 1000).toISOString();

const FALLBACK: LiveMatch[] = [
  {
    id: 'fb1', homeTeam: 'Arsenal', awayTeam: 'Chelsea',
    homeScore: 2, awayScore: 1, minute: 67, status: 'LIVE',
    competition: 'Premier League', utcDate: now(),
  },
  {
    id: 'fb2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona',
    homeScore: 1, awayScore: 1, minute: 45, status: 'LIVE',
    competition: 'La Liga', utcDate: now(),
  },
  {
    id: 'fb3', homeTeam: 'Liverpool', awayTeam: 'Manchester City',
    status: 'SCHEDULED', competition: 'Premier League', utcDate: offset(3),
  },
  {
    id: 'fb4', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund',
    status: 'SCHEDULED', competition: 'Bundesliga', utcDate: offset(6),
  },
  {
    id: 'fb5', homeTeam: 'Bangladesh', awayTeam: 'India',
    status: 'SCHEDULED', competition: 'SAFF Championship', utcDate: offset(24),
  },
  {
    id: 'fb6', homeTeam: 'Mohun Bagan', awayTeam: 'East Bengal',
    status: 'SCHEDULED', competition: 'Indian Super League', utcDate: offset(48),
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      type?: 'live' | 'upcoming' | 'all';
    };
    const type = body.type ?? 'all';

    // Try proxy first
    const [live, pl, liga, ucl, saff, isl] = await Promise.all([
      type === 'upcoming' ? Promise.resolve([]) : getLiveFixtures(),
      getUpcomingFixtures(LEAGUE_IDS.PREMIER_LEAGUE,   CURRENT_SEASON, 5),
      getUpcomingFixtures(LEAGUE_IDS.LA_LIGA,          CURRENT_SEASON, 5),
      getUpcomingFixtures(LEAGUE_IDS.CHAMPIONS_LEAGUE, CURRENT_SEASON, 4),
      getUpcomingFixtures(LEAGUE_IDS.SAFF,             CURRENT_SEASON, 3),
      getUpcomingFixtures(LEAGUE_IDS.ISL,              CURRENT_SEASON, 3),
    ]);

    const fixtures = [
      ...(type === 'upcoming' ? [] : live),
      ...saff, ...isl, ...pl, ...liga, ...ucl,
    ];

    const matches: LiveMatch[] = fixtures.length
      ? fixtures.map(mapFixtureToLiveMatch)
      : FALLBACK;

    return NextResponse.json(matches, { headers: HEADERS });
  } catch {
    return NextResponse.json(FALLBACK, { headers: HEADERS });
  }
}
