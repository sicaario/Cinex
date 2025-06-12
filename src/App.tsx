import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AuthPage from './pages/AuthPage';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import MovieList from './pages/MovieList';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/trending" element={<MovieList />} />
        <Route path="/popular" element={<MovieList />} />
        <Route path="/upcoming" element={<MovieList />} />
        <Route path="/top-rated" element={<MovieList />} />
        <Route path="/now-playing" element={<MovieList />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.95)',
                color: '#ffffff',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#E50914',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;