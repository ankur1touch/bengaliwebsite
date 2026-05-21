import HomeNewsClient from '@/components/home/HomeNewsClient';
import MatchOfDay from '@/components/home/MatchOfDay';
import UpcomingMatchesStrip from '@/components/home/UpcomingMatchesStrip';
import CountryPrideStrip from '@/components/home/CountryPrideStrip';
import LiveScoresWidget from '@/components/sidebar/LiveScoresWidget';
import StandingsTable from '@/components/sidebar/StandingsTable';
import TopScorersWidget from '@/components/sidebar/TopScorersWidget';

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MatchOfDay />
          <UpcomingMatchesStrip />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CountryPrideStrip
              countryId="bangladesh"
              flag="🇧🇩"
              titleKey="bangladeshTitle"
              subKey="bangladeshSubtitle"
              accent="green"
            />
            <CountryPrideStrip
              countryId="india"
              flag="🇮🇳"
              titleKey="indiaTitle"
              subKey="indiaSubtitle"
              accent="orange"
            />
          </div>
          <HomeNewsClient />
        </div>
        <aside className="space-y-6">
          <LiveScoresWidget />
          <StandingsTable />
          <TopScorersWidget />
        </aside>
      </div>
    </div>
  );
}
