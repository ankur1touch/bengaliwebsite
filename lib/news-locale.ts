import type { Article, NewsItem } from '@/types';

export function internalSourceName(locale: string): string {
  return locale === 'en' ? 'Football Barta' : 'ফুটবলবার্তা';
}

export function articleLanguage(article: { language?: string }): string {
  return article.language?.trim() || 'bn';
}

export function filterArticlesByLocale<T extends { language?: string }>(
  articles: T[],
  locale: string,
): T[] {
  if (locale === 'en') {
    return articles.filter((a) => articleLanguage(a) === 'en');
  }
  return articles.filter((a) => articleLanguage(a) !== 'en');
}

export function mapInternalArticle(article: Article, locale: string): NewsItem {
  return {
    id: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    url: `/news/${article.slug}`,
    imageUrl: article.imageUrl,
    source: internalSourceName(locale),
    tag: article.tag,
    publishedAt: article.publishedAt,
    isInternal: true,
    slug: article.slug,
  };
}
