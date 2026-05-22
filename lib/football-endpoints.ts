/** Postman-aligned CMS proxy path constants */
export const FOOTBALL_ENDPOINTS = {
  standings:          '/standings',
  topScorers:         '/topscorers',
  live:               '/live',
  fixtures:           '/fixtures',
  lineups:            '/lineups',
  events:             '/events',
  stats:              '/stats',
  headToHead:         '/headtohead',
  players:            '/players',
  playersStatistics:  '/players-statistics',
  playersSquads:      '/players-squads',
  teams:              '/teams',
} as const;

export const LEAGUE_IDS = {
  PREMIER_LEAGUE:   39,
  LA_LIGA:          140,
  CHAMPIONS_LEAGUE: 2,
  WORLD_CUP:        1,
  SAFF:             1032,
  ISL:              323,
  I_LEAGUE:         322,
  BANGLADESH_PL:    622,
  SERIE_A:          135,
  BUNDESLIGA:       78,
  LIGUE_1:          61,
  ARGENTINA:        128,
  BRAZIL:           71,
} as const;

export const DEFAULT_SEASON = Number(process.env.FOOTBALL_API_SEASON ?? 2025);

/** Leagues with reliable events / lineups / stats coverage */
export const MAJOR_LEAGUE_IDS = new Set<number>([
  LEAGUE_IDS.PREMIER_LEAGUE,
  LEAGUE_IDS.LA_LIGA,
  LEAGUE_IDS.CHAMPIONS_LEAGUE,
  LEAGUE_IDS.SERIE_A,
  LEAGUE_IDS.BUNDESLIGA,
  LEAGUE_IDS.LIGUE_1,
  LEAGUE_IDS.WORLD_CUP,
]);
