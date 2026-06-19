import { Globe, ExternalLink, Calendar, MessageSquare, Flame, AlertCircle } from 'lucide-react';

interface NewsViewProps {
  theme?: 'light' | 'dark';
}

interface NewsHeadline {
  id: string;
  category: string;
  title: string;
  date: string;
  views: string;
  excerpt: string;
}

const ToriFeaturedNews: NewsHeadline[] = [
  {
    id: 'n1',
    category: 'AGENCY GOSSIP',
    title: 'Honest Creatives Expands Lagos Studio - High-End Design Bootcamp Launched',
    date: 'June 18, 2026',
    views: '1.2k views',
    excerpt: 'Lagos partner leaks rumors of a massive premium design bootcamp coming to the Adeba, Lakowe studio. Senior designers are set to train under-graduates in next-generation React frameworks with 100% cost waivers.'
  },
  {
    id: 'n2',
    category: 'TECH INSIGHTS',
    title: 'Why Prebuilt Templates are Killing Nigerian Business Conversion Performance',
    date: 'June 10, 2026',
    views: '840 views',
    excerpt: 'Detailed diagnostic logs expose how slow prebuilt models block local Google Rankings. Custom React code ensures lightning-fast speeds on slow mobile mobile networks across West Africa.'
  },
  {
    id: 'n3',
    category: 'COMPELLED SHOWCASES',
    title: 'Backstage at the Lakowe Corporate Scenography Event',
    date: 'May 28, 2026',
    views: '1.9k views',
    excerpt: 'An inside look into our meticulous event planners arranging stage design, vendors schedules, and organic visual installations for international fintech brands.'
  }
];

export default function NewsView({ theme = 'light' }: NewsViewProps) {
  const newsUrl = 'https://www.tori.honestcreatives.com.ng';

  return (
    <div className={`w-full min-h-screen py-16 sm:py-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'
    }`} id="news-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Dynamic Tori Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4" id="news-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-semibold font-mono tracking-wider uppercase bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-950/30">
            🔥 THE DYNAMIC HUB OF HONEST CREATIVES
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight">
            <span className="text-orange-500">Tori</span>
          </h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black font-semibold'}`}>
            Welcome to "Tori" — the primary gossip feed, agency stories, news reviews, and tech happenings compiled live across local landscapes and digital networks.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <a
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 font-mono text-xs uppercase font-extrabold tracking-wider text-stone-50 px-6 py-3.5 rounded-sm transition-all flex items-center gap-2 cursor-pointer border border-orange-505 shadow-md active:scale-95"
              id="news-tab-open-btn"
            >
              Visit www.tori.honestcreatives.com.ng <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Dynamic Tori Buzz Feed Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4 items-start">
          
          {/* Left Column: Tori Headling Stories */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="border-b border-stone-250 dark:border-neutral-850 pb-2 flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
                <Flame size={14} /> TORI HIGHLIGHT BUZZ
              </h2>
              <span className="text-[10px] font-mono text-stone-400">Fresh updates</span>
            </div>

            <div className="space-y-6" id="tori-featured-list">
              {ToriFeaturedNews.map((news) => (
                <div
                  key={news.id}
                  className={`p-6 border rounded-sm transition-all duration-300 group ${
                    theme === 'dark' ? 'bg-neutral-900 border-neutral-850 hover:border-orange-500' : 'bg-stone-50/50 border-stone-200 hover:border-orange-500 shadow-3xs'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] font-mono font-extrabold text-orange-505 uppercase">
                    <span>{news.category}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={10} /> {news.views}</span>
                  </div>
                  
                  <h3 className={`text-base font-bold font-display mt-2 leading-snug group-hover:text-orange-500 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-950 font-extrabold'
                  }`}>
                    {news.title}
                  </h3>

                  <p className={`text-xs mt-2.5 leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black font-semibold'}`}>
                    {news.excerpt}
                  </p>

                  <div className="pt-4 mt-4 border-t border-stone-200/50 dark:border-neutral-850 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-400 flex items-center gap-1">
                      <Calendar size={11} /> {news.date}
                    </span>
                    <a
                      href={newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-mono font-bold uppercase text-orange-500 hover:text-orange-605 flex items-center gap-1"
                    >
                      Read on Tori <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Embedded live URL iframe staging */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-stone-250 dark:border-neutral-850 pb-2 flex items-center justify-between text-left">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                <Globe size={13} /> LIVE INLINE EMBED
              </h2>
              <span className="text-[10px] font-mono text-stone-400 uppercase">Interactive view</span>
            </div>

            {/* Smart Frame Container styling with standard browser bar */}
            <div className={`p-1.5 rounded-sm border overflow-hidden ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-250 shadow-md'
            }`} id="tori-live-embed-browser">
              {/* Safari-like Address mock bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-neutral-950 rounded-xs mb-1.5 text-stone-400" id="browser-mock-address-bar">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
                
                <div className="flex-grow max-w-sm mx-auto px-4 py-1 bg-stone-900 text-[10px] font-mono rounded-xs flex items-center justify-center gap-1 text-stone-200 select-all border border-stone-850 uppercase font-black tracking-wider">
                  <Globe size={10} className="text-orange-500" /> {newsUrl.replace('https://', '')}
                </div>

                <div className="w-8"></div>
              </div>

              {/* Real Iframe wrapper elements */}
              <div className="relative h-[480px] bg-white rounded-xs overflow-hidden" id="tori-iframe-sandbox-stage">
                <iframe
                  src={newsUrl}
                  title="Tori"
                  className="w-full h-full border-none bg-stone-50"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating helpful hints */}
                <div className="absolute bottom-4 left-4 right-4 bg-orange-500 text-stone-50 p-3 rounded-sm border border-orange-400 shadow-xl flex items-start gap-2.5 opacity-90 backdrop-blur-xs text-left" id="iframe-protection-alert">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-wider">Browsing with Integrity</h4>
                    <p className="text-[9px] leading-relaxed">
                      If frame ancestors blocks prevent this embedded view from rendering inside AI Studio, click the button above to launch the live portal directly in a new tab!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
