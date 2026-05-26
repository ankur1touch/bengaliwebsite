import { getTranslations } from 'next-intl/server';
import NewsListingClient from '@/components/news/NewsListingClient';

export const revalidate = 300;

export default async function TransfersPage() {
  const t = await getTranslations('news');
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl uppercase tracking-wider text-gray-900 mb-6">{t('transfers')}</h1>
      <NewsListingClient initialFilter="transfers" />
    </div>
  );
}
