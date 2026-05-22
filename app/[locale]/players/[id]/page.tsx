import { getTranslations } from 'next-intl/server';
import PlayerDetailClient from '@/components/players/PlayerDetailClient';

export const revalidate = 300;

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('players');
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">{t('title')}</h1>
      <PlayerDetailClient playerId={id} />
    </div>
  );
}
