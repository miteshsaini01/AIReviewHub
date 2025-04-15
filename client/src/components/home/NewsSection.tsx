import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsArticles, formatRelativeTime } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NewsSection = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => fetchNewsArticles(3)
  });

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">AI News & Updates</h2>
        <Link href="/news" className="text-primary hover:text-primary-700 flex items-center">
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))
        ) : articles && articles.length > 0 ? (
          // Actual news cards
          articles.map((article) => (
            <NewsCard 
              key={article.id}
              id={article.id}
              category={article.category}
              title={article.title}
              summary={article.summary}
              imageUrl={article.imageUrl || undefined}
              createdAt={article.createdAt || new Date()}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-neutral-500">No news articles found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface NewsCardProps {
  id: number;
  category: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: Date | string;
}

const NewsCard = ({ id, category, title, summary, imageUrl, createdAt }: NewsCardProps) => {
  return (
    <Card className="bg-white shadow-card hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200 flex flex-col">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-medium text-primary mb-2">{category}</span>
        <h3 className="text-lg font-bold font-heading">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600 flex-1">{summary}</p>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-neutral-500">{formatRelativeTime(createdAt)}</span>
          <Link href={`/news/${id}`} className="text-primary hover:text-primary-700 font-medium">
            Read more
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const NewsCardSkeleton = () => {
  return (
    <Card className="bg-white overflow-hidden border border-neutral-200 flex flex-col">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-5 flex-1 flex flex-col">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-3/4 mt-1" />
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
