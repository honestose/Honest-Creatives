import { useState } from 'react';
import { Menu, X, ChevronDown, Mail, Phone, Globe, Sun, Moon, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { ActiveTab } from '../types';
import logoImage from '../assets/images/honest_creatives_logo_1781788567728.jpg';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function Header({ activeTab, setActiveTab, theme = 'light', toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesList = [
    { name: 'Website Design', tab: 'website-design' as ActiveTab },
    { name: 'Digital Design', tab: 'digital-design' as ActiveTab },
    { name: 'Digital Marketing', tab: 'digital-marketing' as ActiveTab },
    { name: 'SEO Services', tab: 'seo' as ActiveTab },
    { name: 'Event Planning Services', tab: 'event-planning' as ActiveTab },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className={`w-full transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-black'}`} id="app-header">
      
      {/* Top Action Contacts / Theme Switcher bar */}
      <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 text-stone-300 border-b border-neutral-850' : 'bg-neutral-950 text-stone-100'}`} id="top-contact-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row justify-between items-center text-xs gap-3 font-mono">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <a href="mailto:support@honestcreatives.com.ng" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
              <Mail size={12} className="text-orange-500" />
              <span>support@honestcreatives.com.ng</span>
            </a>
            <a href="tel:+2349156498230" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
              <Phone size={12} className="text-orange-500" />
              <span>(+234) 915 649 8230</span>
            </a>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div className="flex items-center gap-3 text-stone-400 border-r border-stone-800 pr-4 mr-0.5">
              <a href="https://facebook.com/honestwebsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors hover:scale-110" aria-label="Facebook">
                <Facebook size={12} />
              </a>
              <a href="https://instagram.com/honestwebsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors hover:scale-110" aria-label="Instagram">
                <Instagram size={12} />
              </a>
              <a href="http://tiktok.com/@honestose" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors hover:scale-110 flex items-center" aria-label="TikTok">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.15 2.2 1.95 3.59 2.37.01 1.34 0 2.68-.01 4.02-1.58-.02-3.13-.53-4.43-1.46-.86-.61-1.55-1.42-1.95-2.38v8.61c.01 5.09-4.52 9.06-9.61 8.52-3.87-.41-6.84-3.76-6.87-7.66-.04-4.82 4.19-8.77 9-.8.01 1.32.01 2.65-.01 3.97-1.39-.02-2.82.52-3.76 1.55-.91.99-1.22 2.37-1.02 3.69.24 1.59 1.63 2.76 3.25 2.76 1.14 0 2.19-.59 2.79-1.57.48-.77.71-1.68.7-2.61V0h.03z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@honestwebsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors hover:scale-110" aria-label="YouTube">
                <Youtube size={12} />
              </a>
            </div>
            
            {/* Dark & Light Theme Switch at the Top - Desktop Area */}
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800/60 dark:bg-stone-800 text-orange-400 hover:text-orange-500 transition-colors cursor-pointer border border-stone-700/50"
                id="header-theme-toggle-btn"
                aria-label="Toggle Theme Mode"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={12} />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={12} />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Dark Mode</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`sticky top-0 z-50 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 border-neutral-850 shadow-black/20 shadow-md' : 'bg-white border-stone-300 shadow-none'}`} id="main-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Branding Logo - Renders our generated logo asset directly as requested */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none group" 
              onClick={() => handleTabClick('home')}
              id="brand-logo-trigger"
            >
              <div className="relative w-11 h-11 border border-stone-200 dark:border-neutral-800 rounded-sm overflow-hidden group-hover:border-orange-500 transition-colors duration-300 shrink-0">
                <img
                  src={logoImage}
                  alt="Honest Creatives Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-xl font-bold font-display tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                  Honest <span className="text-orange-500 font-extrabold">Creatives</span>
                </span>
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-stone-550 mt-[-1px] font-bold">Digital Agency</span>
              </div>
            </div>

            {/* Desktop Navigation Link Cluster */}
            <nav className="hidden lg:flex items-center space-x-7 font-bold text-neutral-950" id="desktop-nav-menu">
              
              {/* Home */}
              <button
                id="nav-home-btn"
                onClick={() => handleTabClick('home')}
                className={`py-2 px-1 text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'border-orange-500 text-orange-500 font-bold'
                    : 'border-transparent hover:text-orange-500 hover:border-orange-350 text-neutral-950 dark:text-stone-300 font-bold'
                }`}
              >
                Home
              </button>

              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                id="services-dropdown"
              >
                <button
                  id="nav-services-dropdown-btn"
                  className={`flex items-center gap-1 py-5 px-1 text-sm border-b-2 transition-all cursor-pointer ${
                    ['website-design', 'digital-design', 'digital-marketing', 'seo', 'event-planning'].includes(activeTab)
                      ? 'border-orange-500 text-orange-500 font-bold'
                      : 'border-transparent hover:text-orange-500 hover:border-orange-355 text-neutral-950 dark:text-stone-300 font-bold'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>

                {/* Dropdown Items */}
                {servicesDropdownOpen && (
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 top-full w-64 rounded-sm border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                      theme === 'dark' ? 'bg-neutral-900 border-neutral-800 shadow-xl' : 'bg-white border-stone-300 shadow-none'
                    }`}
                    id="services-dropdown-menu"
                  >
                    {servicesList.map((service) => (
                      <button
                        key={service.tab}
                        id={`nav-${service.tab}-btn`}
                        onClick={() => handleTabClick(service.tab)}
                        className={`w-full text-left px-5 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer border-l-4 ${
                          activeTab === service.tab
                            ? 'text-orange-500 font-bold bg-orange-500/5 border-orange-500 font-bold'
                            : 'text-neutral-900 dark:text-stone-300 hover:text-orange-500 hover:bg-stone-50 dark:hover:bg-neutral-950 border-l-4 border-transparent font-bold'
                        }`}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Separate Pages */}
              <button
                id="nav-about-btn"
                onClick={() => handleTabClick('about')}
                className={`py-2 px-1 text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'about'
                    ? 'border-orange-500 text-orange-500 font-bold'
                    : 'border-transparent hover:text-orange-500 hover:border-orange-355 text-neutral-950 dark:text-stone-300 font-bold'
                }`}
              >
                About Us
              </button>

              <button
                id="nav-contact-btn"
                onClick={() => handleTabClick('contact')}
                className={`py-2 px-1 text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'contact'
                    ? 'border-orange-500 text-orange-500 font-bold'
                    : 'border-transparent hover:text-orange-500 hover:border-orange-355 text-neutral-950 dark:text-stone-300 font-bold'
                }`}
              >
                Contact Us
              </button>

              {/* News */}
              <a
                id="nav-news-btn"
                href="https://www.tori.honestcreatives.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 text-sm border-b-2 border-transparent hover:text-orange-500 hover:border-orange-355 text-neutral-950 dark:text-stone-300 font-bold transition-all cursor-pointer"
              >
                Tori
              </a>

              {/* CMS Partner access */}
              <button
                id="nav-cms-btn"
                onClick={() => handleTabClick('cms')}
                className={`py-2 px-1 text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'cms'
                    ? 'border-orange-550 text-orange-500 font-black'
                    : 'border-transparent hover:text-orange-500 hover:border-orange-355 text-neutral-950 dark:text-stone-300 font-bold'
                }`}
              >
                Partner CMS
              </button>

              {/* New "Send Brief" Action Page Navigation Link */}
              <button
                id="nav-send-brief-btn"
                onClick={() => handleTabClick('send-brief')}
                className={`py-1.5 px-3 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'send-brief'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white'
                }`}
              >
                <Send size={11} />
                <span>Send Brief</span>
              </button>

              {/* Separate Blog - Linked strictly externally */}
              <a
                href="https://www.blog.honestcreatives.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2 px-3 text-xs rounded hover:bg-orange-500 hover:text-white transition-all font-semibold flex items-center gap-1.5 cursor-pointer font-mono border ${
                  theme === 'dark' 
                    ? 'bg-neutral-800 text-white border-neutral-700 hover:border-orange-500' 
                    : 'bg-stone-100 text-neutral-800 border-stone-200 hover:border-orange-500'
                }`}
                id="nav-blog-external-link"
              >
                <span>Blog</span>
                <Globe size={11} />
              </a>
            </nav>

            {/* Mobile Navigation controls */}
            <div className="flex lg:hidden items-center gap-2" id="mobile-nav-toggle-wrapper">
              
              {/* Theme Toggle inside mobile header too for fast accessibility */}
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className="p-2 mr-1 rounded bg-stone-100 dark:bg-neutral-800 text-orange-500 border border-stone-200 dark:border-neutral-700 cursor-pointer"
                  id="mobile-theme-switcher"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-sm focus:outline-none cursor-pointer ${
                  theme === 'dark' ? 'text-white hover:text-orange-500' : 'text-neutral-800 hover:text-orange-500'
                }`}
                id="mobile-menu-burger-btn"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t animate-in slide-in-from-top duration-200 ${
            theme === 'dark' ? 'bg-neutral-900 border-neutral-850 shadow-lg text-white' : 'bg-white border-stone-200 shadow-md text-black'
          }`} id="mobile-navbar-drawer">
            <div className="px-4 pt-4 pb-6 space-y-2 font-medium text-left">
              
              {/* Home Link */}
              <button
                id="mobile-nav-home-btn"
                onClick={() => handleTabClick('home')}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-orange-500/10 text-orange-500 font-bold'
                    : 'hover:bg-stone-50 dark:hover:bg-neutral-950 text-neutral-800 dark:text-stone-200'
                }`}
              >
                Home
              </button>

              {/* Services Accordion Submenu */}
              <div className="border-b border-stone-100 dark:border-neutral-850 pb-1">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full text-left px-4 py-3 rounded-sm text-sm text-neutral-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-neutral-950 flex items-center justify-between transition-all cursor-pointer"
                  id="mobile-services-accordion"
                >
                  <span className={['website-design', 'digital-design', 'digital-marketing', 'seo', 'event-planning'].includes(activeTab) ? 'text-orange-500 font-bold' : ''}>
                    Services
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>

                {mobileServicesOpen && (
                  <div className={`pl-6 pt-1.5 space-y-1 rounded-sm py-2 border-l-2 border-orange-500 my-1 ${
                    theme === 'dark' ? 'bg-neutral-950' : 'bg-stone-50'
                  }`} id="mobile-services-list">
                    {servicesList.map((service) => (
                      <button
                        key={service.tab}
                        id={`mobile-nav-${service.tab}-btn`}
                        onClick={() => handleTabClick(service.tab)}
                        className={`w-full text-left px-4 py-2 text-xs rounded transition-all cursor-pointer ${
                          activeTab === service.tab
                            ? 'text-orange-500 font-bold bg-orange-500/10'
                            : 'text-neutral-700 dark:text-stone-300 hover:text-orange-500'
                        }`}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Separate About Us */}
              <button
                id="mobile-nav-about-btn"
                onClick={() => handleTabClick('about')}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-orange-500/10 text-orange-500 font-bold'
                    : 'text-neutral-850 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-neutral-950'
                }`}
              >
                About Us
              </button>

              {/* Separate Contact Us */}
              <button
                id="mobile-nav-contact-btn"
                onClick={() => handleTabClick('contact')}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-orange-500/10 text-orange-500 font-bold'
                    : 'text-neutral-850 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-neutral-950'
                }`}
              >
                Contact Us
              </button>

              {/* Mobile News Link */}
              <a
                id="mobile-nav-news-btn"
                href="https://www.tori.honestcreatives.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer hover:bg-stone-50 dark:hover:bg-neutral-950 text-neutral-850 dark:text-stone-200"
              >
                <span>Tori</span>
                <span className="text-[10px] text-orange-500 font-mono font-bold">Visit ↗</span>
              </a>

              {/* Mobile CMS Log Link */}
              <button
                id="mobile-nav-cms-btn"
                onClick={() => handleTabClick('cms')}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-orange-500/10 text-orange-500 font-bold'
                    : 'hover:bg-stone-50 dark:hover:bg-neutral-950 text-neutral-800 dark:text-stone-200'
                }`}
              >
                Partner CMS Gate
              </button>

              {/* Mobile "Send Brief" page link */}
              <button
                id="mobile-nav-send-brief-btn"
                onClick={() => handleTabClick('send-brief')}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                  activeTab === 'send-brief'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white'
                }`}
              >
                <Send size={13} />
                <span>Send Brief Form</span>
              </button>

              {/* Separate Blog link */}
              <a
                href="https://www.blog.honestcreatives.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-orange-500 text-white text-center py-3 rounded-sm text-sm hover:bg-orange-600 transition-all font-semibold font-mono"
                id="mobile-nav-blog-external-link"
              >
                Open Blog ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
