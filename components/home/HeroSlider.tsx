'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import TeamCrest from '@/components/ui/TeamCrest';
import { HERO_MATCH_IMG, HERO_WC_IMG } from '@/lib/hero-images';
import type { LiveMatch, NewsItem } from '@/types';
import { MAJOR_LEAGUE_IDS } from '@/lib/football-endpoints';

const WC_KICKOFF = new Date('2026-06-11T19:00:00Z');
const SLIDE_COUNT = 3;
const AUTO_MS = 6000;

function pickMatchOfDay(matches: LiveMatch[]): LiveMatch | null {
  const live = matches.filter((m) => m.status === 'LIVE');
  const majorLive = live.find((m) => m.leagueId && MAJOR_LEAGUE_IDS.has(m.leagueId));
  if (majorLive) return majorLive;
  if (live.length) return live[0];
  const upcoming = matches.find((m) => m.status === 'SCHEDULED');
  if (upcoming) return upcoming;
  return matches[0] ?? null;
}

const CountdownBox = memo(function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[4.5rem] sm:min-w-[5.5rem] px-3 py-3 sm:px-4 sm:py-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
      <span className="font-display text-3xl sm:text-4xl lg:text-5xl text-yellow-400 tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-1.5 font-medium">
        {label}
      </span>
    </div>
  );
});

