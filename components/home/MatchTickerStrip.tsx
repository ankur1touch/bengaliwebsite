'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import TeamCrest from '@/components/ui/TeamCrest';
import type { LiveMatch } from '@/types';

function abbrev(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return parts.map((p) => p[0]).join('').slice(0, 3).toUpperCase();
}

function TickerItem({ m, locale }: { m: LiveMatch; locale: string }) {
  const isLive = m.status === 'LIVE';
  const timeLoc = locale === 'bn' ? 'bn-BD' : 'en-GB';
  const time = isLive
    ? `${m.homeScore ?? 0}–${m.awayScore ?? 0}`
    : new Date(m.utcDate).toLocaleTimeString(timeLoc, { hour: '2-digit', minute: '2-digit' });

  return (
    <Link
      href={`/matches/${m.id}`}
      className="flex items-center gap-2 shrink-0 px-4 py-2 hover:bg-white/5 transition-colors border-r border-white/10 last:border-0"
    >
      {m.homeCrest && <TeamCrest src={m.homeCrest} size={16} className="w-4 h-4" />}
      <span className="text-xs font-semibold text-gray-300">{abbrev(m.homeTeam)}</span>
      <span className={`text-xs font-bold tabular-nums ${isLive ? 'text-red-400' : 'text-yellow-400'}`}>
        {time}
      </span>
      <span className="text-xs font-semibold text-gray-300">{abbrev(m.awayTeam)}</span>
      {m.awayCrest && <TeamCrest src={m.awayCrest} size={16} className="w-4 h-4" />}
      {isLive && m.minute !== undefined && (
        <span className="text-[10px] text-red-400 font-bold">{m.minute}&apos;</span>
      )}
    </Link>
  );
}

export default function MatchTickerStrip() {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);
  const t = useTranslations('ticker');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  const live = matches.filter((m) => m.status === 'LIVE').slice(0, 8);
  const upcoming = matches.filter((m) => m.status === 'SCHEDULED').slice(0, 12);
  const display = [...live, ...upcoming].slice(0, 16);

  if (!display.length && status !== 'loading' && status !== 'idle') return null;

  return (
    <div className="bg-brand-navy border-b border-white/10">
      <div className="flex items-stretch max-w-full">
        <div className="hidden sm:flex items-center gap-2 px-4 bg-green-800/80 shrink-0 border-r border-white/10">
          <span className="text-yellow-400 text-sm">🏆</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-yellow-300 whitespace-nowrap">
            {tNav('worldCup')}
          </span>
        </div>
        <div className="flex-1 overflow-x-auto scrollbar-none flex items-center min-h-[44px]">
          {(status === 'loading' || status === 'idle') && !display.length ? (
            <div className="flex gap-4 px-4 py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-24 bg-white/10 rounded animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            display.map((m) => <TickerItem key={m.id} m={m} locale={locale} />)
          )}
        </div>
        <Link
          href="/matches"
          className="hidden md:flex items-center px-4 text-[10px] uppercase tracking-widest text-yellow-400 hover:text-yellow-300 shrink-0 border-l border-white/10 font-medium"
        >
          {t('label')} →
        </Link>
      </div>
    </div>
  );
}
