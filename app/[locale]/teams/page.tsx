import { getTranslations } from 'next-intl/server';
import TeamsPageClient from '@/components/teams/TeamsPageClient';

export const revalidate = 300;

export default async function TeamsPage() {
  const t = await getTranslations('teams');
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl uppercase tracking-wider text-gray-900 mb-6">{t('title')}</h1>
      <TeamsPageClient />
    </div>
  );
}
