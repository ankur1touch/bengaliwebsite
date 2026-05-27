import { notFound } from 'next/navigation';
import { getArticleBySlugAsync, getAllArticlesAsync } from '@/lib/articles';
import { articleLanguage } from '@/lib/news-locale';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import RelatedNews from '@/components/article/RelatedNews';

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getAllArticlesAsync();
  return articles.flatMap((a) => {
    const lang = articleLanguage(a);
    const locales = lang === 'en' ? ['en' as const] : ['bn' as const];
    return locales.map((locale) => ({ locale, slug: a.slug }));
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlugAsync(slug);
  if (!article) notFound();

  const lang = articleLanguage(article);
  if (locale === 'en' && lang !== 'en') notFound();
  if (locale === 'bn' && lang === 'en') notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ArticleHeader article={article} />
      <ArticleBody content={article.content} />
      <RelatedNews currentSlug={article.slug} currentTag={article.tag} locale={locale} />
    </div>
  );
}
