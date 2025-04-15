import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsArticles, formatRelativeTime } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NewsArticle } from "@shared/schema";
import { Search } from "lucide-react";

const News = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => fetchNewsArticles(100) // Get a larger number to allow for filtering
  });
  
  // Filter articles based on search query and category
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = 
      searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" || 
      article.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for tabs
  const categories = articles 
    ? ["all", ...new Set(articles.map(article => article.category.toLowerCase()))]
    : ["all"];

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-6">AI News & Updates</h1>
        
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs 
          defaultValue="all" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="mb-2 overflow-x-auto scrollbar-hide pb-2 flex flex-nowrap">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize whitespace-nowrap"
              >
                {category === "all" ? "All Categories" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <NewsCard 
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-neutral-600">
              {searchQuery 
                ? "Try adjusting your search terms." 
                : "There are no articles in this category yet."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <Card className="bg-white shadow-card hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200 flex flex-col h-full">
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-medium text-primary mb-2">{article.category}</span>
        <h3 className="text-lg font-bold font-heading mb-2">{article.title}</h3>
        <p className="mt-2 text-sm text-neutral-600 flex-1">{article.summary}</p>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-neutral-500">{formatRelativeTime(article.createdAt)}</span>
          <a href="#" className="text-primary hover:text-primary-700 font-medium">Read more</a>
        </div>
      </CardContent>
    </Card>
  );
};

const NewsCardSkeleton = () => {
  return (
    <Card className="bg-white overflow-hidden border border-neutral-200 flex flex-col h-full">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-5 flex-1 flex flex-col">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-1 mb-3" />
        <div className="mt-auto flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default News;
