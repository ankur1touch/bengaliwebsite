import axiosClient from '@/lib/client';
import type { NewsItem } from '@/types';

export async function fetchNewsApi(category?: string): Promise<NewsItem[]> {
  const { data } = await axiosClient.post<NewsItem[]>('/api/news', { category });
  return data;
}

export async function fetchNewsByCountryApi(countryId: string): Promise<NewsItem[]> {
  const { data } = await axiosClient.post<NewsItem[]>(`/api/country/${countryId}`);
  return data;
}
