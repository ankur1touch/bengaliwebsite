'use client';

import { useTranslations } from 'next-intl';
import wcData from '@/data/world-cup-2026.json';

export default function WcMascotSection() {
  const t = useTranslations('worldcup');
  const { mascot } = wcData;

  return (
    <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8">
        <div className="text-8xl shrink-0">{mascot.emoji}</div>
        <div>
          <p className="text-xs uppercase tracking-widest text-yellow-400 mb-2">{t('officialMascot')}</p>
          <h2 className="font-display text-4xl uppercase tracking-wide">{mascot.name}</h2>
          <p className="text-green-100 mt-3 max-w-xl leading-relaxed">{mascot.description}</p>
        </div>
      </div>
    </section>
  );
}
