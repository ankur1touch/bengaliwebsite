'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatchDetail, clearMatchDetail } from '@/store/features/matchDetailSlice';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import MatchCardRow from './MatchCardRow';
import { SkeletonList } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface Props { matchId: string; }

function eventIcon(type: string, detail: string): string {
  if (type === 'Goal') return '⚽';
  if (type === 'Card') return detail.includes('Red') ? '🟥' : '🟨';
  if (type === 'subst') return '🔄';
  if (type === 'Var') return '📺';
  return '•';
}

export default function MatchDetailClient({ matchId }: Props) {
  const dispatch = useAppDispatch();
  const { detail, status, error } = useAppSelector((s) => s.matchDetail);
  const t = useTranslations('detail');
  const tM = useTranslations('matches');
  const [tab, setTab] = useState('events');

  useEffect(() => {
    dispatch(fetchMatchDetail(matchId));
    return () => { dispatch(clearMatchDetail()); };
  }, [dispatch, matchId]);

  // Poll live matches every 30s for fresh events / stats
  useEffect(() => {
    if (detail?.fixture.status !== 'LIVE') return;
    const timer = setInterval(() => {
      dispatch(fetchMatchDetail({ id: matchId, silent: true }));
    }, 30000);
    return () => clearInterval(timer);
  }, [dispatch, matchId, detail?.fixture.status]);

  if ((status === 'loading' || status === 'idle') && !detail) return <SkeletonList />;
  if (status === 'failed' && !detail) {
    return <ErrorState message={error ?? undefined} onRetry={() => dispatch(fetchMatchDetail(matchId))} />;
  }
  if (!detail) return <SkeletonList />;

  const { fixture, events, lineups, statistics, h2h } = detail;
  const isLive = fixture.status === 'LIVE';

  const tabs = [
    { id: 'events',  label: t('events') },
    { id: 'lineups', label: t('lineups') },
    { id: 'stats',   label: t('stats') },
    { id: 'h2h',     label: t('h2h') },
  ];

  return (
    <div className="space-y-6">
      {/* Header scoreboard */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-wide">{fixture.competition}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            {fixture.homeCrest && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fixture.homeCrest} alt="" className="w-14 h-14 mx-auto mb-2 object-contain" />
            )}
            <p className="font-bold text-gray-900">{fixture.homeTeam}</p>
          </div>
          <div className="text-center shrink-0">
            {fixture.homeScore !== undefined ? (
              <p className="text-3xl font-extrabold text-green-700 tabular-nums">
                {fixture.homeScore} – {fixture.awayScore}
              </p>
            ) : (
              <p className="text-xl font-bold text-gray-400">{tM('vs')}</p>
            )}
            <Badge
              label={isLive ? `🔴 ${fixture.minute}'` : fixture.status === 'FT' ? tM('ft') : tM('scheduled')}
              variant={isLive ? 'live' : 'muted'}
            />
          </div>
          <div className="flex-1 text-center">
            {fixture.awayCrest && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fixture.awayCrest} alt="" className="w-14 h-14 mx-auto mb-2 object-contain" />
            )}
            <p className="font-bold text-gray-900">{fixture.awayTeam}</p>
          </div>
        </div>
        {fixture.venue && <p className="text-xs text-gray-400 text-center mt-3">{fixture.venue}</p>}
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'events' && (
        <div className="bg-white rounded-lg border border-gray-100 divide-y">
          {events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {isLive ? t('noEventsLive') : t('noEvents')}
            </p>
          ) : events.map((e, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className="text-gray-400 w-8 shrink-0">{e.time}&apos;</span>
              <span className={`font-medium ${e.team === 'home' ? 'text-green-700' : 'text-blue-700'}`}>
                {eventIcon(e.type, e.detail)}
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  {e.player ?? e.detail}
                  {e.detail && e.player && e.type !== 'Goal' && (
                    <span className="text-gray-400 font-normal ml-1">({e.detail})</span>
                  )}
                </p>
                {e.assist && <p className="text-xs text-gray-400">{t('assist')}: {e.assist}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'lineups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineups.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 col-span-2">
              {isLive ? t('noLineupsLive') : t('noLineups')}
            </p>
          ) : lineups.map((l) => (
            <div key={l.teamId} className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                {l.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.logo} alt="" className="w-6 h-6 object-contain" />
                )}
                <h3 className="font-bold text-sm text-gray-800">{l.teamName}</h3>
                {l.formation && <span className="text-xs text-gray-400 ml-auto">{l.formation}</span>}
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-2">{t('starters')}</p>
              <ul className="space-y-1 mb-3">
                {l.startXI.map((p) => (
                  <li key={p.id} className="text-xs text-gray-700 flex gap-2">
                    <span className="text-gray-400 w-5">{p.number}</span>{p.name}
                  </li>
                ))}
              </ul>
              {l.subs.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-500 mb-2">{t('subs')}</p>
                  <ul className="space-y-1">
                    {l.subs.map((p) => (
                      <li key={p.id} className="text-xs text-gray-500 flex gap-2">
                        <span className="text-gray-400 w-5">{p.number}</span>{p.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'stats' && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {statistics.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {isLive ? t('noStatsLive') : t('noStats')}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-2 px-4 text-right font-bold text-green-700 w-1/4">{fixture.homeTeam}</th>
                  <th className="py-2 px-4 text-center text-gray-400 w-1/2"></th>
                  <th className="py-2 px-4 text-left font-bold text-blue-700 w-1/4">{fixture.awayTeam}</th>
                </tr>
              </thead>
              <tbody>
                {statistics.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 px-4 text-right font-semibold text-gray-800">{s.home ?? '–'}</td>
                    <td className="py-2 px-4 text-center text-xs text-gray-500">{s.type}</td>
                    <td className="py-2 px-4 text-left font-semibold text-gray-800">{s.away ?? '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'h2h' && (
        <div className="space-y-2">
          {h2h.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('noH2h')}</p>
          ) : h2h.map((m) => <MatchCardRow key={m.id} match={m} compact />)}
        </div>
      )}
    </div>
  );
}
