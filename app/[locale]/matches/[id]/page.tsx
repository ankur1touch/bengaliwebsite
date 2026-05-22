import { getTranslations } from 'next-intl/server';
import MatchDetailClient from '@/components/matches/MatchDetailClient';

export const revalidate = 60;

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('matches');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <MatchDetailClient matchId={id} />
    </div>
  );
}
