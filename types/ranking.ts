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
