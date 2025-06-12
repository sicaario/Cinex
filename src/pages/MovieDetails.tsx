import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  DollarSign, 
  Play, 
  ExternalLink,
  Tv
} from 'lucide-react';
import { MovieDetails as MovieDetailsType, Credits, Video, WatchProviders } from '../types/movie';
import { movieApi, getImageUrl, getBackdropUrl } from '../utils/api';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        const [movieData, creditsData, videosData, providersData] = await Promise.all([
          movieApi.getDetails(parseInt(id)),
          movieApi.getCredits(parseInt(id)),
          movieApi.getVideos(parseInt(id)),
          movieApi.getWatchProviders(parseInt(id)),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData.results.filter((video: Video) => video.site === 'YouTube'));
        setWatchProviders(providersData.results?.US || null);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-xl font-bold mb-4">Movie not found</h1>
          <Link to="/" className="text-red-400 hover:text-red-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const director = credits?.crew.find(person => person.job === 'Director');
  const trailer = videos.find(video => video.type === 'Trailer') || videos[0];

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStreamingUrl = (provider: any) => {
    const providerName = provider.provider_name.toLowerCase();
    
    const streamingUrls: { [key: string]: string } = {
      'netflix': `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
      'amazon prime video': `https://www.amazon.com/s?k=${encodeURIComponent(movie.title)}&i=instant-video`,
      'disney plus': `https://www.disneyplus.com/search?q=${encodeURIComponent(movie.title)}`,
      'hulu': `https://www.hulu.com/search?q=${encodeURIComponent(movie.title)}`,
      'hbo max': `https://www.hbomax.com/search?q=${encodeURIComponent(movie.title)}`,
      'apple tv plus': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
      'paramount plus': `https://www.paramountplus.com/search/?query=${encodeURIComponent(movie.title)}`,
      'peacock': `https://www.peacocktv.com/search?q=${encodeURIComponent(movie.title)}`,
      'youtube': `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' full movie')}`,
      'google play movies & tv': `https://play.google.com/store/search?q=${encodeURIComponent(movie.title)}&c=movies`,
      'vudu': `https://www.vudu.com/content/movies/search?query=${encodeURIComponent(movie.title)}`,
      'microsoft store': `https://www.microsoft.com/en-us/search?q=${encodeURIComponent(movie.title)}`
    };

    return streamingUrls[providerName] || `https://www.google.com/search?q=${encodeURIComponent(movie.title + ' watch online ' + provider.provider_name)}`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(135deg, #E50914 0%, #8B0000 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center pt-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <div className="w-64 max-w-full">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-full rounded-xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 max-w-2xl">
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-lg text-gray-300 italic mb-4">{movie.tagline}</p>
                )}

                {/* Movie Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-sm">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>{movie.original_language.toUpperCase()}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm border border-red-600/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-gray-200 leading-relaxed mb-6">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch Trailer</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="relative z-10 -mt-20 bg-gradient-to-b from-transparent to-black">
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-800">
            {['overview', 'cast', 'crew', 'streaming'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors duration-300 border-b-2 text-sm ${
                  activeTab === tab
                    ? 'text-red-400 border-red-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab === 'streaming' ? 'Watch Online' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {movie.overview}
                  </p>
                  
                  {director && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-white mb-1">Director</h4>
                      <p className="text-gray-300">{director.name}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Movie Facts</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Status</h4>
                      <p className="text-white">{movie.status}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Original Language</h4>
                      <p className="text-white">{movie.original_language.toUpperCase()}</p>
                    </div>
                    
                    {movie.budget > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Budget</h4>
                        <p className="text-white">{formatCurrency(movie.budget)}</p>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Revenue</h4>
                        <p className="text-white">{formatCurrency(movie.revenue)}</p>
                      </div>
                    )}
                    
                    {movie.homepage && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Homepage</h4>
                        <a
                          href={movie.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && credits && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {credits.cast.slice(0, 12).map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="w-full aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                      {person.profile_path ? (
                        <img
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{person.name}</h4>
                    <p className="text-gray-400 text-xs">{person.character}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'crew' && credits && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credits.crew
                  .filter((person, index, self) => 
                    self.findIndex(p => p.id === person.id && p.job === person.job) === index
                  )
                  .slice(0, 12)
                  .map((person) => (
                    <div key={`${person.id}-${person.job}`} className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        {person.profile_path ? (
                          <img
                            src={getImageUrl(person.profile_path, 'w185')}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{person.name}</h4>
                        <p className="text-gray-400 text-sm">{person.job}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'streaming' && (
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Tv className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Watch Online</h3>
                </div>
                
                {watchProviders ? (
                  <div className="space-y-6">
                    {watchProviders.flatrate && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Streaming Services</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {watchProviders.flatrate.map((provider) => (
                            <motion.a
                              key={provider.provider_id}
                              href={getStreamingUrl(provider)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-red-500/50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img
                                src={getImageUrl(provider.logo_path, 'w92')}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg mx-auto mb-3"
                              />
                              <span className="text-white text-sm font-medium block mb-2">{provider.provider_name}</span>
                              <div className="flex items-center justify-center space-x-1 text-red-400 text-xs">
                                <ExternalLink className="w-3 h-3" />
                                <span>Watch Now</span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {watchProviders.rent && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Rent</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {watchProviders.rent.map((provider) => (
                            <motion.a
                              key={provider.provider_id}
                              href={getStreamingUrl(provider)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-green-500/50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img
                                src={getImageUrl(provider.logo_path, 'w92')}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg mx-auto mb-3"
                              />
                              <span className="text-white text-sm font-medium block mb-2">{provider.provider_name}</span>
                              <div className="flex items-center justify-center space-x-1 text-green-400 text-xs">
                                <ExternalLink className="w-3 h-3" />
                                <span>Rent Now</span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {watchProviders.buy && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Buy</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {watchProviders.buy.map((provider) => (
                            <motion.a
                              key={provider.provider_id}
                              href={getStreamingUrl(provider)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-purple-500/50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img
                                src={getImageUrl(provider.logo_path, 'w92')}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg mx-auto mb-3"
                              />
                              <span className="text-white text-sm font-medium block mb-2">{provider.provider_name}</span>
                              <div className="flex items-center justify-center space-x-1 text-purple-400 text-xs">
                                <ExternalLink className="w-3 h-3" />
                                <span>Buy Now</span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-white mb-2">No streaming options available</h4>
                    <p className="text-gray-400">
                      Streaming information is not available for this movie in your region.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;