import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-heading">
            Review, Rate & Discover <span className="text-primary">AI Models</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Join the community of AI enthusiasts and help shape the future of artificial intelligence through your reviews.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/leaderboard">
              <Button size="lg" className="px-6 py-3 rounded-lg shadow-md">
                Explore AI Models
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-6 py-3 rounded-lg shadow-md">
              How It Works
            </Button>
          </div>
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex -space-x-2">
              <img 
                className="h-8 w-8 rounded-full ring-2 ring-white" 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256" 
                alt="User avatar" 
              />
              <img 
                className="h-8 w-8 rounded-full ring-2 ring-white" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256" 
                alt="User avatar" 
              />
              <img 
                className="h-8 w-8 rounded-full ring-2 ring-white" 
                src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=256" 
                alt="User avatar" 
              />
            </div>
            <span className="text-sm text-muted-foreground">Join <span className="font-medium text-foreground">5,000+</span> active reviewers</span>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780acdf692?auto=format&fit=crop&q=80&w=800" 
              alt="AI technology interface" 
              className="w-full h-auto" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-multiply"></div>
          </div>
          <div className="absolute -bottom-5 -left-5 bg-background rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="text-accent-500">
                <i className="ri-award-fill text-2xl"></i>
              </div>
              <div>
                <h3 className="font-medium">Earn rewards for your reviews</h3>
                <p className="text-sm text-neutral-600">Get points for every contribution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
