import type { LiveMatch } from './match';

export interface PlayerInfo {
  id:           number;
  name:         string;
  photo?:       string;
  age?:         number;
  nationality?: string;
  height?:      string;
  weight?:      string;
}

export interface PlayerSeasonStats {
  teamId:       number;
  teamName:     string;
  teamLogo?:    string;
  league:       string;
  appearances:  number;
  goals:        number;
  assists:      number;
  minutes:      number;
}

export interface PlayerDetailPayload {
  player:      PlayerInfo;
  statistics:  PlayerSeasonStats[];
  fixtures:    LiveMatch[];
}
