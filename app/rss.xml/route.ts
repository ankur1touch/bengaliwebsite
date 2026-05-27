import { generateSiteFeed } from '@/lib/rss-feed';
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://footballbarta.vercel.app';
  return new Response(await generateSiteFeed(siteUrl), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
