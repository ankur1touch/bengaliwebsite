export type NewsTag =
  | 'la-liga' | 'champions' | 'world-cup' | 'transfers'
  | 'national' | 'analysis' | 'premier-league' | 'bangladesh'
  | 'india' | 'cricket';

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface NewsItem {
  id:        string;
  title:     string;
  excerpt?:  string;
  url:       string;
  imageUrl?: string;
  source:    string;
  tag?:      NewsTag;
  publishedAt: string;
  isInternal: boolean;
  slug?:     string;
}

export interface Article {
  slug:        string;
  title:       string;
  excerpt:     string;
  content:     string;
  author:      string;
  publishedAt: string;
  imageUrl?:   string;
  tag:         NewsTag;
  tags:        string[];
  language?:   string;
  sourceUrl?:  string;
  sourceName?: string;
  articleId?:  string;
}
