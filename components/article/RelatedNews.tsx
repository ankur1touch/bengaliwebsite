import { getTranslations } from 'next-intl/server';
import { getAllArticlesAsync } from '@/lib/articles';
import { filterArticlesByLocale, mapInternalArticle } from '@/lib/news-locale';
import NewsCard from '@/components/home/NewsCard';
import type { NewsTag } from '@/types';

export default async function RelatedNews({
  currentSlug,
  currentTag,
  locale,
}: {
  currentSlug: string;
  currentTag: NewsTag;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'article' });
  const related = filterArticlesByLocale(await getAllArticlesAsync(), locale)
    .filter((a) => a.slug !== currentSlug && a.tag === currentTag)
    .slice(0, 3)
    .map((a) => mapInternalArticle(a, locale));

  if (!related.length) return null;
  return (
    <div className="mt-10 pt-6 border-t">
      <h2 className="text-lg font-bold mb-4 border-l-4 border-green-600 pl-3">{t('relatedNews')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
