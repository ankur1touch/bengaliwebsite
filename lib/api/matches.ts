import axiosClient from '@/lib/client';
import type { LiveMatch } from '@/types';

export interface FetchMatchesParams {
  tab?: 'live' | 'upcoming' | 'results' | 'all';
  countryId?: string;
}

export async function fetchMatchesApi(params: FetchMatchesParams = {}): Promise<LiveMatch[]> {
  const { data } = await axiosClient.post<LiveMatch[]>('/api/matches', params);
  return data;
}
