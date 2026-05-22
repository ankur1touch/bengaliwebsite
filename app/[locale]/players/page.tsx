import { getTranslations } from 'next-intl/server';
import TopScorersPageClient from '@/components/players/TopScorersPageClient';

export const revalidate = 600;

export default async function PlayersPage() {
  const t = await getTranslations('players');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <TopScorersPageClient />
    </div>
  );
}
