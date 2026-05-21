import { getTranslations } from 'next-intl/server';
import MatchesClient from '@/components/matches/MatchesClient';
export const revalidate = 60;
export default async function MatchesPage() {
  const t = await getTranslations('matches');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <MatchesClient />
    </div>
  );
}
