import Parser from 'rss-parser';
import { getCache, setCache } from './memory-cache';
import { slugify } from './utils';
import type { NewsItem, NewsTag } from '@/types';

const parser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'FootballBarta/1.0' },
  customFields: {
    item: [
      ['media:content',   'mediaContent',   { keepArray: true }] as [string, string, { keepArray: boolean }],
      ['media:thumbnail', 'mediaThumbnail'] as [string, string],
    ],
  },
});

interface FeedSource { url: string; source: string; defaultTag: NewsTag; }

// RSS feeds — verified football-only sources
export const FEED_SOURCES: FeedSource[] = [
  { url: 'https://www.90min.com/posts.rss',                    source: '90min',        defaultTag: 'la-liga'        },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',   source: 'BBC Sport',    defaultTag: 'premier-league' },
  { url: 'https://www.theguardian.com/football/rss',           source: 'The Guardian', defaultTag: 'premier-league' },
  { url: 'https://www.espn.com/espn/rss/soccer/news',          source: 'ESPN',         defaultTag: 'champions'      },
  { url: 'https://www.skysports.com/rss/12603',                source: 'Sky Sports',   defaultTag: 'premier-league' },
  { url: 'https://www.skysports.com/rss/12801',                source: 'Sky Sports',   defaultTag: 'champions'      },
];

// Any match → drop unconditionally (not football)
const NON_FOOTBALL_RE =
  /\bcricket\b|ipl|\bt20\b|\bodi\b|\btest match\b|wicket|batting|bowling|innings|\blbw\b|capsey|sciver|beaumont|\bboxing\b|\bwwe\b|\bnba\b|\bnfl\b|\bnhl\b|\btennis\b|\bgolf\b|\bcycling\b|\bformula.?1\b|\bf1 grand prix\b|\brugby\b|wakefield|super league|catalans|\bbaseball\b|\bbasketball\b|\bbadminton\b|\bhockey\b|\bwrestling\b|\bfury\b|\bbellew\b|\btyson\b|\banthony joshua\b|\bdarts\b|\bsnooker\b|\bswimming\b|\bathletics\b|\bnetball\b|\bvolleyball\b|\bmma\b|\bufc\b/i;

// Sky Sports must also have a positive football keyword
const FOOTBALL_POSITIVE_RE =
  /\bfootball\b|soccer|premier league|champions league|la liga|serie a|bundesliga|ligue 1|\bfifa\b|\buefa\b|\bfpl\b|\btransfer\b|\bsquad\b|\bfixture\b|kick.?off|match.?day|\bpenalty\b|red card|yellow card|\bstriker\b|\bmidfielder\b|\bdefender\b|\bgoalkeeper\b|\bFA Cup\b|\bleague cup\b|\bEFL\b|\bMLS\b|\bISL\b|\bBPL\b|ফুটবল|গোল|লিগ|ট্রান্সফার/i;

const FOOTBALL_ONLY_SOURCES = new Set(['90min', 'BBC Sport', 'The Guardian', 'ESPN']);

function isFootball(title: string, source: string): boolean {
  if (NON_FOOTBALL_RE.test(title)) return false;
  if (FOOTBALL_ONLY_SOURCES.has(source)) return true;
  return FOOTBALL_POSITIVE_RE.test(title);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImage(item: any): string | undefined {
  // 1. Standard enclosure
  if (item.enclosure?.url && item.enclosure.url.startsWith('http')) return item.enclosure.url;

  // 2. media:thumbnail — BBC Sport: { $: { url, width, height } }
  const thumb = item.mediaThumbnail ?? item['media:thumbnail'];
  if (thumb) {
    const url = thumb?.['$']?.url ?? thumb?.url ?? (typeof thumb === 'string' ? thumb : undefined);
    if (typeof url === 'string' && url.startsWith('http')) return url;
  }

  // 3. media:content array — Guardian: pick highest width
  const mediaArr = item.mediaContent ?? item['media:content'];
  if (Array.isArray(mediaArr) && mediaArr.length > 0) {
    let best = '';
    let bestWidth = 0;
    for (const m of mediaArr) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attrs = (m as any)?.['$'] ?? {};
      const w = parseInt(attrs?.width ?? '0', 10);
      const url: string = attrs?.url ?? '';
      if (url.startsWith('http') && w > bestWidth) {
        best = url;
        bestWidth = w;
      }
    }
    if (best) return best;
    // fallback: first item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const first = (mediaArr[0] as any)?.['$']?.url;
    if (typeof first === 'string' && first.startsWith('http')) return first;
  }

  // 4. Single media:content object (not array)
  if (mediaArr && !Array.isArray(mediaArr)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (mediaArr as any)?.['$']?.url;
    if (typeof url === 'string' && url.startsWith('http')) return url;
  }

  // 5. First <img> in HTML content
  const html: string = item['content:encoded'] ?? item.content ?? '';
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m?.[1]?.startsWith('http')) return m[1];
  }

  return undefined;
}

// Tag-based football Unsplash fallback images
const TAG_IMAGES: Record<string, string> = {
  'world-cup':      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  'champions':      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  'premier-league': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
  'la-liga':        'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80',
  'transfers':      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
  'bangladesh':     'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80',
  'india':          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
  'analysis':       'https://images.unsplash.com/photo-1551958219-acbc595d5524?w=800&q=80',
  'default':        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
};

function fallbackImage(tag?: string): string {
  return TAG_IMAGES[tag ?? 'default'] ?? TAG_IMAGES['default'];
}

function autoTag(title: string, defaultTag: NewsTag): NewsTag {
  const t = title.toLowerCase();
  if (/world cup|bisshokap|fifa|বিশ্বকাপ/.test(t))     return 'world-cup';
  if (/champions league|uefa|চ্যাম্পিয়নস/.test(t))     return 'champions';
  if (/transfer|signing|contract|ট্রান্সফার/.test(t))   return 'transfers';
  if (/analysis|opinion|view|বিশ্লেষণ/.test(t))         return 'analysis';
  if (/bangladesh|বাংলাদেশ|bpl|abahani/.test(t))        return 'bangladesh';
  if (/india|ভারত|isl|i-league|chhetri/.test(t))        return 'india';
  if (/la liga|real madrid|barcelona/.test(t))           return 'la-liga';
  if (/premier league|arsenal|chelsea/.test(t))          return 'premier-league';
  return defaultTag;
}

export async function getAggregatedNews(): Promise<NewsItem[]> {
  const CACHE_KEY = 'rss:all';
  const cached = getCache<NewsItem[]>(CACHE_KEY);
  if (cached) return cached;

  const results = await Promise.allSettled(
    FEED_SOURCES.map(async (src) => {
      const feed = await parser.parseURL(src.url);
      return feed.items
        .filter((item) => isFootball(item.title ?? '', src.source))
        .slice(0, 20)
        .map((item): NewsItem => {
          const tag = autoTag(item.title ?? '', src.defaultTag);
          return {
            id:          slugify(item.title ?? ''),
            title:       item.title ?? '',
            excerpt:     item.contentSnippet?.slice(0, 200),
            url:         item.link ?? '#',
            imageUrl:    extractImage(item) ?? fallbackImage(tag),
            source:      src.source,
            tag,
            publishedAt: item.isoDate ?? new Date().toISOString(),
            isInternal:  false,
          };
        });
    })
  );

  const all = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  const unique = all.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  const sorted = unique.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  setCache(CACHE_KEY, sorted, 300);
  return sorted;
}
