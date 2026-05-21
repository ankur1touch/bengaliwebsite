import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import MobileNav from './MobileNav';

export default async function Header() {
  const tNav   = await getTranslations('nav');
  const tBrand = await getTranslations('brand');

  const NAV_LINKS = [
    { href: '/news',                     label: tNav('latest')        },
    { href: '/world-cup',                label: tNav('worldCup')      },
    { href: '/news?cat=premier-league',  label: tNav('premierLeague') },
    { href: '/news?cat=la-liga',         label: tNav('laLiga')        },
    { href: '/country/bangladesh',       label: tNav('bangladesh')    },
    { href: '/country/india',            label: tNav('india')         },
    { href: '/matches',                  label: tNav('matches')       },
    { href: '/standings',                label: tNav('standings')     },
  ];

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {tBrand('namePart1')}<span className="text-yellow-300">{tBrand('namePart2')}</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-yellow-300 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
