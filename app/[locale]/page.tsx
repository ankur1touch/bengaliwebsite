import dynamic from 'next/dynamic';
import { getHomePageData } from '@/lib/homepage-data';
import HomeStoreProvider from '@/components/home/HomeStoreProvider';
import HeroSlider from '@/components/home/HeroSlider';
import MatchTickerStrip from '@/components/home/MatchTickerStrip';
import UpcomingMatchesStrip from '@/components/home/UpcomingMatchesStrip';
import HomeNewsClient from '@/components/home/HomeNewsClient';
import LiveScoresWidget from '@/components/sidebar/LiveScoresWidget';
import { Skeleton } from '@/components/ui/Skeleton';

export const revalidate = 300;

const TournamentsSection = dynamic(() => import('@/components/home/TournamentsSection'), {
  loading: () => <Skeleton className="h-48 rounded-2xl" />,
});

const FanZoneStrip = dynamic(() => import('@/components/home/FanZoneStrip'), {
  loading: () => <Skeleton className="h-52 rounded-2xl" />,
});

const WorldRankingsWidget = dynamic(() => import('@/components/home/WorldRankingsWidget'), {
  loading: () => <Skeleton className="h-72 rounded-2xl" />,
});

const HomeSidebarData = dynamic(() => import('@/components/sidebar/HomeSidebarData'), {
  loading: () => (
    <div className="space-y-6">
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  ),
});

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <HomeStoreProvider data={data}>
      <HeroSlider initialMatches={data.matches} initialNews={data.news} />
      <MatchTickerStrip />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingMatchesStrip />
            <HomeNewsClient />
            <TournamentsSection />
            <FanZoneStrip />
          </div>
          <aside className="space-y-6">
            <WorldRankingsWidget initialRankings={data.fifaRankings} />
            <LiveScoresWidget />
            <HomeSidebarData />
          </aside>
        </div>
      </div>
    </HomeStoreProvider>
  );
}
