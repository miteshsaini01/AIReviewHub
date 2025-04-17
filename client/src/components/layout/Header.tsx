import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Menu, Plus, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
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
            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>Home</Link>
            <Link href="/compare" className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/compare' || location === '/leaderboard' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>Compare</Link>
            <Link href="/models" className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/models' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>Models</Link>
            <Link href="/news" className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/news' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>News</Link>
            <Link href="/rewards" className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/rewards' ? 'text-primary' : 'text-neutral-600 hover:bg-primary-50'}`}>Rewards</Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-neutral-600" />
            </Button>
            
            {user && (
              <Link href="/add-review">
                <Button className="hidden md:flex items-center" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Review
                </Button>
              </Link>
            )}
            
            {/* Show either profile dropdown or login based on authentication status */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.avatar || undefined} alt={`${user.name || user.username} avatar`} />
                    <AvatarFallback>{(user.name || user.username).charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name || user.username}</p>
                      {user.email && (
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                      <p className="text-xs text-primary font-medium">
                        {user.points} points
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="hidden md:block">
                <Button variant="outline" size="sm">Login / Register</Button>
              </Link>
            )}
            
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
            <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>Home</Link>
            <Link href="/compare" className={`block px-3 py-2 rounded-md text-base font-medium ${(location === '/compare' || location === '/leaderboard') ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>Compare</Link>
            <Link href="/models" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/models' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>Models</Link>
            <Link href="/news" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/news' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>News</Link>
            <Link href="/rewards" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/rewards' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>Rewards</Link>
            
            {user ? (
              <>
                <Link href="/add-review" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/add-review' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                  Add Review
                </Link>
                <Link href="/profile" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/profile' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-primary-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/auth' ? 'text-primary bg-primary-50' : 'text-neutral-600 hover:bg-primary-50'}`}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
