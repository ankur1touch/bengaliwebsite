import axiosClient from '@/lib/client';
import type { LiveMatch } from '@/types';

export async function fetchMatchesApi(): Promise<LiveMatch[]> {
  const { data } = await axiosClient.post<LiveMatch[]>('/api/matches');
  return data;
}
