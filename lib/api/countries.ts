import axiosClient from '@/lib/client';
import type { Country } from '@/types';

export async function fetchCountriesApi(): Promise<Country[]> {
  const { data } = await axiosClient.post<Country[]>('/api/countries');
  return data;
}
