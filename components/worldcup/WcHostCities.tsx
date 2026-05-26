'use client';

import { useTranslations } from 'next-intl';
import wcData from '@/data/world-cup-2026.json';

export default function WcHostCities() {
  const t = useTranslations('worldcup');
  const { hostNations } = wcData;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-gray-900 mb-6">
        {t('hostVenues')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {hostNations.map((n) => (
          <div key={n.country} className="rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 text-center shadow-sm">
            <span className="text-5xl">{n.flag}</span>
            <h3 className="font-display text-2xl uppercase text-gray-900 mt-3">{n.country}</h3>
            <p className="text-sm text-gray-500 mt-1">{n.cities} {t('cities')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
