/**
 * Football Proxy Client — uses CMS proxy via api-football-cms.
 * SERVER ONLY.
 */

import { cmsFetch, extractResponse } from './api-football-cms';
import { FOOTBALL_ENDPOINTS, LEAGUE_IDS, DEFAULT_SEASON } from './football-endpoints';
import { getCache, setCache } from './memory-cache';
import type { LiveMatch } from '@/types';

export { LEAGUE_IDS, DEFAULT_SEASON as CURRENT_SEASON };

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
  const data = await cmsFetch(FOOTBALL_ENDPOINTS.live, {}, { revalidate: 30 });
  const list = extractResponse<ProxyFixture>(data);
  setCache(key, list, 30);
  return list;
}

export async function getUpcomingFixtures(leagueId: number, season = DEFAULT_SEASON, next = 10): Promise<ProxyFixture[]> {
  const key = `proxy:fixtures:upcoming:${leagueId}:${season}`;
  const cached = getCache<ProxyFixture[]>(key);
  if (cached) return cached;
  const data = await cmsFetch(FOOTBALL_ENDPOINTS.fixtures, { league: leagueId, season, next }, { revalidate: 300 });
  const list = extractResponse<ProxyFixture>(data);
  setCache(key, list, 300);
  return list;
}

export async function getStandings(leagueId: number, season = DEFAULT_SEASON): Promise<ProxyStanding[]> {
  const key = `proxy:standings:${leagueId}:${season}`;
  const cached = getCache<ProxyStanding[]>(key);
  if (cached) return cached;
  const data = await cmsFetch(FOOTBALL_ENDPOINTS.standings, { league: leagueId, season }, { revalidate: 600 });
  const raw = extractResponse<{ league: { standings: ProxyStanding[][] } }>(data);
  const list = raw[0]?.league?.standings?.[0] ?? [];
  setCache(key, list, 600);
  return list;
}

export async function getTopScorers(leagueId: number, season = DEFAULT_SEASON): Promise<ProxyTopScorer[]> {
  const key = `proxy:topscorers:${leagueId}:${season}`;
  const cached = getCache<ProxyTopScorer[]>(key);
  if (cached) return cached;
  const data = await cmsFetch(FOOTBALL_ENDPOINTS.topScorers, { league: leagueId, season }, { revalidate: 600 });
  const list = extractResponse<ProxyTopScorer>(data);
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
    homeTeamId:  f.teams.home.id,
    awayTeamId:  f.teams.away.id,
    homeScore:   f.goals.home ?? undefined,
    awayScore:   f.goals.away ?? undefined,
    minute:      f.fixture.status.elapsed ?? undefined,
    status:      statusMap[f.fixture.status.short] ?? 'SCHEDULED',
    competition: f.league.name,
    leagueId:    f.league.id,
    utcDate:     f.fixture.date,
    homeCrest:   f.teams.home.logo,
    awayCrest:   f.teams.away.logo,
    venue:       f.fixture.venue?.name,
    round:       f.league.round,
  };
}