const HeroCountdown = memo(function HeroCountdown({
  labels,
}: {
  labels: { days: string; hours: string; mins: string; secs: string };
}) {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = Math.max(0, WC_KICKOFF.getTime() - Date.now());
      const totalSec = Math.floor(diff / 1000);
      setParts({
        days: Math.floor(totalSec / 86400),
        hours: Math.floor((totalSec % 86400) / 3600),
        mins: Math.floor((totalSec % 3600) / 60),
        secs: totalSec % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const display = mounted ? parts : { days: 0, hours: 0, mins: 0, secs: 0 };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-8" suppressHydrationWarning>
      <CountdownBox value={display.days} label={labels.days} />
      <span className="hidden sm:flex items-center text-yellow-400/60 font-display text-2xl pb-6">:</span>
      <CountdownBox value={display.hours} label={labels.hours} />
      <span className="hidden sm:flex items-center text-yellow-400/60 font-display text-2xl pb-6">:</span>
      <CountdownBox value={display.mins} label={labels.mins} />
      <span className="hidden sm:flex items-center text-yellow-400/60 font-display text-2xl pb-6">:</span>
      <CountdownBox value={display.secs} label={labels.secs} />
    </div>
  );
});

interface HeroSliderProps {
  initialMatches: LiveMatch[];
  initialNews: NewsItem[];
}

export default function HeroSlider({ initialMatches, initialNews }: HeroSliderProps) {
  const t = useTranslations('home');
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState({ 1: false, 2: false });

  const match = pickMatchOfDay(initialMatches);
  const topStory = initialNews[0];
  const isLive = match?.status === 'LIVE';

  const next = useCallback(() => setActive((i) => (i + 1) % SLIDE_COUNT), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT), []);

  useEffect(() => {
    if (active === 1 || active === 2) {
      setVisited((v) => (v[active] ? v : { ...v, [active]: true }));
    }
  }, [active]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (id) clearInterval(id);
      id = setInterval(next, AUTO_MS);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [next]);

  const countdownLabels = {
    days: t('heroDays'),
    hours: t('heroHours'),
    mins: t('heroMins'),
    secs: t('heroSecs'),
  };

  const slideClass = (index: number) =>
    `absolute inset-0 transition-opacity duration-700 ${
      active === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
    }`;

  return (
    <section className="relative w-full overflow-hidden bg-brand-navy">
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
        <div className={slideClass(0)}>
          <Image
            src={HERO_WC_IMG}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={65}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 hero-gradient opacity-90" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center py-16 sm:py-20">
            <Badge label={t('heroWcBadge')} variant="wc" className="mb-4 w-fit" />
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-white uppercase leading-none tracking-wide">
              {t('heroWcTitle')}{' '}
              <span className="text-yellow-400">{t('heroWcYear')}</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
              {t('heroWcDesc')}
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-8 mb-3 font-medium">
              {t('heroCountdownLabel')}
            </p>
            <HeroCountdown labels={countdownLabels} />
            <Link href="/world-cup">
              <Button variant="primary" size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 border-0">
                {t('heroExploreWc')} →
              </Button>
            </Link>
          </div>
        </div>

        {(active === 1 || visited[1]) && (
          <div className={slideClass(1)}>
            <Image
              src={HERO_MATCH_IMG}
              alt=""
              fill
              sizes="100vw"
              quality={65}
              loading="lazy"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-900/85 to-green-800/70" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center py-16 sm:py-20">
              {match ? (
                <Link href={`/matches/${match.id}`} className="group block max-w-2xl animate-fadeIn">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-display text-sm uppercase tracking-widest text-yellow-300">
                      {t('matchOfDay')}
                    </span>
                    {isLive && <Badge label={t('live')} variant="live" />}
                  </div>
                  <p className="text-xs uppercase tracking-widest text-green-200/80 mb-6">{match.competition}</p>
                  <div className="flex items-center gap-6 sm:gap-10">
                    <div className="flex-1 text-center">
                      {match.homeCrest && (
                        <TeamCrest
                          src={match.homeCrest}
                          size={80}
                          className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 drop-shadow-lg"
                        />
                      )}
                      <p className="font-display text-lg sm:text-2xl text-white uppercase truncate">{match.homeTeam}</p>
                    </div>
                    <div className="text-center shrink-0">
                      {match.homeScore !== undefined ? (
                        <p className="font-display text-4xl sm:text-6xl text-white tabular-nums">
                          {match.homeScore}<span className="text-yellow-400 mx-1">–</span>{match.awayScore}
                        </p>
                      ) : (
                        <p className="font-display text-3xl text-yellow-400">{t('vs')}</p>
                      )}
                      {isLive && match.minute !== undefined && (
                        <p className="text-sm text-yellow-300 mt-2 font-medium">{match.minute}&apos;</p>
                      )}
                    </div>
                    <div className="flex-1 text-center">
                      {match.awayCrest && (
                        <TeamCrest
                          src={match.awayCrest}
                          size={80}
                          className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 drop-shadow-lg"
                        />
                      )}
                      <p className="font-display text-lg sm:text-2xl text-white uppercase truncate">{match.awayTeam}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="h-40 rounded-xl bg-white/10 animate-pulse max-w-xl" />
              )}
            </div>
          </div>
        )}

        {(active === 2 || visited[2]) && (
          <div className={slideClass(2)}>
            {topStory?.imageUrl ? (
              <SafeImage
                src={topStory.imageUrl}
                alt=""
                fill
                sizes="100vw"
                quality={70}
                loading="lazy"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-20 sm:pb-24 pt-16">
              {topStory ? (
                <div className="max-w-3xl animate-fadeIn">
                  <Badge label={t('heroTopStory')} variant="tournament" className="mb-4 w-fit" />
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white uppercase leading-tight line-clamp-3">
                    {topStory.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-3">{topStory.source}</p>
                  {topStory.isInternal && topStory.slug ? (
                    <Link href={`/news/${topStory.slug}`} className="inline-block mt-6">
                      <Button variant="primary" size="lg">{t('heroReadStory')} →</Button>
                    </Link>
                  ) : (
                    <a href={topStory.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-6">
                      <Button variant="primary" size="lg">{t('heroReadStory')} →</Button>
                    </a>
                  )}
                </div>
              ) : (
                <div className="h-32 rounded-xl bg-white/10 animate-pulse max-w-2xl" />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-4 sm:left-6 z-20 flex gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              active === i ? 'w-8 bg-yellow-400' : 'w-4 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-4 sm:right-6 z-20 flex gap-1">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="p-2.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-6 right-4 sm:right-6 z-20 font-display text-4xl sm:text-5xl text-white/20 tabular-nums">
        {String(active + 1).padStart(2, '0')}
      </div>
    </section>
  );
}
