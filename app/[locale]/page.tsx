import dynamic from 'next/dynamic';
import { getHomePageData } from '@/lib/homepage-data';
import MatchTickerStripServer from '@/components/home/MatchTickerStripServer';
import UpcomingMatchesStripServer from '@/components/home/UpcomingMatchesStripServer';
import HomeNewsGrid from '@/components/home/HomeNewsGrid';
import LiveScoresWidgetServer from '@/components/sidebar/LiveScoresWidgetServer';
import { Skeleton } from '@/components/ui/Skeleton';

export const revalidate = 300;

const HeroSlider = dynamic(() => import('@/components/home/HeroSlider'), {
  loading: () => (
    <section
      className="relative w-full overflow-hidden bg-brand-navy min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] animate-pulse"
      aria-hidden
    />
  ),
});

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getHomePageData(locale);

  return (
    <>
      <HeroSlider initialMatches={data.matches} initialNews={data.news} />
      <MatchTickerStripServer matches={data.matches} locale={locale} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingMatchesStripServer matches={data.matches} locale={locale} />
            <HomeNewsGrid news={data.news} locale={locale} />
            <TournamentsSection />
            <FanZoneStrip />
          </div>
          <aside className="space-y-6">
            <WorldRankingsWidget initialRankings={data.fifaRankings} />
            <LiveScoresWidgetServer matches={data.matches} locale={locale} />
            <HomeSidebarData rankings={data.rankings} />
          </aside>
        </div>
      </div>
    </>
  );
}
