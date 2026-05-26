/**
 * Server-only homepage data bundle — parallel fetch to cut client waterfalls.
 */
import { fetchMatches, fetchRankings, fetchFifaRankings } from './football-api';
import { getAggregatedNews } from './rss';
import { getAllArticles } from './mdx';
import type { NewsItem, LiveMatch, RankingsPayload, FifaRanking } from '@/types';

export async function getHomeNews(): Promise<NewsItem[]> {
  const [rssItems, articles] = await Promise.all([
    getAggregatedNews(),
    Promise.resolve(
      getAllArticles().map((a): NewsItem => ({
        id: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        url: `/news/${a.slug}`,
        imageUrl: a.imageUrl,
        source: 'ফুটবলবার্তা',
        tag: a.tag,
        publishedAt: a.publishedAt,
        isInternal: true,
        slug: a.slug,
      })),
    ),
  ]);
  return [...articles, ...rssItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export interface HomePageData {
  matches: LiveMatch[];
  news: NewsItem[];
  rankings: RankingsPayload;
  fifaRankings: FifaRanking[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const [matches, news, rankings, fifaRankings] = await Promise.all([
    fetchMatches({ tab: 'all' }),
    getHomeNews(),
    fetchRankings({}),
    fetchFifaRankings(),
  ]);
  return { matches, news, rankings, fifaRankings };
}
