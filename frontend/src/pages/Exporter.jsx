import React, { useState, useEffect } from 'react';
import { 
  Globe, Bell, User as UserIcon, Settings, LogOut, Briefcase, ShoppingCart, 
  Truck, ArrowUpRight, Search, Plus, Trash2, Edit3, Eye, X, Check, AlertTriangle, 
  ChevronDown, HelpCircle, Activity, TrendingUp, Sliders, DollarSign, Loader2,
  ArrowLeft, ArrowRight
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

  const [analysisSubView, setAnalysisSubView] = useState('select'); // 'select', 'recommendations', 'country-overview', 'compliance', 'cost', 'what-if'

  // Cost Estimation Configuration States
  const [costQuantity, setCostQuantity] = useState(1000);
  const [costShippingMode, setCostShippingMode] = useState('Sea'); // 'Air', 'Sea', 'Road'
  const [costInsurance, setCostInsurance] = useState(true);
  const [costLogisticsPartner, setCostLogisticsPartner] = useState('FastCargo Logistics');
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);
  const [calculatedCostBreakdown, setCalculatedCostBreakdown] = useState({
    productCost: 350.00,
    freight: 45.00,
    insurance: 12.00,
    tariff: 20.35,
    gst: 18.00,
    customsDuty: 20.35,
    handlingCharges: 8.00,
    landedCost: 473.70,
    sellingPrice: 620.00,
    revenue: 620000,
    profit: 146.30,
    margin: 23.6
  });

  // Compliance Chat Assistant States
  const [complianceLang, setComplianceLang] = useState('EN'); // 'EN', 'HI', 'TE'
  const [complianceChatText, setComplianceChatText] = useState('');
  const [complianceChatHistory, setComplianceChatHistory] = useState([
    { sender: 'assistant', text: "Hello! I am your TradeWise Compliance Assistant. Ask me anything about exporting goods to Germany under FSSAI and European Union regulations." }
  ]);

  // What-if Simulator States
  const [whatIfOrganic, setWhatIfOrganic] = useState(true);
  const [whatIfShippingMode, setWhatIfShippingMode] = useState('Sea');
  const [whatIfInsuranceActive, setWhatIfInsuranceActive] = useState(true);
  const [whatIfTariffAdj, setWhatIfTariffAdj] = useState(5);
  const [whatIfLogisticsPartner, setWhatIfLogisticsPartner] = useState('FastCargo Logistics');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResults, setSimulatedResults] = useState({
    aiScore: 84,
    compliance: 72,
    landedCost: 420,
    profit: 160,
    countryRank: 3
  });

  const handleStartAnalysis = () => {
    if (!selectedAnalysisProduct) return;
    setIsAnalyzing(true);
    setAnalyzedProduct(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedProduct(selectedAnalysisProduct);
      setAnalysisSubView('recommendations');
      addToast(`AI analysis completed for ${selectedAnalysisProduct}!`, 'success');
    }, 1500);
  };

  const handleCalculateCost = () => {
    setIsCalculatingCost(true);
    setTimeout(() => {
      setIsCalculatingCost(false);
      const qty = parseFloat(costQuantity) || 1000;
      const baseProductCost = selectedAnalysisProduct === 'Cumin Seeds' ? 420.00 : 350.00;
      const freightPerKg = costShippingMode === 'Air' ? 120.00 : costShippingMode === 'Road' ? 25.00 : 45.00;
      const insPerKg = costInsurance ? 12.00 : 0.00;
      const tariffPerKg = baseProductCost * 0.05; // 5% tariff estimate
      const gstPerKg = baseProductCost * 0.05; // 5% GST
      const customsPerKg = baseProductCost * 0.05; // 5% customs
      const handlingPerKg = 8.00;
      
      const landedPerKg = baseProductCost + freightPerKg + insPerKg + tariffPerKg + gstPerKg + customsPerKg + handlingPerKg;
      const sellingPrice = selectedAnalysisProduct === 'Cumin Seeds' ? 700.00 : 620.00;
      const profitPerKg = sellingPrice - landedPerKg;
      const marginVal = (profitPerKg / sellingPrice) * 100;
      
      setCalculatedCostBreakdown({
        productCost: baseProductCost,
        freight: freightPerKg,
        insurance: insPerKg,
        tariff: tariffPerKg,
        gst: gstPerKg,
        customsDuty: customsPerKg,
        handlingCharges: handlingPerKg,
        landedCost: landedPerKg,
        sellingPrice: sellingPrice,
        revenue: sellingPrice * qty,
        profit: profitPerKg,
        margin: parseFloat(marginVal.toFixed(1))
      });
      addToast("Landed cost calculations updated successfully.", "success");
    }, 1000);
  };

  const handleSendComplianceChat = () => {
    if (!complianceChatText.trim()) return;
    const userMsg = complianceChatText.trim();
    setComplianceChatText('');
    setComplianceChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    
    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("invoice") || lower.includes("document")) {
        reply = `Under EU DGFT guidelines, your Commercial Invoice must declare the exact net weight, HS Code (${selectedAnalysisProduct === 'Cumin Seeds' ? '0909.31' : '0910.30'}), organic origin declaration, and FSSAI export registration number. Since your invoice is currently marked as verified, you are compliant with this factor.`;
      } else if (lower.includes("organic") || lower.includes("certification")) {
        reply = "Germany requires USDA/EU equivalent Organic Certification for organic labeling. Your profile lists this certificate as 'Missing'. You must submit NPOP India documentation to APEDA to resolve this gap.";
      } else {
        reply = `To export ${selectedAnalysisProduct} to ${selectedCountry}, ensure all required phytosanitary lab test reports are active. The complexity rating is currently at 78/100 because of the missing Organic Certificate and Export License.`;
      }
      setComplianceChatHistory(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 800);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      
      let simScore = 84;
      let simComp = 72;
      let simLanded = 420;
      let simProfit = 160;
      let simRank = 3;
      
      if (whatIfOrganic) {
        simScore += 4;
        simComp += 18;
      }
      
      if (whatIfShippingMode === 'Air') {
        simLanded += 80;
        simProfit -= 80;
      } else if (whatIfShippingMode === 'Road') {
        simLanded -= 20;
        simProfit += 20;
      }
      
      if (!whatIfInsuranceActive) {
        simLanded -= 12;
        simProfit += 12;
        simScore -= 3;
      }
      
      const tariffDiff = (parseFloat(whatIfTariffAdj) - 5) * 5;
      simLanded += tariffDiff;
      simProfit -= tariffDiff;
      
      if (simProfit > 180) {
        simRank = 1;
        simScore += 3;
      } else if (simProfit > 150) {
        simRank = 2;
      } else {
        simRank = 4;
      }
      
      setSimulatedResults({
        aiScore: simScore,
        compliance: simComp,
        landedCost: simLanded,
        profit: simProfit,
        countryRank: simRank
      });
      addToast("Counterfactual simulation completed! Displaying projections.", "success");
    }, 1000);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col antialiased font-sans relative">
      
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
            Workspace
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
            onClick={() => { setActiveView('analysis'); setAnalysisSubView('select'); }}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'analysis' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Market Analysis
            {activeView === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>

          <button 
            onClick={() => setActiveView('orders')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeView === 'orders' ? 'text-sky-655 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Export Orders
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
                onClick={() => { setActiveView('analysis'); setAnalysisSubView('select'); }}
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
                    onClick={() => { setActiveView('analysis'); setAnalysisSubView('select'); }}
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
                                  setAnalysisSubView('select');
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
            {/* Header section with back button if not in select step */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Market Analysis</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {analysisSubView === 'select' && "AI-powered export recommendations for your products"}
                  {analysisSubView === 'recommendations' && `Global recommendations for ${selectedAnalysisProduct}`}
                  {analysisSubView === 'country-overview' && `${selectedCountry} Recommendation Hub`}
                  {analysisSubView === 'compliance' && `${selectedCountry} Compliance Report`}
                  {analysisSubView === 'cost' && `${selectedCountry} Cost & Profit Estimation`}
                  {analysisSubView === 'what-if' && `${selectedCountry} Counterfactual Simulator`}
                </p>
              </div>

              {analysisSubView !== 'select' && (
                <button
                  onClick={() => {
                    if (analysisSubView === 'recommendations') setAnalysisSubView('select');
                    else if (analysisSubView === 'country-overview') setAnalysisSubView('recommendations');
                    else setAnalysisSubView('country-overview');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    {analysisSubView === 'recommendations' && "Back to Analyze"}
                    {analysisSubView === 'country-overview' && "Back to Recommendations"}
                    {(analysisSubView === 'compliance' || analysisSubView === 'cost' || analysisSubView === 'what-if') && "Back to Overview"}
                  </span>
                </button>
              )}
            </div>

            {/* SUB-VIEW: SELECT PRODUCT (Analyze Product) */}
            {analysisSubView === 'select' && (
              <div className="max-w-xl mx-auto py-8">
                {isAnalyzing ? (
                  <div className="bg-white border border-slate-200/85 rounded-2xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[350px] animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mb-6">
                      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Running AI Matching Algorithms</h3>
                    <p className="text-xxs text-slate-450 mt-2 max-w-xs leading-relaxed">
                      Evaluating tariff indices, phytosanitary requirements, shipping freight costs, and country credit risks for <strong>{selectedAnalysisProduct}</strong>...
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="p-3 rounded-xl bg-sky-50 text-sky-500">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Product to Analyze</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Access compliance complexity ratings and landed cost estimates</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Choose Catalog Product</label>
                        <select 
                          value={selectedAnalysisProduct}
                          onChange={(e) => {
                            setSelectedAnalysisProduct(e.target.value);
                            setAnalyzedProduct(null);
                          }}
                          className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          {products.map(p => (
                            <option key={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleStartAnalysis}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-xs text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/10 rounded-xl transition-all cursor-pointer"
                      >
                        <span>Start Market Analysis</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW: RECOMMENDATIONS TABLE */}
            {analysisSubView === 'recommendations' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-sky-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>AI-derived export suggestions matching <strong>{selectedAnalysisProduct}</strong> parameters:</span>
                  </div>
                  <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-[10px]">3 Target Markets</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                          <th className="py-4 px-5">Country</th>
                          <th className="py-4 px-5">AI score</th>
                          <th className="py-4 px-5">Market Demand</th>
                          <th className="py-4 px-5">Estimated Profit</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        {/* Germany */}
                        <tr className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🇩🇪</span>
                              <span className="font-bold text-slate-800">Germany</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sky-655 font-extrabold text-sm">84.6%</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              High ↑
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-800 font-bold">₹184.65/kg</td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => { setSelectedCountry('Germany'); setAnalysisSubView('country-overview'); }}
                              className="px-3.5 py-1.5 text-[10px] font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow transition-all cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>

                        {/* UAE */}
                        <tr className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🇦🇪</span>
                              <span className="font-bold text-slate-800">UAE</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sky-655 font-extrabold text-sm">76.2%</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              Medium
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-800 font-bold">₹145.00/kg</td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => { setSelectedCountry('UAE'); setAnalysisSubView('country-overview'); }}
                              className="px-3.5 py-1.5 text-[10px] font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow transition-all cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>

                        {/* Singapore */}
                        <tr className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🇸🇬</span>
                              <span className="font-bold text-slate-800">Singapore</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sky-655 font-extrabold text-sm">71.8%</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Growing
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-800 font-bold">₹120.00/kg</td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => { setSelectedCountry('Singapore'); setAnalysisSubView('country-overview'); }}
                              className="px-3.5 py-1.5 text-[10px] font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow transition-all cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW: COUNTRY OVERVIEW PAGE */}
            {analysisSubView === 'country-overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header overview banner */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedCountry === 'Germany' ? '🇩🇪' : selectedCountry === 'UAE' ? '🇦🇪' : '🇸🇬'}</span>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedCountry} Market Summary</h2>
                      <p className="text-xxs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Route evaluation for {selectedAnalysisProduct}</p>
                    </div>
                  </div>
                  <span className="text-xxs font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">
                    ★ AI Recommended
                  </span>
                </div>

                {/* Country Overview Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: AI Score */}
                  <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Score</span>
                    <span className="text-xl font-black text-sky-650 block">
                      {selectedCountry === 'Germany' ? '84.6' : selectedCountry === 'UAE' ? '76.2' : '71.8'}/100
                    </span>
                    <span className="text-[9px] text-sky-500 font-bold block">Highly feasible match</span>
                  </div>

                  {/* Card 2: Demand */}
                  <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Market Demand</span>
                    <span className="text-xl font-black text-emerald-600 block">
                      {selectedCountry === 'Germany' ? 'HIGH' : selectedCountry === 'UAE' ? 'MEDIUM' : 'GROWING'}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold block">↑ Consistent YoY gains</span>
                  </div>

                  {/* Card 3: Expected Profit */}
                  <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Expected Profit</span>
                    <span className="text-xl font-black text-slate-800 block">
                      {selectedCountry === 'Germany' ? '₹184.65/kg' : selectedCountry === 'UAE' ? '₹145.00/kg' : '₹120.00/kg'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block">Selling price: {selectedCountry === 'Germany' ? '₹620/kg' : selectedCountry === 'UAE' ? '₹580/kg' : '₹520/kg'}</span>
                  </div>

                  {/* Card 4: Compliance Score */}
                  <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Compliance index</span>
                    <span className="text-xl font-black text-amber-600 block">
                      {selectedCountry === 'Germany' ? '78/100' : selectedCountry === 'UAE' ? '88/100' : '82/100'}
                    </span>
                    <span className="text-[9px] text-amber-500 font-bold block">Requires certificate updates</span>
                  </div>
                </div>

                {/* Card navigation buttons (Workflow action cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Action 1: Compliance */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow transition-all space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-850 uppercase tracking-wider block">Compliance Report</span>
                      <p className="text-[10px] text-slate-400 font-medium">Verify customs documents, certifications status, labeling rules, and index parameters.</p>
                    </div>
                    <button
                      onClick={() => setAnalysisSubView('compliance')}
                      className="w-full py-2.5 text-xs font-bold text-sky-655 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer text-center"
                    >
                      View Compliance Report
                    </button>
                  </div>

                  {/* Action 2: Cost Estimation */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow transition-all space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-850 uppercase tracking-wider block">Cost & Profit Estimation</span>
                      <p className="text-[10px] text-slate-400 font-medium">Calculate product cost, transport freight, insurance, taxes, and net landed cost margins.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCostQuantity(1000);
                        setCostShippingMode('Sea');
                        setCostInsurance(true);
                        setCostLogisticsPartner('FastCargo Logistics');
                        setAnalysisSubView('cost');
                      }}
                      className="w-full py-2.5 text-xs font-bold text-sky-655 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer text-center"
                    >
                      View Cost Estimation
                    </button>
                  </div>

                  {/* Action 3: What-if Simulation */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow transition-all space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-850 uppercase tracking-wider block">What-if Simulator</span>
                      <p className="text-[10px] text-slate-400 font-medium">Run simulations on shipping transport modes, tariff rates, insurance, and organic branding.</p>
                    </div>
                    <button
                      onClick={() => {
                        setWhatIfOrganic(true);
                        setWhatIfShippingMode('Sea');
                        setWhatIfInsuranceActive(true);
                        setWhatIfTariffAdj(5);
                        setWhatIfLogisticsPartner('FastCargo Logistics');
                        setSimulatedResults({
                          aiScore: selectedCountry === 'Germany' ? 84 : selectedCountry === 'UAE' ? 76 : 71,
                          compliance: selectedCountry === 'Germany' ? 72 : selectedCountry === 'UAE' ? 82 : 78,
                          landedCost: selectedCountry === 'Germany' ? 420 : selectedCountry === 'UAE' ? 390 : 410,
                          profit: selectedCountry === 'Germany' ? 160 : selectedCountry === 'UAE' ? 140 : 110,
                          countryRank: selectedCountry === 'Germany' ? 3 : selectedCountry === 'UAE' ? 5 : 7
                        });
                        setAnalysisSubView('what-if');
                      }}
                      className="w-full py-2.5 text-xs font-bold text-sky-655 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Run What-if Analysis
                    </button>
                  </div>

                  {/* Action 4: Create Order */}
                  <div className="bg-gradient-to-br from-sky-500/5 to-indigo-500/5 border border-indigo-100 p-5 rounded-2xl shadow-sm hover:shadow transition-all space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-850 uppercase tracking-wider block">Commit & Export</span>
                      <p className="text-[10px] text-slate-400 font-medium">Create a provisional Indian SME export order and lock this trade route in your tracking log.</p>
                    </div>
                    <button
                      onClick={() => {
                        const orderId = `ORD-00${orders.length + 1}`;
                        const newOrder = {
                          id: orderId,
                          importer: selectedCountry === 'Germany' ? "EuroSpice GmbH" : selectedCountry === 'UAE' ? "Al Noor Trading" : "SingaFoods",
                          country: selectedCountry,
                          email: selectedCountry === 'Germany' ? "info@eurospice.de" : selectedCountry === 'UAE' ? "alnoor@trading.ae" : "buying@singafoods.sg",
                          phone: selectedCountry === 'Germany' ? "+49-89-987654" : selectedCountry === 'UAE' ? "+971-50-1234567" : "+65-6789-0123",
                          product: selectedAnalysisProduct,
                          hscode: selectedAnalysisProduct === 'Cumin Seeds' ? "0909.31" : "0910.30",
                          qty: "1,000 kg",
                          value: selectedCountry === 'Germany' ? "₹6,20,000" : selectedCountry === 'UAE' ? "₹5,80,000" : "₹5,20,000",
                          status: "Pending",
                          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
                          delivery: "25 August 2026",
                          logisticsPartner: "TBD"
                        };
                        setOrders(prev => [newOrder, ...prev]);
                        addToast(`Export Order ${orderId} created successfully for ${selectedCountry}!`, "success");
                        setActiveView('orders');
                      }}
                      className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-xl shadow-md transition-all cursor-pointer text-center"
                    >
                      Create Export Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW: COMPLIANCE REPORT PAGE */}
            {analysisSubView === 'compliance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
                
                {/* Left Panel: Checklist and Score (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Documents & Certifications Card */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Required Documents & Status</h3>
                      {/* Language Select controls */}
                      <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-[9px] font-black text-slate-500">
                        {['EN', 'HI', 'TE'].map(lang => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setComplianceLang(lang);
                              addToast(`Compliance documents translated to ${lang === 'EN' ? 'English' : lang === 'HI' ? 'Hindi' : 'Telugu'}.`, 'success');
                            }}
                            className={`px-2 py-0.5 rounded cursor-pointer ${complianceLang === lang ? 'bg-white text-sky-600 shadow-xs' : 'hover:text-slate-800'}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Invoice */}
                      <div 
                        onClick={() => toggleDoc('invoice')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          ownedDocs.invoice 
                            ? 'border-emerald-250 bg-emerald-50/10 text-slate-800 shadow-xs' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-450'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className={ownedDocs.invoice ? "text-emerald-500" : "text-red-500 font-bold"}>{ownedDocs.invoice ? "✔" : "✖"}</span>
                          <span>Commercial Invoice</span>
                        </div>
                        <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                          ownedDocs.invoice ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {ownedDocs.invoice ? 'Verified' : 'Missing'}
                        </span>
                      </div>

                      {/* Packing List */}
                      <div 
                        onClick={() => toggleDoc('packingList')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          ownedDocs.packingList 
                            ? 'border-emerald-250 bg-emerald-50/10 text-slate-800 shadow-xs' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-455'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className={ownedDocs.packingList ? "text-emerald-500" : "text-red-500 font-bold"}>{ownedDocs.packingList ? "✔" : "✖"}</span>
                          <span>Packing List</span>
                        </div>
                        <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                          ownedDocs.packingList ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {ownedDocs.packingList ? 'Verified' : 'Missing'}
                        </span>
                      </div>

                      {/* Origin Cert */}
                      <div 
                        onClick={() => toggleDoc('originCert')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          ownedDocs.originCert 
                            ? 'border-emerald-255 bg-emerald-50/10 text-slate-800 shadow-xs' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-455'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className={ownedDocs.originCert ? "text-emerald-500" : "text-red-500 font-bold"}>{ownedDocs.originCert ? "✔" : "✖"}</span>
                          <span>Certificate of Origin</span>
                        </div>
                        <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                          ownedDocs.originCert ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {ownedDocs.originCert ? 'Verified' : 'Missing'}
                        </span>
                      </div>

                      {/* Export License */}
                      <div 
                        onClick={() => toggleDoc('fssaiLicense')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          ownedDocs.fssaiLicense 
                            ? 'border-emerald-255 bg-emerald-50/10 text-slate-800 shadow-xs' 
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 text-slate-455'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className={ownedDocs.fssaiLicense ? "text-emerald-500" : "text-red-500 font-bold"}>{ownedDocs.fssaiLicense ? "✔" : "✖"}</span>
                          <span>Export License</span>
                        </div>
                        <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                          ownedDocs.fssaiLicense ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {ownedDocs.fssaiLicense ? 'Verified' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-right">
                      <button
                        onClick={() => addToast("Provisional compliance sample templates PDF package downloaded.", "success")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-55 cursor-pointer shadow-xs"
                      >
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Sample
                      </button>
                    </div>
                  </div>

                  {/* Certifications & Labeling Details Card */}
                  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-855 uppercase tracking-widest border-b border-slate-100 pb-2">Required Certifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Organic */}
                      <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Organic Certificate</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${ownedDocs.organicCert ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className={`text-xs font-black ${ownedDocs.organicCert ? 'text-emerald-600' : 'text-red-550'}`}>
                            {ownedDocs.organicCert ? 'Available' : 'Missing'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOwnedDocs(prev => ({ ...prev, organicCert: !prev.organicCert }));
                            addToast("Organic Certificate state toggled.", "success");
                          }}
                          className="text-[9px] font-bold text-sky-600 hover:underline mt-1 block cursor-pointer"
                        >
                          Toggle status
                        </button>
                      </div>

                      {/* ISO 22000 */}
                      <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">ISO 22000 Cert</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-black text-emerald-600">Available</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">Declared in profile settings</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Labeling & Packing Standards</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-705">
                        <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100 space-y-1">
                          <span className="block text-[9px] font-bold text-slate-450 uppercase">Language</span>
                          <span>German translations</span>
                        </div>
                        <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100 space-y-1">
                          <span className="block text-[9px] font-bold text-slate-450 uppercase">Packaging</span>
                          <span>Double-wall vacuum seals</span>
                        </div>
                        <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100 space-y-1">
                          <span className="block text-[9px] font-bold text-slate-450 uppercase">Shelf Life</span>
                          <span>12 Months Dec declaration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Complexity index & Sources & AI chat assistant (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Complexity Index Index */}
                  {(() => {
                    const ownedCount = Object.values(ownedDocs).filter(Boolean).length;
                    const compScore = Math.max(100 - (ownedCount * 12), 10);
                    const barColor = compScore < 40 ? 'bg-emerald-500' : compScore < 75 ? 'bg-amber-500' : 'bg-red-500';
                    const textColor = compScore < 40 ? 'text-emerald-600' : compScore < 75 ? 'text-amber-600' : 'text-red-550';
                    return (
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-3.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-450 uppercase tracking-widest text-[10px]">Compliance Complexity</span>
                          <span className={`font-black text-sm ${textColor}`}>{compScore} /100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all duration-300`} style={{ width: `${compScore}%` }}></div>
                        </div>

                        {/* Breakdown bars */}
                        <div className="space-y-2 pt-2 text-[10px] font-bold text-slate-500">
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Verified Documents</span><span>{ownedDocs.invoice && ownedDocs.packingList ? '100%' : '50%'}</span></div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: ownedDocs.invoice && ownedDocs.packingList ? '100%' : '50%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Certifications</span><span>{ownedDocs.organicCert ? '100%' : '50%'}</span></div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: ownedDocs.organicCert ? '100%' : '50%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>Lab Inspection Tests</span><span>90%</span></div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                          </div>
                        </div>

                        {/* References / Sources */}
                        <div className="border-t border-slate-100 pt-3 space-y-1.5">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Official Sources</span>
                          <div className="space-y-1 text-[10px] font-bold text-sky-655">
                            <span className="block hover:underline cursor-pointer">↳ EU Spice Tariff Import Regulation (2026/410)</span>
                            <span className="block hover:underline cursor-pointer">↳ Indian DGFT Phytosanitary Export Notification #42</span>
                            <span className="block hover:underline cursor-pointer">↳ FSSAI organic packaging guidelines</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* AI Compliance chat box */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[300px] border border-slate-800">
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xxs font-black uppercase tracking-widest text-slate-350">AI TradeWise Assistant</span>
                      </div>

                      {/* Chat messages */}
                      <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar py-1">
                        {complianceChatHistory.map((m, idx) => (
                          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-xl text-xxs font-semibold max-w-[85%] leading-relaxed ${
                              m.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-200'
                            }`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-800 pt-3 mt-3">
                      <input 
                        type="text" 
                        value={complianceChatText}
                        onChange={(e) => setComplianceChatText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComplianceChat()}
                        placeholder="Ask about compliance..."
                        className="flex-grow bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xxs font-bold text-white focus:outline-none focus:border-sky-500"
                      />
                      <button 
                        onClick={handleSendComplianceChat}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-xxs font-black rounded-xl transition-all cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW: COST & PROFIT ESTIMATION PAGE */}
            {analysisSubView === 'cost' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Cost Configurator top bar */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Cost Calculation Parameters</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 items-end">
                    
                    {/* Quantity */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Quantity (kg)</label>
                      <input 
                        type="number"
                        value={costQuantity}
                        onChange={(e) => setCostQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Shipping Mode */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Shipping Mode</label>
                      <select 
                        value={costShippingMode}
                        onChange={(e) => setCostShippingMode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                      >
                        <option>Air</option>
                        <option>Sea</option>
                        <option>Road</option>
                      </select>
                    </div>

                    {/* Insurance check */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-455 uppercase tracking-wider block">Insurance</label>
                      <select 
                        value={costInsurance ? 'Yes' : 'No'}
                        onChange={(e) => setCostInsurance(e.target.value === 'Yes')}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                    {/* Logistics Partner */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Logistics Partner</label>
                      <select 
                        value={costLogisticsPartner}
                        onChange={(e) => setCostLogisticsPartner(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                      >
                        <option>FastCargo Logistics</option>
                        <option>GlobalShip Inc.</option>
                        <option>TransWorld Logistics</option>
                      </select>
                    </div>

                    {/* Calculate trigger */}
                    <button
                      onClick={handleCalculateCost}
                      disabled={isCalculatingCost}
                      className="w-full py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isCalculatingCost ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Calculating...</span>
                        </>
                      ) : (
                        <span>Calculate</span>
                      )}
                    </button>
                  </div>
                </div>

                {isCalculatingCost ? (
                  <div className="bg-white border border-slate-200/80 p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-4" />
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Evaluating Landed Tariff Margins</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: breakdown table (7 cols) */}
                    <div className="lg:col-span-7 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-100 pb-2">Landed Cost breakdown</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-semibold text-slate-655 border-collapse">
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <td className="py-2.5">Product Base Cost</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{(calculatedCostBreakdown.productCost).toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">Freight Shipping Cost ({costShippingMode})</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.freight.toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">Insurance Fees</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.insurance.toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">Customs Duties (5%)</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.customsDuty.toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">Tariff Regulatory Fee</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.tariff.toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">GST (IGST equivalent)</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.gst.toFixed(2)}/kg</td>
                            </tr>
                            <tr>
                              <td className="py-2.5">Handling & Clearing Charges</td>
                              <td className="py-2.5 text-right text-slate-800 font-bold">₹{calculatedCostBreakdown.handlingCharges.toFixed(2)}/kg</td>
                            </tr>
                            <tr className="border-t border-slate-200 bg-sky-50/15 font-black text-sky-700">
                              <td className="py-3 px-1.5">Total Landed Cost</td>
                              <td className="py-3 px-1.5 text-right text-sky-750 text-sm">₹{calculatedCostBreakdown.landedCost.toFixed(2)}/kg</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Profit margins and Visual charts (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Profit margins card */}
                      <div className="bg-gradient-to-br from-indigo-500/5 to-sky-500/5 border border-indigo-100 p-5 rounded-2xl shadow-sm space-y-3.5">
                        <span className="text-[10px] font-black text-slate-455 uppercase tracking-widest block border-b border-slate-200/50 pb-1.5">Margin Projections</span>
                        
                        <div className="space-y-2.5 text-xs font-bold text-slate-600">
                          <div className="flex justify-between">
                            <span>Target Selling Price</span>
                            <span className="text-slate-900">₹{calculatedCostBreakdown.sellingPrice.toFixed(2)}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Projected Revenue</span>
                            <span className="text-slate-900">₹{calculatedCostBreakdown.revenue.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Landed Cost Total</span>
                            <span className="text-slate-900">₹{(calculatedCostBreakdown.landedCost * costQuantity).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t border-slate-200/50 pt-2 flex justify-between font-black">
                            <span className="text-emerald-700 text-[13px]">Net Profit Margin</span>
                            <span className="text-emerald-600 text-[13px]">{calculatedCostBreakdown.margin}%</span>
                          </div>
                          <div className="flex justify-between font-black">
                            <span className="text-emerald-700">Expected Profit</span>
                            <span className="text-emerald-600">₹{(calculatedCostBreakdown.profit * costQuantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* CSS Visual charts */}
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                        <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Cost Distribution Ratio</span>
                        
                        {/* Cost stacked horizontal bar */}
                        <div className="space-y-2.5">
                          <div className="h-6 w-full rounded-lg overflow-hidden flex text-[8px] font-black text-white text-center">
                            <div className="bg-sky-500 flex items-center justify-center" style={{ width: '65%' }}>Product (65%)</div>
                            <div className="bg-indigo-500 flex items-center justify-center" style={{ width: '20%' }}>Freight (20%)</div>
                            <div className="bg-emerald-500 flex items-center justify-center" style={{ width: '15%' }}>Other (15%)</div>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] font-bold text-slate-455">
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span><span>Base product</span></div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span><span>Logistics freight</span></div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span><span>Duties & GST</span></div>
                          </div>
                        </div>

                        {/* Profit margin share ratio chart representation */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Margin Analysis</span>
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full border-[6px] border-slate-100 flex items-center justify-center">
                              <span className="text-[10px] font-black text-slate-800">{calculatedCostBreakdown.margin}%</span>
                              <div className="absolute inset-0 rounded-full border-[6px] border-emerald-500 border-t-transparent border-l-transparent border-r-transparent animate-spin-slow"></div>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-455">
                              <span className="block font-bold text-emerald-600">★★★★ Strong profitability index</span>
                              <span className="block mt-0.5">Route profit margins are above Indian exporter benchmarks.</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW: WHAT-IF SIMULATOR PAGE */}
            {analysisSubView === 'what-if' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
                
                {/* Left Panel: variables adjusters (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-5">
                  <h3 className="text-xs font-black text-slate-855 uppercase tracking-widest border-b border-slate-100 pb-2">Simulator Settings</h3>
                  
                  {/* Organic cert toggles */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Organic Certification</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWhatIfOrganic(true)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          whatIfOrganic ? 'bg-sky-500 text-white border-sky-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        Yes (Certified)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWhatIfOrganic(false)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          !whatIfOrganic ? 'bg-sky-500 text-white border-sky-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        No (Convention)
                      </button>
                    </div>
                  </div>

                  {/* Shipping mode */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-455 uppercase tracking-wider block">Transport Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Air', 'Sea', 'Road'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWhatIfShippingMode(m)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            whatIfShippingMode === m ? 'bg-sky-500 text-white border-sky-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Insurance toggles */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Cargo Insurance Coverage</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWhatIfInsuranceActive(true)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          whatIfInsuranceActive ? 'bg-sky-500 text-white border-sky-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setWhatIfInsuranceActive(false)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          !whatIfInsuranceActive ? 'bg-sky-500 text-white border-sky-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>

                  {/* Tariff Adjustment slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black text-slate-450 uppercase tracking-wider">
                      <span>Tariff Adjustment Rate</span>
                      <span className="text-slate-800">{whatIfTariffAdj}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={whatIfTariffAdj}
                      onChange={(e) => setWhatIfTariffAdj(e.target.value)}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>

                  {/* Logistics Partner */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Logistics Partner</label>
                    <select
                      value={whatIfLogisticsPartner}
                      onChange={(e) => setWhatIfLogisticsPartner(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <option>FastCargo Logistics</option>
                      <option>GlobalShip Inc.</option>
                      <option>TransWorld Logistics</option>
                    </select>
                  </div>

                  {/* Action trigger */}
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="w-full py-3 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSimulating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Simulating Projections...</span>
                      </>
                    ) : (
                      <span>Run Simulation</span>
                    )}
                  </button>
                </div>

                {/* Right Panel: Projections Comparison Matrix (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-855 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Projections Comparison Matrix
                  </h3>

                  {isSimulating ? (
                    <div className="p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[250px]">
                      <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-4" />
                      <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Evaluating Alternate Trade Conditions</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto animate-in fade-in duration-300">
                      <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                            <th className="py-3 px-4">Metric</th>
                            <th className="py-3 px-4">Current Profile</th>
                            <th className="py-3 px-4">Simulated Projections</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                          <tr>
                            <td className="py-3 px-4 font-bold">AI Feasibility Score</td>
                            <td className="py-3 px-4 text-slate-500">84/100</td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-sky-655">{simulatedResults.aiScore}/100</span>
                              {simulatedResults.aiScore > 84 && <span className="ml-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↑</span>}
                              {simulatedResults.aiScore < 84 && <span className="ml-1 text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">↓</span>}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold">Compliance Index</td>
                            <td className="py-3 px-4 text-slate-500">72/100</td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-800">{simulatedResults.compliance}/100</span>
                              {simulatedResults.compliance > 72 && <span className="ml-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↑</span>}
                              {simulatedResults.compliance < 72 && <span className="ml-1 text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">↓</span>}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold">Landed Cost / kg</td>
                            <td className="py-3 px-4 text-slate-500">₹420</td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-850">₹{simulatedResults.landedCost}</span>
                              {simulatedResults.landedCost < 420 && <span className="ml-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↓ Improvement</span>}
                              {simulatedResults.landedCost > 420 && <span className="ml-1 text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">↑ Increase</span>}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold">Expected Margin Profit / kg</td>
                            <td className="py-3 px-4 text-slate-500">₹160</td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-emerald-600">₹{simulatedResults.profit}</span>
                              {simulatedResults.profit > 160 && <span className="ml-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↑ Gain</span>}
                              {simulatedResults.profit < 160 && <span className="ml-1 text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">↓ Loss</span>}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold">Target Country Rank</td>
                            <td className="py-3 px-4 text-slate-500">#3</td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-900">#{simulatedResults.countryRank}</span>
                              {simulatedResults.countryRank < 3 && <span className="ml-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↑ Up</span>}
                              {simulatedResults.countryRank > 3 && <span className="ml-1 text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">↓ Down</span>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

           {activeView === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Export Orders</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Manage incoming contracts, tracking logs, and freight assignments.</p>
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
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-455 uppercase tracking-widest">
                      <th className="py-4 px-5">Order ID</th>
                      <th className="py-4 px-5">Product</th>
                      <th className="py-4 px-5">Destination Country</th>
                      <th className="py-4 px-5">Quantity</th>
                      <th className="py-4 px-5">Value</th>
                      <th className="py-4 px-5">Logistics Partner</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5">Tracking</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {orders
                      .filter(o => orderFilter === 'All' || o.status === orderFilter)
                      .map(o => {
                        const shipment = shipments.find(s => s.orderId === o.id);
                        const partner = shipment ? shipment.logistics : (o.logisticsPartner || 'TBD');
                        const trackNum = shipment ? shipment.tracking : 'TBD';
                        return (
                          <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-5 font-mono text-slate-900 font-bold">#{o.id}</td>
                            <td className="py-4 px-5 text-slate-800">{o.product}</td>
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-1.5">
                                <span>{o.country === 'Germany' ? '🇩🇪' : o.country === 'UAE' ? '🇦🇪' : '🇸🇬'}</span>
                                <span className="font-bold text-slate-800">{o.country}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-slate-500">{o.qty}</td>
                            <td className="py-4 px-5 text-slate-805">{o.value}</td>
                            <td className="py-4 px-5 text-slate-500 font-semibold">{partner}</td>
                            <td className="py-4 px-5">
                              {o.status === 'Pending' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Pending
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
                            <td className="py-4 px-5 font-mono text-[10px] text-slate-450">{trackNum}</td>
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
                        );
                      })}
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
