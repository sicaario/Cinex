const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

if (!API_KEY) {
  console.error('TMDB API key is required. Please add VITE_TMDB_API_KEY to your .env file.');
}

if (!BASE_URL) {
  console.error('TMDB Base URL is required. Please add VITE_TMDB_BASE_URL to your .env file.');
}

if (!IMAGE_BASE_URL) {
  console.error('TMDB Image Base URL is required. Please add VITE_TMDB_IMAGE_BASE_URL to your .env file.');
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchFromAPI(endpoint: string, params: Record<string, string> = {}) {
  if (!API_KEY || !BASE_URL) {
    throw new ApiError('TMDB API configuration is incomplete. Please check your environment variables.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const statusText = response.statusText || 'Unknown Error';
      const errorMessage = `API request failed: ${statusText} (Status: ${response.status})`;
      throw new ApiError(errorMessage, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
}

// Movie endpoints
export const movieApi = {
  // Get trending movies
  getTrending: (timeWindow: 'day' | 'week' = 'week', page: number = 1) =>
    fetchFromAPI(`/trending/movie/${timeWindow}`, { page: page.toString() }),

  // Get popular movies
  getPopular: (page: number = 1) =>
    fetchFromAPI('/movie/popular', { page: page.toString() }),

  // Get upcoming movies
  getUpcoming: (page: number = 1) =>
    fetchFromAPI('/movie/upcoming', { page: page.toString() }),

  // Get top rated movies
  getTopRated: (page: number = 1) =>
    fetchFromAPI('/movie/top_rated', { page: page.toString() }),

  // Get now playing movies
  getNowPlaying: (page: number = 1) =>
    fetchFromAPI('/movie/now_playing', { page: page.toString() }),

  // Get movie details
  getDetails: (movieId: number) =>
    fetchFromAPI(`/movie/${movieId}`),

  // Get movie credits
  getCredits: (movieId: number) =>
    fetchFromAPI(`/movie/${movieId}/credits`),

  // Get movie videos
  getVideos: (movieId: number) =>
    fetchFromAPI(`/movie/${movieId}/videos`),

  // Get movie watch providers
  getWatchProviders: (movieId: number) =>
    fetchFromAPI(`/movie/${movieId}/watch/providers`),

  // Get similar movies
  getSimilar: (movieId: number, page: number = 1) =>
    fetchFromAPI(`/movie/${movieId}/similar`, { page: page.toString() }),

  // Search movies
  search: (query: string, page: number = 1) =>
    fetchFromAPI('/search/movie', { query, page: page.toString() }),

  // Discover movies with filters
  discover: (filters: {
    page?: number;
    genre?: string;
    year?: string;
    language?: string;
    sortBy?: string;
    minRating?: string;
  } = {}) => {
    const params: Record<string, string> = {};
    
    if (filters.page) params.page = filters.page.toString();
    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.year = filters.year;
    if (filters.language) params.with_original_language = filters.language;
    if (filters.sortBy) params.sort_by = filters.sortBy;
    if (filters.minRating) params['vote_average.gte'] = filters.minRating;
    
    return fetchFromAPI('/discover/movie', params);
  },

  // Get genres
  getGenres: () =>
    fetchFromAPI('/genre/movie/list'),

  // Get languages
  getLanguages: () =>
    fetchFromAPI('/configuration/languages'),
};

// Helper functions for image URLs
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = 'w1280') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};