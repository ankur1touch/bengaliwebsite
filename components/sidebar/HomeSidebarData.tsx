'use client';

import StandingsTable from './StandingsTable';
import TopScorersWidget from './TopScorersWidget';
import type { RankingsPayload } from '@/types';

/** Sidebar rankings widgets — uses server data on homepage to avoid hydration mismatches. */
export default function HomeSidebarData({ rankings }: { rankings?: RankingsPayload }) {
  return (
    <>
      <StandingsTable initialStandings={rankings?.standings} />
      <TopScorersWidget initialTopScorers={rankings?.topScorers} />
    </>
  );
}
