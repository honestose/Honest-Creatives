import { useState } from 'react';
import { Shield, Sparkles, Sliders, Compass, HelpCircle } from 'lucide-react';
import { ActiveTab } from '../types';

interface AboutViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
  customContent?: any;
}

export default function AboutView({ setActiveTab, theme = 'light', customContent }: AboutViewProps) {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  
  const coreValues = [
    {
      icon: <Shield size={20} className="text-orange-500" />,
      title: 'Uncompromised Integrity',
      desc: 'We call things exactly as they are. If a technical direction is unviable or a marketing budget is too narrow to yield ROAS, we explicitly inform you before contractual obligation.'
    },
    {
      icon: <Sparkles size={20} className="text-orange-500" />,
      title: 'Obsessive Craftsmanship',
      desc: 'We do not run with precompiled layouts, bloated builders, or shortcut templates. Every design asset, website pixel, and event staging plan is structured custom to your identity.'
    },
    {
      icon: <Sliders size={20} className="text-orange-500" />,
      title: 'Meticulous Delivery',
      desc: 'Speed matters. Clean, validated codebases run faster, rank higher organically on search engines, and convert clients better. We deliver quality within strict deadlines.'
    }
  ];

  const operationalTimeline = [
    {
      year: 'Core Mission',
      title: 'Honest Creatives Foundations',
      desc: 'Formulated in Lagos. We observed businesses constantly struggling with vague technical scopes, silent fees, and bloated marketing budgets. We founded Honest Creatives to correct this.'
    },
    {
      year: 'Visual Scale',
      title: 'Digital and Experiential Blend',
      desc: 'Extended from responsive web design into creative digital graphic development and aesthetic event design. This unique triad allows us to synchronize physical and digital customer spaces.'
    },
    {
      year: 'Continuous Lead',
      title: 'Organic Scale & Technical Security',
      desc: 'Refining our SEO structures, content models, and fast React frameworks. Delivering solid, predictable marketing infrastructures for corporate ventures across Nigeria and abroad.'
    }
  ];

  const teamMembers = [
    {
      name: 'Adewale Bashorun',
      role: 'Creative Principal & Design Director',
      bio: 'Adewale spends his days styling clean layouts, selecting high-contrast color pallets, and mapping out aesthetic vendor guidelines.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ngozi Okafor',
      role: 'Lead Architect & Tech Specialist',
      bio: 'Ngozi manages code safety, performs speed audits, refines React schemas, and builds solid SEO architectures.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleCtaClick = () => {
    setActiveTab('send-brief');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className={`w-full transition-colors duration-300 animate-in fade-in duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-stone-150' : 'bg-white text-black'
    }`} id="about-us-view">
      
      {/* Editorial Header Section */}
      <section className={`py-16 sm:py-24 border-b ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
      }`} id="about-editorial-intro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-header-layout">
            
            <div className="lg:col-span-8 text-left space-y-6" id="about-text-content">
              <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold">ABOUT OUR AGENCY</span>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-neutral-950'
              }`}>
                Authentic visual design, <br className="hidden sm:inline" />
                <span className="text-orange-500">engineered without compromise.</span>
              </h1>
              <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
              <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                theme === 'dark' ? 'text-stone-300' : 'text-black font-medium'
              }`}>
                {customContent?.aboutIntro || "Honest Creatives is a cross-functional agency based in Lagos, Nigeria. We bridge the critical gap between high-level brand styling and engineering perfection. We don’t just sketch pretty pictures; we code robust React web platforms, deploy conversion-driven marketing architectures, and direct premium life event spaces."}
              </p>
            </div>

            <div className="lg:col-span-4" id="about-action-stat">
              <div className={`p-6 border-2 rounded-sm text-left shadow-sm ${
                theme === 'dark' ? 'bg-neutral-950 border-orange-500' : 'bg-white border-orange-500'
              }`} id="about-statement-badge">
                <Compass className="text-orange-500 mb-4" size={24} />
                <h3 className={`font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Our Governing Focus</h3>
                <p className={`text-xs leading-relaxed mt-2 ${theme === 'dark' ? 'text-stone-400' : 'text-black font-medium'}`}>
                  "Ensure that every design asset, code file, campaign projection, and vendor contract is fully honest, transparent, and profitable for the client."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate History Image */}
      <section className={`w-full py-2 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-stone-100'}`} id="about-image-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`w-full h-80 rounded-sm overflow-hidden border ${theme === 'dark' ? 'border-neutral-800' : 'border-stone-200'}`}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Honest Creatives Collaborative workspace team"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values Matrix */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-values">
        <div className="text-center space-y-3.5 mb-14" id="values-headings">
          <span className="text-xs uppercase font-mono tracking-wider text-orange-500 font-bold">The Guardrails</span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold font-display transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
            Our Core <span className="text-orange-500">Operating Values</span>
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left" id="values-grid">
          {coreValues.map((val, index) => (
            <div key={index} className={`p-8 border rounded-sm transition-colors ${
              theme === 'dark' ? 'border-neutral-800 bg-neutral-900/35' : 'border-stone-200 bg-stone-50/50'
            }`} id={`value-card-${index}`}>
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/40 rounded-xs flex items-center justify-center text-orange-500 mb-5">
                {val.icon}
              </div>
              <h3 className={`font-bold text-sm font-display mb-2.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                {val.title}
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-black font-semibold'}`}>
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tactical Timeline Showcase */}
      <section className={`py-20 border-t border-b ${
        theme === 'dark' ? 'bg-neutral-900/10 border-neutral-850' : 'bg-stone-50/50 border-stone-200'
      }`} id="about-timeline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="timeline-layout">
            
            <div className="lg:col-span-4 text-left space-y-4" id="timeline-intro-panel">
              <span className="text-xs uppercase font-mono tracking-wider text-orange-500 font-bold">Our Philosophy</span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold font-display leading-tight transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-neutral-950'
              }`}>
                Created to combat <br />
                <span className="text-orange-500 font-bold">Digital Bloat.</span>
              </h2>
              <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-450' : 'text-black font-semibold'}`}>
                We believe in simple processes, transparent operations, and deep competence. Here is the operational trajectory driving our solutions forward.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8 text-left" id="timeline-items-list">
              {operationalTimeline.map((item, index) => (
                <div key={index} className={`flex flex-col sm:flex-row gap-4 sm:gap-8 pb-8 border-b last:border-b-0 ${
                  theme === 'dark' ? 'border-neutral-800' : 'border-stone-200/60'
                }`} id={`timeline-row-${index}`}>
                  <div className="sm:w-32 shrink-0">
                    <span className={`text-[10px] font-mono font-bold uppercase rounded py-1 px-2 border ${
                      theme === 'dark' 
                        ? 'bg-orange-950/20 border-orange-500/30 text-orange-400' 
                        : 'bg-orange-50 border-orange-200/50 text-orange-500'
                    }`}>
                      {item.year}
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className={`font-bold text-sm font-display ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{item.title}</h3>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-black font-semibold'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Accordion FAQs on About Us page */}
      <section className={`py-16 sm:py-20 border-b ${theme === 'dark' ? 'bg-neutral-900/15 border-neutral-850' : 'bg-stone-50 border-stone-200'}`} id="about-faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-2">
          <div className="text-center space-y-3.5 mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-sm">
              ABOUT FAQS & TRUTHS
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
              Agency <span className="text-orange-500">Questions</span>
            </h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto pb-6">
            {[
              {
                q: 'Who founded Honest Creatives and where are you based?',
                a: 'Honest Creatives was founded by highly experienced design professionals and senior stack developers based in Nigeria. Our studio is situated at 4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos, Nigeria. We host branding sessions, technical briefings, and consult with local and global commercial partners.'
              },
              {
                q: 'What is your operational philosophy regarding client communications?',
                a: 'Total honesty. We have zero hidden retainers or silent developer surcharges. If a project timeline needs structural padding or standard social campaign costs fluctuate, our directors discuss details with you directly. You are always in coordinate control.'
              },
              {
                q: 'Do you work with startups as well as established corporate teams?',
                a: 'Yes, we scale our frameworks depending on business maturity. We supply fast mvps for funded startups, as well as complex brand identity files, SEO mappings, and large-scale experiential coordination setups for established enterprises.'
              }
            ].map((item, index) => {
              const isOpened = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-stone-250 rounded-sm overflow-hidden text-left transition-all duration-200 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpened ? null : index)}
                    className="w-full p-5 flex justify-between items-center text-xs font-black uppercase tracking-tight text-black focus:outline-none cursor-pointer hover:bg-stone-50"
                  >
                    <span className="text-black">{item.q}</span>
                    <span className="text-orange-500 text-lg font-mono leading-none">
                      {isOpened ? '−' : '+'}
                    </span>
                  </button>
                  {isOpened && (
                    <div className="p-5 pt-0 text-xs leading-relaxed text-black font-semibold border-t border-stone-150 animate-in slide-in-from-top-1">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Call to action block - renamed references clearly to Honest Creatives */}
      <section className="bg-stone-950 text-white py-16 px-4 border-t border-neutral-850" id="about-cta-panel">
        <div className="max-w-4xl mx-auto text-center space-y-5" id="about-cta-content">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Let's build something completely <span className="text-orange-500">Honest Creatives</span> style together.
          </h2>
          <p className="text-stone-400 text-xs leading-relaxed max-w-md mx-auto">
            Book our design, development, SEO, digital marketing, or event planning professionals today.
          </p>
          <div className="pt-2">
            <button
              onClick={handleCtaClick}
              className="bg-orange-500 hover:bg-orange-600 text-stone-50 font-mono text-xs uppercase font-bold tracking-wider px-8 py-4 rounded-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              id="about-cta-main-btn"
            >
              Consult Honest Creatives Directors
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
