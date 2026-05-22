'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import StandingsTable from './StandingsTable';
import TopScorersWidget from './TopScorersWidget';

/** Single fetch for sidebar rankings widgets on homepage */
export default function HomeSidebarData() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.rankings.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status]);

  return (
    <>
      <StandingsTable />
      <TopScorersWidget />
    </>
  );
}
