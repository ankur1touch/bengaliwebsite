/**
 * CMS proxy client — SERVER ONLY. Never import in 'use client' files.
 * API key is mapped on the proxy server; no key in this repo.
 */

const PRIMARY   = process.env.FOOTBALL_API_BASE_URL ?? 'https://api.labenditaec.com/api/football';
const ALTERNATE = 'https://api.pase-y-gol.com/api/football';

export interface CmsFetchOptions {
  revalidate?: number;
  useAlternate?: boolean;
}

export function extractResponse<T>(payload: unknown): T[] {
  if (!payload || typeof payload !== 'object') return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.response)) return p.response as T[];
  if (Array.isArray(p.data))     return p.data as T[];
  if (Array.isArray(payload))    return payload as T[];
  return [];
}

export async function cmsFetch<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: CmsFetchOptions = {},
): Promise<T | null> {
  const base = options.useAlternate ? ALTERNATE : PRIMARY;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = `${base}${path}${qs ? `?${qs}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: options.revalidate ?? 60 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      if (!options.useAlternate) {
        return cmsFetch<T>(path, params, { ...options, useAlternate: true });
      }
      return null;
    }
    return (await res.json()) as T;
  } catch {
    if (!options.useAlternate) {
      return cmsFetch<T>(path, params, { ...options, useAlternate: true });
    }
    return null;
  }
}
