'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

const FOOTBALL_KEYWORDS =
  /football|soccer|goal|match|league|cup|fifa|uefa|premier|la liga|serie a|bundesliga|champions|transfer|manager|coach|squad|fixture|kick|striker|midfielder|defender|goalkeeper|penalty|ফুটবল|গোল|ম্যাচ|লিগ|কাপ|দল/i;

export default function BreakingTicker() {
  const t = useTranslations('ticker');
  const defaults = useMemo(
    () => [t('default1'), t('default2'), t('default3'), t('default4')],
    [t]
  );
  const [items, setItems] = useState<string[]>(defaults);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;
        const titles = (data as { title: string; tag?: string }[])
          .filter((n) => n.tag !== 'cricket' && FOOTBALL_KEYWORDS.test(n.title))
          .slice(0, 10)
          .map((n) => n.title);
        if (titles.length) setItems(titles);
      } catch {
        /* keep defaults */
      }
    };

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof window !== 'undefined' && typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        cancelled = true;
        if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      };
    }
    const timeout = setTimeout(run, 1500);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div
      className="bg-yellow-400 text-yellow-900 py-1.5 overflow-hidden relative"
      style={{ height: 32 }}
    >
      <div className="flex items-center h-full">
        <span className="shrink-0 font-bold text-[11px] uppercase bg-yellow-600 text-white px-2.5 py-0.5 rounded z-10 ml-3 mr-2">
          {t('label')}
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {doubled.map((item, i) => (
              <span key={i} className="text-sm font-medium px-6 shrink-0">
                {item}
                <span className="mx-3 opacity-50">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
