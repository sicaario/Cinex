import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getBackdropUrl } from '../../utils/api';

interface HeroProps {
  movies: Movie[];
}

const Hero: React.FC<HeroProps> = ({ movies }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const currentMovie = movies[currentMovieIndex];

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!currentMovie) return null;

  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path, 'original');
  const releaseYear = currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : 'TBA';

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(135deg, #E50914 0%, #8B0000 100%)'
            }}
          />
          
          {/* Netflix-style Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMovie.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Movie Title */}
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {currentMovie.title}
                </motion.h1>

                {/* Movie Meta */}
                <motion.div 
                  className="flex items-center space-x-6 mb-6 text-gray-300"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">
                      {currentMovie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{releaseYear}</span>
                  </div>
                  
                  <div className="px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm">
                    {currentMovie.original_language.toUpperCase()}
                  </div>
                </motion.div>

                {/* Movie Overview */}
                <motion.p 
                  className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {currentMovie.overview}
                </motion.p>

                {/* Action Buttons */}
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <Link to={`/movie/${currentMovie.id}`}>
                    <motion.button
                      className="flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-2xl"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(229, 9, 20, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-6 h-6" />
                      <span>Watch Now</span>
                    </motion.button>
                  </Link>
                  
                  <Link to={`/movie/${currentMovie.id}`}>
                    <motion.button
                      className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm px-8 py-4 rounded-lg text-white font-semibold text-lg border border-gray-600/50"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-6 h-6" />
                      <span>More Info</span>
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Movie Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMovieIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentMovieIndex 
                ? 'bg-red-500 scale-125' 
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-gray-300">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gradient-to-b from-red-400 to-red-600 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;