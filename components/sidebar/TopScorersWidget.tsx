'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRankings } from '@/store/features/rankingsSlice';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TopScorersWidget() {
  const dispatch = useAppDispatch();
  const { topScorers, status } = useAppSelector((s) => s.rankings);
  const t = useTranslations('sidebar');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRankings({}));
  }, [dispatch, status]);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4" style={{ minHeight: 240 }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 border-l-4 border-yellow-500 pl-3">{t('topScorers')}</h3>
        <Link href="/players" className="text-xs text-green-700 hover:underline">{t('seeAll')} →</Link>
      </div>
      {(status === 'loading' || status === 'idle') && (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8" />)}</div>
      )}
      <div className="space-y-2">
        {topScorers.slice(0, 5).map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-400 w-4 shrink-0">{i + 1}</span>
              <div className="min-w-0">
                {s.playerId ? (
                  <Link href={`/players/${s.playerId}`} className="font-medium text-gray-800 truncate block hover:text-green-700">
                    {s.playerName}
                  </Link>
                ) : (
                  <p className="font-medium text-gray-800 truncate">{s.playerName}</p>
                )}
                <p className="text-gray-400 truncate">{s.teamName}</p>
              </div>
            </div>
            <span className="font-bold text-green-700 text-sm shrink-0 ml-2">{s.goals}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
