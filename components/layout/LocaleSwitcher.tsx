'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LocaleSwitcher() {
  const locale   = useLocale() as 'bn' | 'en';
  const router   = useRouter();
  const pathname = usePathname();

  const switchTo = (target: 'bn' | 'en') => {
    if (target === locale) return;
    router.replace(pathname, { locale: target });
  };

  return (
    <div
      className="flex items-center rounded-full border border-white/50 overflow-hidden text-xs font-bold shrink-0 relative z-10"
      role="group"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => switchTo('bn')}
        aria-pressed={locale === 'bn'}
        aria-label="Switch to Bengali"
        className={`px-3 py-1.5 transition-colors cursor-pointer ${
          locale === 'bn'
            ? 'bg-yellow-400 text-green-900'
            : 'text-white/90 hover:bg-white/15'
        }`}
      >
        বাং
      </button>
      <span className="w-px self-stretch bg-white/30" aria-hidden="true" />
      <button
        type="button"
        onClick={() => switchTo('en')}
        aria-pressed={locale === 'en'}
        aria-label="Switch to English"
        className={`px-3 py-1.5 transition-colors cursor-pointer ${
          locale === 'en'
            ? 'bg-yellow-400 text-green-900'
            : 'text-white/90 hover:bg-white/15'
        }`}
      >
        EN
      </button>
    </div>
  );
}
