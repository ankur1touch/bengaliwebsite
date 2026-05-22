'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import Badge from '@/components/ui/Badge';
import type { LiveMatch } from '@/types';
import { MAJOR_LEAGUE_IDS } from '@/lib/football-endpoints';

function pickMatchOfDay(matches: LiveMatch[]): LiveMatch | null {
  const live = matches.filter((m) => m.status === 'LIVE');
  const majorLive = live.find((m) => m.leagueId && MAJOR_LEAGUE_IDS.has(m.leagueId));
  if (majorLive) return majorLive;
  if (live.length) return live[0];
  const upcoming = matches.find((m) => m.status === 'SCHEDULED');
  if (upcoming) return upcoming;
  return matches[0] ?? null;
}

function useCountdown(target: string) {
  const [diff, setDiff] = useState<number>(() => new Date(target).getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  return { days, hours, mins };
}

export default function MatchOfDay() {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return <div className="h-28 rounded-xl bg-gray-200 animate-pulse" />;
  }

  const match = pickMatchOfDay(matches);
  if (!match) return null;

  return <MatchOfDayCard match={match} />;
}

function MatchOfDayCard({ match }: { match: LiveMatch }) {
  const t = useTranslations('home');
  const countdown = useCountdown(match.utcDate);
  const isLive   = match.status === 'LIVE';
  const isPlayed = match.status === 'FT';

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block bg-gradient-to-br from-green-700 via-green-800 to-green-900 rounded-xl p-5 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">
            {t('matchOfDay')}
          </span>
          {isLive && <Badge label={t('live')} variant="live" />}
        </div>
        <span className="text-xs opacity-80 truncate max-w-[40%] text-right">{match.competition}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center min-w-0">
          {match.homeCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.homeCrest} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" loading="lazy" />
          )}
          <p className="font-bold text-sm sm:text-base truncate">{match.homeTeam}</p>
        </div>

        <div className="text-center px-2 shrink-0">
          {match.homeScore !== undefined && match.awayScore !== undefined ? (
            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums">
              {match.homeScore}<span className="opacity-50 mx-1">–</span>{match.awayScore}
            </p>
          ) : (
            <p className="text-xl font-bold opacity-90">{t('vs')}</p>
          )}
          {isLive && match.minute !== undefined && (
            <p className="text-xs text-yellow-300 font-medium mt-1">{match.minute}&apos;</p>
          )}
          {!isLive && match.status === 'SCHEDULED' && countdown && (
            <p className="text-[11px] text-yellow-300 mt-1 font-medium tabular-nums">
              {countdown.days > 0 ? `${countdown.days}d ` : ''}
              {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.mins).padStart(2, '0')}
            </p>
          )}
          {isPlayed && <p className="text-[11px] text-yellow-300 mt-1 font-medium">{t('finished')}</p>}
        </div>

        <div className="flex-1 text-center min-w-0">
          {match.awayCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.awayCrest} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" loading="lazy" />
          )}
          <p className="font-bold text-sm sm:text-base truncate">{match.awayTeam}</p>
        </div>
      </div>
    </Link>
  );
}
