import { getAllArticles as getMdxArticles, getArticleBySlug as getMdxArticleBySlug } from './mdx';
import { getMongoArticleBySlug, getMongoArticles } from './cms-store';
import type { Article } from '@/types';

function mergeArticles(mdx: Article[], mongo: Article[]): Article[] {
  const bySlug = new Map<string, Article>();
  for (const article of mdx) bySlug.set(article.slug, article);
  for (const article of mongo) bySlug.set(article.slug, article);
  return [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getAllArticlesAsync(): Promise<Article[]> {
  const [mdx, mongo] = await Promise.all([
    Promise.resolve(getMdxArticles()),
    getMongoArticles(),
  ]);
  return mergeArticles(mdx, mongo);
}

export async function getArticleBySlugAsync(slug: string): Promise<Article | null> {
  const mongoArticle = await getMongoArticleBySlug(slug);
  if (mongoArticle) return mongoArticle;
  return getMdxArticleBySlug(slug);
}

/** Sync MDX-only list — kept for build-time paths that cannot await Mongo. */
export { getMdxArticles as getAllArticles, getMdxArticleBySlug as getArticleBySlug };
