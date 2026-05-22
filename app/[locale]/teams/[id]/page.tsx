import TeamDetailClient from '@/components/teams/TeamDetailClient';

export const revalidate = 300;

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <TeamDetailClient teamId={id} />
    </div>
  );
}
