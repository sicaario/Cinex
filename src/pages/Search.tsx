import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Movie, Genre } from '../types/movie';
import { movieApi } from '../utils/api';
import MovieCard from '../components/MovieCard/MovieCard';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity.desc');

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== searchQuery) {
      setSearchQuery(query || '');
    }
    resetAndSearchMovies();
  }, [searchParams]);

  // Infinite scroll
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

  const fetchGenres = async () => {
    try {
      const response = await movieApi.getGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const resetAndSearchMovies = () => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    searchMovies(1, true);
  };

  const searchMovies = async (newPage = 1, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    const query = searchParams.get('q');
    
    try {
      let response;
      
      if (query) {
        response = await movieApi.search(query, newPage);
      } else {
        response = await movieApi.discover({
          page: newPage,
          genre: selectedGenre,
          year: selectedYear,
          language: selectedLanguage,
          minRating,
          sortBy,
        });
      }
      
      const newMovies = response.results || [];
      
      if (reset || newPage === 1) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }
      
      setHasMore(newPage < (response.total_pages || 1) && newMovies.length > 0);
      setPage(newPage);
    } catch (error) {
      console.error('Error searching movies:', error);
      if (reset) setMovies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMovies = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      searchMovies(page + 1);
    }
  }, [page, hasMore, loadingMore, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    setSearchParams(params);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedYear) params.set('year', selectedYear);
    if (selectedLanguage) params.set('language', selectedLanguage);
    if (minRating) params.set('rating', minRating);
    if (sortBy !== 'popularity.desc') params.set('sort', sortBy);
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedLanguage('');
    setMinRating('');
    setSortBy('popularity.desc');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Search and explore millions of movies from around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full px-6 py-4 pl-14 bg-gray-900/80 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 text-lg backdrop-blur-sm"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-white font-medium transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-900/50 border border-gray-700 px-6 py-3 rounded-xl text-white hover:bg-gray-800/50 transition-colors duration-300 backdrop-blur-sm"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              className="mt-6 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
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
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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

                {/* Rating Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="7">7.0+</option>
                    <option value="8">8.0+</option>
                    <option value="9">9.0+</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-white font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="popularity.desc">Popularity (High to Low)</option>
                    <option value="popularity.asc">Popularity (Low to High)</option>
                    <option value="vote_average.desc">Rating (High to Low)</option>
                    <option value="vote_average.asc">Rating (Low to High)</option>
                    <option value="release_date.desc">Release Date (Newest)</option>
                    <option value="release_date.asc">Release Date (Oldest)</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={applyFilters}
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {loading && movies.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Searching movies...</p>
            </div>
          </div>
        ) : movies.length > 0 ? (
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
                <p className="text-gray-400">You've reached the end of the search results</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;