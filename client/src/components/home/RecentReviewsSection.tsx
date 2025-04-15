import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentReviews, fetchUserById, fetchAiModelById, formatRelativeTime } from "@/lib/data";
import { ArrowRight, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";

const RecentReviewsSection = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: () => fetchRecentReviews(2)
  });

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Recent Reviews</h2>
        <Link href="/reviews" className="text-primary hover:text-primary-700 flex items-center">
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 2 }).map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))
        ) : reviews && reviews.length > 0 ? (
          // Actual review cards
          reviews.map((review) => (
            <ReviewCard key={review.id} reviewId={review.id} />
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-neutral-500">No reviews found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface ReviewCardProps {
  reviewId: number;
}

const ReviewCard = ({ reviewId }: ReviewCardProps) => {
  const { data: review, isLoading: isReviewLoading } = useQuery({
    queryKey: [`/api/reviews/${reviewId}`],
    queryFn: () => fetchReviewById(reviewId)
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${review?.userId}`],
    queryFn: () => fetchUserById(review?.userId || 0),
    enabled: !!review?.userId
  });

  const { data: model, isLoading: isModelLoading } = useQuery({
    queryKey: [`/api/models/${review?.modelId}`],
    queryFn: () => fetchAiModelById(review?.modelId || 0),
    enabled: !!review?.modelId
  });

  const isLoading = isReviewLoading || isUserLoading || isModelLoading;

  if (isLoading) {
    return <ReviewCardSkeleton />;
  }

  if (!review || !user || !model) {
    return null;
  }

  return (
    <Card className="bg-white shadow-card overflow-hidden border border-neutral-200">
      <CardContent className="p-5">
        <div className="flex items-start">
          <Avatar className="w-12 h-12 mr-4">
            <AvatarImage src={user?.avatar || undefined} alt={`${user?.name || 'User'} avatar`} />
            <AvatarFallback>{(user?.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-neutral-900">{user?.name || 'Anonymous User'}</h3>
                <div className="text-sm text-neutral-500">
                  Reviewed <Link href={`/model/${model?.id || 0}`} className="text-primary font-medium">{model?.name || 'Unknown Model'}</Link>
                </div>
              </div>
              <Rating value={review?.rating || 0} />
            </div>
            <div className="mt-2">
              <h4 className="font-medium">{review?.title || 'Untitled Review'}</h4>
              <p className="mt-1 text-sm text-neutral-600">{review?.content || 'No content available'}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                {formatRelativeTime(review?.createdAt || new Date())}
              </span>
            </div>
            <div className="mt-3 flex items-center text-sm text-neutral-500 space-x-4">
              <Button variant="ghost" size="sm" className="h-auto p-1 text-neutral-500 hover:text-neutral-700">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{review?.helpfulVotes || 0} Helpful</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-neutral-500 hover:text-neutral-700">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{review?.commentCount || 0} Comments</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <Card className="bg-white overflow-hidden border border-neutral-200">
      <CardContent className="p-5">
        <div className="flex items-start">
          <Skeleton className="w-12 h-12 rounded-full mr-4" />
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-40 mt-3" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <div className="mt-3">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="mt-3 flex space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReviewsSection;
