import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, ExternalLink, ArrowUp, Send } from 'lucide-react';
import { ActiveTab } from '../types';
import logoImage from '../assets/images/honest_creatives_logo_1781788567728.jpg';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
}

export default function Footer({ setActiveTab, theme = 'light' }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full border-t transition-colors duration-300 pt-16 pb-8 ${
      theme === 'dark' 
        ? 'bg-neutral-950 text-white border-neutral-850' 
        : 'bg-white text-black border-stone-200'
    }`} id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16" id="footer-grid">
          
          {/* Brand Presentation Section */}
          <div className="md:col-span-5 flex flex-col space-y-4" id="footer-brand-section">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleNavClick('home')}>
              <div className="w-9 h-9 border border-stone-200 dark:border-neutral-800 rounded-sm overflow-hidden shrink-0">
                <img
                  src={logoImage}
                  alt="Honest Creatives Mini Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-lg font-bold font-display tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                Honest <span className="text-orange-500">Creatives</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
              We translate business goals into highly functional codebases, bold digital designs, targeted marketing architectures, and magnificent live experiences.
            </p>
            
            {/* Social Media Cluster - Updated with requested links & Custom TikTok Vector Icon */}
            <div className="flex items-center space-x-3 pt-2" id="footer-social-media">
              <a 
                href="https://facebook.com/honestwebsolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-10 h-10 border rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors ${
                  theme === 'dark' ? 'border-neutral-800 text-stone-300' : 'border-stone-200 text-neutral-800'
                }`}
                id="social-facebook"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a 
                href="https://instagram.com/honestwebsolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-10 h-10 border rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors ${
                  theme === 'dark' ? 'border-neutral-800 text-stone-300' : 'border-stone-200 text-neutral-800'
                }`}
                id="social-instagram"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              
              {/* Custom SVG TikTok Icon - http://tiktok.com/@honestose */}
              <a 
                href="http://tiktok.com/@honestose" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-10 h-10 border rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors ${
                  theme === 'dark' ? 'border-neutral-800 text-stone-300' : 'border-stone-200 text-neutral-800'
                }`}
                id="social-tiktok"
                aria-label="TikTok"
              >
                <svg size={15} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.15 2.2 1.95 3.59 2.37.01 1.34 0 2.68-.01 4.02-1.58-.02-3.13-.53-4.43-1.46-.86-.61-1.55-1.42-1.95-2.38v8.61c.01 5.09-4.52 9.06-9.61 8.52-3.87-.41-6.84-3.76-6.87-7.66-.04-4.82 4.19-8.77 9-.8.01 1.32.01 2.65-.01 3.97-1.39-.02-2.82.52-3.76 1.55-.91.99-1.22 2.37-1.02 3.69.24 1.59 1.63 2.76 3.25 2.76 1.14 0 2.19-.59 2.79-1.57.48-.77.71-1.68.7-2.61V0h.03z"/>
                </svg>
              </a>
              
              <a 
                href="https://youtube.com/@honestwebsolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-10 h-10 border rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors ${
                  theme === 'dark' ? 'border-neutral-800 text-stone-300' : 'border-stone-200 text-neutral-800'
                }`}
                id="social-youtube"
                aria-label="YouTube"
              >
                <Youtube size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 flex flex-col space-y-4 text-left" id="footer-quick-links">
            <h4 className="text-xs font-bold font-mono text-orange-500 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <button onClick={() => handleNavClick('home')} className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-stone-300 hover:text-orange-500' : 'text-stone-700 hover:text-orange-500'}`}>
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-stone-300 hover:text-orange-500' : 'text-stone-700 hover:text-orange-500'}`}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-stone-300 hover:text-orange-500' : 'text-stone-700 hover:text-orange-500'}`}>
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('send-brief')} className="text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer font-bold font-mono text-xs uppercase tracking-wider">
                  <Send size={11} /> Send Brief
                </button>
              </li>
              <li>
                <a 
                  href="https://www.blog.honestcreatives.com.ng" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`transition-colors flex items-center gap-1 cursor-pointer ${theme === 'dark' ? 'text-stone-300 hover:text-orange-500' : 'text-stone-700 hover:text-orange-500'}`}
                >
                  Our Blog <ExternalLink size={12} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Authoritative Contact Block (Required) */}
          <div className="md:col-span-4 flex flex-col space-y-4 text-left" id="footer-contact-block">
            <h4 className="text-xs font-bold font-mono text-orange-500 uppercase tracking-widest">Contact Details</h4>
            <ul className="space-y-4 text-sm font-medium" id="footer-info-list">
              {/* Email */}
              <li className="flex gap-3">
                <Mail size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Write to us</span>
                  <a href="mailto:support@honestcreatives.com.ng" className={`border-b transition-colors leading-relaxed font-semibold ${
                    theme === 'dark' 
                      ? 'text-white border-neutral-800 hover:text-orange-500 hover:border-orange-500' 
                      : 'text-neutral-900 border-stone-200 hover:text-orange-500 hover:border-orange-500'
                  }`}>
                    support@honestcreatives.com.ng
                  </a>
                </div>
              </li>

              {/* Mobile */}
              <li className="flex gap-3">
                <Phone size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Call us</span>
                  <a href="tel:+2349156498230" className={`border-b transition-colors leading-relaxed font-semibold ${
                    theme === 'dark' 
                      ? 'text-white border-neutral-800 hover:text-orange-500 hover:border-orange-500' 
                      : 'text-neutral-900 border-stone-200 hover:text-orange-500 hover:border-orange-500'
                  }`}>
                    (+234) 915 649 8230
                  </a>
                </div>
              </li>

              {/* Address */}
              <li className="flex gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Office Location</span>
                  <address className={`not-italic leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-stone-800'}`}>
                    4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos, Nigeria
                  </address>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright bar - "Crafted with integrity and transparency" is removed exactly as requested */}
        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono transition-colors ${
          theme === 'dark' ? 'border-neutral-850 text-stone-500' : 'border-stone-100 text-stone-500'
        }`} id="footer-bottom-bar">
          <p>© {currentYear} Honest Creatives. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
