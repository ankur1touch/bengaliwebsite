'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';

interface Props { links: { href: string; label: string }[]; }

export default function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);
  const locale          = useLocale() as 'bn' | 'en';
  const router          = useRouter();
  const pathname        = usePathname();
  const tLocale         = useTranslations('locale');

  const switchTo = (target: 'bn' | 'en') => {
    setOpen(false);
    if (target === locale) return;
    router.replace(pathname, { locale: target });
  };

  return (
    <div className="lg:hidden relative z-10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1 cursor-pointer"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-green-800 z-50 py-3 shadow-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-sm hover:bg-green-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-green-700 mt-2 pt-3 px-5 flex items-center gap-2">
            <span className="text-xs text-green-300 mr-1">{tLocale('label')}:</span>
            <button
              type="button"
              onClick={() => switchTo('bn')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                locale === 'bn' ? 'bg-yellow-400 text-green-900' : 'border border-white/40 text-white/90'
              }`}
            >
              {tLocale('bengali')}
            </button>
            <button
              type="button"
              onClick={() => switchTo('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                locale === 'en' ? 'bg-yellow-400 text-green-900' : 'border border-white/40 text-white/90'
              }`}
            >
              {tLocale('english')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
