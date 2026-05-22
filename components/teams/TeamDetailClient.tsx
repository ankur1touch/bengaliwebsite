'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTeamDetail } from '@/store/features/teamDetailSlice';
import MatchCardRow from '@/components/matches/MatchCardRow';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface Props { teamId: string; }

export default function TeamDetailClient({ teamId }: Props) {
  const dispatch = useAppDispatch();
  const { detail, status, error } = useAppSelector((s) => s.teamDetail);
  const t = useTranslations('detail');

  useEffect(() => {
    dispatch(fetchTeamDetail(teamId));
  }, [dispatch, teamId]);

  if (status === 'loading' || status === 'idle') return <SkeletonList />;
  if (status === 'failed' || !detail) {
    return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchTeamDetail(teamId))} />;
  }

  const { team, squad, fixtures, results, standing } = detail;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-6">
        {team.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
            {team.country && <span>{team.country}</span>}
            {team.founded && <span>{t('founded')}: {team.founded}</span>}
            {team.venue && <span>{t('venue')}: {team.venue}</span>}
          </div>
          {standing && (
            <p className="mt-2 text-sm text-green-700 font-medium">
              {t('position')}: #{standing.position} — {standing.points} pts
            </p>
          )}
        </div>
      </div>

      {squad.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-800 border-l-4 border-green-600 pl-3 mb-3">{t('squad')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {squad.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-3">
                {p.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                )}
                <div className="min-w-0">
                  {p.id ? (
                    <Link href={`/players/${p.id}`} className="font-medium text-sm text-gray-800 hover:text-green-700 truncate block">
                      {p.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                  )}
                  <p className="text-xs text-gray-400">{p.position}{p.number ? ` · #${p.number}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
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

      {results.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-800 border-l-4 border-green-600 pl-3 mb-3">{t('results')}</h3>
          <div className="space-y-2">
            {results.map((m) => <MatchCardRow key={m.id} match={m} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
