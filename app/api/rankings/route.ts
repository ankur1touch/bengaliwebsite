import { NextRequest, NextResponse } from 'next/server';
import {
  getStandings,
  getTopScorers,
  LEAGUE_IDS,
  CURRENT_SEASON,
} from '@/lib/football-proxy';
import type { StandingRow, TopScorer, RankingsPayload } from '@/types';

const HEADERS = { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' };

const FALLBACK_STANDINGS: StandingRow[] = [
  { position: 1, teamName: 'Real Madrid',  playedGames: 34, won: 25, draw: 6,  lost: 3,  goalDifference: 42, points: 81 },
  { position: 2, teamName: 'Barcelona',    playedGames: 34, won: 24, draw: 5,  lost: 5,  goalDifference: 38, points: 77 },
  { position: 3, teamName: 'Atletico Madrid', playedGames: 34, won: 20, draw: 8,  lost: 6,  goalDifference: 22, points: 68 },
  { position: 4, teamName: 'Sevilla',      playedGames: 34, won: 16, draw: 8,  lost: 10, goalDifference: 10, points: 56 },
  { position: 5, teamName: 'Villarreal',   playedGames: 34, won: 15, draw: 9,  lost: 10, goalDifference:  8, points: 54 },
];

const FALLBACK_SCORERS: TopScorer[] = [
  { playerName: 'Erling Haaland',  teamName: 'Manchester City', goals: 27 },
  { playerName: 'Mohamed Salah',   teamName: 'Liverpool',       goals: 22 },
  { playerName: 'Vinícius Júnior', teamName: 'Real Madrid',     goals: 20 },
  { playerName: 'Robert Lewandowski', teamName: 'Barcelona',    goals: 19 },
  { playerName: 'Harry Kane',      teamName: 'Bayern Munich',   goals: 18 },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { leagueId?: number };
    const leagueId = body.leagueId ?? LEAGUE_IDS.LA_LIGA;

    const [proxyStandings, proxyScorers] = await Promise.all([
      getStandings(leagueId, CURRENT_SEASON),
      getTopScorers(leagueId, CURRENT_SEASON),
    ]);

    const standings: StandingRow[] = proxyStandings.length
      ? proxyStandings.map((s) => ({
          position:       s.rank,
          teamName:       s.team.name,
          crestUrl:       s.team.logo,
          playedGames:    s.all.played,
          won:            s.all.win,
          draw:           s.all.draw,
          lost:           s.all.lose,
          goalDifference: s.goalsDiff,
          points:         s.points,
        }))
      : FALLBACK_STANDINGS;

    const topScorers: TopScorer[] = proxyScorers.length
      ? proxyScorers.slice(0, 10).map((p) => {
          const stat = p.statistics[0];
          return {
            playerName: p.player.name,
            teamName:   stat?.team?.name ?? '',
            goals:      stat?.goals?.total ?? 0,
            crestUrl:   stat?.team?.logo,
          };
        })
      : FALLBACK_SCORERS;

    const payload: RankingsPayload = { standings, topScorers };
    return NextResponse.json(payload, { headers: HEADERS });
  } catch {
    return NextResponse.json(
      { standings: FALLBACK_STANDINGS, topScorers: FALLBACK_SCORERS } as RankingsPayload,
      { headers: HEADERS }
    );
  }
}
