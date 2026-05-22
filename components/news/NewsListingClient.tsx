'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNews, fetchNewsByCategory } from '@/store/features/newsSlice';
import NewsCard from '@/components/home/NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import type { NewsTag } from '@/types';

export default function NewsListingClient({ initialFilter }: { initialFilter?: NewsTag }) {
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector((s) => s.news);
  const [activeTab, setActiveTab] = useState<NewsTag | 'all'>(initialFilter ?? 'all');
  const t = useTranslations('news');

  const TABS: { key: NewsTag | 'all'; label: string }[] = [
    { key: 'all',            label: t('all')           },
    { key: 'la-liga',        label: t('laLiga')        },
    { key: 'premier-league', label: t('premierLeague') },
    { key: 'champions',      label: t('champions')     },
    { key: 'world-cup',      label: t('worldCup')      },
    { key: 'transfers',      label: t('transfers')     },
    { key: 'national',       label: t('national')      },
    { key: 'analysis',       label: t('analysis')      },
  ];

  useEffect(() => {
    if (activeTab === 'all') dispatch(fetchNews());
    else dispatch(fetchNewsByCategory(activeTab));
  }, [dispatch, activeTab]);

  const handleTab = (key: NewsTag | 'all') => {
    setActiveTab(key);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.key} type="button" onClick={() => handleTab(tab.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {(status === 'loading' || status === 'idle') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {status === 'failed' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={() => activeTab === 'all' ? dispatch(fetchNews()) : dispatch(fetchNewsByCategory(activeTab))}
        />
      )}
      {status === 'succeeded' && !articles.length && <EmptyState />}
      {status === 'succeeded' && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
