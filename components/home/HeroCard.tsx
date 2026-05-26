'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import type { NewsItem } from '@/types';

export default function HeroCard({ item }: { item: NewsItem }) {
  const t = useTranslations('home');
  const content = (
    <div className="relative h-96 lg:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group cursor-pointer shadow-lg">
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.title}
          width={1200}
          height={630}
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity duration-500 group-hover:scale-105 transform"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <Badge label={t('breaking')} variant="live" className="mb-3" />
        <h2 className="font-display text-white text-2xl sm:text-3xl lg:text-4xl uppercase leading-tight line-clamp-3 tracking-wide">
          {item.title}
        </h2>
        <p className="text-gray-400 text-sm mt-2 uppercase tracking-wider">{item.source}</p>
      </div>
    </div>
  );
  if (item.isInternal && item.slug) return <Link href={`/news/${item.slug}`} prefetch={false}>{content}</Link>;
  return <a href={item.url} target="_blank" rel="noopener noreferrer">{content}</a>;
}
