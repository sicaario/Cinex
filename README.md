# 🎬 Cinex - Netflix-Style Movie Discovery Platform

A modern, responsive movie discovery platform built with React, TypeScript, and Tailwind CSS. Cinex provides a Netflix-like experience for browsing, searching, and discovering movies with real-time data from The Movie Database (TMDB).

![Cinex Preview](https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🎯 Core Features
- **Netflix-Style Interface** - Sleek, modern design inspired by Netflix
- **Infinite Scrolling** - Continuously load more movies as you scroll
- **Real-Time Search** - Search movies with live suggestions
- **Movie Categories** - Browse Trending, Upcoming, and Top Rated movies
- **Detailed Movie Pages** - Complete movie information with cast, crew, and streaming options
- **User Authentication** - Secure sign-up and sign-in with Supabase
- **Responsive Design** - Perfect experience across all devices

### 🎨 Design Highlights
- **Iconic Loading Animation** - Netflix-style startup animation
- **Smooth Transitions** - Framer Motion animations throughout
- **Dark Theme** - Cinematic black theme with red accents
- **Glassmorphism Effects** - Modern backdrop blur effects
- **Micro-interactions** - Hover states and button animations

### 🔍 Movie Discovery
- **Advanced Filtering** - Filter by genre, year, language, and rating
- **Smart Sorting** - Sort by popularity, rating, or release date
- **Watch Providers** - Find where to stream, rent, or buy movies
- **Movie Trailers** - Watch trailers directly from YouTube
- **Cast & Crew Info** - Detailed information about movie personnel

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Vite** - Fast build tool and development server

### Backend & Services
- **Supabase** - Authentication and database
- **TMDB API** - Movie data and images
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications

### Icons & Assets
- **Lucide React** - Beautiful, customizable icons
- **Pexels** - High-quality stock images
- **Custom SVG Favicon** - Branded C logo

## 🛠️ Installation & Setup

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

Visit `http://localhost:5173` to see the application.

## 📱 Usage

### Authentication
1. **Sign Up** - Create a new account with email and password
2. **Sign In** - Access your account
3. **Auto-login** - Stay signed in across sessions

### Movie Discovery
1. **Browse Categories** - Use the navigation to explore different movie categories
2. **Search Movies** - Use the search bar with live suggestions
3. **Filter Results** - Apply filters for genre, year, language, and rating
4. **View Details** - Click any movie to see detailed information
5. **Watch Trailers** - Click "Watch Trailer" to view on YouTube
6. **Find Streaming** - Check the "Watch Online" tab for streaming options

### Navigation
- **Trending** - Most popular movies this week
- **Upcoming** - Movies coming to theaters soon
- **Top Rated** - Highest-rated movies of all time (sorted by rating)

## 🎨 Design System

### Colors
- **Primary Red**: `#E50914` (Netflix red)
- **Background**: `#000000` (Pure black)
- **Text**: `#FFFFFF` (White)
- **Secondary**: `#808080` (Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Spacing
- **System**: 8px base unit
- **Consistent**: All spacing follows 8px increments

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Hero/           # Landing page hero section
│   ├── Layout/         # Header and navigation
│   ├── LoadingScreen/  # Netflix-style loading animation
│   ├── MovieCard/      # Individual movie cards
│   └── MovieSection/   # Movie grid sections
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── AuthPage.tsx    # Sign in/up page
│   ├── Home.tsx        # Landing page
│   ├── MovieDetails.tsx # Individual movie page
│   ├── MovieList.tsx   # Category pages
│   └── Search.tsx      # Search results page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and API calls
└── lib/                # Third-party library configurations
```

### Key Components

#### MovieCard
Displays individual movies with:
- Poster image with fallback
- Rating badge
- Hover animations
- Play button overlay

#### Header
Navigation component featuring:
- Responsive design
- Live search with suggestions
- User authentication status
- Mobile menu

#### Hero
Landing page hero with:
- Rotating movie backgrounds
- Auto-advancing slideshow
- Call-to-action buttons
- Scroll indicator

### API Integration

The app uses TMDB API for:
- Movie data and metadata
- High-resolution images
- Search functionality
- Genre information
- Cast and crew details
- Video trailers
- Streaming provider information

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** - For providing the comprehensive movie database API
- **Netflix** - Design inspiration for the user interface
- **Supabase** - For authentication and database services
- **Pexels** - For high-quality stock images
- **Framer Motion** - For smooth animations and transitions

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/cinex/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your issue

---

**Made with ❤️ and lots of ☕ by [Your Name]**

*Enjoy discovering movies with Cinex!* 🎬✨