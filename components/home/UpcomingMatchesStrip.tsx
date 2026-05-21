'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import type { LiveMatch } from '@/types';

function MatchCard({ m, locale, tHome, tMatches }: {
  m: LiveMatch;
  locale: string;
  tHome:    (k: string) => string;
  tMatches: (k: string) => string;
}) {
  const isLive   = m.status === 'LIVE';
  const dateLoc  = locale === 'bn' ? 'bn-BD' : 'en-GB';

  return (
    <div className={`shrink-0 w-60 snap-start rounded-xl p-3 border transition-all ${
      isLive
        ? 'bg-red-50 border-red-200 shadow-sm'
        : 'bg-white border-gray-100 hover:border-green-200 hover:shadow-md'
    }`}>
      <p className="text-[10px] text-gray-400 mb-2 truncate font-medium uppercase tracking-wide">
        {m.competition}
      </p>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {m.homeCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.homeCrest} alt="" className="w-5 h-5 object-contain shrink-0" loading="lazy" />
          )}
          <span className="text-xs font-semibold text-gray-800 truncate">{m.homeTeam}</span>
        </div>

        <div className="text-center shrink-0 px-1">
          {isLive && m.homeScore !== undefined ? (
            <span className="text-sm font-extrabold text-red-600 tabular-nums">
              {m.homeScore}–{m.awayScore}
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-medium">{tMatches('vs')}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-semibold text-gray-800 truncate text-right">{m.awayTeam}</span>
          {m.awayCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.awayCrest} alt="" className="w-5 h-5 object-contain shrink-0" loading="lazy" />
          )}
        </div>
      </div>

      <p className={`text-[11px] mt-2 font-medium ${isLive ? 'text-red-500' : 'text-yellow-700'}`}>
        {isLive
          ? `🔴 ${tHome('live')}${m.minute ? ' ' + m.minute + "'" : ''}`
          : new Date(m.utcDate).toLocaleString(dateLoc, {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
      </p>
    </div>
  );
}

export default function UpcomingMatchesStrip() {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);
  const tHome    = useTranslations('home');
  const tMatches = useTranslations('matches');
  const locale   = useLocale();

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div>
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="flex gap-3">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-60 shrink-0 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const live      = matches.filter((m) => m.status === 'LIVE').slice(0, 3);
  const scheduled = matches.filter((m) => m.status === 'SCHEDULED').slice(0, 6);
  const display   = [...live, ...scheduled].slice(0, 8);

  if (!display.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800 border-l-4 border-green-600 pl-3">
          {tHome('matches')}
        </h2>
        <Link href="/matches" className="text-sm text-green-700 hover:underline font-medium">
          {tHome('seeAll')} →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
        {display.map((m) => (
          <MatchCard key={m.id} m={m} locale={locale} tHome={tHome} tMatches={tMatches} />
        ))}
      </div>
    </section>
  );
}
