'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NewsletterCTA from './NewsletterCTA';

export default function Footer() {
  const t      = useTranslations('footer');
  const tBrand = useTranslations('brand');

  const links: Array<[string, string]> = [
    ['/about',     t('about')],
    ['/contact',   t('contact')],
    ['/privacy',   t('privacy')],
    ['/advertise', t('advertise')],
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 max-w-md mx-auto">
          <NewsletterCTA />
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-800 pt-6">
          <div className="text-white font-bold text-lg">
            {tBrand('namePart1')}<span className="text-yellow-400">{tBrand('namePart2')}</span>
          </div>
          <div className="flex gap-6 text-sm">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
          <p className="text-xs">{t('copy')}</p>
        </div>
      </div>
    </footer>
  );
}
