import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '@/lib/mdx';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import RelatedNews from '@/components/article/RelatedNews';

export const revalidate = 600;

export async function generateStaticParams() {
  return getAllArticles().flatMap((a) => [
    { locale: 'bn', slug: a.slug },
    { locale: 'en', slug: a.slug },
  ]);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ArticleHeader article={article} />
      <ArticleBody content={article.content} />
      <RelatedNews currentSlug={article.slug} currentTag={article.tag} />
    </div>
  );
}
