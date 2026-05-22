export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'SCHEDULED' | 'POSTPONED';

export interface LiveMatch {
  id:           string;
  homeTeam:     string;
  awayTeam:     string;
  homeTeamId?:  number;
  awayTeamId?:  number;
  homeScore?:   number;
  awayScore?:   number;
  minute?:      number;
  status:       MatchStatus;
  competition:  string;
  leagueId?:    number;
  utcDate:      string;
  homeCrest?:   string;
  awayCrest?:   string;
  venue?:       string;
  round?:       string;
}
