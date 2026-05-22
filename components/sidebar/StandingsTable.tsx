'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';

export default function StandingsTable() {
  const dispatch = useAppDispatch();
  const { standings, status } = useAppSelector((s) => s.rankings);
  const t        = useTranslations('standings');
  const tSidebar = useTranslations('sidebar');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status]);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4" style={{ minHeight: 280 }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 border-l-4 border-green-600 pl-3">{tSidebar('standings')}</h3>
        <Link href="/standings" className="text-xs text-green-700 hover:underline">{tSidebar('seeAll')}</Link>
      </div>
      {(status === 'loading' || status === 'idle') && (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8" />)}</div>
      )}
      <table className="w-full text-xs">
        <thead><tr className="text-gray-400 border-b">
          <th className="pb-1 text-left w-6">{t('rank')}</th>
          <th className="pb-1 text-left">{t('team')}</th>
          <th className="pb-1 text-center">{t('played')}</th>
          <th className="pb-1 text-center font-bold text-green-700">{t('points')}</th>
        </tr></thead>
        <tbody>
          {standings.slice(0, 5).map((row) => (
            <tr key={row.position} className="border-b border-gray-50">
              <td className="py-1.5 text-gray-500">{row.position}</td>
              <td className="py-1.5 font-medium text-gray-800 truncate max-w-[120px]">
                {row.teamId ? (
                  <Link href={`/teams/${row.teamId}`} className="hover:text-green-700">{row.teamName}</Link>
                ) : row.teamName}
              </td>
              <td className="py-1.5 text-center text-gray-500">{row.playedGames}</td>
              <td className="py-1.5 text-center font-bold text-green-700">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
