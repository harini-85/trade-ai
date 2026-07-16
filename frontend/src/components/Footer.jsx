import React from 'react';
import { Globe, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-200 mb-12">
          
          {/* Column 1: Brand & Statement */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-905">
                TradeWise<span className="text-sky-655">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              AI-powered global compliance, landed cost calculation, and market ranking decision intelligence built for Indian SMEs.
            </p>
            <div className="text-xxs font-bold text-sky-600 tracking-wider mt-2">
              🇮🇳 BUILT FOR INDIAN SMEs, COMPETING GLOBALLY
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li><a href="#how-it-works" className="hover:text-slate-950 transition-colors">CAER Rankings</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-950 transition-colors">Landed Cost Engine</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-950 transition-colors">Compliance RAG</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-950 transition-colors">What-If Explorer</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li><a href="#how-it-works" className="hover:text-slate-950 transition-colors">Compliance Framework</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">HS Classification Codes</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">Compliance Index Rules</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">API References</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li><a href="#" className="hover:text-slate-950 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">Beta Exporters</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">Export Council Partners</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Column 5: Newsletter Signup */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Subscribe to Alerts</h4>
            <p className="text-xxs text-slate-500 leading-normal">Get instant WhatsApp & email digests on regulatory changes.</p>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 shadow-xxs">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent text-xs text-slate-800 px-2 py-1.5 focus:outline-none w-full placeholder-slate-400" 
              />
              <button className="bg-sky-600 hover:bg-sky-500 text-white p-1.5 rounded-md transition-colors cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Language Selector, Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <div className="text-xxs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} TradeWise AI Technologies Private Limited. All rights reserved.
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-slate-600 text-xxs font-semibold bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
            <Globe className="w-3 h-3 text-sky-655" />
            <span>English (India)</span>
          </div>

          {/* Social Icons (using inline SVGs for compatibility) */}
          <div className="flex gap-4 text-slate-500">
            <a href="#" className="hover:text-slate-905 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-slate-905 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-slate-905 transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
