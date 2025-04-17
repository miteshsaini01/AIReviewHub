import { useQuery } from "@tanstack/react-query";
import { fetchAiModels } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Plus } from "lucide-react";

const Models = () => {
  const { data: models, isLoading } = useQuery({
    queryKey: ['/api/models'],
    queryFn: () => fetchAiModels()
  });

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-8">All AI Models</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ModelCardSkeleton key={index} />
            ))
          ) : models && models.length > 0 ? (
            models.map((model) => (
              <Card key={model.id} className="bg-white hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200">
                <div className="relative">
                  <img 
                    src={model.imageUrl || undefined}
                    alt={`${model.name} interface`} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-heading">{model.name}</h3>
                    <div className="flex items-center">
                      <div className="text-sm font-bold text-neutral-900">{(model.avgRating ?? 0).toFixed(1)}</div>
                      <div className="ml-1">
                        <Rating value={model.avgRating ?? 0} />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">{model.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">{model.category}</span>
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs font-medium">{(model.reviewCount ?? 0).toLocaleString()} reviews</span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link href={`/model/${model.id}`}>
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary-700 text-sm font-medium">
                        View Technical Info
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/add-review?modelId=${model.id}`}>
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary-700 text-sm font-medium">
                        <Plus className="mr-1 h-4 w-4" />
                        Add review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-neutral-500">No AI models found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModelCardSkeleton = () => (
  <Card className="overflow-hidden border border-neutral-200">
    <Skeleton className="w-full h-48" />
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full mt-3" />
      <Skeleton className="h-4 w-3/4 mt-2" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
  </Card>
);

export default Models;