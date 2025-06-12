import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie';
import MovieCard from '../MovieCard/MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
  loading?: boolean;
  showAll?: boolean;
}

const MovieSection: React.FC<MovieSectionProps> = ({ 
  title, 
  movies, 
  viewAllLink,
  loading = false,
  showAll = false
}) => {
  const displayMovies = showAll ? movies : movies.slice(0, 12);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          
          {viewAllLink && !showAll && (
            <Link
              to={viewAllLink}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors duration-300"
            >
              <span className="text-lg font-medium">View All</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Movies Grid */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: showAll ? 18 : 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            {displayMovies.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MovieSection;