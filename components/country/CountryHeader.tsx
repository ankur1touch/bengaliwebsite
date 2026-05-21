import type { Country } from '@/types';
export default function CountryHeader({ country }: { country: Country }) {
  return (
    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-10 px-4 text-center">
      <div className="text-5xl mb-3">{country.flag}</div>
      <h1 className="text-3xl font-bold mb-1">{country.nameBn}</h1>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {country.leagues.map((l) => (
          <span key={l} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{l}</span>
        ))}
      </div>
      <p className="mt-3 text-green-200 text-sm max-w-xl mx-auto">{country.description}</p>
    </div>
  );
}
