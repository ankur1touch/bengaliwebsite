'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { fetchMatches } from '@/store/features/matchesSlice';
import MatchCardRow from '@/components/matches/MatchCardRow';
import { Skeleton } from '@/components/ui/Skeleton';
import type { CountryId } from '@/types';

interface Props { countryId: CountryId; }

export default function CountryFootballSection({ countryId }: Props) {
  const dispatch = useAppDispatch();
  const { standings, topScorers, status: rStatus } = useAppSelector((s) => s.rankings);
  const { matches, status: mStatus } = useAppSelector((s) => s.matches);
  const t = useTranslations('standings');
  const tSidebar = useTranslations('sidebar');

  useEffect(() => {
    dispatch(fetchRankings({ countryId }));
    dispatch(fetchMatches({ countryId }));
  }, [dispatch, countryId]);

  const loading = rStatus === 'loading' || rStatus === 'idle';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h3 className="text-sm font-bold text-gray-800 border-l-4 border-green-600 pl-3 mb-3">{tSidebar('standings')}</h3>
        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8" />)}</div>
        ) : (
          <table className="w-full text-xs">
            <thead><tr className="text-gray-400 border-b">
              <th className="pb-1 text-left">{t('rank')}</th>
              <th className="pb-1 text-left">{t('team')}</th>
              <th className="pb-1 text-center">{t('points')}</th>
            </tr></thead>
            <tbody>
              {standings.slice(0, 5).map((row) => (
                <tr key={row.position} className="border-b border-gray-50">
                  <td className="py-1.5 text-gray-500">{row.position}</td>
                  <td className="py-1.5 font-medium">{row.teamName}</td>
                  <td className="py-1.5 text-center font-bold text-green-700">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h3 className="text-sm font-bold text-gray-800 border-l-4 border-yellow-500 pl-3 mb-3">{tSidebar('topScorers')}</h3>
        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8" />)}</div>
        ) : (
          <div className="space-y-2">
            {topScorers.slice(0, 5).map((s, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-medium">{s.playerName}</span>
                <span className="font-bold text-green-700">{s.goals}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {(mStatus === 'succeeded' && matches.length > 0) && (
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 border-l-4 border-green-600 pl-3 mb-3">{tSidebar('upcomingMatches')}</h3>
          <div className="space-y-2">
            {matches.slice(0, 4).map((m) => <MatchCardRow key={m.id} match={m} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
