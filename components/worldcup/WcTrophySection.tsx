'use client';

import { useTranslations } from 'next-intl';
import wcData from '@/data/world-cup-2026.json';

export default function WcTrophySection() {
  const t = useTranslations('worldcup');
  const { trophy, champions } = wcData;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-yellow-600 font-semibold mb-2">🏆 {t('trophyLabel')}</p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-gray-900 leading-tight">
            {t('trophyTitle')}
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">{trophy.description}</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              [trophy.material, t('goldTrophy')],
              [trophy.weight, t('kilograms')],
              [trophy.height, t('cmTall')],
            ].map(([val, label]) => (
              <div key={label} className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                <p className="font-display text-xl text-green-800">{val}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">{t('previousChampions')}</p>
          <div className="flex flex-wrap gap-3">
            {champions.map((c) => (
              <div key={c.country} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium text-gray-800 text-sm">{c.country}</span>
                <span className="text-xs text-yellow-600 font-bold">×{c.titles}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
