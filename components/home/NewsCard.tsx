import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import RelativeTime from '@/components/ui/RelativeTime';
import type { NewsItem } from '@/types';

export default function NewsCard({ item }: { item: NewsItem }) {
  const Inner = (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-green-200 hover:shadow-sm transition-all h-full flex flex-col">
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={160}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">⚽</div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        {item.tag && <Badge label={item.tag} variant="green" />}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.title}</h3>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs text-gray-400">{item.source}</span>
          <span className="text-xs text-gray-400"><RelativeTime dateStr={item.publishedAt} /></span>
        </div>
      </div>
    </div>
  );

  if (item.isInternal && item.slug) {
    return <Link href={`/news/${item.slug}`} prefetch={false}>{Inner}</Link>;
  }
  return <a href={item.url} target="_blank" rel="noopener noreferrer">{Inner}</a>;
}
