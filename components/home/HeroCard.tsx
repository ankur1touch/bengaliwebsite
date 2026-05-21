import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import type { NewsItem } from '@/types';

export default function HeroCard({ item }: { item: NewsItem }) {
  const t = useTranslations('home');
  const content = (
    <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group cursor-pointer">
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.title}
          width={1200}
          height={630}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Badge label={t('breaking')} variant="live" className="mb-2" />
        <h2 className="text-white text-xl lg:text-2xl font-bold leading-tight line-clamp-3">{item.title}</h2>
        <p className="text-gray-300 text-sm mt-1">{item.source}</p>
      </div>
    </div>
  );
  if (item.isInternal && item.slug) return <Link href={`/news/${item.slug}`} prefetch={false}>{content}</Link>;
  return <a href={item.url} target="_blank" rel="noopener noreferrer">{content}</a>;
}
