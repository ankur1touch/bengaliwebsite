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
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm" style={{ minHeight: 240 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          {t('topScorers')}
        </h3>
        <Link href="/players" className="text-xs text-green-700 hover:underline uppercase tracking-wide font-medium">
          {t('seeAll')} →
        </Link>
      </div>
      {(status === 'loading' || status === 'idle') && (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)}</div>
      )}
      <div className="space-y-2.5">
        {topScorers.slice(0, 5).map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-display text-sm text-gray-400 w-5 shrink-0">{i + 1}</span>
              <div className="min-w-0">
                {s.playerId ? (
                  <Link href={`/players/${s.playerId}`} className="font-medium text-gray-800 truncate block hover:text-green-700 transition-colors">
                    {s.playerName}
                  </Link>
                ) : (
                  <p className="font-medium text-gray-800 truncate">{s.playerName}</p>
                )}
                <p className="text-gray-400 truncate text-[11px]">{s.teamName}</p>
              </div>
            </div>
            <span className="font-display text-base text-green-700 shrink-0 ml-2">{s.goals}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
