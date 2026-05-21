'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function StandingsClient() {
  const dispatch = useAppDispatch();
  const { standings, status, error } = useAppSelector((s) => s.rankings);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings());
  }, [dispatch, status]);

  if (status === 'loading') return <div className="space-y-2">{[...Array(20)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>;
  if (status === 'failed')  return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchRankings())} />;

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-green-700 text-white">
          <tr>
            {['#', 'দল', 'খেলা', 'জয়', 'ড্র', 'হার', 'গো.পা.', 'পয়েন্ট'].map((h) => (
              <th key={h} className="px-3 py-2 text-center font-medium text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.position} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-3 py-2 text-center text-gray-500">{row.position}</td>
              <td className="px-3 py-2 font-medium text-gray-800">{row.teamName}</td>
              <td className="px-3 py-2 text-center text-gray-600">{row.playedGames}</td>
              <td className="px-3 py-2 text-center text-gray-600">{row.won}</td>
              <td className="px-3 py-2 text-center text-gray-600">{row.draw}</td>
              <td className="px-3 py-2 text-center text-gray-600">{row.lost}</td>
              <td className="px-3 py-2 text-center text-gray-600">{row.goalDifference}</td>
              <td className="px-3 py-2 text-center font-bold text-green-700">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
