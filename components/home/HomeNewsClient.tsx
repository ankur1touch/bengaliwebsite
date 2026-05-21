'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNews } from '@/store/features/newsSlice';
import HeroCard from './HeroCard';
import NewsCard from './NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function HomeNewsClient() {
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector((s) => s.news);
  const t = useTranslations('home');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchNews());
  }, [dispatch, status]);

  if (status === 'loading' || (status === 'idle' && !articles.length)) {
    return (
      <div className="space-y-5" style={{ minHeight: 900 }}>
        <div className="h-80 lg:h-96 rounded-xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }
  if (status === 'failed') return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchNews())} />;
  if (!articles.length)    return <EmptyState />;

  const [hero, ...rest] = articles;

  return (
    <div className="space-y-5">
      <HeroCard item={hero} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800 border-l-4 border-green-600 pl-3">{t('latest')}</h2>
          <Link href="/news" className="text-sm text-green-700 hover:underline">{t('seeAll')} →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.slice(0, 6).map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
