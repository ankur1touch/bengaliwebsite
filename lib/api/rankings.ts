import axiosClient from '@/lib/client';
import type { RankingsPayload } from '@/types';

export async function fetchRankingsApi(): Promise<RankingsPayload> {
  const { data } = await axiosClient.post<RankingsPayload>('/api/rankings');
  return data;
}
