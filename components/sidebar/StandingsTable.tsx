'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import type { StandingRow } from '@/types';

interface Props {
  initialStandings?: StandingRow[];
}

export default function StandingsTable({ initialStandings }: Props) {
  const dispatch = useAppDispatch();
  const { standings, status } = useAppSelector((s) => s.rankings);
  const t        = useTranslations('standings');
  const tSidebar = useTranslations('sidebar');
  const rows = initialStandings?.length ? initialStandings : standings;
  const loading = !initialStandings?.length && (status === 'loading' || status === 'idle');

  useEffect(() => {
    if (initialStandings?.length) return;
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status, initialStandings?.length]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm" style={{ minHeight: 280 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600" />
          {tSidebar('standings')}
        </h3>
        <Link href="/standings" className="text-xs text-green-700 hover:underline uppercase tracking-wide font-medium">
          {tSidebar('seeAll')}
        </Link>
      </div>
      {loading && (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)}</div>
      )}
      {!loading && (
      <table className="w-full text-xs">
        <thead><tr className="text-gray-400 border-b border-gray-100">
          <th className="pb-2 text-left w-6 font-medium">{t('rank')}</th>
          <th className="pb-2 text-left font-medium">{t('team')}</th>
          <th className="pb-2 text-center font-medium">{t('played')}</th>
          <th className="pb-2 text-center font-bold text-green-700">{t('points')}</th>
        </tr></thead>
        <tbody>
          {rows.slice(0, 5).map((row) => (
            <tr key={row.position} className="border-b border-gray-50 last:border-0">
              <td className="py-2 text-gray-500">{row.position}</td>
              <td className="py-2 font-medium text-gray-800 truncate max-w-[120px]">
                {row.teamId ? (
                  <Link href={`/teams/${row.teamId}`} className="hover:text-green-700 transition-colors">{row.teamName}</Link>
                ) : row.teamName}
              </td>
              <td className="py-2 text-center text-gray-500">{row.playedGames}</td>
              <td className="py-2 text-center font-bold text-green-700">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}
