import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, TrendingUp, Calendar, Star, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { movieApi } from '../../utils/api';
import { Movie } from '../../types/movie';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const response = await movieApi.search(searchQuery.trim());
          setSearchSuggestions(response.results.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { path: '/trending', label: 'Trending', icon: TrendingUp },
    { path: '/upcoming', label: 'Upcoming', icon: Calendar },
    { path: '/top-rated', label: 'Top Rated', icon: Star },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800/50'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mr-8">
            <motion.div
              className="text-red-600 text-3xl font-black"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              C
            </motion.div>
            <span className="text-2xl font-black text-white tracking-wider">CINEX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 mr-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Compact Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 pl-10 bg-gray-900/80 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-gray-900/95 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                  >
                    {searchSuggestions.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleSuggestionClick(movie.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors flex items-center space-x-3"
                      >
                        <span className="text-sm">🎬</span>
                        <div>
                          <p className="text-white font-medium text-sm">{movie.title}</p>
                          <p className="text-gray-400 text-xs">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/30 backdrop-blur-sm ml-4">
            <div className="w-7 h-7 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-medium text-sm">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white ml-4"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-6 pb-6 border-t border-gray-700/50"
            >
              <nav className="flex flex-col space-y-3 mt-6">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      location.pathname === path
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-6 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full px-4 py-3 pl-12 bg-gray-900/80 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>

              {/* Mobile User */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;