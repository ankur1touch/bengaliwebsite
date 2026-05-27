import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article } from '@/types';
import type { CmsArticlePayload } from './cms-payload';
import {
  buildArticleTags,
  excerptFromPayload,
  inferNewsTag,
  normalizePublishedAt,
  resolveAuthor,
  resolveSlug,
  slugifyTitle,
} from './cms-payload';
import { CMS_ARTICLES_COLLECTION, getMongoDb } from './mongo';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export interface StoredArticle extends Article {
  language?: string;
  sourceUrl?: string;
  sourceName?: string;
  articleId?: string;
}

function payloadToArticle(payload: CmsArticlePayload, slug: string, language: string): StoredArticle {
  const tag = inferNewsTag(payload);
  return {
    slug,
    title: payload.title.trim(),
    excerpt: excerptFromPayload(payload),
    content: (payload.content ?? '').trim(),
    author: resolveAuthor(payload),
    publishedAt: normalizePublishedAt(payload.publishedAt),
    imageUrl: payload.imageUrl?.trim() || undefined,
    tag,
    tags: buildArticleTags(payload, tag),
    language: payload.language?.trim() || language,
    sourceUrl: payload.sourceUrl?.trim() || undefined,
    sourceName: payload.sourceName?.trim() || undefined,
    articleId: payload.meta?.originalArticleId?.trim() || undefined,
  };
}

function writeMdxArticle(article: StoredArticle): void {
  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  const frontmatter: Record<string, unknown> = {
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    publishedAt: article.publishedAt,
    tag: article.tag,
    tags: article.tags,
  };
  if (article.imageUrl) frontmatter.imageUrl = article.imageUrl;
  if (article.language) frontmatter.language = article.language;
  if (article.sourceUrl) frontmatter.sourceUrl = article.sourceUrl;
  if (article.sourceName) frontmatter.sourceName = article.sourceName;
  if (article.articleId) frontmatter.articleId = article.articleId;

  const fileBody = matter.stringify(article.content, frontmatter);
  fs.writeFileSync(path.join(ARTICLES_DIR, `${article.slug}.mdx`), fileBody, 'utf8');
}

async function slugExists(slug: string): Promise<boolean> {
  const mdxPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (fs.existsSync(mdxPath)) return true;

  const db = await getMongoDb();
  if (!db) return false;
  const existing = await db.collection(CMS_ARTICLES_COLLECTION).findOne({ slug }, { projection: { _id: 1 } });
  return Boolean(existing);
}

export async function resolveUniqueSlug(payload: CmsArticlePayload): Promise<string> {
  const base = resolveSlug(payload, payload.meta?.originalArticleId);
  if (!(await slugExists(base))) return base;

  const articleId = payload.meta?.originalArticleId;
  if (articleId) {
    const withId = slugifyTitle(`${base}-${articleId.slice(-8)}`);
    if (!(await slugExists(withId))) return withId;
  }

  let attempt = 2;
  while (attempt < 100) {
    const candidate = `${base}-${attempt}`;
    if (!(await slugExists(candidate))) return candidate;
    attempt += 1;
  }
  return `${base}-${Date.now()}`;
}

async function saveToMongo(article: StoredArticle): Promise<string> {
  const db = await getMongoDb();
  if (!db) throw new Error('MONGODB_URI is not configured');

  const now = new Date().toISOString();
  const result = await db.collection(CMS_ARTICLES_COLLECTION).updateOne(
    { slug: article.slug },
    {
      $set: { ...article, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  const doc = await db.collection(CMS_ARTICLES_COLLECTION).findOne({ slug: article.slug });
  const id = doc?._id?.toString() ?? article.slug;
  return result.upsertedId?.toString() ?? id;
}

export async function createArticleFromPayload(
  payload: CmsArticlePayload,
  language: string,
): Promise<{ article: StoredArticle; storage: 'mongodb' | 'mdx'; id: string }> {
  if (!payload.title?.trim()) {
    throw new Error('title is required');
  }
  if (!payload.content?.trim() && !payload.description?.trim() && !payload.summary?.trim()) {
    throw new Error('content, description, or summary is required');
  }

  const slug = await resolveUniqueSlug(payload);
  const article = payloadToArticle(payload, slug, language);
  const db = await getMongoDb();

  if (db) {
    const id = await saveToMongo(article);
    return { article, storage: 'mongodb', id };
  }

  writeMdxArticle(article);
  return { article, storage: 'mdx', id: article.slug };
}

export async function getMongoArticles(): Promise<StoredArticle[]> {
  const db = await getMongoDb();
  if (!db) return [];
  const docs = await db
    .collection<StoredArticle>(CMS_ARTICLES_COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs;
}

export async function getMongoArticleBySlug(slug: string): Promise<StoredArticle | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<StoredArticle>(CMS_ARTICLES_COLLECTION).findOne({ slug }, { projection: { _id: 0 } });
}

export async function countMongoArticles(): Promise<number> {
  const db = await getMongoDb();
  if (!db) return 0;
  return db.collection(CMS_ARTICLES_COLLECTION).countDocuments();
}
