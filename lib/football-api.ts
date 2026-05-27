/**
 * Unified football data orchestration — SERVER ONLY.
 * CMS proxy first → football-data.org fallback → static fallbacks.
 */

import { cmsFetch, extractResponse } from './api-football-cms';
import { FOOTBALL_ENDPOINTS, DEFAULT_SEASON, LEAGUE_IDS, MAJOR_LEAGUE_IDS } from './football-endpoints';
import { getCache, setCache } from './memory-cache';
import { getCountryLeague, getDefaultLeague } from './country-leagues';
import {
  getLiveFixtures,
  getUpcomingFixtures,
  getStandings,
  getTopScorers,
  mapFixtureToLiveMatch,
  type ProxyFixture,
} from './football-proxy';
import type {
  LiveMatch,
  MatchDetailPayload,
  FixtureDetail,
  MatchEvent,
  TeamLineup,
  LineupPlayer,
  MatchStatRow,
  PlayerDetailPayload,
  TeamDetailPayload,
  RankingsPayload,
  StandingRow,
  TopScorer,
  FifaRanking,
  SearchResult,
} from '@/types';
import staticFifaRankings from '@/data/fifa-rankings.json';

export type MatchTab = 'live' | 'upcoming' | 'results' | 'all';

const STATUS_MAP: Record<string, LiveMatch['status']> = {
  '1H': 'LIVE', '2H': 'LIVE', HT: 'LIVE', ET: 'LIVE', BT: 'LIVE', P: 'LIVE', LIVE: 'LIVE',
  FT: 'FT', AET: 'FT', PEN: 'FT',
  NS: 'SCHEDULED', TBD: 'SCHEDULED', PST: 'POSTPONED', CANC: 'POSTPONED',
};

function mapProxyFixture(f: ProxyFixture): LiveMatch {
  const base = mapFixtureToLiveMatch(f);
  return {
    ...base,
    homeTeamId: f.teams.home.id,
    awayTeamId: f.teams.away.id,
    leagueId:   f.league.id,
    venue:      f.fixture.venue?.name,
    round:      f.league.round,
  };
}

// ── Match list ─────────────────────────────────────────────────

export async function fetchMatches(opts: {
  tab?: MatchTab;
  countryId?: string;
} = {}): Promise<LiveMatch[]> {
  const tab = opts.tab ?? 'all';
  const league = opts.countryId
    ? (getCountryLeague(opts.countryId) ?? getDefaultLeague())
    : getDefaultLeague();

  const cacheKey = `matches:${tab}:${opts.countryId ?? 'default'}`;
  const cached = getCache<LiveMatch[]>(cacheKey);
  if (cached) return cached;

  let matches: LiveMatch[] = [];

  if (tab === 'live' || tab === 'all') {
    const live = await getLiveFixtures();
    matches.push(...live.map(mapProxyFixture));
  }

  if (tab === 'upcoming' || tab === 'all') {
    const leagues = opts.countryId
      ? [league.leagueId]
      : [LEAGUE_IDS.PREMIER_LEAGUE, LEAGUE_IDS.LA_LIGA, LEAGUE_IDS.CHAMPIONS_LEAGUE, LEAGUE_IDS.SAFF, LEAGUE_IDS.ISL];
    const upcoming = await Promise.all(
      leagues.map((id) => getUpcomingFixtures(id, league.season, 8))
    );
    matches.push(...upcoming.flat().map(mapProxyFixture));
  }

  if (tab === 'results' || tab === 'all') {
    const data = await cmsFetch<{ response: ProxyFixture[] }>(
      FOOTBALL_ENDPOINTS.fixtures,
      { league: league.leagueId, season: league.season, last: 10 },
      { revalidate: 300 },
    );
    matches.push(...extractResponse<ProxyFixture>(data).map(mapProxyFixture));
  }

  // Deduplicate by id
  const seen = new Set<string>();
  matches = matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Major leagues first — better detail coverage (events, lineups, stats)
  matches.sort((a, b) => {
    const aMajor = a.leagueId && MAJOR_LEAGUE_IDS.has(a.leagueId) ? 0 : 1;
    const bMajor = b.leagueId && MAJOR_LEAGUE_IDS.has(b.leagueId) ? 0 : 1;
    if (aMajor !== bMajor) return aMajor - bMajor;
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;
    return 0;
  });

  if (tab === 'live')     matches = matches.filter((m) => m.status === 'LIVE');
  if (tab === 'upcoming') matches = matches.filter((m) => m.status === 'SCHEDULED');
  if (tab === 'results')  matches = matches.filter((m) => m.status === 'FT');

  if (!matches.length) matches = FALLBACK_MATCHES;
  setCache(cacheKey, matches, 60);
  return matches;
}

