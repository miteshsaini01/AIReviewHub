import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">AI Review Hub</h3>
            <p className="text-sm">The go-to destination for AI enthusiasts, developers, and everyday users to review, rate, and discover artificial intelligence models.</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="ri-twitter-x-line"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="ri-linkedin-fill"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="ri-github-fill"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="ri-discord-fill"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/leaderboard" className="hover:text-white">
                  AI Models
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/add-review" className="hover:text-white">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-white">
                  Rewards Program
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Join Discord</a></li>
              <li><a href="#" className="hover:text-white">Guidelines</a></li>
              <li><a href="#" className="hover:text-white">Submit an AI</a></li>
              <li><a href="#" className="hover:text-white">Become an Expert</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white">Content Guidelines</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-700 text-sm text-neutral-400 flex flex-col md:flex-row justify-between items-center">
          <div>© {new Date().getFullYear()} AI Review Hub. All rights reserved.</div>
          <div className="mt-4 md:mt-0">Made with ❤️ for AI enthusiasts worldwide</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
