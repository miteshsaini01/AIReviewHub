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
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";

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

const Compare = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("avgRating");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Prepare data for charts
  const chartData = filteredModels?.map(model => ({
    name: model.name,
    Accuracy: model.accuracyScore ?? 0,
    "Ease of Use": model.easeOfUseScore ?? 0,
    Innovation: model.innovationScore ?? 0,
    Rating: model.avgRating ?? 0,
    Reviews: model.reviewCount ?? 0
  })) || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen text-neutral-800 relative">
      {/* 3D effect background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-30 blur-2xl">
          <circle cx="30%" cy="20%" r="180" fill="#a5b4fc" />
          <circle cx="70%" cy="80%" r="140" fill="#f0abfc" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-8 flex items-center gap-4">
          <span className="drop-shadow-lg">Compare AI Models</span>
          <span className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 rounded-full shadow-md">Technical Data</span>
        </h1>
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search AI models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105"
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
        {/* Technical Data Charts */}
        <div className="mb-12 bg-white/80 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Model Technical Comparison</h2>
          <div className="w-full h-96">
            <ChartContainer config={{}}>
              {/* Example: Bar chart for Accuracy, Ease of Use, Innovation */}
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Accuracy" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Ease of Use" fill="#a21caf" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Innovation" fill="#f59e42" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="w-full h-96 mt-12">
            <ChartContainer config={{}}>
              {/* Example: Line chart for Average Rating */}
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Rating" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <AiModelCardSkeleton key={index} />
            ))
          ) : filteredModels && filteredModels.length > 0 ? (
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
      {/* Day/Night Theme Toggle (floating button) */}
      <ThemeToggle />
    </div>
  );
};

// Theme toggle button (simple example)
const ThemeToggle = () => {
  const [dark, setDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      ) : (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
      )}
    </button>
  );
};

interface AiModelCardProps {
  model: AiModel;
  rank: number;
}

const AiModelCard = ({ model, rank }: AiModelCardProps) => {
  return (
    <Card className="bg-white hover:shadow-2xl transition-shadow overflow-hidden border border-neutral-200 relative">
      {/* 3D floating effect */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <svg width="60" height="24" className="opacity-40 blur-sm">
          <ellipse cx="30" cy="12" rx="28" ry="8" fill="#a5b4fc" />
        </svg>
      </div>
      <div className="relative">
        <img 
          src={model.imageUrl || undefined}
          alt={`${model.name} interface`} 
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
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

export default Compare;
