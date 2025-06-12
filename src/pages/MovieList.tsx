import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Star, Calendar, Film, Filter, X } from 'lucide-react';
import { Movie, Genre } from '../types/movie';
import { movieApi } from '../utils/api';
import MovieCard from '../components/MovieCard/MovieCard';

const MovieList: React.FC = () => {
  const location = useLocation();
  const category = location.pathname.slice(1);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const categoryConfig = {
    trending: {
      title: 'Trending',
      icon: TrendingUp,
      fetchFunction: (page: number) => movieApi.getTrending('week', page),
    },
    upcoming: {
      title: 'Upcoming',
      icon: Calendar,
      fetchFunction: (page: number) => movieApi.getUpcoming(page),
    },
    'top-rated': {
      title: 'Top Rated',
      icon: Star,
      fetchFunction: (page: number) => movieApi.getTopRated(page),
      defaultSort: 'vote_average.desc', // Sort by rating for top-rated
    },
  };

  const config = categoryConfig[category as keyof typeof categoryConfig];

  // Set default sort for top-rated category
  useEffect(() => {
    if (category === 'top-rated' && sortBy === 'popularity.desc') {
      setSortBy('vote_average.desc');
    }
  }, [category]);

  // Fetch genres once on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await movieApi.getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Reset and fetch movies when category or filters change
  useEffect(() => {
    if (config) {
      setMovies([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      fetchMovies(1, true);
    }
  }, [category, selectedGenre, selectedLanguage, selectedYear, sortBy]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        hasMore &&
        !loading
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loading]);

  const fetchMovies = async (pageNumber: number, reset = false) => {
    if (!config) return;

    try {
      let response;
      
      // Use filters if any are selected, or if it's top-rated (always sort by rating)
      if (selectedGenre || selectedLanguage || selectedYear || sortBy !== 'popularity.desc' || category === 'top-rated') {
        const currentSort = category === 'top-rated' && sortBy === 'popularity.desc' ? 'vote_average.desc' : sortBy;
        response = await movieApi.discover({
          page: pageNumber,
          genre: selectedGenre,
          language: selectedLanguage,
          year: selectedYear,
          sortBy: currentSort,
        });
      } else {
        // Use category-specific endpoint
        response = await config.fetchFunction(pageNumber);
      }
      
      const newMovies = response.results || [];
      
      if (reset) {
        setMovies(newMovies);
      } else {
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMovies = newMovies.filter((m: Movie) => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMovies];
        });
      }
      
      setHasMore(pageNumber < (response.total_pages || 1) && newMovies.length > 0);
      setPage(pageNumber);
      
      console.log(`${category} movies loaded:`, {
        page: pageNumber,
        newMovies: newMovies.length,
        totalMovies: reset ? newMovies.length : movies.length + newMovies.length,
        hasMore: pageNumber < (response.total_pages || 1)
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (reset) setMovies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMovies = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      setLoadingMore(true);
      fetchMovies(page + 1);
    }
  }, [page, hasMore, loadingMore, loading]);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedYear('');
    setSortBy(category === 'top-rated' ? 'vote_average.desc' : 'popularity.desc');
  };

  const hasActiveFilters = selectedGenre || selectedLanguage || selectedYear || 
    (category === 'top-rated' ? sortBy !== 'vote_average.desc' : sortBy !== 'popularity.desc');

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-gray-400">The requested category does not exist.</p>
        </div>
      </div>
    );
  }

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">{config.title}</h1>
            {category === 'top-rated' && (
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                Sorted by Rating
              </span>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 px-4 py-3 rounded-lg text-white hover:bg-gray-800/60 transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                    <option value="hi">Hindi</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-white font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="release_date.desc">Newest First</option>
                    <option value="release_date.asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movies Grid */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
              ))}
            </motion.div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">Loading more movies...</span>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && movies.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">You've reached the end of the list</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <IconComponent className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-gray-400">
              Unable to load movies in this category at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;