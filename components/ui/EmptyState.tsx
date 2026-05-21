'use client';
import { useTranslations } from 'next-intl';

export default function EmptyState({ message }: { message?: string }) {
  const t = useTranslations('states');
  return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">⚽</p>
      <p className="text-gray-500">{message ?? t('empty')}</p>
    </div>
  );
}
