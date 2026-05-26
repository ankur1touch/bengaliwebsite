'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import wcData from '@/data/world-cup-2026.json';

const KICKOFF = new Date(wcData.kickoff);

function useCountdown(target: Date) {
  const [parts, setParts] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const totalSec = Math.floor(diff / 1000);
      setParts({
        days:  Math.floor(totalSec / 86400),
        hours: Math.floor((totalSec % 86400) / 3600),
        mins:  Math.floor((totalSec % 3600) / 60),
        secs:  totalSec % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return parts;
}

export default function WcHeroBanner() {
  const t = useTranslations('worldcup');
  const cd = useCountdown(KICKOFF);

  return (
    <div className="relative bg-brand-navy text-white py-16 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="relative max-w-7xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-yellow-400 mb-3">{t('badge')}</p>
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-wide">
          {t('title')} <span className="text-yellow-400">2026</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">{t('subtitle')}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            [cd.days, t('days')],
            [cd.hours, t('hours')],
            [cd.mins, t('mins')],
            [cd.secs, t('secs')],
          ].map(([val, label]) => (
            <div key={String(label)} className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 min-w-[4rem]">
              <p className="font-display text-3xl text-yellow-400 tabular-nums">{String(val).padStart(2, '0')}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <Link href="/matches" className="inline-block mt-8">
          <Button variant="primary" size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 border-0">
            {t('viewFixtures')} →
          </Button>
        </Link>
      </div>
    </div>
  );
}
