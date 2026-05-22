import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SearchClient from '@/components/search/SearchClient';
import { SkeletonCard } from '@/components/ui/Skeleton';

export const revalidate = 300;

export default async function SearchPage() {
  const t = await getTranslations('search');
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
        </div>
      }>
        <SearchClient />
      </Suspense>
    </div>
  );
}
