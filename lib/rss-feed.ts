import { getAllArticlesAsync } from './articles';

export async function generateSiteFeed(siteUrl: string): Promise<string> {
  const articles = (await getAllArticlesAsync()).slice(0, 20);
  const items = articles.map((a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/news/${a.slug}</link>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid>${siteUrl}/news/${a.slug}</guid>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ফুটবলবার্তা</title>
    <link>${siteUrl}</link>
    <description>বাংলায় ফুটবলের সর্বশেষ খবর</description>
    <language>bn</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
