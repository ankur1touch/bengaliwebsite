import { getAllArticles } from '@/lib/mdx';
import NewsCard from '@/components/home/NewsCard';
import type { NewsTag, NewsItem } from '@/types';

export default function RelatedNews({ currentSlug, currentTag }: { currentSlug: string; currentTag: NewsTag }) {
  const related = getAllArticles()
    .filter((a) => a.slug !== currentSlug && a.tag === currentTag)
    .slice(0, 3)
    .map((a): NewsItem => ({
      id: a.slug, title: a.title, excerpt: a.excerpt,
      url: `/news/${a.slug}`, imageUrl: a.imageUrl,
      source: 'ফুটবলবার্তা', tag: a.tag, publishedAt: a.publishedAt,
      isInternal: true, slug: a.slug,
    }));

  if (!related.length) return null;
  return (
    <div className="mt-10 pt-6 border-t">
      <h2 className="text-lg font-bold mb-4 border-l-4 border-green-600 pl-3">সম্পর্কিত খবর</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
