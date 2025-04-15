import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAiModels } from "@/lib/data";
import { AiModel } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/rating";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("avgRating");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const categories = [
    "All Categories",
    "Text Generation",
    "Image Generation",
    "Voice AI",
    "Code Assistants",
    "Multimodal",
    "Video Generation",
    "Language Translation",
    "Data Analysis",
    "Music Generation",
    "RAG Systems",
    "Agents"
  ];
  
  const { data: models, isLoading } = useQuery({
    queryKey: ['/api/models', selectedCategory, sortBy],
    queryFn: () => fetchAiModels(
      selectedCategory === "All Categories" ? undefined : selectedCategory,
      sortBy
    )
  });

  // Filter models by search query
  const filteredModels = models?.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-8">AI Models Leaderboard</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search AI models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {/* Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex space-x-2 sm:ml-auto">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className="rounded-md border-neutral-300 text-sm py-2 pr-8 pl-3 shadow-sm">
                <SelectValue placeholder="Sort by: Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avgRating">Sort by: Rating</SelectItem>
                <SelectItem value="reviewCount">Sort by: Most Reviewed</SelectItem>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <AiModelCardSkeleton key={index} />
            ))
          ) : filteredModels && filteredModels.length > 0 ? (
            // Actual model cards
            filteredModels.map((model, index) => (
              <AiModelCard 
                key={model.id} 
                model={model} 
                rank={index + 1} 
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-neutral-500">No AI models found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AiModelCardProps {
  model: AiModel;
  rank: number;
}

const AiModelCard = ({ model, rank }: AiModelCardProps) => {
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200">
      <div className="relative">
        <img 
          src={model.imageUrl || undefined}
          alt={`${model.name} interface`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          #{rank} Ranked
        </div>
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
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-3 gap-2 text-xs text-neutral-500">
            <ProgressMeter 
              label="Accuracy" 
              value={model.accuracyScore ?? 0} 
              size="sm"
            />
            <ProgressMeter 
              label="Ease of Use" 
              value={model.easeOfUseScore ?? 0} 
              size="sm"
            />
            <ProgressMeter 
              label="Innovation" 
              value={model.innovationScore ?? 0} 
              size="sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Link href={`/model/${model.id}`}>
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary-700 text-sm font-medium">
              Read reviews
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
  );
};

const AiModelCardSkeleton = () => {
  return (
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
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
