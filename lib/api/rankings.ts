import axiosClient from '@/lib/client';
import type { RankingsPayload } from '@/types';

export interface FetchRankingsParams {
  countryId?: string;
  leagueId?: number;
}

export async function fetchRankingsApi(params: FetchRankingsParams = {}): Promise<RankingsPayload> {
  const { data } = await axiosClient.post<RankingsPayload>('/api/rankings', params);
  return data;
}
