'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations('search');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="hidden md:flex items-center relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="w-40 lg:w-52 pl-3 pr-8 py-1.5 rounded-full text-sm text-gray-800 bg-white/90 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label={t('placeholder')}
      />
      <button type="submit" className="absolute right-2 text-green-700 hover:text-green-900" aria-label="Search">
        <Search size={16} />
      </button>
    </form>
  );
}
