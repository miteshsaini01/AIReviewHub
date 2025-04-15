import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const RewardsSection = () => {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-primary to-primary-700 rounded-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-primary-500 opacity-30 -skew-x-12 transform translate-x-1/4"></div>
        <div className="relative px-6 py-10 md:p-10 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">Earn Rewards for Your Reviews</h2>
          <p className="mt-4 text-primary-100">Share your experiences with AI models and earn points that can be redeemed for exclusive rewards, discounts, and special offers.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <RewardItem 
              icon="ri-quill-pen-line" 
              title="Write Reviews" 
              points="50 points per review" 
            />
            <RewardItem 
              icon="ri-image-add-line" 
              title="Add Media" 
              points="+20 points for photos/videos" 
            />
            <RewardItem 
              icon="ri-award-line" 
              title="Get Upvotes" 
              points="+5 points per upvote" 
            />
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/rewards">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-neutral-100">
                Explore Rewards
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-primary-600">
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface RewardItemProps {
  icon: string;
  title: string;
  points: string;
}

const RewardItem = ({ icon, title, points }: RewardItemProps) => {
  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
      <div className="text-accent-500 mb-2">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <h3 className="text-white font-bold">{title}</h3>
      <p className="text-sm text-primary-100 mt-1">{points}</p>
    </div>
  );
};

export default RewardsSection;
