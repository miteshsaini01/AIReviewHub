import { useQuery } from "@tanstack/react-query";
import { fetchSiteStats } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

const StatsSection = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => fetchSiteStats()
  });

  return (
    <section className="bg-background rounded-xl shadow-md py-6 px-8 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatItem 
          label="AI Models" 
          value={stats?.modelCount} 
          suffix="+" 
          isLoading={isLoading} 
        />
        <StatItem 
          label="User Reviews" 
          value={stats?.reviewCount} 
          isLoading={isLoading} 
        />
        <StatItem 
          label="Active Users" 
          value={stats?.userCount} 
          isLoading={isLoading} 
        />
        <StatItem 
          label="Rewards Claimed" 
          value={stats?.rewardsClaimed} 
          isLoading={isLoading} 
        />
      </div>
    </section>
  );
};

interface StatItemProps {
  label: string;
  value?: number;
  suffix?: string;
  isLoading: boolean;
}

const StatItem = ({ label, value, suffix = "", isLoading }: StatItemProps) => {
  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm">{label}</p>
      {isLoading ? (
        <Skeleton className="h-9 w-24 mx-auto mt-1" />
      ) : (
        <p className="text-3xl font-bold text-primary">
          {value?.toLocaleString()}{suffix}
        </p>
      )}
    </div>
  );
};

export default StatsSection;
