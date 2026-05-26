'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import axiosClient from '@/lib/client';
import type { SearchResult } from '@/types';
import NewsCard from '@/components/home/NewsCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import Tabs from '@/components/ui/Tabs';

type TabId = 'all' | 'news' | 'matches' | 'players' | 'teams';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const t = useTranslations('search');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>('all');

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    axiosClient.post<SearchResult>('/api/search', { q })
      .then(({ data }) => setResults(data))
      .catch(() => setResults({ news: [], matches: [], players: [], teams: [] }))
      .finally(() => setLoading(false));
  }, [q]);

  const tabs = [
    { id: 'all',     label: t('tabAll') },
    { id: 'news',    label: t('tabNews') },
    { id: 'matches', label: t('tabMatches') },
    { id: 'players', label: t('tabPlayers') },
    { id: 'teams',   label: t('tabTeams') },
  ];

  if (!q.trim()) {
    return <p className="text-gray-500 text-center py-12">{t('hint')}</p>;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!results) return null;

  const total = results.news.length + results.matches.length + results.players.length + results.teams.length;

  if (!total) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 font-medium">{t('noResults')}</p>
        <p className="text-sm text-gray-400 mt-2">{t('hint')}</p>
      </div>
    );
  }

  const showNews    = tab === 'all' || tab === 'news';
  const showMatches = tab === 'all' || tab === 'matches';
  const showPlayers = tab === 'all' || tab === 'players';
  const showTeams   = tab === 'all' || tab === 'teams';

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {t('for')} &ldquo;{q}&rdquo; — {total} {t('results')}
      </p>
      <Tabs tabs={tabs} active={tab} onChange={(id) => setTab(id as TabId)} />

      {showNews && results.news.length > 0 && (
        <section className="mb-8">
          {tab === 'all' && <h2 className="font-display text-lg uppercase tracking-wider text-gray-800 mb-3">{t('tabNews')}</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.news.map((item) => (
              <NewsCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.title,
                  url: item.url,
                  source: item.source,
                  tag: item.tag as import('@/types').NewsTag | undefined,
                  publishedAt: new Date().toISOString(),
                  isInternal: !!item.slug,
                  slug: item.slug,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {showMatches && results.matches.length > 0 && (
        <section className="mb-8">
          {tab === 'all' && <h2 className="font-display text-lg uppercase tracking-wider text-gray-800 mb-3">{t('tabMatches')}</h2>}
          <div className="space-y-2">
            {results.matches.map((m) => (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className="block p-4 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-sm transition-all"
              >
                <p className="text-xs text-gray-400 uppercase tracking-wide">{m.competition}</p>
                <p className="font-semibold text-gray-800 mt-1">{m.homeTeam} vs {m.awayTeam}</p>
                <p className="text-xs text-green-700 mt-1">{m.status}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showPlayers && results.players.length > 0 && (
        <section className="mb-8">
          {tab === 'all' && <h2 className="font-display text-lg uppercase tracking-wider text-gray-800 mb-3">{t('tabPlayers')}</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.players.map((p) => (
              <Link
                key={p.id}
                href={`/players/${p.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-green-200 transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.team}</p>
                </div>
                <span className="font-display text-lg text-green-700">{p.goals}G</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showTeams && results.teams.length > 0 && (
        <section className="mb-8">
          {tab === 'all' && <h2 className="font-display text-lg uppercase tracking-wider text-gray-800 mb-3">{t('tabTeams')}</h2>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="p-4 rounded-xl border border-gray-100 bg-white hover:border-green-200 text-center font-semibold text-gray-800 transition-all"
              >
                {team.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
