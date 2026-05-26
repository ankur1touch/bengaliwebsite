import WcHeroBanner from '@/components/worldcup/WcHeroBanner';
import WcTrophySection from '@/components/worldcup/WcTrophySection';
import WcMascotSection from '@/components/worldcup/WcMascotSection';
import WcHostCities from '@/components/worldcup/WcHostCities';
import WcFixturesStrip from '@/components/worldcup/WcFixturesStrip';
import NewsListingClient from '@/components/news/NewsListingClient';

export const revalidate = 300;

export default function WorldCupPage() {
  return (
    <div>
      <WcHeroBanner />
      <WcTrophySection />
      <WcMascotSection />
      <WcHostCities />
      <WcFixturesStrip />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NewsListingClient initialFilter="world-cup" />
      </div>
    </div>
  );
}
