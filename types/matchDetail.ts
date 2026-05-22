import type { LiveMatch, MatchStatus } from './match';

export interface MatchEvent {
  time:      number;
  team:      'home' | 'away';
  type:      string;
  detail:    string;
  player?:   string;
  assist?:   string;
}

export interface LineupPlayer {
  id:       number;
  name:     string;
  number?:  number;
  pos?:     string;
}

export interface TeamLineup {
  teamId:   number;
  teamName: string;
  logo?:    string;
  formation?: string;
  startXI:  LineupPlayer[];
  subs:     LineupPlayer[];
}

export interface MatchStatRow {
  type:   string;
  home:   number | string | null;
  away:   number | string | null;
}

export interface FixtureDetail {
  id:           string;
  homeTeam:     string;
  awayTeam:     string;
  homeTeamId:   number;
  awayTeamId:   number;
  homeScore?:   number;
  awayScore?:   number;
  minute?:      number;
  status:       MatchStatus;
  competition:  string;
  leagueId:     number;
  utcDate:      string;
  homeCrest?:   string;
  awayCrest?:   string;
  venue?:       string;
  round?:       string;
}

export interface MatchDetailPayload {
  fixture:    FixtureDetail;
  events:     MatchEvent[];
  lineups:    TeamLineup[];
  statistics: MatchStatRow[];
  h2h:        LiveMatch[];
}
