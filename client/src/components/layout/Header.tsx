import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Menu, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary text-white p-1 rounded-md mr-2">
                <i className="ri-ai-generate text-xl"></i>
              </div>
              <span className="text-xl font-bold text-primary font-heading">AI Review Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Home
              </a>
            </Link>
            <Link href="/leaderboard">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/leaderboard' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Leaderboard
              </a>
            </Link>
            <Link href="/news">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/news' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>
                News
              </a>
            </Link>
            <Link href="/rewards">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/rewards' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Rewards
              </a>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-neutral-600" />
            </Button>
            
            <Link href="/add-review">
              <Button className="hidden md:flex items-center" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Review
              </Button>
            </Link>
            
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-md"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5 text-neutral-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Home
              </a>
            </Link>
            <Link href="/leaderboard">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/leaderboard' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Leaderboard
              </a>
            </Link>
            <Link href="/news">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/news' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                News
              </a>
            </Link>
            <Link href="/rewards">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/rewards' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Rewards
              </a>
            </Link>
            <Link href="/add-review">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/add-review' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Add Review
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
