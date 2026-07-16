import React from 'react';
import { UploadCloud, BarChart4, Compass, GitCommit, Ship } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Product",
      subtitle: "Enter HS code & specifications",
      description: "Quickly enter your product's harmonized system (HS) code or describe your product in plain text. Our RAG engine extracts key details.",
      icon: UploadCloud,
    },
    {
      num: "02",
      title: "AI Analysis",
      subtitle: "Regulatory & cost indexing",
      description: "Our compliance intelligence and deterministic cost engines analyze global tariffs, certificates, shipping lanes, and demand signals.",
      icon: BarChart4,
    },
    {
      num: "03",
      title: "Get Rankings",
      subtitle: "Adaptive recommendation dashboard",
      description: "Receive an optimization-driven country ranking tailored to your profile—ranked by profit margins, compliance ease, or market demand.",
      icon: Compass,
    },
    {
      num: "04",
      title: "Explore Scenarios",
      subtitle: "Counterfactual 'what-if' simulator",
      description: "Ask hypothetical questions to recalculate rankings. E.g., 'What if my freight rate drops 15%?' or 'What if I obtain CE marking?'",
      icon: GitCommit,
    },
    {
      num: "05",
      title: "Connect & Export",
      subtitle: "Importers & logistics matched",
      description: "Directly match with pre-vetted international buyers, solicit immediate freight quotations, and finalize customs workflows.",
      icon: Ship,
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/80">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full glow-blur -translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            Operation Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            How TradeWise AI Empowers Exporters
          </h2>
          <p className="text-slate-605 mt-4">
            A seamless five-step integration process that simplifies global trade planning from initial concept to physical shipment.
          </p>
        </div>

        {/* Steps Flow Grid / Horizontal-Vertical Indicator */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-[2px] bg-gradient-to-r from-sky-500/40 via-indigo-500/60 to-emerald-500/40 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  {/* Circle Step Icon Wrapper */}
                  <div className="relative mb-6">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-white group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/5 to-indigo-500/5 border border-slate-200 group-hover:border-sky-500/60 transition-colors duration-300"></div>
                    
                    {/* Circle icon content */}
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-sky-600 group-hover:text-sky-500 transition-colors duration-300 shadow-sm">
                      <IconComponent className="w-9 h-9" />
                      
                      {/* Step Number Badge */}
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 border border-white text-xxs font-extrabold text-white flex items-center justify-center">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Connector Line (Mobile - vertical line below circle) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden w-[2px] h-12 bg-gradient-to-b from-sky-500/30 to-indigo-500/30 my-2"></div>
                  )}

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold mt-1">
                    {step.subtitle}
                  </p>
                  
                  {/* Detailed Description */}
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-xs px-2 lg:px-0">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
