'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import type { LiveMatch } from '@/types';

interface Props {
  match: LiveMatch;
  compact?: boolean;
}

export default function MatchCardRow({ match, compact = false }: Props) {
  const t = useTranslations('matches');
  const isLive = match.status === 'LIVE';

  const statusLabel = () => {
    if (isLive) return `🔴 ${match.minute ? match.minute + "'" : t('live')}`;
    if (match.status === 'FT') return t('ft');
    if (match.status === 'HT') return t('ht');
    if (match.status === 'POSTPONED') return t('postponed');
    return t('scheduled');
  };

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`block bg-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all ${
        compact ? 'p-3' : 'p-4'
      } ${isLive ? 'border-red-100 bg-red-50/30' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.homeCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.homeCrest} alt="" className="w-6 h-6 object-contain shrink-0" loading="lazy" />
          )}
          <span className={`font-semibold text-gray-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {match.homeTeam}
          </span>
        </div>

        <div className="text-center shrink-0 px-2">
          {match.homeScore !== undefined && match.awayScore !== undefined ? (
            <p className={`font-bold text-green-700 tabular-nums ${compact ? 'text-sm' : 'text-lg'}`}>
              {match.homeScore} – {match.awayScore}
            </p>
          ) : (
            <p className="text-xs text-gray-400 font-medium">{t('vs')}</p>
          )}
          <Badge
            label={statusLabel()}
            variant={isLive ? 'live' : match.status === 'FT' ? 'green' : 'muted'}
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className={`font-semibold text-gray-800 truncate text-right ${compact ? 'text-xs' : 'text-sm'}`}>
            {match.awayTeam}
          </span>
          {match.awayCrest && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.awayCrest} alt="" className="w-6 h-6 object-contain shrink-0" loading="lazy" />
          )}
        </div>
      </div>
      {!compact && (
        <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-wide">{match.competition}</p>
      )}
    </Link>
  );
}
