'use client';

import { useTranslations } from 'next-intl';
import type { FifaRanking } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface Props {
  initialRankings?: FifaRanking[];
}

export default function WorldRankingsWidget({ initialRankings }: Props) {
  const t = useTranslations('fifaRankings');
  const rankings = initialRankings ?? [];
  const loading = !initialRankings?.length;
  const top = rankings[0];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          {t('title')}
        </h3>
        <span className="text-[10px] uppercase tracking-widest text-gray-400">{t('mens')}</span>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)}</div>
      ) : (
        <>
          {top && (
            <div className="mb-4 p-3 rounded-xl bg-green-700 text-white">
              <p className="text-[10px] uppercase tracking-widest text-green-200 mb-1">{t('currentNumber1')}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{top.flag}</span>
                <div>
                  <p className="font-display text-xl uppercase">{top.country}</p>
                  <p className="text-xs text-green-200">{top.confederation}</p>
                </div>
                <p className="ml-auto font-display text-2xl text-yellow-300 tabular-nums">{top.points.toFixed(0)}</p>
              </div>
            </div>
          )}
          <div className="space-y-1">
            {rankings.slice(0, 10).map((r) => (
              <div key={r.rank} className="flex items-center gap-2 text-xs py-1.5 border-b border-gray-50 last:border-0">
                <span className="font-display text-sm text-gray-400 w-5">{r.rank}</span>
                <span className="text-base">{r.flag}</span>
                <span className="font-medium text-gray-800 flex-1 truncate">{r.country}</span>
                <span className="font-bold text-green-700 tabular-nums">{r.points.toFixed(0)}</span>
                {r.change !== 0 && (
                  <span className={`text-[10px] font-bold ${r.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.change > 0 ? `+${r.change}` : r.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
