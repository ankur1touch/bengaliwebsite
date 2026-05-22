'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function NewsletterCTA() {
  const t = useTranslations('newsletter');
  return (
    <div className="bg-green-800 rounded-lg p-5 text-center text-white">
      <h3 className="font-bold text-lg mb-1">{t('title')}</h3>
      <p className="text-sm text-green-200 mb-4">{t('subtitle')}</p>
      <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
        {t('cta')}
      </Button>
      <p className="text-[10px] text-green-300 mt-3">{t('note')}</p>
    </div>
  );
}
