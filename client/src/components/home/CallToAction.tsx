import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="bg-white rounded-xl shadow-md p-6 md:p-8 text-center">
      <h2 className="text-2xl font-bold font-heading text-neutral-900">Ready to share your AI experience?</h2>
      <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
        Join our community of AI enthusiasts and help shape the future of artificial intelligence through your reviews and feedback.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" className="px-6 py-3">
          Sign Up Now
        </Button>
        <Link href="/leaderboard">
          <Button size="lg" variant="outline" className="px-6 py-3">
            Browse AI Models
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
