/**
 * Server-only homepage data bundle — parallel fetch to cut client waterfalls.
 */
import { fetchMatches, fetchRankings, fetchFifaRankings } from './football-api';
import { getAggregatedNews } from './rss';
import { getAllArticlesAsync } from './articles';
import { filterArticlesByLocale, mapInternalArticle } from './news-locale';
import type { NewsItem, LiveMatch, RankingsPayload, FifaRanking } from '@/types';

export async function getHomeNews(locale = 'bn'): Promise<NewsItem[]> {
  const [rssItems, articles] = await Promise.all([
    getAggregatedNews(),
    getAllArticlesAsync(),
  ]);

  const internalItems = filterArticlesByLocale(articles, locale).map((a) =>
    mapInternalArticle(a, locale),
  );

  return [...internalItems, ...rssItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export interface HomePageData {
  matches: LiveMatch[];
  news: NewsItem[];
  rankings: RankingsPayload;
  fifaRankings: FifaRanking[];
}

export async function getHomePageData(locale = 'bn'): Promise<HomePageData> {
  const [matches, news, rankings, fifaRankings] = await Promise.all([
    fetchMatches({ tab: 'all' }),
    getHomeNews(locale),
    fetchRankings({}),
    fetchFifaRankings(),
  ]);
  return { matches, news, rankings, fifaRankings };
}
