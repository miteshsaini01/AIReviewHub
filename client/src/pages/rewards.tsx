import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRewards } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Rewards = () => {
  const { toast } = useToast();
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['/api/rewards'],
    queryFn: () => fetchRewards()
  });
  
  // Mock user data (in a real app, this would come from authentication)
  const currentUserPoints = 620;
  
  const [activeTab, setActiveTab] = useState<string>("available");
  
  const redeemReward = (rewardId: number, pointsCost: number) => {
    if (currentUserPoints < pointsCost) {
      toast({
        title: "Not enough points",
        description: `You need ${pointsCost - currentUserPoints} more points to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reward redeemed!",
      description: "Your reward has been redeemed successfully.",
    });
  };

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary-700 rounded-xl overflow-hidden relative mb-10">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-primary-500 opacity-30 -skew-x-12 transform translate-x-1/4"></div>
          <div className="relative px-6 py-10 md:p-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-white font-heading mb-4">Rewards Program</h1>
              <p className="text-primary-100 mb-6">
                Earn points by reviewing AI models, adding media to your reviews, and getting upvotes from the community. Redeem your points for exclusive rewards and discounts.
              </p>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">Your Points Balance</h3>
                  <span className="text-white text-xl font-bold">{currentUserPoints} pts</span>
                </div>
                <Progress value={60} className="h-2 bg-white/20" />
                <div className="mt-2 text-sm text-white">
                  You're 380 points away from the next tier
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RewardInfoCard
                  icon="ri-quill-pen-line"
                  title="Write Reviews"
                  points="50 points per review"
                />
                <RewardInfoCard
                  icon="ri-image-add-line"
                  title="Add Media"
                  points="+20 points for photos/videos"
                />
                <RewardInfoCard
                  icon="ri-award-line"
                  title="Get Upvotes"
                  points="+5 points per upvote"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-6">Available Rewards</h2>
          
          <Tabs 
            defaultValue="available" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="available">Available Rewards</TabsTrigger>
              <TabsTrigger value="redeemed">Redeemed Rewards</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <RewardCardSkeleton key={index} />
              ))
            ) : rewards && rewards.length > 0 ? (
              // Actual reward cards (filtering based on active tab)
              rewards
                .filter(reward => 
                  activeTab === "available" ? reward.isAvailable : !reward.isAvailable
                )
                .map(reward => (
                  <RewardCard
                    key={reward.id}
                    id={reward.id}
                    name={reward.name}
                    description={reward.description}
                    pointsCost={reward.pointsCost}
                    isAvailable={reward.isAvailable}
                    userPoints={currentUserPoints}
                    onRedeem={redeemReward}
                  />
                ))
            ) : (
              <div className="col-span-3 text-center py-8 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">No rewards found</h3>
                <p className="text-neutral-600">
                  {activeTab === "available" 
                    ? "There are no available rewards at the moment." 
                    : "You haven't redeemed any rewards yet."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface RewardInfoCardProps {
  icon: string;
  title: string;
  points: string;
}

const RewardInfoCard = ({ icon, title, points }: RewardInfoCardProps) => {
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

interface RewardCardProps {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  isAvailable: boolean;
  userPoints: number;
  onRedeem: (id: number, cost: number) => void;
}

const RewardCard = ({ id, name, description, pointsCost, isAvailable, userPoints, onRedeem }: RewardCardProps) => {
  const canRedeem = userPoints >= pointsCost;
  
  return (
    <Card className="bg-white shadow-card hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{name}</CardTitle>
          <Badge className={`${canRedeem ? 'bg-secondary-500' : 'bg-neutral-200 text-neutral-600'}`}>
            {pointsCost} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-neutral-600">{description}</p>
        
        {!isAvailable && (
          <div className="mt-4 flex items-center p-2 bg-neutral-100 rounded-md">
            <CheckCircle className="h-4 w-4 text-secondary-500 mr-2" />
            <span className="text-sm text-neutral-700">Redeemed</span>
          </div>
        )}
        
        {isAvailable && !canRedeem && (
          <div className="mt-4 flex items-center p-2 bg-neutral-100 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm text-neutral-700">You need {pointsCost - userPoints} more points</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          disabled={!isAvailable || !canRedeem}
          onClick={() => onRedeem(id, pointsCost)}
        >
          {isAvailable ? 'Redeem Reward' : 'Already Redeemed'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const RewardCardSkeleton = () => {
  return (
    <Card className="bg-white overflow-hidden border border-neutral-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default Rewards;
