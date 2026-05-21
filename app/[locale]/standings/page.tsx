import { getTranslations } from 'next-intl/server';
import StandingsClient from '@/components/matches/StandingsClient';
export const revalidate = 600;
export default async function StandingsPage() {
  const t = await getTranslations('standings');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <StandingsClient />
    </div>
  );
}
