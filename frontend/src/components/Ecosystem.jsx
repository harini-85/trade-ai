import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Truck, Package } from 'lucide-react';

export default function Ecosystem() {
  const [activePortal, setActivePortal] = useState('exporter');

  const portals = [
    {
      id: 'exporter',
      role: 'Exporter Portal',
      description: 'Built for Indian SMEs seeking target global markets without compliance risk.',
      features: [
        'Context-aware country recommendations & scores',
        'Grounded multi-lingual compliance RAG searches',
        'Deterministic landed cost & profit estimators'
      ],
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200 shadow-sm',
      glowColor: '#0284c7'
    },
    {
      id: 'importer',
      role: 'Importer Portal',
      description: 'Designed for global buyers wishing to source pre-screened quality goods from India.',
      features: [
        'AI product matching & verification tools',
        'Direct connection to certified Indian exporters',
        'Frictionless digital order & documentation tracking'
      ],
      colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-sm',
      glowColor: '#4f46e5'
    },
    {
      id: 'logistics',
      role: 'Logistics Partner Portal',
      description: 'Enables global freight forwarders and customs brokers to bid on ready shipments.',
      features: [
        'Direct automated request for freight quotes',
        'Streamlined customs clearance documentation matching',
        'Real-time transit updates and policy drift alerts'
      ],
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm',
      glowColor: '#059669'
    }
  ];

  const currentPortalDetails = portals.find(p => p.id === activePortal);

  return (
    <section id="ecosystem" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/80">
      <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-500/5 rounded-full glow-blur animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            Collaborative Network
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Interconnected Trade Ecosystem
          </h2>
          <p className="text-slate-600 mt-4">
            TradeWise AI unites Exporters, Importers, and Logistics partners onto a single synchronized network to minimize delay and manual overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Interconnected Portals Tabs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {portals.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePortal(p.id)}
                  className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activePortal === p.id 
                      ? 'bg-white border-slate-300 shadow-md' 
                      : 'bg-slate-100/50 border-slate-200/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-base text-slate-800">
                    <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: p.glowColor }}></span>
                    {p.role}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>
                </button>
              ))}
            </div>

            {/* Portal Features Display Card */}
            {currentPortalDetails && (
              <div className={`p-6 rounded-2xl border transition-all duration-500 ${currentPortalDetails.colorClass}`}>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  {currentPortalDetails.role} Key Features
                </h4>
                <ul className="flex flex-col gap-3">
                  {currentPortalDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <ShieldCheck className="w-4.5 h-4.5 text-inherit shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Side: Animated Triangle Network Map */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[400px] aspect-square bg-white border border-slate-200 rounded-3xl p-6 relative flex items-center justify-center shadow-sm animate-float">
              <svg viewBox="0 0 300 300" className="w-full h-full relative z-10">
                {/* Inter-node paths */}
                {/* Exporter (150, 50) to Importer (240, 210) */}
                <path d="M 150 50 L 240 210" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                {/* Importer (240, 210) to Logistics (60, 210) */}
                <path d="M 240 210 L 60 210" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                {/* Logistics (60, 210) to Exporter (150, 50) */}
                <path d="M 60 210 L 150 50" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />

                {/* Animated flowing particles */}
                {/* Exporter to Importer particle */}
                <circle r="4" fill="#0284c7" className="animate-[moveParticle1_3s_linear_infinite]" />
                {/* Importer to Logistics particle */}
                <circle r="4" fill="#4f46e5" className="animate-[moveParticle2_3s_linear_infinite]" />
                {/* Logistics to Exporter particle */}
                <circle r="4" fill="#059669" className="animate-[moveParticle3_3s_linear_infinite]" />

                {/* Exporter Node (Top) */}
                <g className="cursor-pointer" onClick={() => setActivePortal('exporter')}>
                  <circle cx="150" cy="50" r="28" fill="#f1f5f9" stroke={activePortal === 'exporter' ? '#0284c7' : '#cbd5e1'} strokeWidth="2.5" />
                  <circle cx="150" cy="50" r="22" fill="#ffffff" className="shadow-sm" />
                  <Package className="w-6 h-6 text-sky-600" x="138" y="38" />
                  <text x="150" y="93" textAnchor="middle" fill="#0284c7" className="text-[10px] font-bold tracking-wider uppercase">Exporter</text>
                </g>

                {/* Importer Node (Bottom Right) */}
                <g className="cursor-pointer" onClick={() => setActivePortal('importer')}>
                  <circle cx="240" cy="210" r="28" fill="#f1f5f9" stroke={activePortal === 'importer' ? '#4f46e5' : '#cbd5e1'} strokeWidth="2.5" />
                  <circle cx="240" cy="210" r="22" fill="#ffffff" className="shadow-sm" />
                  <UserCheck className="w-6 h-6 text-indigo-650" x="228" y="198" />
                  <text x="240" y="253" textAnchor="middle" fill="#4f46e5" className="text-[10px] font-bold tracking-wider uppercase">Importer</text>
                </g>

                {/* Logistics Node (Bottom Left) */}
                <g className="cursor-pointer" onClick={() => setActivePortal('logistics')}>
                  <circle cx="60" cy="210" r="28" fill="#f1f5f9" stroke={activePortal === 'logistics' ? '#059669' : '#cbd5e1'} strokeWidth="2.5" />
                  <circle cx="60" cy="210" r="22" fill="#ffffff" className="shadow-sm" />
                  <Truck className="w-6 h-6 text-emerald-600" x="48" y="198" />
                  <text x="60" y="253" textAnchor="middle" fill="#059669" className="text-[10px] font-bold tracking-wider uppercase">Logistics</text>
                </g>
              </svg>

              {/* Central text display */}
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 tracking-wider">
                SYNCHRONIZED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Particle Animation CSS */}
      <style>{`
        @keyframes moveParticle1 {
          0% { cx: 150; cy: 50; }
          100% { cx: 240; cy: 210; }
        }
        @keyframes moveParticle2 {
          0% { cx: 240; cy: 210; }
          100% { cx: 60; cy: 210; }
        }
        @keyframes moveParticle3 {
          0% { cx: 60; cy: 210; }
          100% { cx: 150; cy: 50; }
        }
      `}</style>
    </section>
  );
}
