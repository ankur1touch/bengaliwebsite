'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function TopScorersPageClient() {
  const dispatch = useAppDispatch();
  const { topScorers, status, error } = useAppSelector((s) => s.rankings);
  const t = useTranslations('players');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') return <SkeletonList />;
  if (status === 'failed') return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchRankings({}))} />;

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-500 text-xs">
            <th className="py-3 px-4 text-left w-10">{t('rank')}</th>
            <th className="py-3 px-4 text-left">{t('player')}</th>
            <th className="py-3 px-4 text-left hidden sm:table-cell">{t('team')}</th>
            <th className="py-3 px-4 text-center font-bold text-green-700">{t('goals')}</th>
          </tr>
        </thead>
        <tbody>
          {topScorers.map((s, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
              <td className="py-3 px-4 text-gray-400 font-medium">{i + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {s.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo} alt="" className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                  )}
                  {s.playerId ? (
                    <Link href={`/players/${s.playerId}`} className="font-semibold text-gray-800 hover:text-green-700">
                      {s.playerName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-800">{s.playerName}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                {s.teamId ? (
                  <Link href={`/teams/${s.teamId}`} className="text-gray-600 hover:text-green-700 flex items-center gap-2">
                    {s.crestUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.crestUrl} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                    )}
                    {s.teamName}
                  </Link>
                ) : (
                  <span className="text-gray-600">{s.teamName}</span>
                )}
              </td>
              <td className="py-3 px-4 text-center font-bold text-green-700 text-base">{s.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
