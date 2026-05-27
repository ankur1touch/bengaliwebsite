import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import NewsCard from '@/components/home/NewsCard';
import type { NewsItem } from '@/types';

export default async function HomeNewsGrid({
  news,
  locale,
}: {
  news: NewsItem[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const gridArticles = news.slice(1, 7);

  if (!gridArticles.length) return null;

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
          {gridArticles.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
