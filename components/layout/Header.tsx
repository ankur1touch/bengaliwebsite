import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import MobileNav from './MobileNav';
import HeaderSearch from './HeaderSearch';

export default async function Header() {
  const tNav   = await getTranslations('nav');
  const tBrand = await getTranslations('brand');

  const NAV_LINKS = [
    { href: '/news',                     label: tNav('latest')        },
    { href: '/world-cup',                label: tNav('worldCup')      },
    { href: '/matches',                  label: tNav('matches')       },
    { href: '/standings',                label: tNav('standings')     },
    { href: '/teams',                    label: tNav('teams')         },
    { href: '/players',                  label: tNav('players')       },
    { href: '/transfers',                label: tNav('transfers')     },
  ];

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="font-display text-2xl tracking-wide uppercase">
            {tBrand('namePart1')}<span className="text-yellow-300">{tBrand('namePart2')}</span>
          </Link>
          <Link
            href="/world-cup"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-[10px] uppercase tracking-widest font-semibold text-yellow-300 hover:bg-yellow-400/25 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            WC 2026
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-widest font-medium hover:text-yellow-300 transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <HeaderSearch />
          <LocaleSwitcher />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
