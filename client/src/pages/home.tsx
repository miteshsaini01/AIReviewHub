import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import RecentReviewsSection from "@/components/home/RecentReviewsSection";
import NewsSection from "@/components/home/NewsSection";
import RewardsSection from "@/components/home/RewardsSection";
import CallToAction from "@/components/home/CallToAction";

const Home = () => {
  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <HeroSection />
        <StatsSection />
        <LeaderboardSection />
        <RecentReviewsSection />
        <NewsSection />
        <RewardsSection />
        <CallToAction />
      </div>
    </div>
  );
};

export default Home;
