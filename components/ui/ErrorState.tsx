'use client';
import { useTranslations } from 'next-intl';

interface Props { message?: string; onRetry?: () => void; }

export default function ErrorState({ message, onRetry }: Props) {
  const t = useTranslations('states');
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">{message ?? t('error')}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition-colors"
        >
          {t('retry')}
        </button>
      )}
    </div>
  );
}
