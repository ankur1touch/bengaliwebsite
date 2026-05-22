import { LEAGUE_IDS, DEFAULT_SEASON } from './football-endpoints';
import type { CountryId } from '@/types';

export interface CountryLeagueConfig {
  leagueId:  number;
  season:    number;
  label:     string;
}

const COUNTRY_LEAGUES: Record<CountryId, CountryLeagueConfig> = {
  bangladesh: { leagueId: LEAGUE_IDS.SAFF,          season: DEFAULT_SEASON, label: 'SAFF Championship' },
  india:      { leagueId: LEAGUE_IDS.ISL,           season: DEFAULT_SEASON, label: 'Indian Super League' },
  argentina:  { leagueId: LEAGUE_IDS.ARGENTINA,     season: DEFAULT_SEASON, label: 'Primera División' },
  brazil:     { leagueId: LEAGUE_IDS.BRAZIL,         season: DEFAULT_SEASON, label: 'Série A' },
  spain:      { leagueId: LEAGUE_IDS.LA_LIGA,        season: DEFAULT_SEASON, label: 'La Liga' },
};

export function getCountryLeague(countryId: string): CountryLeagueConfig | null {
  return COUNTRY_LEAGUES[countryId as CountryId] ?? null;
}

export function getDefaultLeague(): CountryLeagueConfig {
  return { leagueId: LEAGUE_IDS.LA_LIGA, season: DEFAULT_SEASON, label: 'La Liga' };
}
