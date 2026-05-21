'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewsByCountry } from '@/store/features/newsSlice';
import NewsCard from '@/components/home/NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function CountryNewsClient({ countryId }: { countryId: string }) {
  const dispatch = useAppDispatch();
  const { byCountry, countryStatus, error } = useAppSelector((s) => s.news);
  const items = byCountry[countryId] ?? [];

  useEffect(() => {
    dispatch(fetchNewsByCountry(countryId));
  }, [countryId, dispatch]);

  if (countryStatus === 'loading') return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map((i) => <SkeletonCard key={i} />)}</div>;
  if (countryStatus === 'failed')  return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchNewsByCountry(countryId))} />;
  if (!items.length)               return <EmptyState />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => <NewsCard key={item.id} item={item} />)}
    </div>
  );
}
