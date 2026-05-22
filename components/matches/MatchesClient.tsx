'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/features/matchesSlice';
import MatchCardRow from './MatchCardRow';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function MatchesClient() {
  const dispatch = useAppDispatch();
  const { matches, status, error } = useAppSelector((s) => s.matches);
  const t = useTranslations('matches');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMatches({}));
  }, [dispatch, status]);

  if (status === 'loading') return <SkeletonList />;
  if (status === 'failed')  return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchMatches({}))} />;
  if (!matches.length)      return <EmptyState message={t('noMatches')} />;

  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    (acc[m.competition] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([competition, items]) => (
        <div key={competition}>
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 border-b pb-1">{competition}</h2>
          <div className="space-y-2">
            {items.map((m) => <MatchCardRow key={m.id} match={m} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
