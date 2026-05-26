'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NewsletterCTA from './NewsletterCTA';

export default function Footer() {
  const t      = useTranslations('footer');
  const tBrand = useTranslations('brand');

  const columns = [
    {
      title: t('colFootball'),
      links: [
        ['/matches',   t('matches')],
        ['/standings', t('standings')],
        ['/players',   t('players')],
        ['/teams',     t('teams')],
      ] as Array<[string, string]>,
    },
    {
      title: t('colTournaments'),
      links: [
        ['/world-cup', t('worldCup')],
        ['/matches',   t('fixtures')],
      ],
    },
    {
      title: t('colNews'),
      links: [
        ['/news',      t('latest')],
        ['/transfers', t('transfers')],
        ['/search',    t('search')],
      ],
    },
    {
      title: t('colSite'),
      links: [
        ['/about',     t('about')],
        ['/contact',   t('contact')],
        ['/privacy',   t('privacy')],
        ['/advertise', t('advertise')],
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 max-w-md mx-auto">
          <NewsletterCTA />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm uppercase tracking-widest text-white mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-800 pt-6">
          <div className="font-display text-xl text-white uppercase tracking-wide">
            {tBrand('namePart1')}<span className="text-yellow-400">{tBrand('namePart2')}</span>
          </div>
          <p className="text-xs text-gray-500">{t('tagline')}</p>
          <p className="text-xs">{t('copy')}</p>
        </div>
      </div>
    </footer>
  );
}
