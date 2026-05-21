import NewsListingClient from '@/components/news/NewsListingClient';
export const revalidate = 300;
export default function WorldCupPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">🏆 বিশ্বকাপ ২০২৬</h1>
        <p className="text-yellow-100 text-lg">USA · Canada · Mexico — ১১ জুন থেকে</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <NewsListingClient initialFilter="world-cup" />
      </div>
    </div>
  );
}
