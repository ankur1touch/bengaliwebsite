'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore, type RootState } from '@/store/index';
import type { HomePageData } from '@/lib/homepage-data';

function buildPreloadedState(data: HomePageData): Partial<RootState> {
  return {
    matches: {
      matches: data.matches,
      tab: 'all',
      status: 'succeeded',
      error: null,
    },
    news: {
      articles: data.news,
      byCountry: {},
      status: 'succeeded',
      countryStatus: 'idle',
      error: null,
    },
    rankings: {
      standings: data.rankings.standings,
      topScorers: data.rankings.topScorers,
      status: 'succeeded',
      error: null,
    },
  };
}

export default function HomeStoreProvider({
  data,
  children,
}: {
  data: HomePageData;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState(data));
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
