import React from 'react';
import { HelpCircle, AlertCircle, TrendingDown, ShieldAlert } from 'lucide-react';

export default function ProblemStatement() {
  const painPoints = [
    {
      title: "Confused by complex regulations?",
      description: "Navigating hundreds of regulatory documents across multiple countries in different languages is a compliance nightmare.",
      icon: HelpCircle,
      color: "from-amber-50 to-orange-50 text-orange-600 border-orange-200"
    },
    {
      title: "Unsure which market is profitable?",
      description: "Without granular localized demand and pricing indicators, picking target export markets is mostly guesswork.",
      icon: TrendingDown,
      color: "from-rose-50 to-red-50 text-rose-600 border-rose-200"
    },
    {
      title: "Surprised by hidden costs?",
      description: "Unforeseen customs duties, local taxes, high freight margins, and unexpected storage fees wipe out profit margins.",
      icon: AlertCircle,
      color: "from-red-50 to-orange-50 text-red-650 border-red-200"
    },
    {
      title: "Worried about compliance risks?",
      description: "A single missing certificate or incorrect packaging label can result in customs rejection and massive financial losses.",
      icon: ShieldAlert,
      color: "from-rose-50 to-pink-50 text-rose-600 border-rose-200"
    }
  ];

  return (
    <section id="problem" className="py-24 bg-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-500/5 rounded-full glow-blur -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
            The Exporter's Dilemma
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Global Trade is Filled with Hidden Friction
          </h2>
          <p className="text-slate-600 mt-4">
            For SMEs, expanding globally is not just about producing great goods—it is about surviving an obstacle course of compliance, logistics, and opacity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Overwhelmed Exporter SVG Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] aspect-square bg-slate-50 rounded-3xl border border-slate-200 p-8 flex items-center justify-center relative shadow-sm">
              {/* Paperwork Storm SVG */}
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Desk */}
                <rect x="30" y="210" width="240" height="12" rx="4" fill="#cbd5e1" />
                <rect x="50" y="222" width="10" height="60" fill="#94a3b8" />
                <rect x="240" y="222" width="10" height="60" fill="#94a3b8" />

                {/* Overwhelmed Exporter sitting behind desk */}
                {/* Body / Torso */}
                <path d="M 120 210 Q 150 160 180 210 Z" fill="#475569" />
                {/* Head */}
                <circle cx="150" cy="140" r="22" fill="#fda4af" />
                {/* Hair */}
                <path d="M 128 135 Q 150 115 172 135 Q 165 120 150 120 Q 135 120 128 135 Z" fill="#1e293b" />
                {/* Hands on head */}
                <path d="M 120 150 Q 128 140 134 146" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 180 150 Q 172 140 166 146" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Sad face details */}
                <path d="M 143 145 Q 150 148 157 145" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Sweat drop */}
                <path d="M 166 138 Q 168 144 165 146" fill="#38bdf8" />

                {/* Floating paperwork / scattered documents */}
                {/* Paper 1 */}
                <g className="animate-float" style={{ animationDuration: '4s' }}>
                  <rect x="50" y="80" width="40" height="50" rx="2" fill="#f8fafc" transform="rotate(-15, 70, 100)" />
                  <line x1="56" y1="90" x2="84" y2="90" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-15, 70, 100)" />
                  <line x1="56" y1="100" x2="74" y2="100" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-15, 70, 100)" />
                  <line x1="56" y1="110" x2="80" y2="110" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-15, 70, 100)" />
                </g>

                {/* Paper 2 */}
                <g className="animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                  <rect x="200" y="60" width="35" height="45" rx="2" fill="#f8fafc" transform="rotate(25, 217, 82)" />
                  <line x1="205" y1="70" x2="230" y2="70" stroke="#cbd5e1" strokeWidth="2" transform="rotate(25, 217, 82)" />
                  <line x1="205" y1="80" x2="225" y2="80" stroke="#cbd5e1" strokeWidth="2" transform="rotate(25, 217, 82)" />
                  <line x1="205" y1="90" x2="220" y2="90" stroke="#cbd5e1" strokeWidth="2" transform="rotate(25, 217, 82)" />
                </g>

                {/* Paper 3 - Rejected Stamp */}
                <g className="animate-float" style={{ animationDuration: '6s', animationDelay: '0.5s' }}>
                  <rect x="70" y="160" width="45" height="55" rx="2" fill="#f8fafc" transform="rotate(5, 92, 187)" />
                  <line x1="76" y1="172" x2="104" y2="172" stroke="#cbd5e1" strokeWidth="2" transform="rotate(5, 92, 187)" />
                  <line x1="76" y1="182" x2="98" y2="182" stroke="#cbd5e1" strokeWidth="2" transform="rotate(5, 92, 187)" />
                  <line x1="76" y1="192" x2="102" y2="192" stroke="#cbd5e1" strokeWidth="2" transform="rotate(5, 92, 187)" />
                  <rect x="78" y="196" width="28" height="12" rx="1" fill="none" stroke="#ef4444" strokeWidth="1.5" transform="rotate(5, 92, 187)" />
                  <text x="92" y="205" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="bold" fontFamily="sans-serif" transform="rotate(5, 92, 187)">REJECTED</text>
                </g>

                {/* Tax / Tariff Invoice Document on desk */}
                <g>
                  <rect x="180" y="185" width="40" height="25" rx="1" fill="#fee2e2" />
                  <line x1="185" y1="190" x2="215" y2="190" stroke="#fca5a5" strokeWidth="1.5" />
                  <line x1="185" y1="195" x2="205" y2="195" stroke="#fca5a5" strokeWidth="1.5" />
                  <text x="212" y="206" fill="#ef4444" fontSize="8" fontWeight="black" fontFamily="sans-serif">₹</text>
                </g>

                {/* Stack of Folders */}
                <g>
                  <rect x="215" y="155" width="30" height="10" rx="1" fill="#e2e8f0" />
                  <rect x="215" y="167" width="32" height="10" rx="1" fill="#64748b" />
                  <rect x="215" y="179" width="31" height="10" rx="1" fill="#cbd5e1" />
                  <rect x="215" y="191" width="33" height="18" rx="2" fill="#b91c1c" />
                  <text x="231" y="203" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TARIFF</text>
                </g>

                {/* Warning sign in background */}
                <g className="animate-pulse">
                  <polygon points="150,15 175,55 125,55" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
                  <text x="150" y="48" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="extrabold" fontFamily="sans-serif">!</text>
                </g>
              </svg>

              {/* Absolute label */}
              <div className="absolute top-4 left-4 bg-slate-100 border border-slate-200 text-[10px] text-slate-650 font-bold px-2 py-1 rounded">
                EXPORTER WORKSPACE (MANUAL METHOD)
              </div>
            </div>
          </div>

          {/* Right Side: Key Pain Points */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {painPoints.map((point, index) => {
              const IconComp = point.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-gradient-to-tr shrink-0 ${point.color} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
