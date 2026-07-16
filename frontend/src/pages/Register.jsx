import React, { useState } from 'react';
import { Eye, EyeOff, User, Building, Mail, Phone, Globe, Lock, Briefcase, Truck, ShieldCheck, ArrowLeft, ArrowRight, Loader2, Check, X } from 'lucide-react';

export default function Register({ onNavigate }) {
  const [step, setStep] = useState(1); // 1, 2, 3
  const [role, setRole] = useState('exporter'); // 'exporter', 'logistics'

  // Step 1: Basic Info Form States
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Show/Hide Passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Role-Specific Details States
  // Exporter Specifics
  const [exporterGst, setExporterGst] = useState('');
  const [exporterType, setExporterType] = useState('Both'); // Manufacturer, Trader, Both
  const [exporterCategories, setExporterCategories] = useState(['Spices']); // Spices, Textiles, Agri-Prod, Handicraft
  const [exporterProducts, setExporterProducts] = useState('');
  const [exporterExp, setExporterExp] = useState('Beginner'); // Beginner, Intermediate, Experienced



  // Logistics Specifics
  const [logisticsServices, setLogisticsServices] = useState(['Sea Freight', 'Customs Clearance']); // Air, Sea, Road, Rail, Customs, Warehousing
  const [logisticsRegions, setLogisticsRegions] = useState(['Middle East', 'Southeast Asia']); // Europe, Middle East, Southeast Asia, North America, South America, Africa

  // Step 3: Terms & Conditions
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };



  // Validate step transitions
  const validateStep1 = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Required';
    if (!companyName) newErrors.companyName = 'Required';
    if (!email) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }
    if (!phone) newErrors.phone = 'Required';
    if (!password) {
      newErrors.password = 'Required';
    } else if (password.length < 8) {
      newErrors.password = 'Min 8 chars';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mismatch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (role === 'exporter') {
      if (!exporterGst) newErrors.exporterGst = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        triggerToast('error', 'Please correct the validation errors in Step 1.');
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        triggerToast('error', 'Please complete the business registration details.');
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Multi-select and add helpers
  const toggleSelection = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };



  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      triggerToast('error', 'You must agree to the Terms and Conditions to proceed.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerToast('success', 'Account created successfully! Redirecting...');
      setTimeout(() => {
        if (role === 'logistics') {
          onNavigate('/logistics');
        } else {
          onNavigate('/exporter');
        }
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col relative font-sans overflow-hidden">
      
      {/* Background Animated Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-250 text-slate-800 shadow-emerald-500/5' 
            : 'bg-red-50 border border-red-200 text-red-800 shadow-red-500/5'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Back button */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-655 hover:text-slate-900 transition-all bg-white border border-slate-200/80 backdrop-blur-md px-4 py-2 rounded-xl cursor-pointer shadow-sm"
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
            <h2 className="text-xl font-bold tracking-tight text-slate-850 mb-3">
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

        {/* Right Side: Step-by-Step Form Column (40%) */}
        <div className="lg:col-span-5 flex flex-col justify-center py-8 px-6 sm:px-8 relative overflow-y-auto max-h-screen">
          
          {/* Registration Card Wrapper */}
          <div className={`w-full max-w-lg bg-white border border-slate-200/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-7 transition-transform ${
            shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
          }`}>
            
            {/* Step Indicator Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between max-w-xs mx-auto relative mb-3">
                {/* Connection Line Background */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
                
                {/* Connection Line Active */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-sky-500 transition-all duration-300 z-0"
                  style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                ></div>

                {/* Step 1 Circle */}
                <button 
                  onClick={() => step > 1 && setStep(1)} 
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border transition-all cursor-pointer ${
                    step === 1 
                      ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' 
                      : step > 1 
                        ? 'bg-emerald-500 border-emerald-400 text-white' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </button>

                {/* Step 2 Circle */}
                <button 
                  onClick={() => step > 2 && setStep(2)}
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border transition-all cursor-pointer ${
                    step === 2 
                      ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' 
                      : step > 2 
                        ? 'bg-emerald-500 border-emerald-400 text-white' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </button>

                {/* Step 3 Circle */}
                <div 
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border transition-all ${
                    step === 3 
                      ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' 
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  3
                </div>
              </div>

              <div className="flex justify-between max-w-xs mx-auto text-[9px] font-bold text-slate-450 uppercase tracking-widest text-center px-1">
                <span className={step >= 1 ? 'text-sky-600 font-extrabold' : ''}>Basic</span>
                <span className={step >= 2 ? 'text-sky-600 font-extrabold' : ''}>Details</span>
                <span className={step >= 3 ? 'text-sky-600 font-extrabold' : ''}>Confirm</span>
              </div>
            </div>

            {/* ==================================================== */}
            {/* STEP 1 CONTENT: BASIC DETAILS & ROLE SELECTION */}
            {/* ==================================================== */}
            {step === 1 && (
              <div className="space-y-5 animate-slide-in-right">
                
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create Your Account</h2>
                  <p className="text-xxs text-slate-500 font-medium">Step 1 of 3 · Profile and Role Settings</p>
                </div>

                {/* Double-Column Fields Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  
                  {/* Full Name */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: null });
                        }}
                        placeholder="John Doe" 
                        className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.fullName ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (errors.companyName) setErrors({ ...errors, companyName: null });
                        }}
                        placeholder="Acme Ltd" 
                        className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.companyName ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        placeholder="name@company.com" 
                        className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.email ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        placeholder="+91 98765" 
                        className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.phone ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="col-span-2 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Base Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 cursor-pointer"
                      >
                        <option>India</option>
                        <option>Germany</option>
                        <option>Singapore</option>
                        <option>Japan</option>
                        <option>UAE</option>
                        <option>United States</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: null });
                        }}
                        placeholder="Min 8 chars" 
                        className={`w-full pl-9 pr-9 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.password ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-span-1 space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Verify Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                        }}
                        placeholder="Verify password" 
                        className={`w-full pl-9 pr-9 py-2 bg-white border rounded-xl text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Validation helper lines */}
                {(errors.fullName || errors.companyName || errors.email || errors.phone || errors.password || errors.confirmPassword) && (
                  <div className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200/50 px-3 py-1.5 rounded-lg">
                    {errors.fullName || errors.companyName || errors.email || errors.phone || errors.password || errors.confirmPassword}
                  </div>
                )}

                {/* Role Selection Horizontal Cards */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Account Role</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Exporter Card */}
                    <div 
                      onClick={() => setRole('exporter')}
                      className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                        role === 'exporter'
                          ? 'border-sky-500 bg-sky-50/40 text-slate-900 scale-[1.02] shadow-sm'
                          : 'border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Briefcase className={`w-5 h-5 ${role === 'exporter' ? 'text-sky-500' : 'text-slate-400'}`} />
                      <span className="text-xxs font-bold mt-1">Exporter</span>
                    </div>

                    {/* Logistics Card */}
                    <div 
                      onClick={() => setRole('logistics')}
                      className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                        role === 'logistics'
                          ? 'border-sky-500 bg-sky-50/40 text-slate-900 scale-[1.02] shadow-sm'
                          : 'border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Truck className={`w-5 h-5 ${role === 'logistics' ? 'text-sky-500' : 'text-slate-400'}`} />
                      <span className="text-xxs font-bold mt-1">Logistics</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="text-xs font-semibold text-slate-500 hover:text-sky-655 transition-colors cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-103 shadow-md rounded-xl transition-all cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* ==================================================== */}
            {/* STEP 2 CONTENT: ROLE SPECIFIC INFORMATION */}
            {/* ==================================================== */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-in-right">
                
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tell Us About Your Business</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Step 2 of 3 · {role === 'exporter' ? 'Exporter Details' : 'Logistics Partner Details'}</p>
                </div>

                {/* RENDER EXPORTER DETAILS */}
                {role === 'exporter' && (
                  <div className="space-y-5">
                    {/* GST No */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GST / Business Registration No.</label>
                      <input 
                        type="text" 
                        value={exporterGst}
                        onChange={(e) => {
                          setExporterGst(e.target.value);
                          if (errors.exporterGst) setErrors({ ...errors, exporterGst: null });
                        }}
                        placeholder="29AAAAA0000A1Z1" 
                        className={`w-full px-4 py-2 bg-white border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 ${
                          errors.exporterGst ? 'border-red-500/50' : 'border-slate-200'
                        }`}
                      />
                      {errors.exporterGst && <p className="text-xs text-red-500 font-semibold">{errors.exporterGst}</p>}
                    </div>

                    {/* Business Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Type</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['Manufacturer', 'Trader', 'Both'].map((t) => (
                          <button 
                            key={t}
                            type="button" 
                            onClick={() => setExporterType(t)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              exporterType === t 
                                ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/10 scale-102' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Category Multi-Select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {['Spices', 'Textiles', 'Agri-Prod', 'Handicraft'].map((cat) => {
                          const active = exporterCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleSelection(exporterCategories, setExporterCategories, cat)}
                              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                active
                                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 border-sky-400 text-white shadow-md scale-102'
                                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <span>{cat}</span>
                              {active && <X className="w-3 h-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary Products Description (Single-line input to prevent vertical overflow) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">Primary Products Description</label>
                      <input 
                        type="text"
                        value={exporterProducts}
                        onChange={(e) => setExporterProducts(e.target.value)}
                        placeholder="e.g. Organic black pepper, tumeric powder..." 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
                      />
                    </div>

                    {/* Export Experience */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Export Experience</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['Beginner', 'Intermediate', 'Experienced'].map((exp) => (
                          <button 
                            key={exp}
                            type="button" 
                            onClick={() => setExporterExp(exp)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              exporterExp === exp 
                                ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/10 scale-102' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}



                {/* RENDER LOGISTICS DETAILS */}
                {role === 'logistics' && (
                  <div className="space-y-5">
                    {/* Service Types */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-555 uppercase tracking-widest">Service Types Offered</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Air Freight', 'Sea Freight', 'Road Transport', 'Rail Transport', 'Customs Clearance', 'Warehousing'].map((svc) => {
                          const active = logisticsServices.includes(svc);
                          return (
                            <button
                              key={svc}
                              type="button"
                              onClick={() => toggleSelection(logisticsServices, setLogisticsServices, svc)}
                              className={`py-1.5 px-1 rounded-xl text-xxs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                active
                                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-102'
                                  : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                              }`}
                            >
                              <span>{svc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Service Regions */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service Regions</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Europe', 'Middle East', 'Southeast Asia', 'North America', 'South America', 'Africa'].map((reg) => {
                          const active = logisticsRegions.includes(reg);
                          return (
                            <button
                              key={reg}
                              type="button"
                              onClick={() => toggleSelection(logisticsRegions, setLogisticsRegions, reg)}
                              className={`py-1.5 px-1 rounded-xl text-xxs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                active
                                  ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-102'
                                  : 'bg-white border-slate-200 text-slate-555 hover:bg-slate-50'
                              }`}
                            >
                              <span>{reg}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold border border-slate-200 bg-white/50 rounded-xl hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-6 py-2 font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-103 shadow-md rounded-xl transition-all cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* ==================================================== */}
            {/* STEP 3 CONTENT: CONFIRMATION & REVIEW */}
            {/* ==================================================== */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-in-right">
                
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Review & Confirm</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Step 3 of 3 · Verify Profile Details</p>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Summary</h3>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Info Fields */}
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Full Name</span>
                      <span className="text-slate-800">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company</span>
                      <span className="text-slate-800">{companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-800">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone</span>
                      <span className="text-slate-800">{phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Country</span>
                      <span className="text-slate-800">{country}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2.5">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Role</span>
                      <span className="text-sky-600 font-extrabold capitalize text-[10px]">{role}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  
                  {/* Checkbox agreement */}
                  <div className="flex items-start">
                    <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-500 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-200 bg-white accent-sky-500 focus:ring-0 cursor-pointer"
                      />
                      <span>
                        I agree to the{' '}
                        <span className="text-sky-655 hover:text-sky-500 underline">Terms of Service</span>
                        {' '}and{' '}
                        <span className="text-sky-655 hover:text-sky-500 underline">Privacy Policy</span>.
                      </span>
                    </label>
                  </div>

                  {/* Navigation and Register Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <button 
                      type="button" 
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold border border-slate-200 bg-white/50 rounded-xl hover:text-slate-900 hover:border-slate-350 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-103 active:scale-98 shadow-lg shadow-sky-500/10 rounded-xl transition-all disabled:opacity-50 cursor-pointer animate-[pulseGlow_3s_infinite]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Embedded Styles for shake and pulses */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
