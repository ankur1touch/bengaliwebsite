'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNews } from '@/store/features/newsSlice';
import NewsCard from '@/components/home/NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector((s) => s.news);
  const t = useTranslations('search');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchNews());
  }, [dispatch, status]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.excerpt?.toLowerCase().includes(lower) ||
        a.source.toLowerCase().includes(lower) ||
        a.tag?.toLowerCase().includes(lower),
    );
  }, [articles, q]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchNews())} />;
  }

  if (!q.trim()) {
    return <p className="text-gray-500 text-center py-12">{t('hint')}</p>;
  }

  if (!results.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 font-medium">{t('noResults')}</p>
        <p className="text-sm text-gray-400 mt-2">{t('hint')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {t('for')} &ldquo;{q}&rdquo; — {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
