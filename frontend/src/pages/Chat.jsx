import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowLeft, Send, User, Loader2 } from 'lucide-react';
import { chatApi } from '../api';

// Polyfill global for stompjs/sockjs inside Vite
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

export default function Chat({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [partner, setPartner] = useState(null); // Selected chat partner
  const [history, setHistory] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Available chat partners list based on role
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      onNavigate('/login');
      return;
    }
    const user = JSON.parse(userJson);
    setCurrentUser(user);

    // Setup chat partners depending on who is logged in
    if (user.role === 'EXPORTER') {
      setPartners([
        { id: 2, name: 'Al Noor Importer', email: 'importer@company.com', role: 'IMPORTER' },
        { id: 3, name: 'FastCargo Logistics', email: 'logistics@company.com', role: 'LOGISTICS_PARTNER' }
      ]);
    } else if (user.role === 'IMPORTER') {
      setPartners([
        { id: 1, name: 'John Exporter', email: 'exporter@company.com', role: 'EXPORTER' }
      ]);
    } else {
      setPartners([
        { id: 1, name: 'John Exporter', email: 'exporter@company.com', role: 'EXPORTER' }
      ]);
    }
  }, []);

  // Connect to STOMP WebSockets
  useEffect(() => {
    if (!currentUser) return;

    let SockJS;
    let Stomp;
    
    try {
      SockJS = require('sockjs-client');
      Stomp = require('stompjs');
    } catch (e) {
      // Direct imports if require is not available in bundle env
    }

    // Dynamic import fallback for ES Modules
    const connectWebSockets = async () => {
      try {
        if (!SockJS) {
          const sockjsModule = await import('sockjs-client/dist/sockjs.js');
          SockJS = sockjsModule.default;
        }
        if (!Stomp) {
          const stompModule = await import('stompjs/lib/stomp.js');
          Stomp = stompModule.Stomp;
        }

        const socket = new SockJS('http://localhost:8080/ws/chat');
        const StompClient = Stomp.over(socket);
        StompClient.debug = null; // Disable console logging

        StompClient.connect({}, () => {
          setConnected(true);
          stompClientRef.current = StompClient;
          
          // Subscribe to incoming private messages
          StompClient.subscribe('/topic/messages/' + currentUser.id, (message) => {
            const msg = JSON.parse(message.body);
            // Append message if it belongs to active thread
            setHistory(prev => {
              // Avoid duplicates
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          });
        }, () => {
          setConnected(false);
        });
      } catch (err) {
        console.error("STOMP Websocket connection error:", err);
      }
    };

    connectWebSockets();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [currentUser]);

  // Load chat history when partner is changed
  useEffect(() => {
    if (!partner || !currentUser) return;

    chatApi.getHistory(partner.id)
      .then(res => {
        setHistory(res.data);
        scrollToBottom();
      })
      .catch(() => {});
  }, [partner, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !partner || !stompClientRef.current) return;

    const payload = {
      senderId: currentUser.id,
      receiverId: partner.id,
      content: messageText.trim()
    };

    // Dispatch message via WebSocket
    stompClientRef.current.send('/app/chat.send', {}, JSON.stringify(payload));
    setMessageText('');
  };

  const handleGoBack = () => {
    if (currentUser?.role === 'IMPORTER') {
      onNavigate('/importer');
    } else if (currentUser?.role === 'LOGISTICS_PARTNER') {
      onNavigate('/logistics');
    } else {
      onNavigate('/exporter');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col antialiased font-sans select-none relative">
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Globe className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-900">TradeWise Chat Channel</span>
          {connected ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1.5" title="WebSocket Active"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-400 ml-1.5 animate-pulse" title="WebSocket Reconnecting"></span>
          )}
        </div>

        <div className="w-28"></div>
      </nav>

      {/* Main Chat layout split column */}
      <div className="flex-grow pt-16 grid grid-cols-1 md:grid-cols-12 max-w-7xl w-full mx-auto relative z-10 min-h-[calc(100vh-4rem)]">
        
        {/* Left Side: Partners list (4 cols) */}
        <div className="md:col-span-4 bg-white border-r border-slate-200 p-4 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Available Contacts</h3>
          <div className="flex flex-col gap-2">
            {partners.map(p => (
              <div 
                key={p.id}
                onClick={() => setPartner(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  partner && partner.id === p.id 
                    ? 'border-sky-500 bg-sky-50/10 scale-[1.01]' 
                    : 'border-slate-100 bg-slate-50/20 hover:border-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 border flex items-center justify-center text-slate-500">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-800">{p.name}</span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">{p.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Conversation Area (8 cols) */}
        <div className="md:col-span-8 bg-slate-50/40 flex flex-col justify-between h-full max-h-[calc(100vh-4rem)]">
          {partner ? (
            <>
              {/* Active Header */}
              <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-xxs">
                <div>
                  <span className="block text-xs font-black text-slate-850">{partner.name}</span>
                  <span className="block text-[10px] text-slate-400">{partner.email}</span>
                </div>
              </div>

              {/* Message scroll list */}
              <div className="flex-grow p-5 overflow-y-auto space-y-4">
                {history.map(m => {
                  const incoming = m.senderId !== currentUser.id;
                  return (
                    <div key={m.id} className={`flex ${incoming ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-3.5 rounded-2xl max-w-sm text-xs font-semibold leading-relaxed shadow-xxs ${
                        incoming 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input form */}
              <form onSubmit={handleSendMessage} className="bg-white border-t border-slate-200 p-4 flex gap-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                />
                <button 
                  type="submit" 
                  className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6" />
              </div>
              <span className="block text-sm font-black text-slate-800 uppercase">Start negotiation chat</span>
              <span className="block text-xxs text-slate-400 mt-1 max-w-xs">Select one of the contacts from the sidebar menu to begin real-time pricing negotiations.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
