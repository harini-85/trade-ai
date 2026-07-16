import React, { useState, useEffect } from 'react';
import { 
  Globe, Bell, User as UserIcon, Settings, LogOut, Briefcase, ShoppingCart, 
  Truck, ArrowUpRight, Search, Plus, Trash2, Edit3, Eye, X, Check, AlertTriangle, 
  ChevronDown, HelpCircle, Activity, TrendingUp, Sliders, DollarSign, Loader2
} from 'lucide-react';

export default function Exporter({ onNavigate }) {
  // Active View: 'overview', 'products', 'analysis', 'orders', 'logistics', 'profile'
  const [activeView, setActiveView] = useState('overview');
  
  // Navigation Profile Menu Dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Notifications Dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Market analysis completed for Turmeric Powder", time: "2 hours ago", type: "analysis", read: false },
    { id: 2, text: "New order #ORD-001 received from Al Noor Trading", time: "5 hours ago", type: "order", read: false },
    { id: 3, text: "Shipment #SH-042 reached customs in Germany", time: "1 day ago", type: "shipment", read: true }
  ]);

  // Toast stack state
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // 1. Seed Products State
  const [products, setProducts] = useState([
    { id: 1, name: "Organic Turmeric Powder", hscode: "0910.30", category: "Spices", price: 350, unit: "kg", currency: "INR", origin: "India", status: "Active" },
    { id: 2, name: "Cumin Seeds", hscode: "0909.31", category: "Spices", price: 420, unit: "kg", currency: "INR", origin: "India", status: "Active" },
    { id: 3, name: "Green Cardamom", hscode: "0908.31", category: "Spices", price: 1200, unit: "kg", currency: "INR", origin: "India", status: "Draft" },
    { id: 4, name: "Black Pepper", hscode: "0904.11", category: "Spices", price: 580, unit: "kg", currency: "INR", origin: "India", status: "Analyzing" }
  ]);

  // Product Filter & Search
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Add Product Drawer State
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdHscode, setNewProdHscode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Spices');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCurrency, setNewProdCurrency] = useState('INR');
  const [newProdOrigin, setNewProdOrigin] = useState('India');
  const [drawerLoading, setDrawerLoading] = useState(false);

  // 2. Seed Orders State
  const [orders, setOrders] = useState([
    { id: 'ORD-001', importer: "Al Noor Trading", country: "UAE", email: "alnoor@trading.ae", phone: "+971-50-1234567", product: "Organic Turmeric Powder", hscode: "0910.30", qty: "500 kg", value: "₹1,75,000", status: "Pending", date: "15 July 2026", delivery: "30 July 2026" },
    { id: 'ORD-002', importer: "EuroSpice GmbH", country: "Germany", email: "info@eurospice.de", phone: "+49-89-987654", product: "Cumin Seeds", hscode: "0909.31", qty: "200 kg", value: "₹84,000", status: "Accepted", date: "12 July 2026", delivery: "28 July 2026" },
    { id: 'ORD-003', importer: "SingaFoods", country: "Singapore", email: "buying@singafoods.sg", phone: "+65-6789-0123", product: "Green Cardamom", hscode: "0908.31", qty: "100 kg", value: "₹1,20,000", status: "Shipped", date: "10 July 2026", delivery: "25 July 2026" }
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('All');

  // 3. Seed Shipments State
  const [shipments, setShipments] = useState([
    { id: 'SH-042', orderId: 'ORD-002', logistics: "FastCargo Logistics", method: "Sea Freight", tracking: "FCL-MUM-HAM-2026-042", dest: "Germany", status: "In Transit", eta: "28 July 2026", currentLoc: "Vessel departed Mumbai Port, en route to Hamburg" },
    { id: 'SH-041', orderId: 'ORD-001', logistics: "GlobalShip Inc.", method: "Air Freight", tracking: "GSI-DEL-DXB-2026-041", dest: "UAE", status: "Customs Clearance", eta: "24 July 2026", currentLoc: "Held at Dubai Port for customs document audit" },
    { id: 'SH-040', orderId: 'ORD-003', logistics: "TransWorld Logistics", method: "Sea Freight", tracking: "TWL-MUM-SIN-2026-040", dest: "Singapore", status: "Delivered", eta: "22 July 2026", currentLoc: "Delivered at SingaFoods warehouse, Singapore" }
  ]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // 4. Market Analysis State
  const [selectedAnalysisProduct, setSelectedAnalysisProduct] = useState('Organic Turmeric Powder');
  const [selectedCountry, setSelectedCountry] = useState('Germany');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('overview');
  const [analyzedProduct, setAnalyzedProduct] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ownedDocs, setOwnedDocs] = useState({
    invoice: true,
    packingList: true,
    originCert: true,
    organicCert: false,
    phytoReport: false,
    fssaiLicense: false,
  });

  const toggleDoc = (key) => {
    setOwnedDocs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const count = Object.values(next).filter(Boolean).length;
      addToast(`Compliance checklist updated: ${count} of 6 active.`, 'success');
      return next;
    });
  };

  const handleStartAnalysis = () => {
    if (!selectedAnalysisProduct) return;
    setIsAnalyzing(true);
    setAnalyzedProduct(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedProduct(selectedAnalysisProduct);
      addToast(`AI analysis completed for ${selectedAnalysisProduct}!`, 'success');
    }, 1500);
  };

  // What-If Sliders State
  const [whatIfPrice, setWhatIfPrice] = useState(350);
  const [whatIfShipping, setWhatIfShipping] = useState(45);
  const [whatIfInsurance, setWhatIfInsurance] = useState(12);
  const [recalculating, setRecalculating] = useState(false);
  const [whatIfResults, setWhatIfResults] = useState({
    landedCost: 435.35,
    estimatedProfit: 184.65,
    margin: 29.8,
    aiScore: 84.6
  });

  const handleRecalculate = () => {
    setRecalculating(true);
    setTimeout(() => {
      // Logic for calculator simulation
      const baseProductCost = parseFloat(whatIfPrice);
      const shipCost = parseFloat(whatIfShipping);
      const insCost = parseFloat(whatIfInsurance);
      const customsDuty = (baseProductCost + shipCost) * 0.05; // 5% duty estimate
      const otherCharges = 8.00;
      
      const totalLandedCost = baseProductCost + shipCost + insCost + customsDuty + otherCharges;
      const sellingPrice = 620.00;
      const profit = sellingPrice - totalLandedCost;
      const margin = (profit / sellingPrice) * 100;
      
      // Calculate new AI score based on margins & costs
      let baseScore = 84.6;
      if (profit < 184.65) baseScore -= (184.65 - profit) * 0.15;
      if (profit > 184.65) baseScore += (profit - 184.65) * 0.1;
      const roundedScore = Math.min(Math.max(baseScore, 30), 99).toFixed(1);

      setWhatIfResults({
        landedCost: totalLandedCost.toFixed(2),
        estimatedProfit: profit.toFixed(2),
        margin: margin.toFixed(1),
        aiScore: roundedScore
      });
      setRecalculating(false);
      addToast('Landed costs recalculated successfully!', 'success');
    }, 1000);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdHscode) {
      addToast('Please enter all required fields.', 'error');
      return;
    }
    setDrawerLoading(true);
    setTimeout(() => {
      const newProductObj = {
        id: products.length + 1,
        name: newProdName,
        hscode: newProdHscode,
        category: newProdCategory,
        price: parseFloat(newProdPrice),
        unit: 'kg',
        currency: newProdCurrency,
        origin: newProdOrigin,
        status: 'Active'
      };
      setProducts(prev => [...prev, newProductObj]);
      setShowAddDrawer(false);
      setNewProdName('');
      setNewProdHscode('');
      setNewProdDesc('');
      setNewProdPrice('');
      setDrawerLoading(false);
      addToast('Product saved successfully!', 'success');
    }, 1200);
  };

  const handleAnalyzeProduct = () => {
    if (!newProdName || !newProdPrice || !newProdHscode) {
      addToast('Please input product specifications first.', 'error');
      return;
    }
    setDrawerLoading(true);
    setTimeout(() => {
      const newProductObj = {
        id: products.length + 1,
        name: newProdName,
        hscode: newProdHscode,
        category: newProdCategory,
        price: parseFloat(newProdPrice),
        unit: 'kg',
        currency: newProdCurrency,
        origin: newProdOrigin,
        status: 'Analyzing'
      };
      setProducts(prev => [...prev, newProductObj]);
      setShowAddDrawer(false);
      
      // Navigate to Analysis view and trigger simulation loader
      setSelectedAnalysisProduct(newProdName);
      setAnalyzedProduct(null);
      setIsAnalyzing(true);
      setActiveView('analysis');
      setDrawerLoading(false);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalyzedProduct(newProdName);
        addToast(`AI analysis completed for ${newProdName}`, 'success');
      }, 1500);
      
    }, 1500);
  };

  const handleDeleteProduct = (id, name) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast(`${name} deleted from catalog.`, 'success');
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Accepted' } : o));
    setSelectedOrder(null);
    addToast(`Order #${orderId} accepted!`, 'success');
  };

  const handleRejectOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Rejected' } : o));
    setSelectedOrder(null);
    addToast(`Order #${orderId} rejected.`, 'error');
  };

  const handleLogout = () => {
    addToast('Logging out...', 'success');
    setTimeout(() => {
      onNavigate('/');
    }, 1000);
  };

  // Close dropdowns on window click
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowProfileMenu(false);
      setShowNotifications(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col antialiased font-sans select-none relative">
      
      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            t.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-slate-800 shadow-emerald-500/5' 
              : 'bg-red-50 border-red-200 text-red-800 shadow-red-500/5'
          }`}>
            <div className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-6">
        {/* Left Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Globe className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">TradeWise</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 h-full text-xs font-bold text-slate-500">
          <button 
            onClick={() => onNavigate('/')}
            className="hover:text-slate-900 transition-colors h-full px-1 cursor-pointer"
          >
            Home
          </button>
          
          <button 
            onClick={() => setActiveView('overview')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'overview' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Overview
            {activeView === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>

          <button 
            onClick={() => setActiveView('products')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'products' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Products
            {activeView === 'products' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>

          <button 
            onClick={() => setActiveView('analysis')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'analysis' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Analysis
            {activeView === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>

          <button 
            onClick={() => setActiveView('orders')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'orders' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Orders
            {activeView === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>

          <button 
            onClick={() => setActiveView('logistics')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'logistics' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Logistics
            {activeView === 'logistics' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 cursor-pointer relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Box */}
            {showNotifications && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2.5">
                  <span className="text-xs font-black text-slate-800">Notifications</span>
                  <button 
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                      addToast('All notifications marked as read', 'success');
                    }}
                    className="text-[10px] font-bold text-sky-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl border text-xxs transition-colors ${n.read ? 'border-slate-50 bg-white' : 'border-sky-100 bg-sky-50/10'}`}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-700 leading-normal">{n.text}</span>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5 ml-1"></div>}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown avatar */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-black text-white">TW</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Box */}
            {showProfileMenu && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
              >
                <div className="p-2 border-b border-slate-100 mb-1.5">
                  <span className="block text-xs font-black text-slate-800">TradeWise User</span>
                  <span className="block text-[10px] text-slate-450 mt-0.5 truncate">exporter@company.com</span>
                </div>
                
                <button 
                  onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xxs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  View Profile
                </button>

                <button 
                  onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xxs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>

                <button 
                  onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xxs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  My Company
                </button>

                <div className="border-t border-slate-100 my-1.5"></div>

                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xxs font-bold text-red-655 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* VIEW RENDER DISPATCHER */}
      <div className="flex-grow pt-24 pb-12 px-6 max-w-7xl w-full mx-auto relative z-10">

        {/* ---------------------------------------------------- */}
        {/* VIEW: OVERVIEW / DASHBOARD */}
        {/* ---------------------------------------------------- */}
        {activeView === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">


            {/* Grid of 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Products Card */}
              <div 
                onClick={() => setActiveView('products')}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-sky-200 cursor-pointer transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">↗ 2 new</span>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-slate-900">{products.length}</span>
                  <span className="text-xxs font-bold text-slate-450 uppercase tracking-widest mt-1 block">Catalog Products</span>
                </div>
              </div>

              {/* Analyses Card */}
              <div 
                onClick={() => setActiveView('analysis')}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-250 cursor-pointer transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↗ 5 this wk</span>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-slate-900">24</span>
                  <span className="text-xxs font-bold text-slate-450 uppercase tracking-widest mt-1 block">Market Reports</span>
                </div>
              </div>

              {/* Pending Orders */}
              <div 
                onClick={() => setActiveView('orders')}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-250 cursor-pointer transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">⚠ {orders.filter(o => o.status === 'Pending').length} Action</span>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'Pending').length}</span>
                  <span className="text-xxs font-bold text-slate-450 uppercase tracking-widest mt-1 block">Pending Orders</span>
                </div>
              </div>

              {/* Active Shipments */}
              <div 
                onClick={() => setActiveView('logistics')}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">✓ On track</span>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-slate-900">{shipments.filter(s => s.status !== 'Delivered').length}</span>
                  <span className="text-xxs font-bold text-slate-450 uppercase tracking-widest mt-1 block">Active Shipments</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Activity split column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Quick Actions (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { setShowAddDrawer(true); setActiveView('products'); }}
                    className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-sky-500 group-hover:rotate-90 transition-transform" />
                      <div>
                        <span className="block text-xs font-bold text-slate-850">Add Product Specs</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Define HS codes and price models</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setActiveView('analysis')}
                    className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-emerald-500 group-hover:animate-pulse" />
                      <div>
                        <span className="block text-xs font-bold text-slate-850">Start Market Intelligence Analysis</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Explore high margins and import complexity</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setActiveView('orders')}
                    className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="block text-xs font-bold text-slate-850">Inspect Orders</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Clear pending buyer bids and accept contract rates</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setActiveView('logistics')}
                    className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                      <div>
                        <span className="block text-xs font-bold text-slate-850">Track Shipment Status</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Customs updates and ETA timings</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Recent Activity (5 Cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Recent Activity</h3>
                  <div className="relative pl-6 space-y-4">
                    {/* Vertical timeline connection */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100 z-0"></div>

                    {/* Timeline Item 1 */}
                    <div className="relative z-10">
                      <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-sky-500"></div>
                      <div className="text-xxs">
                        <span className="block font-bold text-slate-800">Market analysis completed</span>
                        <span className="block text-slate-450 mt-0.5">Evaluated Germany tariff models for Turmeric Powder</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-semibold">2 hours ago</span>
                      </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative z-10">
                      <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-amber-500"></div>
                      <div className="text-xxs">
                        <span className="block font-bold text-slate-805">New buyer offer received</span>
                        <span className="block text-slate-450 mt-0.5">Al Noor Trading (UAE) requested 500kg turmeric</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-semibold">5 hours ago</span>
                      </div>
                    </div>

                    {/* Timeline Item 3 */}
                    <div className="relative z-10">
                      <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500"></div>
                      <div className="text-xxs">
                        <span className="block font-bold text-slate-805">Vessel Departed Port</span>
                        <span className="block text-slate-455 mt-0.5">Shipment #SH-042 loaded at Mumbai Harbor</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-semibold">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => addToast('All historical activities are already rendered.', 'success')}
                  className="w-full text-center py-2.5 mt-4 text-xxs font-bold text-indigo-600 hover:text-indigo-700 transition-colors border border-slate-100 hover:border-slate-200 rounded-xl cursor-pointer"
                >
                  View All Activity →
                </button>
              </div>

            </div>

            {/* Product Performance Overview */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-805 uppercase tracking-widest mb-4">Product Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Turmeric */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                  <span className="block text-xs font-black text-slate-800">Turmeric</span>
                  <span className="block text-[10px] text-slate-450 mt-0.5">4 target markets</span>
                  <div className="mt-3 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 text-xxs font-black py-1 px-2.5 rounded-full w-max mx-auto">
                    <span>AI Index: 84%</span>
                  </div>
                </div>

                {/* Cumin */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                  <span className="block text-xs font-black text-slate-800">Cumin Seeds</span>
                  <span className="block text-[10px] text-slate-450 mt-0.5">2 target markets</span>
                  <div className="mt-3 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 text-xxs font-black py-1 px-2.5 rounded-full w-max mx-auto">
                    <span>AI Index: 72%</span>
                  </div>
                </div>

                {/* Cardamom */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                  <span className="block text-xs font-black text-slate-800">Cardamom</span>
                  <span className="block text-[10px] text-slate-450 mt-0.5">3 target markets</span>
                  <div className="mt-3 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 text-xxs font-black py-1 px-2.5 rounded-full w-max mx-auto">
                    <span>AI Index: 68%</span>
                  </div>
                </div>

                {/* Pepper */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                  <span className="block text-xs font-black text-slate-800">Black Pepper</span>
                  <span className="block text-[10px] text-slate-450 mt-0.5">1 target market</span>
                  <div className="mt-3 flex items-center justify-center gap-1 bg-amber-50 text-amber-600 text-xxs font-black py-1 px-2.5 rounded-full w-max mx-auto">
                    <span>AI Index: 55%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW: PRODUCTS CATALOG */}
        {/* ---------------------------------------------------- */}
        {activeView === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300 relative">
            
            {/* Header section */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Manage your product catalog, HS codes, and launch AI scoring models.</p>
              </div>
              <button 
                onClick={() => setShowAddDrawer(true)}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search box */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Search products by name or HS code..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
                />
              </div>

              {/* Filter category */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Filter by:</span>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option>All</option>
                  <option>Spices</option>
                  <option>Textiles</option>
                  <option>Agri-Prod</option>
                  <option>Handicraft</option>
                </select>
              </div>
            </div>

            {/* List Table Container */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                      <th className="py-4 px-5">Product Name</th>
                      <th className="py-4 px-5">HS Code</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5">Price</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    
                    {products.length > 0 ? (
                      products
                        .filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.hscode.includes(searchProduct);
                          const matchesCat = filterCategory === 'All' || p.category === filterCategory;
                          return matchesSearch && matchesCat;
                        })
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-5 font-bold text-slate-900">{p.name}</td>
                            <td className="py-4 px-5 font-mono text-slate-500">{p.hscode}</td>
                            <td className="py-4 px-5 text-slate-500">{p.category}</td>
                            <td className="py-4 px-5 text-slate-805">₹{p.price}/{p.unit}</td>
                            <td className="py-4 px-5">
                              {p.status === 'Active' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Active
                                </span>
                              )}
                              {p.status === 'Draft' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                  Draft
                                </span>
                              )}
                              {p.status === 'Analyzing' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                                  <Loader2 className="w-3 h-3 text-sky-500 animate-spin" />
                                  Analyzing
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right space-x-1.5">
                              <button 
                                onClick={() => {
                                  setSelectedAnalysisProduct(p.name);
                                  setActiveView('analysis');
                                  addToast(`Loading market index details for ${p.name}...`, 'success');
                                }}
                                className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                                title="Analyze Product"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => addToast('Edit feature is mocked for this catalog record.', 'success')}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                                title="Edit specs"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12">
                          <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                            <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                            <span className="block text-sm font-bold text-slate-800">No products added yet</span>
                            <span className="block text-xxs text-slate-400 mt-1 leading-normal">Add your first custom catalog specification to run automated compliance checks and profit audits.</span>
                            <button 
                              onClick={() => setShowAddDrawer(true)}
                              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xxs font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-400"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Your First Product
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer info */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xxs font-bold text-slate-400">
                <span>Showing {products.length} of {products.length} products</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:text-slate-700 disabled:opacity-40 cursor-pointer" disabled>Prev</button>
                  <span className="text-slate-800">Page 1</span>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:text-slate-700 disabled:opacity-40 cursor-pointer" disabled>Next</button>
                </div>
              </div>
            </div>

            {/* ADD PRODUCT DRAWER PANEL */}
            {showAddDrawer && (
              <div className="fixed inset-0 z-50 flex justify-end">
                {/* Drawer Backdrop blur */}
                <div 
                  onClick={() => setShowAddDrawer(false)}
                  className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs"
                ></div>

                {/* Drawer Content */}
                <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Add New Product</h2>
                        <span className="text-xxs text-slate-400 font-semibold block mt-0.5">Input custom specifications for analysis</span>
                      </div>
                      <button 
                        onClick={() => setShowAddDrawer(false)}
                        className="p-2 hover:bg-slate-50 rounded-full cursor-pointer text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Inputs */}
                    <form className="space-y-4" onSubmit={handleSaveProduct}>
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Name</label>
                        <input 
                          type="text" 
                          required
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="e.g., Organic Turmeric Powder"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                        />
                      </div>

                      {/* HS Code */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HS Code</label>
                        <input 
                          type="text" 
                          required
                          value={newProdHscode}
                          onChange={(e) => setNewProdHscode(e.target.value)}
                          placeholder="e.g., 0910.30"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 font-mono"
                        />
                      </div>

                      {/* Product Category */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Category</label>
                        <select 
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option>Spices</option>
                          <option>Textiles</option>
                          <option>Agri-Prod</option>
                          <option>Handicraft</option>
                        </select>
                      </div>

                      {/* Product Description */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Description</label>
                        <textarea 
                          rows="3"
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          placeholder="Premium quality organic turmeric grown in farms..."
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 resize-none"
                        />
                      </div>

                      {/* Pricing Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit Price (per kg)</label>
                          <input 
                            type="number" 
                            required
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            placeholder="350"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Currency</label>
                          <select 
                            value={newProdCurrency}
                            onChange={(e) => setNewProdCurrency(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                          >
                            <option>INR</option>
                            <option>USD</option>
                            <option>EUR</option>
                          </select>
                        </div>
                      </div>

                      {/* Origin */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Country of Origin</label>
                        <select 
                          value={newProdOrigin}
                          onChange={(e) => setNewProdOrigin(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option>India</option>
                          <option>Singapore</option>
                          <option>United States</option>
                        </select>
                      </div>
                    </form>
                  </div>

                  {/* Actions footer */}
                  <div className="space-y-2 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleSaveProduct}
                      disabled={drawerLoading}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-6 py-3 font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      {drawerLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Save Product'}
                    </button>
                    <button 
                      onClick={handleAnalyzeProduct}
                      disabled={drawerLoading}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-6 py-3 font-bold text-xs text-sky-600 border border-sky-200 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                    >
                      {drawerLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : '🔍 Analyze Product'}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW: MARKET ANALYSIS */}
        {/* ---------------------------------------------------- */}
        {activeView === 'analysis' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Market Analysis</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">AI-powered export recommendations for your products</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Panel: Recommendations Selection (4 Cols) */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                
                {/* Select Product Dropdown & Start button */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Select Product</label>
                    <select 
                      value={selectedAnalysisProduct}
                      onChange={(e) => {
                        setSelectedAnalysisProduct(e.target.value);
                        setAnalyzedProduct(null); // Clear analysis when product changes
                      }}
                      className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      {products.map(p => (
                        <option key={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold text-xs text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 shadow-md shadow-sky-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Start Analysis</span>
                    )}
                  </button>
                </div>

                {/* Target Country Bids (Only show if analyzed) */}
                {analyzedProduct && (
                  <div className="border-t border-slate-100 pt-3.5 animate-in fade-in duration-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Target Country Bids</span>
                    <div className="space-y-3">
                      
                      {/* Germany card */}
                      <div 
                        onClick={() => { setSelectedCountry('Germany'); setWhatIfPrice(350); setWhatIfShipping(45); setWhatIfInsurance(12); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedCountry === 'Germany' 
                            ? 'border-sky-500 bg-sky-50/15 shadow-sm scale-102 pl-5'
                            : 'border-slate-100 bg-slate-50/20 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇩🇪</span>
                            <span className="text-xs font-black text-slate-805">Germany</span>
                          </div>
                          <span className="text-xxs font-extrabold text-sky-655">84.6% Match</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-450">
                          <span>Demand: <span className="text-emerald-550">High ↑</span></span>
                          <span>Profit: <span className="text-emerald-555">Strong</span></span>
                        </div>
                      </div>

                      {/* UAE card */}
                      <div 
                        onClick={() => { setSelectedCountry('UAE'); setWhatIfPrice(350); setWhatIfShipping(30); setWhatIfInsurance(10); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedCountry === 'UAE' 
                            ? 'border-sky-500 bg-sky-50/15 shadow-sm scale-102 pl-5'
                            : 'border-slate-100 bg-slate-50/20 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇦🇪</span>
                            <span className="text-xs font-black text-slate-805">UAE</span>
                          </div>
                          <span className="text-xxs font-extrabold text-sky-655">76.2% Match</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-450">
                          <span>Demand: <span className="text-slate-700">Medium</span></span>
                          <span>Profit: <span className="text-emerald-550">Good</span></span>
                        </div>
                      </div>

                      {/* Singapore card */}
                      <div 
                        onClick={() => { setSelectedCountry('Singapore'); setWhatIfPrice(350); setWhatIfShipping(35); setWhatIfInsurance(8); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedCountry === 'Singapore' 
                            ? 'border-sky-500 bg-sky-50/15 shadow-sm scale-102 pl-5'
                            : 'border-slate-100 bg-slate-50/20 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇸🇬</span>
                            <span className="text-xs font-black text-slate-805">Singapore</span>
                          </div>
                          <span className="text-xxs font-extrabold text-sky-655">71.8% Match</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-455">
                          <span>Demand: <span className="text-emerald-555">Growing</span></span>
                          <span>Profit: <span className="text-slate-700">Moderate</span></span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Right Panel: Tabbed Details (8 Cols) */}
              <div className="lg:col-span-8">
                {isAnalyzing ? (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
                    <span className="block text-sm font-black text-slate-800 uppercase tracking-widest">Running AI Matching Algorithms</span>
                    <span className="block text-xxs text-slate-455 mt-1.5 max-w-xs leading-relaxed">Evaluating tariff indices, phytosanitary requirements, shipping freight costs, and country credit risks for {selectedAnalysisProduct}...</span>
                  </div>
                ) : !analyzedProduct ? (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
                    <div className="p-4 bg-sky-50 rounded-full text-sky-500 mb-4 animate-bounce">
                      <Globe className="w-8 h-8" />
                    </div>
                    <span className="block text-sm font-black text-slate-800 uppercase tracking-widest">Ready for AI Market Analysis</span>
                    <span className="block text-xxs text-slate-455 mt-2 max-w-sm leading-relaxed">
                      Select a product from the dropdown on the left and click <strong>Start Analysis</strong> to calculate global duties, compliance complexity, and target market margins.
                    </span>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                    
                    {/* Target Header */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedCountry === 'Germany' ? '🇩🇪' : selectedCountry === 'UAE' ? '🇦🇪' : '🇸🇬'}</span>
                        <div>
                          <h2 className="text-lg font-black text-slate-900 tracking-tight">{selectedCountry} Compliance & Cost Audit</h2>
                          <span className="text-xxs font-bold text-slate-400">AI Scoring Analysis Index Score: {selectedCountry === 'Germany' ? '84.6' : selectedCountry === 'UAE' ? '76.2' : '71.8'}/100</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addToast(`Target country ${selectedCountry} saved to desk.`, 'success')}
                          className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Save Target
                        </button>
                        <button 
                          onClick={() => {
                            addToast(`Target selection locked for ${selectedCountry}.`, 'success');
                            setActiveView('overview');
                          }}
                          className="px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-md shadow-sky-500/5 transition-all cursor-pointer"
                        >
                          Lock Route
                        </button>
                      </div>
                    </div>

                    {/* Tab Controls */}
                    <div className="flex border-b border-slate-100 text-xs font-bold text-slate-450 gap-4">
                      {['overview', 'compliance', 'cost', 'why?', 'what-if'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveAnalysisTab(tab)}
                          className={`pb-2 px-1 cursor-pointer transition-colors relative uppercase text-[10px] tracking-wider ${
                            activeAnalysisTab === tab ? 'text-sky-655 font-extrabold' : 'hover:text-slate-805'
                          }`}
                        >
                          {tab}
                          {activeAnalysisTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents dispatcher */}
                    <div className="py-2 min-h-64">
                      
                      {/* Tab: Overview */}
                      {activeAnalysisTab === 'overview' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                              <span className="block text-xxs font-bold text-slate-400 uppercase tracking-widest">Market Demand</span>
                              <span className="block text-xl font-black text-emerald-600 mt-1">HIGH</span>
                              <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">↑ Strong organic growth</span>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-center">
                              <span className="block text-xxs font-bold text-slate-400 uppercase tracking-widest">AI Index Score</span>
                              <span className="block text-xl font-black text-sky-655 mt-1">{selectedCountry === 'Germany' ? '84.6/100' : selectedCountry === 'UAE' ? '76.2/100' : '71.8/100'}</span>
                              <span className="text-[10px] text-sky-500 font-semibold mt-1 block">★★★★★ highly recommended</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Market Insights</h4>
                            <ul className="space-y-2 text-xs font-semibold text-slate-500 pl-4 list-disc">
                              <li>Growing consumer demand for single-origin organic spices.</li>
                              <li>12% YoY import growth from South Asian countries.</li>
                              <li>Favorable customs duty rates under bilateral trade arrangements.</li>
                              <li>Active Indian exporter network handles over 40% of shipments.</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Tab: Compliance */}
                      {activeAnalysisTab === 'compliance' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Required Documents & Status</h4>
                            <p className="text-[10px] text-slate-400 font-medium">Toggle the document fields below to declare which credentials you already possess.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              
                              {/* Invoice */}
                              <div 
                                onClick={() => toggleDoc('invoice')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.invoice 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-450'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.invoice ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-350 shrink-0"></div>
                                  )}
                                  <span>Commercial Invoice</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.invoice ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-450'
                                }`}>
                                  {ownedDocs.invoice ? 'Active' : 'Missing'}
                                </span>
                              </div>

                              {/* Packing List */}
                              <div 
                                onClick={() => toggleDoc('packingList')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.packingList 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-455'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.packingList ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-350 shrink-0"></div>
                                  )}
                                  <span>Packing List</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.packingList ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-450'
                                }`}>
                                  {ownedDocs.packingList ? 'Active' : 'Missing'}
                                </span>
                              </div>

                              {/* Origin Cert */}
                              <div 
                                onClick={() => toggleDoc('originCert')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.originCert 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-455'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.originCert ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-355 shrink-0"></div>
                                  )}
                                  <span>Certificate of Origin</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.originCert ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-450'
                                }`}>
                                  {ownedDocs.originCert ? 'Active' : 'Missing'}
                                </span>
                              </div>

                              {/* Organic Cert */}
                              <div 
                                onClick={() => toggleDoc('organicCert')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.organicCert 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-455'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.organicCert ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-355 shrink-0"></div>
                                  )}
                                  <span>Organic Certification</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.organicCert ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-450'
                                }`}>
                                  {ownedDocs.organicCert ? 'Active' : 'Missing'}
                                </span>
                              </div>

                              {/* Phyto Report */}
                              <div 
                                onClick={() => toggleDoc('phytoReport')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.phytoReport 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-455'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.phytoReport ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-355 shrink-0"></div>
                                  )}
                                  <span>Lab Test Phytosanitary Report</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.phytoReport ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-455'
                                }`}>
                                  {ownedDocs.phytoReport ? 'Active' : 'Missing'}
                                </span>
                              </div>

                              {/* FSSAI License */}
                              <div 
                                onClick={() => toggleDoc('fssaiLicense')}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  ownedDocs.fssaiLicense 
                                    ? 'border-emerald-200 bg-emerald-50/10 text-slate-800 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 text-slate-455'
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {ownedDocs.fssaiLicense ? (
                                    <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-md border border-slate-355 shrink-0"></div>
                                  )}
                                  <span>FSSAI Export License</span>
                                </div>
                                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                                  ownedDocs.fssaiLicense ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-455'
                                }`}>
                                  {ownedDocs.fssaiLicense ? 'Active' : 'Missing'}
                                </span>
                              </div>

                            </div>
                          </div>

                          {(() => {
                            const count = Object.values(ownedDocs).filter(Boolean).length;
                            // Calculate a realistic complexity score that falls as more documents are owned
                            const compScore = Math.max(100 - (count * 15), 10);
                            const ratingLabel = compScore <= 40 ? 'Low Complexity' : compScore <= 70 ? 'Moderate' : 'High Complexity';
                            const textClass = compScore <= 40 ? 'text-emerald-600' : compScore <= 70 ? 'text-amber-600' : 'text-red-500';
                            const barClass = compScore <= 40 ? 'bg-emerald-500' : compScore <= 70 ? 'bg-amber-500' : 'bg-red-500';

                            return (
                              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 space-y-2 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-slate-450 uppercase tracking-widest">Compliance Complexity Score</span>
                                  <span className={`font-black ${textClass}`}>{compScore}/100 ({ratingLabel})</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${barClass} rounded-full transition-all duration-500`} style={{ width: `${compScore}%` }}></div>
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                                  {count} of 6 required documents are currently verified. Click card blocks above to add or remove active declarations.
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Tab: Cost & Profit */}
                      {activeAnalysisTab === 'cost' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                          
                          {/* Cost Breakdown */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Cost Breakdown (per kg)</h4>
                            <div className="border border-slate-100 rounded-xl p-4 text-xs font-semibold space-y-2.5">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Product Cost</span>
                                <span className="text-slate-800">₹350.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Shipping Cost (Freight)</span>
                                <span className="text-slate-800">₹45.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Insurance charges</span>
                                <span className="text-slate-800">₹12.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Customs Duty (5% estimate)</span>
                                <span className="text-slate-800">₹20.35</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Port clearing charges</span>
                                <span className="text-slate-800">₹8.00</span>
                              </div>
                              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold">
                                <span className="text-slate-805">Total Landed Cost</span>
                                <span className="text-sky-600">₹435.35/kg</span>
                              </div>
                            </div>
                          </div>

                          {/* Profit Estimation */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Profit Margin Audit</h4>
                            <div className="border border-slate-100 rounded-xl p-4 text-xs font-semibold space-y-2.5">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Target Selling Price</span>
                                <span className="text-slate-800">₹620.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Total Landed Cost</span>
                                <span className="text-slate-800">₹435.35</span>
                              </div>
                              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold">
                                <span className="text-slate-805">Estimated Profit</span>
                                <span className="text-emerald-600">₹184.65/kg</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span className="text-slate-800">Estimated Profit Margin</span>
                                <span className="text-emerald-600">29.8%</span>
                              </div>
                              
                              <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 p-2 rounded-lg">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>💰 Strong profitability index for Germany route</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Tab: Why This */}
                      {activeAnalysisTab === 'why?' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Explainable AI Factor Analysis</h4>
                          
                          <div className="space-y-3">
                            {/* Factor 1 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-700">Market Demand (Import Growth)</span>
                                <span className="text-emerald-600">+31 points</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[62%] rounded-full"></div>
                              </div>
                            </div>

                            {/* Factor 2 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-700">Estimated Profit Margin</span>
                                <span className="text-emerald-600">+18 points</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[36%] rounded-full"></div>
                              </div>
                            </div>

                            {/* Factor 3 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-750">Logistics Reliability Performance</span>
                                <span className="text-emerald-600">+10 points</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[20%] rounded-full"></div>
                              </div>
                            </div>

                            {/* Factor 4 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-700">Compliance complexity penalties</span>
                                <span className="text-red-500">-8 points</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[16%] rounded-full"></div>
                              </div>
                              <span className="text-[10px] text-slate-400 block ml-1">↳ 2 certifications missing in profile</span>
                            </div>

                            {/* Factor 5 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-700">Country risk (tariffs)</span>
                                <span className="text-red-500">-3 points</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[6%] rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs font-bold text-slate-450">
                            <span>Based on 15 custom data points</span>
                            <span className="text-slate-805">AI Model Confidence: 87%</span>
                          </div>
                        </div>
                      )}

                      {/* Tab: What-If */}
                      {activeAnalysisTab === 'what-if' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Adjust Sliders */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Adjust Variables</h4>
                              
                              {/* Price */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-550">Product Cost (₹/kg)</span>
                                  <span className="text-slate-800">₹{whatIfPrice}</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="200" 
                                  max="800" 
                                  value={whatIfPrice}
                                  onChange={(e) => setWhatIfPrice(e.target.value)}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                              </div>

                              {/* Shipping */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-555">Shipping Cost (₹/kg)</span>
                                  <span className="text-slate-800">₹{whatIfShipping}</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="10" 
                                  max="150" 
                                  value={whatIfShipping}
                                  onChange={(e) => setWhatIfShipping(e.target.value)}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                              </div>

                              {/* Insurance */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-555">Insurance Cost (₹/kg)</span>
                                  <span className="text-slate-800">₹{whatIfInsurance}</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="5" 
                                  max="50" 
                                  value={whatIfInsurance}
                                  onChange={(e) => setWhatIfInsurance(e.target.value)}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                              </div>

                              <button 
                                onClick={handleRecalculate}
                                disabled={recalculating}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-md transition-all cursor-pointer"
                              >
                                {recalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Recalculate'}
                              </button>
                            </div>

                            {/* Calculated Results */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
                              <h4 className="text-xs font-bold text-slate-855 uppercase tracking-widest border-b border-slate-200 pb-2">Updated Results</h4>
                              
                              <div className="space-y-2.5 text-xs font-bold">
                                <div className="flex justify-between">
                                  <span className="text-slate-450">Total Landed Cost</span>
                                  <span className="text-slate-805">₹{whatIfResults.landedCost}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Estimated Profit</span>
                                  <span className="text-emerald-600">₹{whatIfResults.estimatedProfit}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Estimated Margin</span>
                                  <span className="text-emerald-600">{whatIfResults.margin}%</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2.5">
                                  <span className="text-slate-850 uppercase tracking-widest text-[10px]">AI Score Target</span>
                                  <span className="text-sky-655 font-extrabold text-[10px]">{whatIfResults.aiScore}/100</span>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW: ORDERS VIEW */}
        {/* ---------------------------------------------------- */}
        {activeView === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders Registry</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Manage incoming contracts and freight assignments from foreign importers.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 border-b border-slate-100 text-xs font-bold text-slate-450 mb-4 pb-1">
              {['All', 'Pending', 'Accepted', 'Shipped', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`pb-2 px-1 cursor-pointer transition-colors relative ${
                    orderFilter === status ? 'text-sky-655 font-extrabold' : 'hover:text-slate-850'
                  }`}
                >
                  {status} {status === 'Pending' && `(${orders.filter(o => o.status === 'Pending').length})`}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                      <th className="py-4 px-5">Order ID</th>
                      <th className="py-4 px-5">Importer</th>
                      <th className="py-4 px-5">Product</th>
                      <th className="py-4 px-5">Quantity</th>
                      <th className="py-4 px-5">Value</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {orders
                      .filter(o => orderFilter === 'All' || o.status === orderFilter)
                      .map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-4 px-5 font-mono text-slate-900 font-bold">#{o.id}</td>
                          <td className="py-4 px-5">
                            <span className="block font-bold text-slate-800">{o.importer}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{o.country}</span>
                          </td>
                          <td className="py-4 px-5 text-slate-500">{o.product}</td>
                          <td className="py-4 px-5 text-slate-500">{o.qty}</td>
                          <td className="py-4 px-5 text-slate-805">{o.value}</td>
                          <td className="py-4 px-5">
                            {o.status === 'Pending' && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Pending Action
                              </span>
                            )}
                            {o.status === 'Accepted' && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Accepted
                              </span>
                            )}
                            {o.status === 'Rejected' && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Rejected
                              </span>
                            )}
                            {o.status === 'Shipped' && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-655 bg-sky-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                In Transit
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button 
                              onClick={() => setSelectedOrder(o)}
                              className="p-1.5 text-slate-400 hover:text-sky-655 rounded-lg hover:bg-slate-50 cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ORDER DETAILS MODAL */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs"></div>
                
                {/* Modal Container */}
                <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl animate-in scale-in duration-300 z-10 space-y-6">
                  {/* Title */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Order Details #{selectedOrder.id}</h3>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 hover:bg-slate-50 rounded-full cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Splits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Importer Info */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-xs font-semibold space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">Importer Info</span>
                      <span className="block text-slate-900 font-extrabold">{selectedOrder.importer}</span>
                      <span className="block text-slate-550">{selectedOrder.country}</span>
                      <span className="block text-slate-400 font-mono mt-2 truncate">📧 {selectedOrder.email}</span>
                      <span className="block text-slate-400 font-mono">📱 {selectedOrder.phone}</span>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 text-xs font-semibold space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">Product Details</span>
                      <span className="block text-slate-900 font-extrabold">{selectedOrder.product}</span>
                      <span className="block text-slate-500 font-mono">HS Code: {selectedOrder.hscode}</span>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Quantity</span>
                        <span className="text-slate-800">{selectedOrder.qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Value</span>
                        <span className="text-sky-655 font-bold">{selectedOrder.value}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div className="border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-500 space-y-2">
                    <div className="flex justify-between">
                      <span>Order Date</span>
                      <span className="text-slate-700">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Delivery</span>
                      <span className="text-slate-700">{selectedOrder.delivery}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {selectedOrder.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleAcceptOrder(selectedOrder.id)}
                          className="flex-grow py-3 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Accept Order
                        </button>
                        <button 
                          onClick={() => handleRejectOrder(selectedOrder.id)}
                          className="px-4 py-3 text-xs font-bold text-red-655 border border-red-200 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        >
                          Reject Order
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => {
                          setSelectedShipment(shipments.find(s => s.orderId === selectedOrder.id) || null);
                          setSelectedOrder(null);
                          if (selectedOrder.status === 'Shipped') setActiveView('logistics');
                        }}
                        className="w-full py-3 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                      >
                        {selectedOrder.status === 'Shipped' ? 'Track Shipment →' : 'Logistics details locked'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW: LOGISTICS SHIPMENTS */}
        {/* ---------------------------------------------------- */}
        {activeView === 'logistics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shipment Tracking</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Verify customs documentation and monitor logistics tracking ETA.</p>
            </div>

            {/* Logistics Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                      <th className="py-4 px-5">Shipment ID</th>
                      <th className="py-4 px-5">Order ID</th>
                      <th className="py-4 px-5">Logistics Partner</th>
                      <th className="py-4 px-5">Destination</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {shipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-mono text-slate-900 font-bold">#{s.id}</td>
                        <td className="py-4 px-5 font-mono text-slate-400">#{s.orderId}</td>
                        <td className="py-4 px-5">
                          <span className="block font-bold text-slate-805">{s.logistics}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{s.method}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-500">{s.dest}</td>
                        <td className="py-4 px-5">
                          {s.status === 'In Transit' && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-655 bg-sky-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                              In Transit
                            </span>
                          )}
                          {s.status === 'Customs Clearance' && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Customs Audit
                            </span>
                          )}
                          {s.status === 'Delivered' && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Delivered
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button 
                            onClick={() => setSelectedShipment(s)}
                            className="px-3.5 py-1.5 text-xxs font-black text-indigo-650 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all cursor-pointer"
                          >
                            ▷ View Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SHIPMENT DETAIL TIMELINE MODAL */}
            {selectedShipment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div onClick={() => setSelectedShipment(null)} className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs"></div>

                {/* Modal box */}
                <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl animate-in scale-in duration-300 z-10 space-y-5">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Shipment Timeline #{selectedShipment.id}</h3>
                    <button 
                      onClick={() => setSelectedShipment(null)}
                      className="p-1.5 hover:bg-slate-50 rounded-full cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shipping Info Card */}
                  <div className="border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-500 space-y-2 bg-slate-50/20">
                    <div className="flex justify-between">
                      <span>Logistics Partner</span>
                      <span className="text-slate-800 font-extrabold">{selectedShipment.logistics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Method</span>
                      <span className="text-slate-750">{selectedShipment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tracking ID</span>
                      <span className="text-slate-750 font-mono">{selectedShipment.tracking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery (ETA)</span>
                      <span className="text-slate-800">{selectedShipment.eta}</span>
                    </div>
                  </div>

                  {/* Vertical Timeline Steps */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest">Status Progress</h4>
                    
                    <div className="relative pl-6 space-y-6">
                      {/* Timeline bar */}
                      <div className="absolute left-[7px] top-2.5 bottom-2.5 w-0.5 bg-slate-100 z-0"></div>

                      {/* Step 1: Confirmed */}
                      <div className="relative z-10 text-xs">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span className="block font-bold text-emerald-600">Order Confirmed — 15 July</span>
                        <span className="block text-[10px] text-slate-400">Payment cleared & product packed</span>
                      </div>

                      {/* Step 2: Picked Up */}
                      <div className="relative z-10 text-xs">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span className="block font-bold text-emerald-600">Cargo Picked Up — 16 July</span>
                        <span className="block text-[10px] text-slate-400">Loaded into FastCargo transport fleet</span>
                      </div>

                      {/* Step 3: In Transit */}
                      <div className="relative z-10 text-xs">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-sky-500 shadow-sm flex items-center justify-center animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <span className="block font-bold text-sky-655">In Transit — 18 July (Current)</span>
                        <span className="block text-[10px] text-slate-450 mt-0.5">Vessel departed Mumbai Port, en route to Hamburg</span>
                      </div>

                      {/* Step 4: Customs */}
                      <div className="relative z-10 text-xs">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white shadow-sm"></div>
                        <span className="block font-semibold text-slate-400">Customs Clearance — Pending</span>
                        <span className="block text-[10px] text-slate-400">Audit of phytosanitary import certifications</span>
                      </div>

                      {/* Step 5: Delivered */}
                      <div className="relative z-10 text-xs">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white shadow-sm"></div>
                        <span className="block font-semibold text-slate-400">Delivered — Estimated 28 July</span>
                        <span className="block text-[10px] text-slate-400">Sign-off by EuroSpice representative</span>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW: PROFILE & SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeView === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Exporter Profile Settings</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Verify company registrations and update passwords.</p>
            </div>

            {/* Profile fields */}
            <div className="border border-slate-100 bg-slate-50/20 p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                <div className="space-y-1">
                  <span className="text-slate-400 block">Full Name</span>
                  <span className="text-slate-800 block text-sm">John Doe</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">Company Name</span>
                  <span className="text-slate-800 block text-sm">Acme Export Ltd</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">Registered Email</span>
                  <span className="text-slate-805 block text-sm font-mono">exporter@company.com</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">Phone</span>
                  <span className="text-slate-805 block text-sm font-mono">+91 98765 43210</span>
                </div>
                <div className="space-y-1 col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-slate-400 block">Base Country</span>
                  <span className="text-slate-808 block text-sm">India</span>
                </div>
              </div>
            </div>

            {/* Button Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => addToast('Update Profile modal is not active.', 'success')}
                className="flex-grow py-3 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Update Profile Info
              </button>
              <button 
                onClick={() => addToast('Change password token sent to email.', 'success')}
                className="px-5 py-3 text-xs font-bold text-slate-655 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
