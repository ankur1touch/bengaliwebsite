import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import TeamCrest from '@/components/ui/TeamCrest';
import type { LiveMatch } from '@/types';

function abbrev(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return parts.map((p) => p[0]).join('').slice(0, 3).toUpperCase();
}

function TickerItem({ m, locale }: { m: LiveMatch; locale: string }) {
  const isLive = m.status === 'LIVE';
  const timeLoc = locale === 'bn' ? 'bn-BD' : 'en-GB';
  const time = isLive
    ? `${m.homeScore ?? 0}–${m.awayScore ?? 0}`
    : new Date(m.utcDate).toLocaleTimeString(timeLoc, { hour: '2-digit', minute: '2-digit' });

  return (
    <Link
      href={`/matches/${m.id}`}
      className="flex items-center gap-2 shrink-0 px-4 py-2 hover:bg-white/5 transition-colors border-r border-white/10 last:border-0"
    >
      {m.homeCrest && <TeamCrest src={m.homeCrest} size={16} className="w-4 h-4" />}
      <span className="text-xs font-semibold text-gray-300">{abbrev(m.homeTeam)}</span>
      <span className={`text-xs font-bold tabular-nums ${isLive ? 'text-red-400' : 'text-yellow-400'}`}>
        {time}
      </span>
      <span className="text-xs font-semibold text-gray-300">{abbrev(m.awayTeam)}</span>
      {m.awayCrest && <TeamCrest src={m.awayCrest} size={16} className="w-4 h-4" />}
      {isLive && m.minute !== undefined && (
        <span className="text-[10px] text-red-400 font-bold">{m.minute}&apos;</span>
      )}
    </Link>
  );
}

export default async function MatchTickerStripServer({
  matches,
  locale,
}: {
  matches: LiveMatch[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'ticker' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const live = matches.filter((m) => m.status === 'LIVE').slice(0, 8);
  const upcoming = matches.filter((m) => m.status === 'SCHEDULED').slice(0, 12);
  const display = [...live, ...upcoming].slice(0, 16);

  if (!display.length) return null;

  return (
    <div className="bg-brand-navy border-b border-white/10">
      <div className="flex items-stretch max-w-full">
        <div className="hidden sm:flex items-center gap-2 px-4 bg-green-800/80 shrink-0 border-r border-white/10">
          <span className="text-yellow-400 text-sm">🏆</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-yellow-300 whitespace-nowrap">
            {tNav('worldCup')}
          </span>
        </div>
        <div className="flex-1 overflow-x-auto scrollbar-none flex items-center min-h-[44px]">
          {display.map((m) => (
            <TickerItem key={m.id} m={m} locale={locale} />
          ))}
        </div>
        <Link
          href="/matches"
          className="hidden md:flex items-center px-4 text-[10px] uppercase tracking-widest text-yellow-400 hover:text-yellow-300 shrink-0 border-l border-white/10 font-medium"
        >
          {t('label')} →
        </Link>
      </div>
    </div>
  );
}
