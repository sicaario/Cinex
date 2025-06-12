import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Play } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../utils/api';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const posterUrl = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-sm shadow-xl transform transition-all duration-500 group-hover:shadow-red-500/20 border border-gray-700/20 group-hover:border-red-500/30">
        {/* Movie Poster */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-500" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-bold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Play Button */}
          <Link to={`/movie/${movie.id}`}>
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <Link to={`/movie/${movie.id}`}>
            <h3 className="text-white font-bold text-sm leading-tight mb-2 group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
              {movie.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}</span>
            </div>
            
            <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">
              {movie.original_language.toUpperCase()}
            </span>
          </div>

          {/* Overview Preview */}
          <p className="text-gray-400 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {movie.overview}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;