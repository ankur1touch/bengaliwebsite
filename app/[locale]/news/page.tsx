import { getTranslations } from 'next-intl/server';
import NewsListingClient from '@/components/news/NewsListingClient';
export const revalidate = 300;
export default async function NewsPage() {
  const t = await getTranslations('news');
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <NewsListingClient />
    </div>
  );
}
