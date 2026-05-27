import type { NewsTag } from '@/types';

export interface CmsArticlePayload {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  summary?: string;
  language?: string;
  country?: string;
  region?: string;
  sourceUrl?: string;
  sourceName?: string;
  author?: string;
  imageUrl?: string | null;
  _imageFromFallback?: boolean;
  videoUrl?: string | null;
  mediaType?: string;
  isVideo?: boolean;
  players?: string[];
  teams?: string[];
  leagues?: string[];
  competition?: string;
  categories?: string[];
  tags?: string[];
  publishedAt?: string;
  isWorldCup2026?: boolean;
  meta?: {
    originalArticleId?: string;
    scrapedAt?: string;
    structuredAt?: string;
    imageFromFallback?: boolean;
  };
}

const TAG_RULES: { tag: NewsTag; patterns: RegExp[] }[] = [
  { tag: 'world-cup', patterns: [/world\s*cup/i, /\bfifa\b/i, /\bwc\b/i, /২০২৬/] },
  { tag: 'bangladesh', patterns: [/bangladesh/i, /বাংলাদেশ/] },
  { tag: 'india', patterns: [/india/i, /ভারত/] },
  { tag: 'transfers', patterns: [/transfer/i, /signing/i, /ট্রান্সফার/] },
  { tag: 'premier-league', patterns: [/premier\s*league/i, /\bepl\b/i] },
  { tag: 'la-liga', patterns: [/la\s*liga/i, /laliga/i] },
  { tag: 'champions', patterns: [/champions\s*league/i, /ucl/i] },
  { tag: 'national', patterns: [/national/i, /international/i, /জাতীয়/] },
];

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0080-\uffff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'article';
}

export function inferNewsTag(payload: CmsArticlePayload): NewsTag {
  if (payload.isWorldCup2026) return 'world-cup';
  const haystack = [
    payload.competition,
    payload.country,
    payload.region,
    ...(payload.categories ?? []),
    ...(payload.tags ?? []),
    ...(payload.leagues ?? []),
    payload.title,
  ]
    .filter(Boolean)
    .join(' ');

  for (const { tag, patterns } of TAG_RULES) {
    if (patterns.some((p) => p.test(haystack))) return tag;
  }
  return 'analysis';
}

export function buildArticleTags(payload: CmsArticlePayload, primaryTag: NewsTag): string[] {
  const merged = new Set<string>([primaryTag]);
  for (const value of [...(payload.tags ?? []), ...(payload.categories ?? [])]) {
    const trimmed = value.trim();
    if (trimmed) merged.add(trimmed);
  }
  return [...merged];
}

export function normalizePublishedAt(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function excerptFromPayload(payload: CmsArticlePayload): string {
  const candidate = payload.description?.trim() || payload.summary?.trim();
  if (candidate) return candidate.slice(0, 320);
  const plain = (payload.content ?? '').replace(/[#>*_\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.slice(0, 220) + (plain.length > 220 ? '…' : '');
}

export function resolveAuthor(payload: CmsArticlePayload): string {
  return payload.author?.trim() || payload.sourceName?.trim() || 'ফুটবলবার্তা সংবাদদাতা';
}

export function resolveSlug(payload: CmsArticlePayload, articleId?: string): string {
  const fromPayload = payload.slug?.trim();
  if (fromPayload) return slugifyTitle(fromPayload);
  const fromTitle = slugifyTitle(payload.title || '');
  if (fromTitle !== 'article') return fromTitle;
  if (articleId) return slugifyTitle(articleId);
  return `article-${Date.now()}`;
}
