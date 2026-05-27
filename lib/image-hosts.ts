/** Host patterns allowed for next/image — keep in sync with next.config.mjs */
export const REMOTE_IMAGE_HOST_PATTERNS = [
  '**.90min.com',
  '**.minutemediacdn.com',
  '**.bbc.com',
  '**.bbc.co.uk',
  '**.bbci.co.uk',
  'ichef.bbci.co.uk',
  '**.guim.co.uk',
  'i.guim.co.uk',
  '**.espncdn.com',
  'a.espncdn.com',
  '**.skysports.com',
  '**.365dm.com',
  'crests.football-data.org',
  'media.api-sports.io',
  'images.unsplash.com',
  'i.imgur.com',
] as const;

function matchHost(hostname: string, pattern: string): boolean {
  if (pattern.startsWith('**.')) {
    const suffix = pattern.slice(3);
    return hostname === suffix || hostname.endsWith(`.${suffix}`);
  }
  return hostname === pattern;
}

export function isNextImageHost(src: string): boolean {
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    return REMOTE_IMAGE_HOST_PATTERNS.some((pattern) => matchHost(hostname, pattern));
  } catch {
    return false;
  }
}
