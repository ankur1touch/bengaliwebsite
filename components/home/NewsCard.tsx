'use client';

import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import Badge from '@/components/ui/Badge';
import RelativeTime from '@/components/ui/RelativeTime';
import type { NewsItem } from '@/types';

export default function NewsCard({ item }: { item: NewsItem }) {
  const Inner = (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.imageUrl ? (
          <SafeImage
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            quality={70}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">⚽</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {item.tag && (
          <div className="absolute top-3 left-3">
            <Badge label={item.tag} variant="green" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-green-800 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">{item.source}</span>
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
