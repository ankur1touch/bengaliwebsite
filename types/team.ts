import type { LiveMatch } from './match';
import type { StandingRow } from './ranking';

export interface TeamInfo {
  id:       number;
  name:     string;
  logo?:    string;
  country?: string;
  founded?: number;
  venue?:   string;
}

export interface SquadPlayer {
  id:           number;
  name:         string;
  age?:         number;
  number?:      number;
  position?:    string;
  photo?:       string;
}

export interface TeamDetailPayload {
  team:       TeamInfo;
  squad:      SquadPlayer[];
  fixtures:   LiveMatch[];
  results:    LiveMatch[];
  standing?:  StandingRow;
}
