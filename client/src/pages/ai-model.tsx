import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchAiModelById, fetchReviewsByModelId, fetchUserById, formatRelativeTime } from "@/lib/data";
import { Rating } from "@/components/ui/rating";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Plus, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AiModel = () => {
  const [, params] = useRoute<{ id: string }>("/model/:id");
  const modelId = params ? parseInt(params.id) : 0;

  // Fetch model details
  const { 
    data: model, 
    isLoading: isModelLoading,
    error: modelError
  } = useQuery({
    queryKey: [`/api/models/${modelId}`],
    queryFn: () => fetchAiModelById(modelId),
    enabled: modelId > 0
  });

  // Fetch reviews for this model
  const { 
    data: reviews, 
    isLoading: areReviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: [`/api/reviews`, modelId],
    queryFn: () => fetchReviewsByModelId(modelId),
    enabled: modelId > 0
  });

  // If there's an error, scroll to top
  useEffect(() => {
    if (modelError || reviewsError) {
      window.scrollTo(0, 0);
    }
  }, [modelError, reviewsError]);

  // Handle loading state
  if (isModelLoading) {
    return (
      <div className="bg-neutral-50 text-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </div>
          <ModelDetailsSkeleton />
        </div>
      </div>
    );
  }

  // Handle error state
  if (modelError) {
    return (
      <div className="bg-neutral-50 text-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-3">Failed to load AI model</h2>
            <p className="mb-4">There was an error loading this AI model. Please try again later.</p>
            <Link href="/leaderboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leaderboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Handle no model found
  if (!model) {
    return (
      <div className="bg-neutral-50 text-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">AI Model Not Found</h2>
            <p className="mb-4">We couldn't find the AI model you're looking for.</p>
            <Link href="/leaderboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leaderboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb navigation */}
        <div className="flex items-center mb-6 text-sm">
          <Link href="/leaderboard">
            <a className="text-primary hover:text-primary-600 flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Leaderboard
            </a>
          </Link>
        </div>

        {/* Model Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Image and Quick Stats */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
              <div className="relative">
                <img 
                  src={model.imageUrl} 
                  alt={`${model.name} interface`} 
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Top Rated
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h1 className="text-2xl font-bold font-heading">{model.name}</h1>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{model.avgRating.toFixed(1)}</span>
                    <Rating value={model.avgRating} />
                  </div>
                </div>
                <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200">
                  {model.category}
                </Badge>
                <div className="mt-4">
                  <div className="text-sm text-neutral-500 mb-2">{model.reviewCount.toLocaleString()} reviews</div>
                  <Link href={`/add-review?modelId=${model.id}`}>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Write a Review
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Ratings */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">About {model.name}</h2>
                <p className="text-neutral-700 mb-6">{model.description}</p>
                
                <h3 className="font-bold mb-4">Performance Ratings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <ProgressMeter 
                      label="Accuracy" 
                      value={model.accuracyScore} 
                      size="md"
                      className="mb-4"
                    />
                  </div>
                  <div>
                    <ProgressMeter 
                      label="Ease of Use" 
                      value={model.easeOfUseScore} 
                      size="md"
                      className="mb-4"
                    />
                  </div>
                  <div>
                    <ProgressMeter 
                      label="Innovation" 
                      value={model.innovationScore} 
                      size="md"
                      className="mb-4"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Reviews</h2>
                  <Link href={`/add-review?modelId=${model.id}`}>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Review
                    </Button>
                  </Link>
                </div>

                {/* Reviews List */}
                {areReviewsLoading ? (
                  <div className="space-y-6">
                    {[1, 2].map(i => <ReviewCardSkeleton key={i} />)}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <ReviewCard key={review.id} reviewId={review.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg">
                    <p className="text-neutral-500 mb-4">No reviews yet for this model.</p>
                    <Link href={`/add-review?modelId=${model.id}`}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Be the first to review
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelDetailsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="mt-4">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            
            <Skeleton className="h-1 w-full my-6" />
            
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            <div className="space-y-6">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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

  const isLoading = isReviewLoading || isUserLoading;

  if (isLoading) {
    return <ReviewCardSkeleton />;
  }

  if (!review || !user) {
    return null;
  }

  return (
    <Card className="bg-white shadow-sm overflow-hidden border border-neutral-200">
      <CardContent className="p-5">
        <div className="flex items-start">
          <Avatar className="w-12 h-12 mr-4">
            <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-neutral-900">{user.name}</h3>
                <div className="text-sm text-neutral-500">
                  {formatRelativeTime(review.createdAt)}
                </div>
              </div>
              <Rating value={review.rating} />
            </div>
            <div className="mt-2">
              <h4 className="font-medium">{review.title}</h4>
              <p className="mt-1 text-sm text-neutral-600">{review.content}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-neutral-500">
              <div>
                <div className="font-medium text-neutral-700">Accuracy</div>
                <div className="flex items-center">
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mr-1">
                    <div className="bg-secondary-500 h-1.5 rounded-full" style={{ width: `${review.accuracyRating * 20}%` }}></div>
                  </div>
                  <span>{(review.accuracyRating * 2).toFixed(1)}</span>
                </div>
              </div>
              <div>
                <div className="font-medium text-neutral-700">Ease of Use</div>
                <div className="flex items-center">
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mr-1">
                    <div className="bg-secondary-500 h-1.5 rounded-full" style={{ width: `${review.easeOfUseRating * 20}%` }}></div>
                  </div>
                  <span>{(review.easeOfUseRating * 2).toFixed(1)}</span>
                </div>
              </div>
              <div>
                <div className="font-medium text-neutral-700">Innovation</div>
                <div className="flex items-center">
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mr-1">
                    <div className="bg-secondary-500 h-1.5 rounded-full" style={{ width: `${review.innovationRating * 20}%` }}></div>
                  </div>
                  <span>{(review.innovationRating * 2).toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-neutral-500 space-x-4">
              <Button variant="ghost" size="sm" className="h-auto p-1 text-neutral-500 hover:text-neutral-700">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{review.helpfulVotes} Helpful</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-neutral-500 hover:text-neutral-700">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{review.commentCount} Comments</span>
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
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-40 mt-3" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
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

export default AiModel;