const FALLBACK_MATCHES: LiveMatch[] = [
  { id: 'fb1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 2, awayScore: 1, minute: 67, status: 'LIVE', competition: 'Premier League', utcDate: new Date().toISOString() },
  { id: 'fb2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 1, awayScore: 1, minute: 45, status: 'LIVE', competition: 'La Liga', utcDate: new Date().toISOString() },
  { id: 'fb3', homeTeam: 'Liverpool', awayTeam: 'Manchester City', status: 'SCHEDULED', competition: 'Premier League', utcDate: new Date(Date.now() + 86400000).toISOString() },
];

// ── Rankings ───────────────────────────────────────────────────

export async function fetchRankings(opts: { countryId?: string; leagueId?: number } = {}): Promise<RankingsPayload> {
  const league = opts.leagueId
    ? { leagueId: opts.leagueId, season: DEFAULT_SEASON }
    : opts.countryId
      ? (getCountryLeague(opts.countryId) ?? getDefaultLeague())
      : getDefaultLeague();

  const cacheKey = `rankings:${league.leagueId}:${league.season}`;
  const cached = getCache<RankingsPayload>(cacheKey);
  if (cached) return cached;

  const [proxyStandings, proxyScorers] = await Promise.all([
    getStandings(league.leagueId, league.season),
    getTopScorers(league.leagueId, league.season),
  ]);

  const standings: StandingRow[] = proxyStandings.length
    ? proxyStandings.map((s) => ({
        position: s.rank, teamId: s.team.id, teamName: s.team.name, crestUrl: s.team.logo,
        playedGames: s.all.played, won: s.all.win, draw: s.all.draw, lost: s.all.lose,
        goalDifference: s.goalsDiff, points: s.points,
      }))
    : FALLBACK_STANDINGS;

  const topScorers: TopScorer[] = proxyScorers.length
    ? proxyScorers.slice(0, 20).map((p) => {
        const stat = p.statistics[0];
        return {
          playerId: p.player.id, teamId: stat?.team?.id,
          playerName: p.player.name, teamName: stat?.team?.name ?? '',
          goals: stat?.goals?.total ?? 0, assists: stat?.goals?.assists,
          crestUrl: stat?.team?.logo, photo: p.player.photo,
        };
      })
    : FALLBACK_SCORERS;

  const payload = { standings, topScorers };
  setCache(cacheKey, payload, 600);
  return payload;
}

const FALLBACK_STANDINGS: StandingRow[] = [
  { position: 1, teamName: 'Barcelona', playedGames: 37, won: 28, draw: 4, lost: 5, goalDifference: 60, points: 88 },
  { position: 2, teamName: 'Real Madrid', playedGames: 37, won: 26, draw: 6, lost: 5, goalDifference: 40, points: 84 },
  { position: 3, teamName: 'Atletico Madrid', playedGames: 37, won: 22, draw: 8, lost: 7, goalDifference: 30, points: 74 },
];

const FALLBACK_SCORERS: TopScorer[] = [
  { playerName: 'Kylian Mbappé', teamName: 'Real Madrid', goals: 24 },
  { playerName: 'Robert Lewandowski', teamName: 'Barcelona', goals: 22 },
  { playerName: 'Raphinha', teamName: 'Barcelona', goals: 18 },
];

// ── Match detail ───────────────────────────────────────────────

interface RawEvent {
  time: { elapsed: number; extra?: number | null };
  team: { id: number; name: string };
  player: { name: string };
  assist: { name: string | null };
  type: string;
  detail: string;
}

interface RawLineup {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
}

interface RawStat {
  team: { id: number };
  statistics: Array<{ type: string; value: number | string | null }>;
}

interface FixtureWithDetail extends ProxyFixture {
  events?: RawEvent[];
  lineups?: RawLineup[];
  statistics?: RawStat[];
}

function parseEvents(raw: RawEvent[], homeId: number): MatchEvent[] {
  return raw.map((e) => ({
    time: e.time.elapsed + (e.time.extra ?? 0),
    team: e.team.id === homeId ? 'home' as const : 'away' as const,
    type: e.type,
    detail: e.detail,
    player: e.player?.name,
    assist: e.assist?.name ?? undefined,
  }));
}

function parseLineups(raw: RawLineup[]): TeamLineup[] {
  return raw.map((l) => ({
    teamId: l.team.id,
    teamName: l.team.name,
    logo: l.team.logo,
    formation: l.formation,
    startXI: l.startXI.map((p): LineupPlayer => ({
      id: p.player.id, name: p.player.name, number: p.player.number, pos: p.player.pos,
    })),
    subs: (l.substitutes ?? []).map((p): LineupPlayer => ({
      id: p.player.id, name: p.player.name, number: p.player.number, pos: p.player.pos,
    })),
  }));
}

function parseStatistics(raw: RawStat[], homeId: number, awayId: number): MatchStatRow[] {
  if (raw.length < 2) return [];
  const homeStats = raw.find((s) => s.team.id === homeId)?.statistics ?? [];
  const awayStats = raw.find((s) => s.team.id === awayId)?.statistics ?? [];
  return homeStats.map((hs, i) => ({
    type: hs.type,
    home: hs.value,
    away: awayStats[i]?.value ?? null,
  }));
}

function toFixtureDetail(f: ProxyFixture): FixtureDetail {
  return {
    id: String(f.fixture.id),
    homeTeam: f.teams.home.name, awayTeam: f.teams.away.name,
    homeTeamId: f.teams.home.id, awayTeamId: f.teams.away.id,
    homeScore: f.goals.home ?? undefined, awayScore: f.goals.away ?? undefined,
    minute: f.fixture.status.elapsed ?? undefined,
    status: STATUS_MAP[f.fixture.status.short] ?? 'SCHEDULED',
    competition: f.league.name, leagueId: f.league.id,
    utcDate: f.fixture.date,
    homeCrest: f.teams.home.logo, awayCrest: f.teams.away.logo,
    venue: f.fixture.venue?.name, round: f.league.round,
  };
}

export async function fetchMatchDetailPayload(fixtureId: string): Promise<MatchDetailPayload | null> {
  const cacheKey = `match-detail:${fixtureId}`;
  // Shorter cache for live fixtures so events/stats refresh
  const cacheTtl = 30;

  const fixtureData = await cmsFetch<{ response: FixtureWithDetail[] }>(
    FOOTBALL_ENDPOINTS.fixtures,
    { id: fixtureId },
    { revalidate: 30 },
  );
  const fixtures = extractResponse<FixtureWithDetail>(fixtureData);
  if (!fixtures.length) return null;

  const f = fixtures[0];
  const fixture = toFixtureDetail(f);
  const isLive = fixture.status === 'LIVE';
  const cached = getCache<MatchDetailPayload>(cacheKey);
  if (cached && !isLive) return cached;

  const homeId = f.teams.home.id;
  const awayId = f.teams.away.id;

  // Prefer embedded fixture data (CMS stores events/lineups/stats on the fixture doc)
  let events   = parseEvents(f.events ?? [], homeId);
  let lineups  = parseLineups(f.lineups ?? []);
  let statistics = parseStatistics(f.statistics ?? [], homeId, awayId);

  // Fallback to dedicated endpoints when embedded arrays are empty
  const needsEvents  = events.length === 0;
  const needsLineups = lineups.length === 0;
  const needsStats   = statistics.length === 0;

  const [eventsData, lineupsData, statsData, h2hData] = await Promise.all([
    needsEvents
      ? cmsFetch<{ response: RawEvent[] }>(FOOTBALL_ENDPOINTS.events, { fixture: fixtureId }, { revalidate: 30 })
      : null,
    needsLineups
      ? cmsFetch<{ response: RawLineup[] }>(FOOTBALL_ENDPOINTS.lineups, { fixture: fixtureId }, { revalidate: 30 })
      : null,
    needsStats
      ? cmsFetch<{ response: RawStat[] }>(FOOTBALL_ENDPOINTS.stats, { fixture: fixtureId }, { revalidate: 30 })
      : null,
    cmsFetch<{ response: ProxyFixture[] }>(
      FOOTBALL_ENDPOINTS.headToHead,
      { h2h: `${homeId}-${awayId}`, last: 5 },
      { revalidate: 300 },
    ),
  ]);

  if (needsEvents && eventsData) {
    events = parseEvents(extractResponse<RawEvent>(eventsData), homeId);
  }
  if (needsLineups && lineupsData) {
    lineups = parseLineups(extractResponse<RawLineup>(lineupsData));
  }
  if (needsStats && statsData) {
    statistics = parseStatistics(extractResponse<RawStat>(statsData), homeId, awayId);
  }

  const h2h = extractResponse<ProxyFixture>(h2hData)
    .filter((m) => String(m.fixture.id) !== fixtureId)
    .map(mapProxyFixture);

  const payload: MatchDetailPayload = { fixture, events, lineups, statistics, h2h };
  setCache(cacheKey, payload, isLive ? cacheTtl : 60);
  return payload;
}

// ── Player detail ──────────────────────────────────────────────

interface RawPlayer {
  player: {
    id: number; name: string; photo: string; age: number;
    nationality: string; height: string; weight: string;
  };
  statistics: Array<{
    team: { id: number; name: string; logo: string };
    league: { name: string };
    games: { appearences: number; minutes: number };
    goals: { total: number; assists: number };
  }>;
}

export async function fetchPlayerDetailPayload(playerId: string): Promise<PlayerDetailPayload | null> {
  const cacheKey = `player-detail:${playerId}`;
  const cached = getCache<PlayerDetailPayload>(cacheKey);
  if (cached) return cached;

  const [playerData, fixturesData] = await Promise.all([
    cmsFetch<{ response: RawPlayer[] }>(
      FOOTBALL_ENDPOINTS.players,
      { id: playerId, season: DEFAULT_SEASON },
      { revalidate: 300 },
    ),
    cmsFetch<{ response: ProxyFixture[] }>(
      FOOTBALL_ENDPOINTS.fixtures,
      { player: playerId, season: DEFAULT_SEASON, last: 5 },
      { revalidate: 300 },
    ),
  ]);

  const players = extractResponse<RawPlayer>(playerData);
  if (!players.length) return null;
  const p = players[0];

  const payload: PlayerDetailPayload = {
    player: {
      id: p.player.id, name: p.player.name, photo: p.player.photo,
      age: p.player.age, nationality: p.player.nationality,
      height: p.player.height, weight: p.player.weight,
    },
    statistics: p.statistics.map((s) => ({
      teamId: s.team.id, teamName: s.team.name, teamLogo: s.team.logo,
      league: s.league.name,
      appearances: s.games.appearences ?? 0,
      goals: s.goals.total ?? 0, assists: s.goals.assists ?? 0,
      minutes: s.games.minutes ?? 0,
    })),
    fixtures: extractResponse<ProxyFixture>(fixturesData).map(mapProxyFixture),
  };

  setCache(cacheKey, payload, 300);
  return payload;
}

// ── Team detail ────────────────────────────────────────────────

interface RawTeam {
  team: { id: number; name: string; logo: string; country: string; founded: number; venue?: { name: string } };
}

interface RawSquadPlayer {
  id: number; name: string; age: number; number: number; position: string; photo: string;
}

export async function fetchTeamDetailPayload(teamId: string): Promise<TeamDetailPayload | null> {
  const cacheKey = `team-detail:${teamId}`;
  const cached = getCache<TeamDetailPayload>(cacheKey);
  if (cached) return cached;

  const [teamData, squadData, fixturesData, resultsData, standingsData] = await Promise.all([
    cmsFetch<{ response: RawTeam[] }>(FOOTBALL_ENDPOINTS.teams, { id: teamId }, { revalidate: 600 }),
    cmsFetch<{ response: Array<{ team: RawTeam['team']; players: RawSquadPlayer[] }> }>(
      FOOTBALL_ENDPOINTS.playersSquads, { team: teamId }, { revalidate: 600 },
    ),
    cmsFetch<{ response: ProxyFixture[] }>(
      FOOTBALL_ENDPOINTS.fixtures, { team: teamId, season: DEFAULT_SEASON, next: 5 }, { revalidate: 300 },
    ),
    cmsFetch<{ response: ProxyFixture[] }>(
      FOOTBALL_ENDPOINTS.fixtures, { team: teamId, season: DEFAULT_SEASON, last: 5 }, { revalidate: 300 },
    ),
    getStandings(LEAGUE_IDS.LA_LIGA, DEFAULT_SEASON),
  ]);

  const teams = extractResponse<RawTeam>(teamData);
  if (!teams.length) return null;
  const t = teams[0].team;

  const squads = extractResponse<{ team: RawTeam['team']; players: RawSquadPlayer[] }>(squadData);
  const squad: TeamDetailPayload['squad'] = squads[0]?.players?.map((p) => ({
    id: p.id, name: p.name, age: p.age, number: p.number, position: p.position, photo: p.photo,
  })) ?? [];

  const teamStanding = standingsData.find((s) => s.team.id === t.id);

  const payload: TeamDetailPayload = {
    team: { id: t.id, name: t.name, logo: t.logo, country: t.country, founded: t.founded, venue: t.venue?.name },
    squad,
    fixtures: extractResponse<ProxyFixture>(fixturesData).map(mapProxyFixture),
    results:  extractResponse<ProxyFixture>(resultsData).map(mapProxyFixture),
    standing: teamStanding ? {
      position: teamStanding.rank, teamId: teamStanding.team.id,
      teamName: teamStanding.team.name, crestUrl: teamStanding.team.logo,
      playedGames: teamStanding.all.played, won: teamStanding.all.win,
      draw: teamStanding.all.draw, lost: teamStanding.all.lose,
      goalDifference: teamStanding.goalsDiff, points: teamStanding.points,
    } : undefined,
  };

  setCache(cacheKey, payload, 300);
  return payload;
}

// ── FIFA country rankings ──────────────────────────────────────

interface RawFifaRanking {
  rank: number;
  team: { name: string; logo?: string };
  points: number;
  previousRank?: number;
}

export async function fetchFifaRankings(): Promise<FifaRanking[]> {
  const cacheKey = 'fifa-rankings';
  const cached = getCache<FifaRanking[]>(cacheKey);
  if (cached) return cached;

  const FLAG_MAP: Record<string, string> = {
    Argentina: '🇦🇷', France: '🇫🇷', Brazil: '🇧🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    Belgium: '🇧🇪', Portugal: '🇵🇹', Spain: '🇪🇸', Netherlands: '🇳🇱',
    Italy: '🇮🇹', USA: '🇺🇸', Germany: '🇩🇪', Croatia: '🇭🇷', Morocco: '🇲🇦',
  };

  let rankings: FifaRanking[] = [];

  const data = await cmsFetch<{ response: RawFifaRanking[] }>(
    '/rankings',
    { league: LEAGUE_IDS.WORLD_CUP, season: DEFAULT_SEASON },
    { revalidate: 86400 },
  );
  const raw = extractResponse<RawFifaRanking>(data);

  if (raw.length >= 5) {
    rankings = raw.slice(0, 10).map((r, i) => ({
      rank: r.rank ?? i + 1,
      country: r.team.name,
      flag: FLAG_MAP[r.team.name] ?? '⚽',
      points: r.points,
      change: r.previousRank ? r.previousRank - (r.rank ?? i + 1) : 0,
    }));
  }

  if (!rankings.length) {
    rankings = staticFifaRankings as FifaRanking[];
  }

  setCache(cacheKey, rankings, 86400);
  return rankings;
}

// ── Global search ──────────────────────────────────────────────

export async function fetchGlobalSearch(query: string): Promise<SearchResult> {
  const q = query.trim().toLowerCase();
  if (!q) return { news: [], matches: [], players: [], teams: [] };

  const { getAggregatedNews } = await import('./rss');
  const { getAllArticlesAsync } = await import('./articles');

  const [matches, rankingsPayload, rssNews, mdxArticles] = await Promise.all([
    fetchMatches({ tab: 'all' }),
    fetchRankings({}),
    getAggregatedNews().catch(() => []),
    getAllArticlesAsync(),
  ]);

  const mdxNews = mdxArticles.map((a) => ({
    id: a.slug,
    title: a.title,
    slug: a.slug,
    url: `/news/${a.slug}`,
    source: 'Football Barta',
    tag: a.tag,
    excerpt: a.excerpt,
  }));

  const allNews = [
    ...rssNews.map((n) => ({ id: n.id, title: n.title, slug: n.slug, url: n.url, source: n.source, tag: n.tag, excerpt: n.excerpt })),
    ...mdxNews,
  ];

  const news = allNews
    .filter((n) =>
      n.title.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q) ||
      n.tag?.toLowerCase().includes(q) ||
      n.excerpt?.toLowerCase().includes(q),
    )
    .slice(0, 12);

  const matchResults = matches
    .filter((m) =>
      m.homeTeam.toLowerCase().includes(q) ||
      m.awayTeam.toLowerCase().includes(q) ||
      m.competition.toLowerCase().includes(q),
    )
    .slice(0, 8)
    .map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      competition: m.competition,
      status: m.status,
    }));

  const players = rankingsPayload.topScorers
    .filter((p) =>
      p.playerName.toLowerCase().includes(q) ||
      p.teamName.toLowerCase().includes(q),
    )
    .slice(0, 8)
    .map((p) => ({
      id: p.playerId ?? 0,
      name: p.playerName,
      team: p.teamName,
      goals: p.goals,
    }))
    .filter((p) => p.id);

  const teams = rankingsPayload.standings
    .filter((s) => s.teamName.toLowerCase().includes(q))
    .slice(0, 8)
    .map((s) => ({
      id: s.teamId ?? 0,
      name: s.teamName,
    }))
    .filter((t) => t.id);

  return { news, matches: matchResults, players, teams };
}
