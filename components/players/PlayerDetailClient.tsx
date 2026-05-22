'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlayerDetail } from '@/store/features/playerDetailSlice';
import MatchCardRow from '@/components/matches/MatchCardRow';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface Props { playerId: string; }

export default function PlayerDetailClient({ playerId }: Props) {
  const dispatch = useAppDispatch();
  const { detail, status, error } = useAppSelector((s) => s.playerDetail);
  const t = useTranslations('detail');
  const tPlayers = useTranslations('players');

  useEffect(() => {
    dispatch(fetchPlayerDetail(playerId));
  }, [dispatch, playerId]);

  if (status === 'loading' || status === 'idle') return <SkeletonList />;
  if (status === 'failed' || !detail) {
    return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchPlayerDetail(playerId))} />;
  }

  const { player, statistics, fixtures } = detail;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-6">
        {player.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.photo} alt={player.name} className="w-24 h-24 rounded-full object-cover border-4 border-green-100" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            {player.nationality && <span>{t('nationality')}: {player.nationality}</span>}
            {player.age && <span>{t('age')}: {player.age}</span>}
            {player.height && <span>{player.height}</span>}
          </div>
        </div>
      </div>

      {statistics.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-xs text-gray-500">
                <th className="py-2 px-4 text-left">{tPlayers('team')}</th>
                <th className="py-2 px-4 text-left">League</th>
                <th className="py-2 px-4 text-center">{t('appearances')}</th>
                <th className="py-2 px-4 text-center">{t('goals')}</th>
                <th className="py-2 px-4 text-center">{t('assists')}</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((s, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 px-4">
                    <Link href={`/teams/${s.teamId}`} className="flex items-center gap-2 hover:text-green-700">
                      {s.teamLogo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.teamLogo} alt="" className="w-5 h-5 object-contain" />
                      )}
                      {s.teamName}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-gray-600">{s.league}</td>
                  <td className="py-2 px-4 text-center">{s.appearances}</td>
                  <td className="py-2 px-4 text-center font-bold text-green-700">{s.goals}</td>
                  <td className="py-2 px-4 text-center">{s.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fixtures.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-800 border-l-4 border-green-600 pl-3 mb-3">{t('fixtures')}</h3>
          <div className="space-y-2">
            {fixtures.map((m) => <MatchCardRow key={m.id} match={m} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
