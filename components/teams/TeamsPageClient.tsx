'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function TeamsPageClient() {
  const dispatch = useAppDispatch();
  const { standings, status, error } = useAppSelector((s) => s.rankings);
  const t = useTranslations('teams');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }
  if (status === 'failed') return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchRankings({}))} />;

  const teams = standings.filter((s) => s.teamId);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <Link
          key={team.teamId}
          href={`/teams/${team.teamId}`}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-md transition-all text-center"
        >
          {team.crestUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={team.crestUrl} alt="" className="w-12 h-12 object-contain" loading="lazy" />
          )}
          <p className="font-semibold text-sm text-gray-800">{team.teamName}</p>
          <p className="text-xs text-gray-400">#{team.position} · {team.points} {t('pts')}</p>
        </Link>
      ))}
    </div>
  );
}
