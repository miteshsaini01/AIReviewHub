import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pencil, Award, Star, MessageSquare, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentReviews, fetchAiModelById, formatRelativeTime } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/rating";
import { Link } from "wouter";

const Profile = () => {
  // In a real app, you would fetch the actual user profile
  // For now, we'll use a mock user
  const user = {
    id: 2,
    name: "Sarah Miller",
    username: "sarahmiller",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    points: 620,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
  };
  
  // Fetch user's reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: () => fetchRecentReviews()
  });
  
  // Filter to show only user's reviews
  const userReviews = reviews?.filter(review => review.userId === user.id);
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Calculate next milestone
  const currentPoints = user.points;
  const nextMilestone = Math.ceil(currentPoints / 1000) * 1000;
  const progress = (currentPoints / nextMilestone) * 100;
  const pointsNeeded = nextMilestone - currentPoints;

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-neutral-500 mb-2">@{user.username}</p>
                  <Badge className="mb-4">AI Enthusiast</Badge>
                  <Button variant="outline" className="w-full mb-6" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Points Balance</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{currentPoints}</span>
                      <Badge variant="outline">{Math.floor(currentPoints / 100)} Level</Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-neutral-500 mt-2">
                      {pointsNeeded} points until next milestone
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Member Since</h3>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Activity</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-100 rounded-md p-3 text-center">
                        <span className="block font-bold">{userReviews?.length || 0}</span>
                        <span className="text-xs text-neutral-600">Reviews</span>
                      </div>
                      <div className="bg-neutral-100 rounded-md p-3 text-center">
                        <span className="block font-bold">37</span>
                        <span className="text-xs text-neutral-600">Helpful Votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="profile" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3">About Me</h3>
                    <p className="text-neutral-600">
                      AI enthusiast and UX designer passionate about the intersection of artificial intelligence and human-centered design. I enjoy testing and reviewing various AI tools to find the best ones for creative workflows.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3">Achievements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <AchievementCard 
                        icon={<Star className="h-5 w-5" />}
                        title="Top Reviewer"
                        description="Contributed 5+ high-quality reviews"
                      />
                      <AchievementCard 
                        icon={<Award className="h-5 w-5" />}
                        title="Helpful Guide"
                        description="Received 25+ helpful votes"
                      />
                      <AchievementCard 
                        icon={<MessageSquare className="h-5 w-5" />}
                        title="Engaged Commenter"
                        description="Left comments on 10+ reviews"
                      />
                      <AchievementCard 
                        icon={<Clock className="h-5 w-5" />}
                        title="Early Adopter"
                        description="Joined in the first month"
                        locked={false}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <h3 className="text-lg font-bold mb-4">My Reviews</h3>
                  <div className="space-y-4">
                    {isReviewsLoading ? (
                      // Loading skeletons
                      Array.from({ length: 3 }).map((_, index) => (
                        <UserReviewSkeleton key={index} />
                      ))
                    ) : userReviews && userReviews.length > 0 ? (
                      // Actual reviews
                      userReviews.map(review => (
                        <UserReviewCard 
                          key={review.id} 
                          reviewId={review.id} 
                          modelId={review.modelId}
                          title={review.title}
                          content={review.content}
                          rating={review.rating}
                          createdAt={review.createdAt}
                          helpfulVotes={review.helpfulVotes}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 bg-neutral-50 rounded-lg">
                        <p className="text-neutral-500 mb-4">You haven't written any reviews yet.</p>
                        <Link href="/leaderboard">
                          <Button>Write Your First Review</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rewards">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Points History</h3>
                        <Badge variant="outline">{user.points} Total Points</Badge>
                      </div>
                      
                      <Card>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            <PointsHistoryItem 
                              action="Wrote a review for Midjourney"
                              points={50}
                              date="3 days ago"
                            />
                            <PointsHistoryItem 
                              action="Received helpful vote"
                              points={5}
                              date="5 days ago"
                            />
                            <PointsHistoryItem 
                              action="Added image to review"
                              points={20}
                              date="5 days ago"
                            />
                            <PointsHistoryItem 
                              action="Wrote a review for Claude"
                              points={50}
                              date="1 week ago"
                            />
                            <PointsHistoryItem 
                              action="Received helpful vote"
                              points={5}
                              date="2 weeks ago"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Redeemed Rewards</h3>
                      <div className="bg-neutral-100 rounded-lg p-8 text-center">
                        <p className="text-neutral-600 mb-4">You haven't redeemed any rewards yet.</p>
                        <Link href="/rewards">
                          <Button>Explore Rewards</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AchievementCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  locked?: boolean;
}

const AchievementCard = ({ icon, title, description, locked = false }: AchievementCardProps) => {
  return (
    <div className={`border rounded-lg p-4 ${locked ? 'opacity-50' : ''}`}>
      <div className="flex items-center mb-2">
        <div className="bg-primary-50 text-primary p-2 rounded-full mr-3">
          {icon}
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-neutral-600">{description}</p>
      {locked && (
        <Badge variant="outline" className="mt-2">Locked</Badge>
      )}
    </div>
  );
};

interface PointsHistoryItemProps {
  action: string;
  points: number;
  date: string;
}

const PointsHistoryItem = ({ action, points, date }: PointsHistoryItemProps) => {
  return (
    <div className="py-3 px-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{action}</p>
        <p className="text-sm text-neutral-500">{date}</p>
      </div>
      <Badge variant="secondary" className="bg-primary-50 text-primary-700 hover:bg-primary-100">
        +{points} pts
      </Badge>
    </div>
  );
};

interface UserReviewCardProps {
  reviewId: number;
  modelId: number;
  title: string;
  content: string;
  rating: number;
  createdAt: string | Date;
  helpfulVotes: number;
}

const UserReviewCard = ({ reviewId, modelId, title, content, rating, createdAt, helpfulVotes }: UserReviewCardProps) => {
  const { data: model, isLoading: isModelLoading } = useQuery({
    queryKey: [`/api/models/${modelId}`],
    queryFn: () => fetchAiModelById(modelId)
  });
  
  if (isModelLoading) {
    return <UserReviewSkeleton />;
  }

  if (!model) {
    return null;
  }

  return (
    <Card className="border border-neutral-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Link href={`/model/${modelId}`}>
              <a className="text-primary hover:text-primary-700 font-medium">
                {model.name}
              </a>
            </Link>
            <div className="text-sm text-neutral-500">{formatRelativeTime(createdAt)}</div>
          </div>
          <Rating value={rating} />
        </div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-neutral-600 mb-3">{content}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{helpfulVotes} helpful votes</Badge>
          <Link href={`/model/${modelId}`}>
            <Button variant="ghost" size="sm">View</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const UserReviewSkeleton = () => {
  return (
    <Card className="border border-neutral-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
