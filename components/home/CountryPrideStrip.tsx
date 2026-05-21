import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Props {
  countryId:  'bangladesh' | 'india';
  flag:       string;
  titleKey:   'bangladeshTitle'    | 'indiaTitle';
  subKey:     'bangladeshSubtitle' | 'indiaSubtitle';
  accent:     'green' | 'orange';
}

const accents = {
  green:  'from-green-700 via-green-600 to-green-500',
  orange: 'from-orange-600 via-orange-500 to-yellow-500',
};

export default function CountryPrideStrip({ countryId, flag, titleKey, subKey, accent }: Props) {
  const t = useTranslations('home');
  return (
    <Link
      href={`/country/${countryId}`}
      className={`block bg-gradient-to-r ${accents[accent]} text-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="text-5xl shrink-0">{flag}</div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate">{t(titleKey)}</h3>
            <p className="text-sm opacity-90 truncate">{t(subKey)}</p>
          </div>
        </div>
        <span className="text-sm font-medium opacity-90 hidden sm:inline">
          {t('viewMore')} →
        </span>
      </div>
    </Link>
  );
}
