import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Error States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleValidation = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      triggerToast('error', 'Please correct the highlighted form errors.');
      return;
    }

    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      triggerToast('success', 'Authenticated successfully! Redirecting...');
      setTimeout(() => {
        onNavigate('/exporter');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col relative font-sans overflow-hidden">

      {/* Background Animated Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] animate-float"></div>

        {/* Subtle grid/dot pattern */}
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success'
          ? 'bg-emerald-50 border-emerald-200/50 text-white shadow-emerald-500/10'
          : 'bg-red-50 border-red-200 text-red-800 shadow-red-500/5'
          }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-white' : 'bg-red-500'}`}></div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Navbar overlay back to landing */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors bg-white/80 border border-slate-200/80 backdrop-blur-md px-4 py-2 rounded-xl cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Main Split Content */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 min-h-screen relative z-10">

        {/* Left Side: Modern Graphic & Testimonial (60%) */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-50/50 border-r border-slate-200/80 flex-col items-center justify-center p-12 relative overflow-hidden">

          {/* Subtle geometric circles */}
          <div className="absolute w-[400px] h-[400px] border border-slate-200/60 rounded-full z-0"></div>
          <div className="absolute w-[550px] h-[550px] border border-dashed border-slate-200/50 rounded-full z-0 animate-spin-slow"></div>

          {/* Central Flat Style Human Illustration */}
          <div className="relative z-10 flex flex-col items-center max-w-lg text-center">

            {/* SVG Illustration Container */}
            <div className="w-full max-w-[340px] aspect-square flex items-center justify-center relative mb-8">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Background decorative grid bubble */}
                <circle cx="150" cy="150" r="100" fill="#f1f5f9" fillOpacity="0.8" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="150" cy="150" r="80" fill="#e2e8f0" fillOpacity="0.5" />

                {/* Floating abstract elements */}
                {/* 1. Globe outline */}
                <g className="animate-float" style={{ animationDelay: '1s' }}>
                  <circle cx="80" cy="90" r="22" fill="#ffffff" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M68 90 A 22 22 0 0 0 92 90 M80 68 A 22 22 0 0 0 80 112" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.6" />
                </g>

                {/* 2. Checked Document */}
                <g className="animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }}>
                  <rect x="200" y="80" width="30" height="38" rx="3" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" className="shadow-sm" />
                  <line x1="206" y1="92" x2="216" y2="92" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="206" y1="100" x2="224" y2="100" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="206" y1="108" x2="218" y2="108" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="222" cy="92" r="3" fill="#10b981" />
                </g>

                {/* 3. Container Ship silhouette */}
                <g className="animate-float" style={{ animationDelay: '0.2s' }}>
                  <path d="M 60 210 L 105 210 L 98 220 L 67 220 Z" fill="#3b82f6" />
                  <rect x="70" y="200" width="8" height="10" fill="#10b981" />
                  <rect x="80" y="202" width="8" height="8" fill="#3b82f6" />
                  <rect x="90" y="205" width="8" height="5" fill="#64748b" />
                  <line x1="50" y1="223" x2="115" y2="223" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                </g>

                {/* Human/Businessperson vector */}
                <g>
                  {/* Suit torso */}
                  <path d="M 110 240 L 190 240 L 175 190 L 125 190 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
                  {/* Tie */}
                  <path d="M 146 190 L 154 190 L 152 210 L 148 210 Z" fill="#3b82f6" />
                  {/* Collars */}
                  <path d="M 130 190 L 142 200 L 148 190 M 170 190 L 158 200 L 152 190" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />

                  {/* Head skin */}
                  <circle cx="150" cy="165" r="18" fill="#cbd5e1" />
                  {/* Hair */}
                  <path d="M 132 165 Q 150 142 168 165 C 168 152 132 152 132 165" fill="#334155" />

                  {/* Tablet device */}
                  <rect x="135" y="195" width="38" height="26" rx="2.5" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" className="animate-pulse" />
                  <rect x="141" y="201" width="26" height="14" fill="#3b82f6" fillOpacity="0.1" />
                  {/* Green glowing indicator on device */}
                  <circle cx="154" cy="208" r="2.5" fill="#10b981" />

                  {/* Hands */}
                  <path d="M 125 210 Q 130 205 136 210 M 175 210 Q 170 205 164 210" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
              </svg>
            </div>

            {/* Title / Quote Text */}
            <h2 className="text-xl font-bold tracking-tight text-slate-805 mb-3">
              Compliance Intelligence Built for Global Growth
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              "TradeWise AI allowed us to index new custom tariffs and clear our freight compliance audits in record time."
            </p>
            <div className="mt-4 text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Exporter, Textile Council backing
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel (40%) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-12 relative">

          {/* Form Card wrapper */}
          <div className={`w-full max-w-md bg-white/70 border border-slate-200/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-transform ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}>

            {/* Header info */}
            <div className="text-center sm:text-left mb-8">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Sign in to access your export intelligence dashboard
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">



              {/* Email Input */}
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all ${errors.email ? 'border-red-500/50 bg-red-50/5' : 'border-slate-200'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-550 uppercase tracking-widest">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => triggerToast('error', 'Password reset code has been sent to your registered email.')}
                    className="text-xs font-semibold text-slate-500 hover:text-sky-650 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all ${errors.password ? 'border-red-500/50 bg-red-50/5' : 'border-slate-200'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-200 bg-white accent-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-101 active:scale-99 shadow-lg shadow-sky-500/10 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

            </form>

            {/* Register Footer */}
            <div className="mt-8 text-center border-t border-slate-200 pt-6">
              <p className="text-sm font-medium text-slate-500">
                New to TradeWise?{' '}
                <button
                  onClick={() => onNavigate('/register')}
                  className="font-bold text-sky-600 hover:text-sky-500 transition-colors inline-flex items-center gap-0.5"
                >
                  Create an account →
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Shaking animation inline rules */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
