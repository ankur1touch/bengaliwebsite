'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import tournaments from '@/data/tournaments.json';
import Badge from '@/components/ui/Badge';

interface Tournament {
  id: string;
  title: string;
  status: string;
  date: string;
  hosts: string;
  teams: number;
  matches: number | null;
  href: string;
  image: string;
}

export default function TournamentsSection() {
  const t = useTranslations('tournaments');
  const items = tournaments as Tournament[];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-gray-800">
          {t('title')}
        </h2>
        <Link href="/world-cup" className="text-sm text-green-700 hover:underline font-medium uppercase tracking-wide">
          {t('seeAll')} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative rounded-2xl overflow-hidden h-48 bg-gray-900 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge
                label={item.status === 'upcoming' ? t('upcoming') : t('ongoing')}
                variant={item.status === 'upcoming' ? 'wc' : 'tournament'}
                className="mb-2"
              />
              <h3 className="font-display text-lg uppercase text-white leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-300 mt-1">{item.date} · {item.hosts}</p>
              {item.teams && (
                <p className="text-[10px] uppercase tracking-widest text-yellow-400 mt-2 font-medium">
                  {item.teams} {t('teams')}{item.matches ? ` · ${item.matches} ${t('matches')}` : ''}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
