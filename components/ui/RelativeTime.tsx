'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { formatRelative } from '@/lib/dates';

export default function RelativeTime({ dateStr }: { dateStr: string }) {
  const locale = useLocale();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(formatRelative(dateStr, locale));
  }, [dateStr, locale]);

  return <span suppressHydrationWarning>{text ?? '\u00a0'}</span>;
}
