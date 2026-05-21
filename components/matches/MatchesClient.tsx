'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import Badge from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function MatchesClient() {
  const dispatch = useAppDispatch();
  const { matches, status, error } = useAppSelector((s) => s.matches);
  const t = useTranslations('matches');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches());
  }, [dispatch, status]);

  if (status === 'loading') return <SkeletonList />;
  if (status === 'failed')  return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchMatches())} />;
  if (!matches.length)      return <EmptyState message={t('noMatches')} />;

  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    (acc[m.competition] ??= []).push(m);
    return acc;
  }, {});

  const statusLabel = (s: string, minute?: number) => {
    if (s === 'LIVE')      return `🔴 ${minute ? minute + "'" : t('live')}`;
    if (s === 'FT')        return `✅ ${t('ft')}`;
    if (s === 'HT')        return `⏸ ${t('ht')}`;
    if (s === 'POSTPONED') return t('postponed');
    return `📅 ${t('upcoming')}`;
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([competition, items]) => (
        <div key={competition}>
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 border-b pb-1">{competition}</h2>
          <div className="space-y-2">
            {items.map((m) => (
              <div key={m.id} className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 flex-1">{m.homeTeam}</span>
                  <div className="text-center px-4">
                    {(m.homeScore !== undefined) ? (
                      <p className="text-lg font-bold text-green-700">{m.homeScore} – {m.awayScore}</p>
                    ) : (
                      <p className="text-sm text-gray-400">{t('vs')}</p>
                    )}
                    <Badge
                      label={statusLabel(m.status, m.minute)}
                      variant={m.status === 'LIVE' ? 'live' : m.status === 'FT' ? 'green' : 'muted'}
                    />
                  </div>
                  <span className="font-semibold text-gray-800 flex-1 text-right">{m.awayTeam}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
