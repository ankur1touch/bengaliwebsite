import { notFound } from 'next/navigation';
import countries from '@/data/countries.json';
import CountryHeader from '@/components/country/CountryHeader';
import CountryNewsClient from '@/components/country/CountryNewsClient';
import type { Country } from '@/types';

export async function generateStaticParams() {
  return (countries as Country[]).flatMap((c) => [
    { locale: 'bn', id: c.id },
    { locale: 'en', id: c.id },
  ]);
}

export default async function CountryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const country = (countries as Country[]).find((c) => c.id === id);
  if (!country) notFound();
  return (
    <div>
      <CountryHeader country={country} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <CountryNewsClient countryId={country.id} />
      </div>
    </div>
  );
}
