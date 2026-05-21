/**
 * Football Proxy Client
 * Calls the API-Football proxy. API key is mapped server-side — never exposed.
 *   Primary  : https://api.labenditaec.com/api/football
 *   Alternate: https://api.pase-y-gol.com/api/football
 */

import { getCache, setCache } from './memory-cache';
import type { LiveMatch } from '@/types';

const PRIMARY   = 'https://api.labenditaec.com/api/football';
const ALTERNATE = 'https://api.pase-y-gol.com/api/football';

export const LEAGUE_IDS = {
  PREMIER_LEAGUE:   39,
  LA_LIGA:          140,
  CHAMPIONS_LEAGUE: 2,
  WORLD_CUP:        1,
  SAFF:             1032,
  ISL:              323,
  I_LEAGUE:         322,
  BANGLADESH_PL:    622,
} as const;

export const CURRENT_SEASON = 2025;

async function proxyGet<T>(path: string, useAlternate = false): Promise<T | null> {
  const base = useAlternate ? ALTERNATE : PRIMARY;
  try {
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      if (!useAlternate) return proxyGet<T>(path, true);
      return null;
    }
    return (await res.json()) as T;
  } catch {
    if (!useAlternate) return proxyGet<T>(path, true);
    return null;
  }
}

export interface ProxyFixture {
  fixture: {
    id:     number;
    date:   string;
    status: { short: string; elapsed: number | null };
    venue?: { name: string; city: string };
  };
  league: { id: number; name: string; logo: string; round: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

export interface ProxyStanding {
  rank:      number;
  team:      { id: number; name: string; logo: string };
  points:    number;
  goalsDiff: number;
  all:       { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  form:      string;
}

export interface ProxyTopScorer {
  player: { id: number; name: string; photo: string; nationality: string };
  statistics: Array<{
    team:  { id: number; name: string; logo: string };
    goals: { total: number; assists: number };
  }>;
}

export async function getLiveFixtures(): Promise<ProxyFixture[]> {
  const key = 'proxy:fixtures:live';
  const cached = getCache<ProxyFixture[]>(key);
  if (cached) return cached;
  const data = await proxyGet<{ response: ProxyFixture[] }>('/live');
  const list = data?.response ?? [];
  setCache(key, list, 30);
  return list;
}

export async function getUpcomingFixtures(leagueId: number, season = CURRENT_SEASON, next = 10): Promise<ProxyFixture[]> {
  const key = `proxy:fixtures:upcoming:${leagueId}:${season}`;
  const cached = getCache<ProxyFixture[]>(key);
  if (cached) return cached;
  const data = await proxyGet<{ response: ProxyFixture[] }>(`/fixtures?league=${leagueId}&season=${season}&next=${next}`);
  const list = data?.response ?? [];
  setCache(key, list, 300);
  return list;
}

export async function getStandings(leagueId: number, season = CURRENT_SEASON): Promise<ProxyStanding[]> {
  const key = `proxy:standings:${leagueId}:${season}`;
  const cached = getCache<ProxyStanding[]>(key);
  if (cached) return cached;
  const data = await proxyGet<{ response: Array<{ league: { standings: ProxyStanding[][] } }> }>(
    `/standings?league=${leagueId}&season=${season}`
  );
  const list = data?.response?.[0]?.league?.standings?.[0] ?? [];
  setCache(key, list, 600);
  return list;
}

export async function getTopScorers(leagueId: number, season = CURRENT_SEASON): Promise<ProxyTopScorer[]> {
  const key = `proxy:topscorers:${leagueId}:${season}`;
  const cached = getCache<ProxyTopScorer[]>(key);
  if (cached) return cached;
  const data = await proxyGet<{ response: ProxyTopScorer[] }>(`/topscorers?league=${leagueId}&season=${season}`);
  const list = data?.response ?? [];
  setCache(key, list, 600);
  return list;
}

export function mapFixtureToLiveMatch(f: ProxyFixture): LiveMatch {
  const statusMap: Record<string, LiveMatch['status']> = {
    '1H': 'LIVE', '2H': 'LIVE', HT: 'LIVE', ET: 'LIVE', BT: 'LIVE', P: 'LIVE', LIVE: 'LIVE',
    FT: 'FT', AET: 'FT', PEN: 'FT',
    NS: 'SCHEDULED', TBD: 'SCHEDULED', PST: 'POSTPONED', CANC: 'POSTPONED',
  };
  return {
    id:          String(f.fixture.id),
    homeTeam:    f.teams.home.name,
    awayTeam:    f.teams.away.name,
    homeScore:   f.goals.home ?? undefined,
    awayScore:   f.goals.away ?? undefined,
    minute:      f.fixture.status.elapsed ?? undefined,
    status:      statusMap[f.fixture.status.short] ?? 'SCHEDULED',
    competition: f.league.name,
    utcDate:     f.fixture.date,
    homeCrest:   f.teams.home.logo,
    awayCrest:   f.teams.away.logo,
  };
}
