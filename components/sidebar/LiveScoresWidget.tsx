'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import type { LiveMatch } from '@/types';

function ScoreRow({ m, locale }: { m: LiveMatch; locale: string }) {
  const isLive = m.status === 'LIVE';
  const timeLoc = locale === 'bn' ? 'bn-BD' : 'en-GB';
  return (
    <div className="py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5">
            {m.homeCrest && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.homeCrest} alt="" className="w-4 h-4 object-contain shrink-0" loading="lazy" />
            )}
            <p className="text-xs font-medium text-gray-700 truncate">{m.homeTeam}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {m.awayCrest && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.awayCrest} alt="" className="w-4 h-4 object-contain shrink-0" loading="lazy" />
            )}
            <p className="text-xs font-medium text-gray-700 truncate">{m.awayTeam}</p>
          </div>
        </div>
        <div className="text-center shrink-0">
          {m.homeScore !== undefined && m.awayScore !== undefined ? (
            <p className={`text-sm font-extrabold tabular-nums leading-tight ${isLive ? 'text-red-600' : 'text-green-700'}`}>
              {m.homeScore}<br/>{m.awayScore}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              {new Date(m.utcDate).toLocaleTimeString(timeLoc, { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          {isLive && m.minute !== undefined && (
            <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white">
              {m.minute}&apos;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveScoresWidget() {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);
  const t       = useTranslations('sidebar');
  const locale  = useLocale();

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  const live = matches.filter((m) => m.status === 'LIVE' || m.status === 'HT').slice(0, 5);
  const upcoming = matches.filter((m) => m.status === 'SCHEDULED').slice(0, 3);
  const display = live.length ? live : upcoming;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4" style={{ minHeight: 200 }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 border-l-4 border-red-500 pl-3 flex items-center gap-2">
          {live.length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          {live.length ? t('liveScores') : t('upcomingMatches')}
        </h3>
        <Link href="/matches" className="text-xs text-green-700 hover:underline">{t('seeAll')} →</Link>
      </div>
      {(status === 'loading' || status === 'idle') && (
        <div className="space-y-2">{[1,2,3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
      )}
      {status === 'succeeded' && display.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-6">
          {live.length === 0 ? t('noUpcoming') : t('noLive')}
        </p>
      )}
      {display.map((m) => <ScoreRow key={m.id} m={m} locale={locale} />)}
    </div>
  );
}
