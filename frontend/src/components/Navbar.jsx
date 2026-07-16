import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ onNavigate, currentPath }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Ecosystem', href: '#ecosystem' }
  ];

  const handleNavClick = (e, href) => {
    if (currentPath !== '/') {
      e.preventDefault();
      onNavigate('/');
      // Wait for navigation back to home before scrolling to element
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-4 glass-panel border-b border-white/10 shadow-lg' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('/')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Globe className="w-6 h-6 text-white animate-pulse-slow" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-850 to-slate-600 bg-clip-text text-transparent">
              TradeWise<span className="text-sky-500">AI</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100/50 text-xs font-bold text-slate-650 hover:text-slate-900 hover:border-slate-350 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-28 rounded-lg bg-white border border-slate-200 shadow-xl py-1 z-50">
                  {['EN', 'हिन्दी', 'తెలుగు'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l === 'EN' ? 'EN' : l === 'हिन्दी' ? 'HI' : 'TE');
                        setShowLangMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Actions */}
            <button
              onClick={() => onNavigate('/login')}
              className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            
            <button
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-panel border-b border-white/10 shadow-2xl py-6 px-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, item.href);
                }}
                className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
            
            <div className="border-t border-slate-100/80 pt-4 flex flex-col gap-3">
              <button
                onClick={() => { setIsOpen(false); onNavigate('/login'); }}
                className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors w-full py-2.5 border border-slate-200 rounded-xl cursor-pointer"
              >
                Sign In
              </button>
              
              <button
                onClick={() => { setIsOpen(false); onNavigate('/register'); }}
                className="inline-flex items-center justify-center gap-2 w-full py-3 font-semibold rounded-xl text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-all text-center cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
