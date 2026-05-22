import axiosClient from '@/lib/client';
import type { TeamDetailPayload } from '@/types';

export async function fetchTeamDetailApi(id: string): Promise<TeamDetailPayload> {
  const { data } = await axiosClient.post<TeamDetailPayload>(`/api/teams/${id}`);
  return data;
}
