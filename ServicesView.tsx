import { ActiveTab } from '../types';
import { servicesData } from '../data/servicesData';
import { Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesViewProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
}

export default function ServicesView({ activeTab, setActiveTab, theme = 'light' }: ServicesViewProps) {
  const currentService = servicesData[activeTab];

  if (!currentService) {
    return (
      <div className={`py-24 text-center ${theme === 'dark' ? 'bg-neutral-950 text-stone-400' : 'bg-white text-stone-500'}`} id="service-not-found">
        <p>Service profile not found. Please select a valid service path from the dropdown.</p>
        <button 
          onClick={() => setActiveTab('home')} 
          className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded font-mono text-xs uppercase cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleBookClick = () => {
    setActiveTab('send-brief');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className={`w-full transition-colors duration-300 animate-in fade-in duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-stone-150' : 'bg-white text-black'
    }`} id={`service-view-${currentService.id}`}>
      
      {/* Service Hero Banner */}
      <section className={`py-16 sm:py-24 border-b ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
      }`} id="service-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="service-hero-layout">
            
            {/* Creative Copywriting */}
            <div className="lg:col-span-7 space-y-6 text-left" id="service-hero-copy">
              <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold flex items-center gap-1.5">
                <Sparkles size={14} /> Our Core Services
              </span>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Honest <span className="text-orange-500">{currentService.title}</span> Solutions
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>
                {currentService.description}
              </p>
              
              <div className="pt-2">
                <button
                  id="book-service-top-btn"
                  onClick={handleBookClick}
                  className="bg-orange-500 hover:bg-orange-600 font-mono text-xs uppercase font-bold tracking-wider text-white px-7 py-4 rounded-sm transition-all flex items-center gap-2 cursor-pointer border border-orange-500 hover:shadow-md"
                >
                  Send Brief for {currentService.title} <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Service Image Header Display */}
            <div className="lg:col-span-5" id="service-hero-visual">
              <div className={`relative rounded-sm overflow-hidden shadow-sm border-4 max-h-96 ${
                theme === 'dark' ? 'border-neutral-800' : 'border-white'
              }`}>
                <img
                  src={currentService.image}
                  alt={`${currentService.title} illustration from Unsplash`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover aspect-4/3 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/85 text-orange-500 text-[9px] font-mono leading-none py-1.5 px-3 rounded-xs uppercase tracking-wider font-bold">
                  Honest Creatives Spec Sheet
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Deliverables Matrix */}
      <section className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b ${
        theme === 'dark' ? 'border-neutral-900' : 'border-stone-150'
      }`} id="service-features">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="features-layout">
          
          <div className="lg:col-span-4 space-y-4 text-left" id="features-heading-panel">
            <span className="text-xs uppercase font-mono tracking-wider text-orange-500 font-bold">Key Focus Areas</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-display leading-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-neutral-950'
            }`}>
              Technical & Tactical <span className="text-orange-500">Deliverables</span>
            </h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
            <p className="text-stone-450 text-xs leading-relaxed max-w-xs">
              Every package is designed custom to your operational challenges. Here is what we systematically build, integrate, and verify.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left" id="features-grid">
            {currentService.features.map((feature, i) => (
              <div key={i} className={`flex gap-4 p-5 rounded-sm border transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-neutral-900/20' : 'border-stone-200 bg-stone-50/30'
              }`} id={`feature-box-${i}`}>
                <div className="w-8 h-8 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/40 rounded-xs flex items-center justify-center text-orange-500 shrink-0 mt-0.5 animate-pulse">
                  <Check size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className={`font-bold text-sm leading-tight ${theme === 'dark' ? 'text-stone-100' : 'text-neutral-900'}`}>{feature}</h4>
                  <p className="text-stone-450 text-xs leading-relaxed">Fully aligned with modern quality checklists, zero shortcuts.</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Structured Phased Process Line */}
      <section className={`py-20 sm:py-24 border-b ${
        theme === 'dark' ? 'bg-neutral-900/10 border-neutral-900' : 'bg-stone-50/50 border-stone-150'
      }`} id="service-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3.5 mb-14 text-center" id="process-headings">
            <span className="text-xs uppercase font-mono tracking-wider text-orange-500 font-bold">Execution Timeline</span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-display transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-neutral-950'
            }`}>
              The <span className="text-orange-500">Honest Execution</span> Process
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
              How we take your blueprint from initial consultative audit to live production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left" id="process-step-matrix">
            {currentService.process.map((p, i) => (
              <div key={i} className={`p-6 border rounded-sm relative shadow-2xs transition-colors ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-stone-200'
              }`} id={`process-card-${i}`}>
                <span className={`absolute right-6 top-6 text-2xl font-black font-mono transition-colors ${
                  theme === 'dark' ? 'text-neutral-800' : 'text-orange-200'
                }`}>
                  {p.step}
                </span>
                <div className="space-y-3 pt-6 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-orange-500 font-bold">Phase {p.step}</span>
                  <h3 className={`font-bold text-sm font-display leading-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{p.title}</h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Inline Frequently Asked Questions */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="service-faqs">
        <div className="text-center space-y-3.5 mb-12" id="faqs-lead">
          <span className="text-xs uppercase font-mono tracking-wider text-orange-500 font-bold">Clarifying Doubts</span>
          <h2 className={`text-2xl sm:text-3xl font-bold font-display transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-neutral-950'
          }`}>
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-stone-400 text-xs">Direct, straightforward answers regarding {currentService.title}.</p>
        </div>

        <div className={`space-y-4 max-w-3xl mx-auto text-left lg:border-t lg:pt-8 ${
          theme === 'dark' ? 'border-neutral-900' : 'border-stone-150'
        }`} id="faqs-list">
          {currentService.faqs.map((faq, index) => (
            <div key={index} className={`p-5 border rounded-sm flex gap-4 items-start transition-colors ${
              theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800' : 'bg-stone-50 border-stone-200'
            }`} id={`faq-accordion-${index}`}>
              <HelpCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1.5 text-left">
                <h4 className={`font-bold text-sm font-display text-black dark:text-black`}>{faq.question}</h4>
                <p className={`text-xs leading-relaxed text-black dark:text-black font-semibold`}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Prompt Strip */}
      <section className="bg-stone-950 text-white py-16 px-4 sm:px-6 border-t border-neutral-850" id="service-action-strip">
        <div className="max-w-4xl mx-auto text-center space-y-6" id="action-strip-content">
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight text-white">
            Ready to deploy professional <br className="hidden sm:inline" />
            <span className="text-orange-500 font-extrabold">{currentService.title}</span> setups for your brand?
          </h2>
          <p className="text-stone-400 text-xs max-w-md mx-auto">
            Book a dedicated consultation block with our tech lead to assess your specific business scope.
          </p>
          <div className="pt-2">
            <button
              onClick={handleBookClick}
              className="bg-orange-500 hover:bg-orange-600 font-mono text-xs uppercase font-bold tracking-wider text-stone-50 px-8 py-4 rounded-sm transition-all inline-flex items-center gap-2 cursor-pointer hover:shadow-md"
              id="strip-cta-btn"
            >
              Send Brief to Team <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
