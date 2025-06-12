import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import MovieSection from '../components/MovieSection/MovieSection';
import { Movie } from '../types/movie';
import { movieApi } from '../utils/api';

const Home: React.FC = () => {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Page states for infinite scroll
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        hasMore
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, trendingPage, popularPage, upcomingPage, topRatedPage, nowPlayingPage]);

  const fetchInitialMovies = async () => {
    try {
      setLoading(true);
      
      // Fetch initial data for all categories
      const [trending, popular, upcoming, topRated, nowPlaying] = await Promise.all([
        movieApi.getTrending(),
        movieApi.getPopular(),
        movieApi.getUpcoming(),
        movieApi.getTopRated(),
        movieApi.getNowPlaying(),
      ]);

      setTrendingMovies(trending.results || []);
      setPopularMovies(popular.results || []);
      setUpcomingMovies(upcoming.results || []);
      setTopRatedMovies(topRated.results || []);
      setNowPlayingMovies(nowPlaying.results || []);
      
      // Use trending movies for hero section
      setHeroMovies((trending.results || []).slice(0, 5));
      
      console.log('Initial movies loaded:', {
        trending: trending.results?.length || 0,
        popular: popular.results?.length || 0,
        upcoming: upcoming.results?.length || 0,
        topRated: topRated.results?.length || 0,
        nowPlaying: nowPlaying.results?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching initial movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      // Load next page for each category
      const promises = [];
      
      // Trending
      if (trendingMovies.length >= trendingPage * 20) {
        promises.push(
          movieApi.getTrending().then(response => {
            const newMovies = response.results || [];
            setTrendingMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMovies];
            });
            setTrendingPage(prev => prev + 1);
          })
        );
      }

      // Popular
      if (popularMovies.length >= popularPage * 20) {
        promises.push(
          movieApi.getPopular(popularPage + 1).then(response => {
            const newMovies = response.results || [];
            setPopularMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMovies];
            });
            setPopularPage(prev => prev + 1);
          })
        );
      }

      // Upcoming
      if (upcomingMovies.length >= upcomingPage * 20) {
        promises.push(
          movieApi.getUpcoming(upcomingPage + 1).then(response => {
            const newMovies = response.results || [];
            setUpcomingMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMovies];
            });
            setUpcomingPage(prev => prev + 1);
          })
        );
      }

      // Top Rated
      if (topRatedMovies.length >= topRatedPage * 20) {
        promises.push(
          movieApi.getTopRated(topRatedPage + 1).then(response => {
            const newMovies = response.results || [];
            setTopRatedMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMovies];
            });
            setTopRatedPage(prev => prev + 1);
          })
        );
      }

      // Now Playing
      if (nowPlayingMovies.length >= nowPlayingPage * 20) {
        promises.push(
          movieApi.getNowPlaying(nowPlayingPage + 1).then(response => {
            const newMovies = response.results || [];
            setNowPlayingMovies(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMovies];
            });
            setNowPlayingPage(prev => prev + 1);
          })
        );
      }

      await Promise.all(promises);
      
      console.log('More movies loaded:', {
        trending: trendingMovies.length,
        popular: popularMovies.length,
        upcoming: upcomingMovies.length,
        topRated: topRatedMovies.length,
        nowPlaying: nowPlayingMovies.length,
      });
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, trendingMovies.length, popularMovies.length, upcomingMovies.length, topRatedMovies.length, nowPlayingMovies.length, trendingPage, popularPage, upcomingPage, topRatedPage, nowPlayingPage]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {heroMovies.length > 0 && <Hero movies={heroMovies} />}

      {/* Movie Sections with Infinite Scroll */}
      <div className="relative z-10 -mt-20">
        <MovieSection
          title="Trending Now"
          movies={trendingMovies}
          viewAllLink="/trending"
          loading={loading}
          showAll={true}
        />
        
        <MovieSection
          title="Popular Movies"
          movies={popularMovies}
          viewAllLink="/popular"
          loading={loading}
          showAll={true}
        />

        <MovieSection
          title="Now Playing"
          movies={nowPlayingMovies}
          viewAllLink="/now-playing"
          loading={loading}
          showAll={true}
        />
        
        <MovieSection
          title="Coming Soon"
          movies={upcomingMovies}
          viewAllLink="/upcoming"
          loading={loading}
          showAll={true}
        />
        
        <MovieSection
          title="Top Rated"
          movies={topRatedMovies}
          viewAllLink="/top-rated"
          loading={loading}
          showAll={true}
        />
      </div>

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white">Loading more movies...</span>
          </div>
        </div>
      )}

      {/* Netflix-style Ambient Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-700/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default Home;