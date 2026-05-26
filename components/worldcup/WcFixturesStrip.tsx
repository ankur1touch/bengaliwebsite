'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import { LEAGUE_IDS } from '@/lib/football-endpoints';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WcFixturesStrip() {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);
  const t = useTranslations('worldcup');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  const wcMatches = matches
    .filter((m) => m.leagueId === LEAGUE_IDS.WORLD_CUP || m.competition.toLowerCase().includes('world cup'))
    .slice(0, 8);

  const display = wcMatches.length ? wcMatches : matches.filter((m) => m.status === 'SCHEDULED').slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="font-display text-xl uppercase tracking-wider text-gray-800 mb-4">{t('fixtures')}</h2>
      {(status === 'loading' || status === 'idle') && (
        <div className="flex gap-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 w-64 rounded-xl shrink-0" />)}</div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {display.map((m) => (
          <Link
            key={m.id}
            href={`/matches/${m.id}`}
            className="shrink-0 w-64 rounded-xl border border-gray-100 bg-white p-4 hover:border-green-200 hover:shadow-md transition-all"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{m.competition}</p>
            <p className="text-sm font-semibold text-gray-800">{m.homeTeam}</p>
            <p className="text-xs text-gray-400 my-1">{t('vs')} {m.awayTeam}</p>
            <p className="text-xs text-green-700 font-medium">
              {m.status === 'LIVE' ? `🔴 LIVE ${m.minute ?? ''}'` : new Date(m.utcDate).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
