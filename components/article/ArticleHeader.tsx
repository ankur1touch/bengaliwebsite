import SafeImage from '@/components/ui/SafeImage';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/dates';
import type { Article } from '@/types';

export default function ArticleHeader({ article }: { article: Article }) {
  return (
    <div className="mb-6">
      <Badge label={article.tag} variant="green" className="mb-3" />
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        {article.author} · {formatDate(article.publishedAt)}
      </p>
      {article.imageUrl && (
        <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden mb-6">
          <SafeImage src={article.imageUrl} alt={article.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-green-600 pl-4">{article.excerpt}</p>
    </div>
  );
}
