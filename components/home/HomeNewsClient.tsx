'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNews } from '@/store/features/newsSlice';
import NewsCard from './NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function HomeNewsClient() {
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector((s) => s.news);
  const t = useTranslations('home');
  const locale = useLocale();

  useEffect(() => {
    if (status === 'idle') dispatch(fetchNews(locale));
  }, [dispatch, status, locale]);

  if (status === 'loading' || (status === 'idle' && !articles.length)) {
    return (
      <div className="space-y-5" style={{ minHeight: 480 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }
  if (status === 'failed') return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchNews(locale))} />;
  if (!articles.length) return <EmptyState />;

  const gridArticles = articles.slice(1, 7);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-gray-800">
            {t('latest')}
          </h2>
          <Link href="/news" className="text-sm text-green-700 hover:underline font-medium uppercase tracking-wide">
            {t('seeAll')} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gridArticles.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
