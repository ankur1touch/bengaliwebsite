import HomeNewsClient from '@/components/home/HomeNewsClient';
import MatchOfDay from '@/components/home/MatchOfDay';
import UpcomingMatchesStrip from '@/components/home/UpcomingMatchesStrip';
import LiveScoresWidget from '@/components/sidebar/LiveScoresWidget';
import HomeSidebarData from '@/components/sidebar/HomeSidebarData';

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MatchOfDay />
          <UpcomingMatchesStrip />
          <HomeNewsClient />
        </div>
        <aside className="space-y-6">
          <LiveScoresWidget />
          <HomeSidebarData />
        </aside>
      </div>
    </div>
  );
}
