import { getCache, setCache } from './memory-cache';
import type { LiveMatch, StandingRow, TopScorer, RankingsPayload } from '@/types';

const BASE = 'https://api.football-data.org/v4';
const TOKEN = process.env.FOOTBALL_DATA_TOKEN;

async function fdFetch<T>(path: string): Promise<T> {
  if (!TOKEN) throw new Error('No FOOTBALL_DATA_TOKEN');
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': TOKEN },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`football-data error ${res.status}`);
  return res.json() as Promise<T>;
}

// ── FALLBACK DATA (used when no API key is set) ────────────────
const FALLBACK_MATCHES: LiveMatch[] = [
  { id: 'f1', homeTeam: 'আর্সেনাল', awayTeam: 'চেলসি',     homeScore: 2, awayScore: 1, minute: 78, status: 'LIVE',      competition: 'প্রিমিয়ার লিগ', utcDate: new Date().toISOString() },
  { id: 'f2', homeTeam: 'বার্সেলোনা', awayTeam: 'রিয়াল মাদ্রিদ', homeScore: 3, awayScore: 0, status: 'FT', competition: 'লা লিগা', utcDate: new Date().toISOString() },
  { id: 'f3', homeTeam: 'বাংলাদেশ', awayTeam: 'নেপাল', homeScore: 2, awayScore: 0, status: 'FT', competition: 'সাফ চ্যাম্পিয়নশিপ', utcDate: new Date().toISOString() },
];

const FALLBACK_STANDINGS: StandingRow[] = [
  { position: 1, teamName: 'রিয়াল মাদ্রিদ', playedGames: 34, won: 25, draw: 6,  lost: 3,  goalDifference: 42, points: 81 },
  { position: 2, teamName: 'বার্সেলোনা',     playedGames: 34, won: 24, draw: 5,  lost: 5,  goalDifference: 38, points: 77 },
  { position: 3, teamName: 'অ্যাটলেটিকো',   playedGames: 34, won: 20, draw: 8,  lost: 6,  goalDifference: 22, points: 68 },
  { position: 4, teamName: 'সেভিয়া',         playedGames: 34, won: 16, draw: 8,  lost: 10, goalDifference: 10, points: 56 },
  { position: 5, teamName: 'ভিয়ারিয়াল',     playedGames: 34, won: 15, draw: 9,  lost: 10, goalDifference:  8, points: 54 },
];

const FALLBACK_SCORERS: TopScorer[] = [
  { playerName: 'হ্যালান্ড',   teamName: 'ম্যান সিটি',   goals: 27 },
  { playerName: 'সালাহ',       teamName: 'লিভারপুল',    goals: 22 },
  { playerName: 'ভিনিসিয়াস', teamName: 'রিয়াল মাদ্রিদ', goals: 20 },
];

// ── PUBLIC API ─────────────────────────────────────────────────
export async function getLiveMatches(): Promise<LiveMatch[]> {
  const CACHE_KEY = 'fd:matches';
  const cached = getCache<LiveMatch[]>(CACHE_KEY);
  if (cached) return cached;

  if (!TOKEN) return FALLBACK_MATCHES;

  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const raw = await fdFetch<{ matches: Record<string, unknown>[] }>(`/matches?dateFrom=${yesterday}&dateTo=${today}`);

    const matches: LiveMatch[] = raw.matches.map((m) => ({
      id:          String(m.id),
      homeTeam:    (m.homeTeam as { name: string }).name,
      awayTeam:    (m.awayTeam as { name: string }).name,
      homeScore:   (m.score as { fullTime: { home: number } }).fullTime?.home,
      awayScore:   (m.score as { fullTime: { away: number } }).fullTime?.away,
      status:      m.status as LiveMatch['status'],
      competition: (m.competition as { name: string }).name,
      utcDate:     m.utcDate as string,
      homeCrest:   (m.homeTeam as { crest: string }).crest,
      awayCrest:   (m.awayTeam as { crest: string }).crest,
    }));

    setCache(CACHE_KEY, matches, 60);
    return matches;
  } catch {
    return FALLBACK_MATCHES;
  }
}

export async function getRankings(): Promise<RankingsPayload> {
  const CACHE_KEY = 'fd:rankings';
  const cached = getCache<RankingsPayload>(CACHE_KEY);
  if (cached) return cached;

  if (!TOKEN) return { standings: FALLBACK_STANDINGS, topScorers: FALLBACK_SCORERS };

  try {
    const [standingsRaw, scorersRaw] = await Promise.all([
      fdFetch<{ standings: { table: Record<string, unknown>[] }[] }>('/competitions/PD/standings'),
      fdFetch<{ scorers: Record<string, unknown>[] }>('/competitions/PD/scorers'),
    ]);

    const standings: StandingRow[] = standingsRaw.standings[0].table.map((r) => ({
      position:       r.position as number,
      teamName:       (r.team as { name: string }).name,
      crestUrl:       (r.team as { crest: string }).crest,
      playedGames:    r.playedGames as number,
      won:            r.won as number,
      draw:           r.draw as number,
      lost:           r.lost as number,
      goalDifference: r.goalDifference as number,
      points:         r.points as number,
    }));

    const topScorers: TopScorer[] = scorersRaw.scorers.slice(0, 10).map((s) => ({
      playerName: (s.player as { name: string }).name,
      teamName:   (s.team as { name: string }).name,
      goals:      s.goals as number,
      crestUrl:   (s.team as { crest: string }).crest,
    }));

    const payload = { standings, topScorers };
    setCache(CACHE_KEY, payload, 600);
    return payload;
  } catch {
    return { standings: FALLBACK_STANDINGS, topScorers: FALLBACK_SCORERS };
  }
}
