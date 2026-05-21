export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'SCHEDULED' | 'POSTPONED';

export interface LiveMatch {
  id:           string;
  homeTeam:     string;
  awayTeam:     string;
  homeScore?:   number;
  awayScore?:   number;
  minute?:      number;
  status:       MatchStatus;
  competition:  string;
  utcDate:      string;
  homeCrest?:   string;
  awayCrest?:   string;
}
