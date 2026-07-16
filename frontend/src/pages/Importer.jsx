import React, { useState, useEffect } from 'react';
import { Globe, LogOut, ShoppingCart, ShoppingBag, Eye, X, Check, Loader2 } from 'lucide-react';
import { productApi, ordersApi } from '../api';

export default function Importer({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'requests'
  
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    loadProducts();
    loadRequests();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    productApi.getProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        addToast('Failed to load products from registry.', 'error');
        setLoading(false);
      });
  };

  const loadRequests = () => {
    ordersApi.getPurchaseRequests()
      .then(res => setPurchaseRequests(res.data))
      .catch(() => {});
  };

  const handleSendPurchaseRequest = (productId, productName) => {
    ordersApi.createPurchaseRequest(productId)
      .then(() => {
        addToast(`Purchase request sent for ${productName}!`, 'success');
        loadRequests();
      })
      .catch(() => addToast('Failed to submit purchase request.', 'error'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col antialiased font-sans select-none relative">
      
      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl ${
            t.type === 'success' ? 'bg-emerald-50 border-emerald-250 text-slate-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Globe className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">TradeWise <span className="text-sky-500 text-xs uppercase px-2 py-0.5 rounded-full border border-sky-200 bg-sky-50 font-bold ml-1">Importer</span></span>
        </div>

        <div className="flex items-center gap-6 h-full text-xs font-bold text-slate-500">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeTab === 'browse' ? 'text-sky-600 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Browse Products
            {activeTab === 'browse' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`transition-colors h-full px-1 cursor-pointer relative ${activeTab === 'requests' ? 'text-sky-600 font-extrabold' : 'hover:text-slate-950'}`}
          >
            Purchase Requests ({purchaseRequests.length})
            {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sky-500 rounded-t-full"></div>}
          </button>
          <button onClick={() => onNavigate('/chat')} className="hover:text-slate-900 transition-colors h-full px-1 cursor-pointer">Chat Channel</button>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xxs font-bold text-red-655 border border-red-200 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-grow pt-24 pb-12 px-6 max-w-7xl w-full mx-auto relative z-10">
        
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Available Product Catalog</h1>
              <p className="text-xs text-slate-500 mt-1">Browse high-quality products from Indian SME exporters and send purchase requests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-12 text-center text-slate-400">Loading catalog items...</div>
              ) : products.length > 0 ? (
                products.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xxs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 uppercase tracking-widest">{p.category}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.hsCode}</span>
                      </div>
                      <h3 className="text-base font-black text-slate-850 mt-3">{p.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">{p.description || 'No description provided.'}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xxs font-bold text-slate-400">
                        <span>Exporter Name</span>
                        <span className="block text-slate-700 font-extrabold mt-0.5">{p.exporter.name}</span>
                      </div>
                      <button 
                        onClick={() => handleSendPurchaseRequest(p.id, p.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xxs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all cursor-pointer shadow-sm shadow-sky-500/10"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Request Purchase
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400">No products uploaded yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-905 tracking-tight">Your Purchase Requests</h1>
              <p className="text-xs text-slate-500 mt-1">Track status and review logs of your export orders contract negotiations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-5">Request ID</th>
                    <th className="py-4 px-5">Product</th>
                    <th className="py-4 px-5">Exporter</th>
                    <th className="py-4 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {purchaseRequests.length > 0 ? (
                    purchaseRequests.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/20">
                        <td className="py-4 px-5 font-mono text-slate-400">#REQ-00{r.id}</td>
                        <td className="py-4 px-5 font-bold text-slate-900">{r.product.name}</td>
                        <td className="py-4 px-5">{r.product.exporter.name}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'ACCEPTED' ? 'text-emerald-600 bg-emerald-50' : r.status === 'QUOTED' ? 'text-indigo-650 bg-indigo-50' : 'text-amber-600 bg-amber-50'
                          }`}>
                            {r.status === 'QUOTED' ? 'Freight Quoted' : r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400">No purchase requests submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
