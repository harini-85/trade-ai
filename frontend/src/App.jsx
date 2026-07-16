import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import HowItWorks from './components/HowItWorks';
import Ecosystem from './components/Ecosystem';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Exporter from './pages/Exporter';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync state with back/forward history actions
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Programmatic navigation utility
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Route router controller
  if (currentPath === '/login') {
    return <Login onNavigate={navigate} />;
  }

  if (currentPath === '/register') {
    return <Register onNavigate={navigate} />;
  }

  if (currentPath === '/exporter') {
    return <Exporter onNavigate={navigate} />;
  }

  // Default: Landing page "/"
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col antialiased select-none font-sans relative overflow-x-hidden">
      {/* Decorative Global Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/5 via-sky-500/2 to-transparent rounded-full glow-blur pointer-events-none z-0"></div>
      
      {/* Navigation Header */}
      <Navbar onNavigate={navigate} currentPath={currentPath} />

      {/* Main Sections */}
      <main className="flex-grow z-10">
        <Hero onNavigate={navigate} />
        <ProblemStatement />
        <HowItWorks />
        <Ecosystem />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default App;
