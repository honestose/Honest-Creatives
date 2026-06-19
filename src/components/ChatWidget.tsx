import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Mail, RefreshCw, User, Sparkles, MessageSquare } from 'lucide-react';
import logoImage from '../assets/images/honest_creatives_logo_1781788567728.jpg';

interface ChatWidgetProps {
  theme?: 'light' | 'dark';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  time: string;
  timestamp: number;
}

export default function ChatWidget({ theme = 'light' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('hc_chat_name') || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('hc_chat_email') || '';
    } catch {
      return '';
    }
  });

  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMode, setChatMode] = useState<'ai_auto' | 'active'>('ai_auto');
  const [lastCheck, setLastCheck] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Pull active session if name + email was already stored in local storage
  useEffect(() => {
    if (name && email) {
      initializeSession(name, email, false);
    }
  }, []);

  // Poll for human/admin replies while chat widget is open
  useEffect(() => {
    if (isOpen && sessionActive && email) {
      // Poll immediately
      pollMessages();

      // Setup 4 second polling timer
      pollingRef.current = setInterval(() => {
        pollMessages();
      }, 4000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isOpen, sessionActive, email]);

  const pollMessages = async () => {
    if (!email) return;
    try {
      const res = await fetch(`/api/chats/session?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          // If message counts differ or a new admin message has been appended, updates state
          if (data.messages.length !== messages.length) {
            setMessages(data.messages);
          }
          setChatMode(data.mode);
        }
      }
    } catch (err) {
      console.warn('[Chat] Failed polling updates:', err);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const initializeSession = async (clientName: string, clientEmail: string, forceOpen = true) => {
    if (!clientName.trim() || !clientEmail.trim() || !clientEmail.includes('@')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/chats/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, email: clientEmail }),
      });
      if (res.ok) {
        const session = await res.json();
        setMessages(session.messages || []);
        setChatMode(session.mode || 'ai_auto');
        setSessionActive(true);

        try {
          localStorage.setItem('hc_chat_name', clientName.trim());
          localStorage.setItem('hc_chat_email', clientEmail.trim().toLowerCase());
        } catch (storageErr) {
          console.warn('Storage blocked:', storageErr);
        }

        if (forceOpen) {
          setIsOpen(true);
        }
      }
    } catch (err) {
      console.error('[Chat] Exception opening support chat:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    initializeSession(name, email, true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || isSubmitting || !email) return;

    const textToSend = messageText.trim();
    setMessageText('');

    // Pre-render local message for responsive feed feel
    const tempMsg: ChatMessage = {
      id: 'temp_' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, text: textToSend }),
      });
      if (res.ok) {
        const updatedSession = await res.json();
        setMessages(updatedSession.messages || []);
        setChatMode(updatedSession.mode || 'ai_auto');
      }
    } catch (err) {
      console.error('[Chat] Message sending error:', err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetSession = () => {
    if (confirm('Are you sure you want to end this chat session? This will wipe local cache.')) {
      try {
        localStorage.removeItem('hc_chat_name');
        localStorage.removeItem('hc_chat_email');
      } catch {}
      setName('');
      setEmail('');
      setMessages([]);
      setSessionActive(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left font-sans" id="floating-chat-widget">
      {/* Expanded Chat Box Window */}
      {isOpen && (
        <div 
          className={`absolute bottom-20 right-0 w-80 sm:w-96 rounded-sm border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 ${
            theme === 'dark' 
              ? 'bg-neutral-900 border-neutral-800 text-stone-100 shadow-black' 
              : 'bg-white border-stone-250 text-black'
          }`}
          id="chat-popover-box"
        >
          {/* Header */}
          <div className="bg-stone-950 text-white p-4 flex justify-between items-center border-b border-neutral-850" id="chat-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-neutral-800 overflow-hidden shrink-0">
                <img 
                  src={logoImage} 
                  alt="Honest Creatives Logo Icon" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                  Honest Creatives Support
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-orange-400">
                  {chatMode === 'active' ? '👤 HUMAN OPERATOR JOINED' : '🤖 SUPPORT ASSISTANT ACTIVE'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {sessionActive && (
                <button
                  onClick={handleResetSession}
                  className="text-stone-500 hover:text-red-400 transition-colors cursor-pointer text-[10px] font-mono mr-2"
                  title="Wipe Session"
                >
                  End Chat
                </button>
              )}
              <button 
                onClick={handleToggle}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-neutral-850"
                id="close-chat-btn"
                aria-label="Close Chat Window"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream / Interactive conversation */}
          {sessionActive ? (
            <div className="flex flex-col flex-grow h-[350px] justify-between">
              
              {/* Chat mode active indicator line info */}
              <div className={`px-4 py-1.5 border-b text-[10px] font-mono flex items-center justify-between ${
                theme === 'dark' ? 'bg-neutral-950/40 border-neutral-850 text-stone-400' : 'bg-stone-50 border-stone-150 text-stone-605'
              }`}>
                <span>Session: <span className="font-bold text-orange-500">{email}</span></span>
                <span className="flex items-center gap-1">
                  {chatMode === 'active' ? (
                    <span className="text-emerald-500 font-bold">● Active Human</span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-0.5">
                      <Sparkles size={10} /> AI Agent Active
                    </span>
                  )}
                </span>
              </div>

              {/* Feed items */}
              <div 
                className={`flex-grow overflow-y-auto p-4 space-y-3 text-xs ${
                  theme === 'dark' ? 'bg-neutral-950' : 'bg-stone-50/70'
                }`}
                id="chat-messages-container"
              >
                {messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  const isAdmin = msg.sender === 'admin';
                  const isBot = msg.sender === 'bot';
                  
                  return (
                    <div 
                      key={msg.id || index}
                      className={`flex flex-col max-w-[85%] ${
                        isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      {/* Name tag prefix */}
                      <span className={`text-[8px] font-mono uppercase tracking-wider mb-0.5 ${
                        isUser ? 'text-orange-505' : isAdmin ? 'text-emerald-500 font-bold' : 'text-stone-400'
                      }`}>
                        {isUser ? 'Client' : isAdmin ? '👑 Senior Partner (Human)' : '🤖 AI Advocate'}
                      </span>
                      
                      <div className={`p-2.5 rounded-sm leading-relaxed ${
                        isUser
                          ? 'bg-orange-500 text-white font-medium'
                          : isAdmin
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold'
                          : theme === 'dark'
                          ? 'bg-neutral-850 border border-neutral-800 text-stone-200'
                          : 'bg-white border border-stone-200 text-stone-850'
                      }`}>
                        <p className="whitespace-pre-line text-[11px]">{msg.text}</p>
                      </div>
                      <span className={`text-[8px] font-mono mt-0.5 ${theme === 'dark' ? 'text-stone-550' : 'text-stone-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer text field input */}
              <form onSubmit={handleSendMessage} className={`p-3 border-t bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-800`} id="chat-widget-footer-reply">
                <div className="relative flex items-center">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message. Hit Enter to send..."
                    rows={1}
                    className={`w-full p-2.5 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10 resize-none ${
                      theme === 'dark' 
                        ? 'bg-neutral-950 text-white border-neutral-800' 
                        : 'bg-stone-50 border-stone-250 text-black'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-sm hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    <Send size={11} className="stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className={`p-5 space-y-4 text-left ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`} id="chat-registration-panel">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-orange-100 dark:bg-orange-950/40 text-orange-500 font-bold px-2 py-0.5 rounded-xs">
                  Live Support Chat
                </span>
                <h3 className={`text-base font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                  Honest Creatives Support
                </h3>
                <p className="text-stone-400 text-[10px] leading-relaxed">
                  Enter your info to connect with our live agency team and design officers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="chat-init-name" className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">First Name / Brand Partner</label>
                  <input
                    type="text"
                    id="chat-init-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kola"
                    className={`w-full p-2.5 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                      theme === 'dark' 
                        ? 'bg-neutral-950 text-white border-neutral-800' 
                        : 'bg-stone-50 border-stone-250 text-black'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="chat-init-email" className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Email Address *</label>
                  <input
                    type="email"
                    id="chat-init-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@com.ng"
                    className={`w-full p-2.5 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                      theme === 'dark' 
                        ? 'bg-neutral-950 text-white border-neutral-800' 
                        : 'bg-stone-50 border-stone-250 text-black'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !email.trim()}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-400 disabled:cursor-not-allowed text-stone-50 text-[11px] font-mono uppercase tracking-wider font-bold rounded-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                id="chat-intake-submit-btn"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>Start Communication Session <MessageSquare size={12} /></>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating launcher Button with blinking, bouncing and circular LIVE CHAT label */}
      <div 
        className={`relative flex items-center justify-center ${!isOpen ? 'animate-combo-chat' : ''}`} 
        id="chat-launcher-wrapper"
      >
        {!isOpen && (
          /* Spinning circular LIVE CHAT text */
          <div className="absolute w-24 h-24 animate-custom-spin pointer-events-none select-none flex items-center justify-center animate-chat-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500 font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-85">
              <path
                id="chat-text-path"
                d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="none"
              />
              <text className="fill-orange-500 font-extrabold text-[9px] uppercase tracking-[0.18em]" textAnchor="middle">
                <textPath href="#chat-text-path" startOffset="25%">
                  ★ LIVE CHAT ★
                </textPath>
              </text>
            </svg>
          </div>
        )}
        <button
          onClick={handleToggle}
          className={`relative w-14 h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 text-stone-50 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-orange-400 focus:outline-none cursor-pointer ${!isOpen ? 'animate-chat-pulse' : ''}`}
          id="chat-widget-launcher-btn"
          aria-label="Honest Creatives Support"
          title="Honest Creatives Support"
        >
          {isOpen ? (
            <X size={24} className="stroke-[2.5]" />
          ) : (
            <MessageCircle size={24} className="stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
}
