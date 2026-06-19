/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import SendBriefView from './components/SendBriefView';
import NewsView from './components/NewsView';
import CmsView from './components/CmsView';
import { ActiveTab } from './types';
import { ArrowUp, MessageCircle, ShieldAlert, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [loading, setLoading] = useState(true);
  const [showCookies, setShowCookies] = useState(false);
  const [customContent, setCustomContent] = useState<any>(null);
  
  // Newsletter modal states
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const fetchCustomContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setCustomContent(data);
      }
    } catch (err) {
      console.warn('Error syncing custom platform contents:', err);
    }
  };

  useEffect(() => {
    fetchCustomContent();
  }, []);

  // Initial loader duration for Honest Creatives branding
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Check if cookies was already configured
  useEffect(() => {
    try {
      const consent = localStorage.getItem('hc_cookies_accepted');
      if (!consent) {
        // Delay cookie prompt slightly for visual pacing
        const timer = setTimeout(() => {
          setShowCookies(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch {
      setShowCookies(true);
    }
  }, []);

  // Trigger newsletter modal after 10 seconds of initial loading
  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('hc_newsletter_dismissed');
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setShowNewsletterModal(true);
        }, 10000); // 10 seconds
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => {
        setShowNewsletterModal(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNewsletterSubmit = (e: any) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('submitting');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMsg('Thank you for subscribing! Welcome to the Circle.');
      try {
        localStorage.setItem('hc_newsletter_dismissed', 'true');
      } catch (err) {
        console.warn('Persistence storage issues:', err);
      }
      setNewsletterEmail('');
      setTimeout(() => {
        setShowNewsletterModal(false);
      }, 2500);
    }, 1200);
  };

  const dismissNewsletterModal = () => {
    setShowNewsletterModal(false);
    try {
      localStorage.setItem('hc_newsletter_dismissed', 'true');
    } catch (err) {
      console.warn('Persistence storage issues:', err);
    }
  };

  const handleAcceptCookies = (status: 'all' | 'essential') => {
    try {
      localStorage.setItem('hc_cookies_accepted', status);
    } catch (e) {
      console.warn('Persistence error:', e);
    }
    setShowCookies(false);
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('hc_theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor page scroll to show/hide the back to top arrow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('hc_theme', next);
      } catch (err) {
        console.error('LocalStorage disabled, dynamic theme will persist only in current session:', err);
      }
      return next;
    });
  };

  // Sync theme with HTML document element so Tailwind dark variants can fire optionally
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center z-[9999] transition-all duration-300">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          {/* Brand loading spin element */}
          <div className="relative flex items-center justify-center" id="brand-spin-loader">
            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center animate-ping">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            </div>
          </div>
          
          <div className="text-center space-y-1.5" id="brand-loading-header">
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              Honest <span className="text-orange-500 animate-pulse">Creatives</span>
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">
              REDEFINING BRAND VIBRATIONS
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen font-sans flex flex-col justify-between antialiased transition-colors duration-300 selection:bg-orange-500 selection:text-white ${
        theme === 'dark' ? 'bg-neutral-950 text-stone-100' : 'bg-white text-black'
      }`} 
      id="honest-creatives-root"
    >
      
      {/* Top Header section containing branding and the new light/dark theme toggle */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      {/* Prime Content router based on active layout tab */}
      <main className={`flex-grow w-full border-t transition-colors duration-300 ${theme === 'dark' ? 'border-neutral-800' : 'border-stone-100'}`} id="main-content-stream">
        {activeTab === 'home' && (
          <HomeView setActiveTab={setActiveTab} theme={theme} customContent={customContent} />
        )}

        {['website-design', 'digital-design', 'digital-marketing', 'seo', 'event-planning'].includes(activeTab) && (
          <ServicesView activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
        )}

        {activeTab === 'about' && (
          <AboutView setActiveTab={setActiveTab} theme={theme} customContent={customContent} />
        )}

        {activeTab === 'contact' && (
          <ContactView theme={theme} customContent={customContent} />
        )}

        {activeTab === 'send-brief' && (
          <SendBriefView setActiveTab={setActiveTab} theme={theme} />
        )}

        {activeTab === 'news' && (
          <NewsView theme={theme} />
        )}

        {activeTab === 'cms' && (
          <CmsView theme={theme} customContent={customContent} onContentChange={fetchCustomContent} />
        )}
      </main>

      {/* Authoritative contact footer section Repeating credentials */}
      <Footer setActiveTab={setActiveTab} theme={theme} />

      {/* Floating green WhatsApp icon on the Left Side of the website */}
      <div 
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center animate-combo-whatsapp"
        id="global-whatsapp-floating-parent"
      >
        {/* Spinning circular text */}
        <div className="absolute w-24 h-24 animate-custom-spin pointer-events-none select-none flex items-center justify-center animate-whatsapp-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#25D366] font-mono text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
            <path
              id="whatsapp-text-path"
              d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              fill="none"
            />
            <text className="fill-[#25D366] font-black text-[9px] uppercase tracking-[0.18em]" textAnchor="middle">
              <textPath href="#whatsapp-text-path" startOffset="25%">
                ★ WHATSAPP ★
              </textPath>
            </text>
          </svg>
        </div>

        <a
          href="https://wa.me/2349156498230"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-stone-50 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-[#1ebd56] focus:outline-none cursor-pointer hover:rotate-12 animate-whatsapp-pulse"
          id="global-whatsapp-floating-btn"
          title="Chat on WhatsApp"
          aria-label="Direct WhatsApp Message"
        >
          <MessageCircle size={24} className="stroke-[2.5]" />
        </a>
      </div>

      {/* Blinking Back To Top Arrow Button - Redefining position right beside the chat box on the right */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-24 z-50 p-3.5 bg-orange-500 text-stone-50 rounded-full shadow-2xl hover:bg-orange-600 transition-all duration-300 animate-pulse border border-orange-400 focus:outline-none flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 animate-chat-pulse"
          id="global-back-to-top-arrow"
          title="Back to Top"
          aria-label="Scroll back to top"
        >
          <ArrowUp size={20} className="stroke-[3]" />
        </button>
      )}

      {/* Premium Cookie Consent Banner - Perfectly Center-Aligned, Small-Sized, Leaves Beautiful Clear Spaces */}
      {showCookies && (
        <div 
          className={`fixed bottom-[92px] sm:bottom-6 left-1/2 -translate-x-1/2 z-[40] w-[calc(100%-2rem)] max-w-sm sm:max-w-md md:max-w-base p-3.5 rounded-sm border shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            theme === 'dark' 
              ? 'bg-neutral-900 border-[#ea580c]/30 text-stone-100 shadow-black' 
              : 'bg-white border-stone-250 text-black shadow-stone-400'
          }`}
          id="cookies-consent-banner"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-2 text-left">
              <div className="p-1.5 bg-orange-500/10 rounded-xs text-orange-500 shrink-0">
                <ShieldAlert size={14} />
              </div>
              <p className="text-[10px] leading-snug text-stone-400 dark:text-stone-300">
                We leverage custom cookies to deliver neat, beautiful visual experiences and live support.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 font-mono text-[9px] shrink-0 self-end sm:self-auto">
              <button
                onClick={() => handleAcceptCookies('essential')}
                className="px-2 py-1 text-stone-500 hover:text-stone-300 rounded-xs cursor-pointer transition-all uppercase font-bold tracking-wider"
                id="cookies-decline-btn"
              >
                Essential Only
              </button>
              <button
                onClick={() => handleAcceptCookies('all')}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 font-black text-[#ffffff] rounded-xs cursor-pointer shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                id="cookies-accept-all-btn"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-intrusive Minimalist Newsletter Overlaid Modal */}
      {showNewsletterModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-300"
          id="newsletter-modal-overlay"
        >
          <div 
            className={`relative w-full max-w-sm p-6 sm:p-8 rounded-sm border shadow-2xl animate-in scale-in duration-200 ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white shadow-black/60' : 'bg-white border-stone-250 text-black shadow-stone-300/40'
            }`}
            id="newsletter-modal-box"
          >
            {/* Close button icon */}
            <button
              onClick={dismissNewsletterModal}
              className={`absolute top-4 right-4 p-1 rounded-sm transition-colors border hover:text-orange-500 hover:border-orange-500 cursor-pointer ${
                theme === 'dark' ? 'border-neutral-800 text-stone-400' : 'border-stone-200 text-stone-500'
              }`}
              id="newsletter-modal-close-btn"
              aria-label="Close newsletter subscription modal"
            >
              <X size={12} className="stroke-[2.5]" />
            </button>

            <div className="space-y-4 text-left">
              <span className="text-[10px] font-mono tracking-widest text-orange-500 font-extrabold uppercase bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-sm inline-block">
                HONEST INSIGHTS
              </span>
              <h3 className={`text-lg sm:text-xl font-bold font-display tracking-tight leading-snug ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                Join the <span className="text-orange-500">Honest Creatives</span> Circle
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                Subscribe to get clean, actionable articles on design systems, custom site speed strategy, and organic marketing directly to your inbox.
              </p>

              {newsletterStatus === 'success' ? (
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 p-4 rounded-sm flex gap-3 items-start text-xs animate-in fade-in duration-250" id="modal-success-box">
                  <span className="text-orange-500 text-base leading-none font-sans font-black">✓</span>
                  <div className="flex-1 text-left space-y-0.5">
                    <span className="font-bold block uppercase text-[10px] font-mono tracking-wider">MEMBER JOINED</span>
                    <p className="text-[11px] leading-relaxed font-semibold">{newsletterMsg}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3" id="modal-newsletter-form">
                  <div className="space-y-1.5">
                    <label htmlFor="modal-email-input" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="modal-email-input"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') setNewsletterStatus('idle');
                      }}
                      placeholder="Enter your email address"
                      className="w-full bg-stone-50/50 dark:bg-black/40 text-black dark:text-white px-3.5 py-3 rounded-sm border-2 border-stone-200 dark:border-neutral-850 focus:border-orange-500 focus:outline-none text-xs font-medium placeholder-stone-400 dark:placeholder-neutral-700 transition-all font-sans"
                      required
                      disabled={newsletterStatus === 'submitting'}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-mono uppercase font-bold text-xs tracking-wider py-3.5 rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    disabled={newsletterStatus === 'submitting'}
                    id="modal-cta-subscribe-btn"
                  >
                    {newsletterStatus === 'submitting' ? 'Registering...' : 'Stay Updated'}
                  </button>

                  {newsletterStatus === 'error' && (
                    <p className="text-[10px] text-red-500 font-bold font-mono text-left animate-in fade-in" id="modal-error-message">
                      ⚠ {newsletterMsg}
                    </p>
                  )}

                  <p className="text-[9px] text-stone-500 font-mono">
                    Zero credit traps. Unsubscribe with 1 click anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

