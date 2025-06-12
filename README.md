# 🎬 Cinex - Netflix-Style Movie Discovery Platform

A modern, responsive movie discovery platform built with React, TypeScript, and Tailwind CSS. Cinex provides a Netflix-like experience for browsing, searching, and discovering movies with real-time data from The Movie Database (TMDB).

![Cinex Preview](https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### Core Features
- **Netflix-Style Interface** - Sleek, modern design inspired by Netflix
- **Infinite Scrolling** - Continuously load more movies as you scroll
- **Real-Time Search** - Search movies with live suggestions
- **Movie Categories** - Browse Trending, Upcoming, and Top Rated movies
- **Detailed Movie Pages** - Complete movie information with cast, crew, and streaming options
- **User Authentication** - Secure sign-up and sign-in with Supabase
- **Responsive Design** - Perfect experience across all devices

###  Movie Discovery
- **Advanced Filtering** - Filter by genre, year, language, and rating
- **Smart Sorting** - Sort by popularity, rating, or release date
- **Watch Providers** - Find where to stream, rent, or buy movies
- **Movie Trailers** - Watch trailers directly from YouTube
- **Cast & Crew Info** - Detailed information about movie personnel

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TMDB API key
- Supabase project

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cinex.git
cd cinex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Get API Keys

#### TMDB API Key
1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account and verify your email
3. Go to Settings > API
4. Request an API key (free)
5. Copy your API key to the `.env` file

#### Supabase Setup
1. Visit [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy your URL and anon key to the `.env` file

### 5. Run the Development Server
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

