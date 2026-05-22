import axiosClient from '@/lib/client';
import type { MatchDetailPayload } from '@/types';

export async function fetchMatchDetailApi(id: string): Promise<MatchDetailPayload> {
  const { data } = await axiosClient.post<MatchDetailPayload>(`/api/matches/${id}`);
  return data;
}
