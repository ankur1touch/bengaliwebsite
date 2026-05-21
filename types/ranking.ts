export interface StandingRow {
  position:        number;
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
  playerName:  string;
  teamName:    string;
  goals:       number;
  crestUrl?:   string;
}

export interface RankingsPayload {
  standings:   StandingRow[];
  topScorers:  TopScorer[];
}
