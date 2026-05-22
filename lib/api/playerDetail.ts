import axiosClient from '@/lib/client';
import type { PlayerDetailPayload } from '@/types';

export async function fetchPlayerDetailApi(id: string): Promise<PlayerDetailPayload> {
  const { data } = await axiosClient.post<PlayerDetailPayload>(`/api/players/${id}`);
  return data;
}
