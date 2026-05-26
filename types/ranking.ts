export interface StandingRow {
  position:        number;
  teamId?:         number;
  teamName:        string;
  crestUrl?:       string;
  playedGames:     number;
  won:             number;
  draw:            number;
  lost:            number;
  goalDifference:  number;
  points:          number;
}

export interface TopScorer {
  playerId?:   number;
  teamId?:     number;
  playerName:  string;
  teamName:    string;
  goals:       number;
  assists?:    number;
  crestUrl?:   string;
  photo?:      string;
}

export interface RankingsPayload {
  standings:   StandingRow[];
  topScorers:  TopScorer[];
}

export interface FifaRanking {
  rank:            number;
  country:         string;
  flag:            string;
  points:          number;
  change:          number;
  confederation?:  string;
}

export interface SearchResult {
  news:     Array<{ id: string; title: string; slug?: string; url: string; source: string; tag?: string }>;
  matches:  Array<{ id: string; homeTeam: string; awayTeam: string; competition: string; status: string }>;
  players:  Array<{ id: number; name: string; team: string; goals: number }>;
  teams:    Array<{ id: number; name: string; league?: string }>;
}
