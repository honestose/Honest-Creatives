import { useState, useEffect } from 'react';
import { ArrowRight, Laptop, Paintbrush, TrendingUp, Search, Calendar, ChevronRight, Shield, Award, Users, Globe, ExternalLink } from 'lucide-react';
import { ActiveTab } from '../types';
import NewsletterForm from './NewsletterForm';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
  customContent?: any;
}

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  link: string;
}

const FallbackBlogPosts: BlogPost[] = [
  {
    id: 'f1',
    title: 'Designing Minimalist Interfaces that Convert: A Masterclass',
    excerpt: 'Learn how whitespace density, structural grids, and elegant typography pairing create user trust and elevate conversion margins by over 40%.',
    date: 'Oct 15, 2026',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    category: 'Design & Code',
    link: 'https://www.blog.honestcreatives.com.ng'
  },
  {
    id: 'f2',
    title: 'Organic Local Search Dominance: The Definite SEO Blueprint',
    excerpt: 'A technical checklist focusing on schema structures, local citation integrity, and Lighthouse performance factors to win Google ranks.',
    date: 'Oct 08, 2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    category: 'SEO & Marketing',
    link: 'https://www.blog.honestcreatives.com.ng'
  },
  {
    id: 'f3',
    title: 'Experiential Popups: Fusing Visual Staging & Schedule Flow',
    excerpt: 'How high-contrast offline brand popups and corporate space experiences translate directly to sustained digital customer engagement.',
    date: 'Oct 03, 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    category: 'Creative Events',
    link: 'https://www.blog.honestcreatives.com.ng'
  }
];

export default function HomeView({ setActiveTab, theme = 'light', customContent }: HomeViewProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [isLiveSync, setIsLiveSync] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const listServices = [
    {
      icon: <Laptop size={24} className="text-orange-500" />,
      title: 'Website Design',
      desc: 'High-performance, beautifully interactive React frontends structured with clean Tailwind code.',
      tab: 'website-design' as ActiveTab,
      marker: 'web'
    },
    {
      icon: <Paintbrush size={24} className="text-orange-500" />,
      title: 'Digital Design',
      desc: 'Sleek visual systems, cohesive typography pairings, monographs, logos, and digital branding book assets.',
      tab: 'digital-design' as ActiveTab,
      marker: 'brand'
    },
    {
      icon: <TrendingUp size={24} className="text-orange-500" />,
      title: 'Digital Marketing',
      desc: 'Structured campaigns and high-converting marketing frameworks built to maximize ROI.',
      tab: 'digital-marketing' as ActiveTab,
      marker: 'ads'
    },
    {
      icon: <Search size={24} className="text-orange-500" />,
      title: 'SEO Services',
      desc: 'Technical site repair, keyword structures, and localized Google Maps organic optimization audits.',
      tab: 'seo' as ActiveTab,
      marker: 'rank'
    },
    {
      icon: <Calendar size={24} className="text-orange-500" />,
      title: 'Event Planning Services',
      desc: 'Exquisite brand pop-ups, workspace openings, scenography layouts, and vendors organization.',
      tab: 'event-planning' as ActiveTab,
      marker: 'stage'
    }
  ];

  const handleServiceClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    let active = true;

    const decodeHtml = (htmlStr: string) => {
      try {
        const txt = document.createElement('textarea');
        txt.innerHTML = htmlStr;
        return txt.value;
      } catch {
        return htmlStr;
      }
    };

    const fetchLivePosts = async () => {
      // 1. First choice: Same-origin Backend Proxy (completely circumvents CORS & Mixed Content issues)
      try {
        const res = await fetch('/api/blog?per_page=100');
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data) && data.length > 0) {
            const formatted = data.map((post: any) => {
              const mediaObj = post._embedded?.['wp:featuredmedia']?.[0];
              const imgUrl = mediaObj?.media_details?.sizes?.medium_large?.source_url || 
                             mediaObj?.source_url || 
                             "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

              const cats = post._embedded?.['wp:term']?.[0];
              const catName = cats && cats[0] ? cats[0].name : "Insights";

              return {
                id: post.id,
                title: decodeHtml(post.title?.rendered || 'Honest Journal Article'),
                excerpt: decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]+>/g, '')).substring(0, 150) + '...',
                date: post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Update',
                image: imgUrl,
                category: catName,
                link: post.link || 'https://www.blog.honestcreatives.com.ng'
              };
            });
            setPosts(formatted);
            setIsLiveSync(true);
            setBlogLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend proxy fetch failed, falling back to direct client-side requests...', err);
      }

      // 2. Direct client-side fetch (Fallback if server endpoints are bypass resolved)
      try {
        const targetUrl = 'https://blog.honestcreatives.com.ng/wp-json/wp/v2/posts?_embed&per_page=100';
        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data) && data.length > 0) {
            const formatted = data.map((post: any) => {
              const mediaObj = post._embedded?.['wp:featuredmedia']?.[0];
              const imgUrl = mediaObj?.media_details?.sizes?.medium_large?.source_url || 
                             mediaObj?.source_url || 
                             "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

              const cats = post._embedded?.['wp:term']?.[0];
              const catName = cats && cats[0] ? cats[0].name : "Insights";

              return {
                id: post.id,
                title: decodeHtml(post.title?.rendered || 'Honest Journal Article'),
                excerpt: decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]+>/g, '')).substring(0, 150) + '...',
                date: post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Update',
                image: imgUrl,
                category: catName,
                link: post.link || 'https://www.blog.honestcreatives.com.ng'
              };
            });
            setPosts(formatted);
            setIsLiveSync(true);
            setBlogLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct API query blocked. Launching origins query-bypass proxy fallback...', err);
      }

      // 3. Raw origins utility proxy as third layer of client-side redundancy
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://blog.honestcreatives.com.ng/wp-json/wp/v2/posts?_embed&per_page=100')}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data) && data.length > 0) {
            const formatted = data.map((post: any) => {
              const mediaObj = post._embedded?.['wp:featuredmedia']?.[0];
              const imgUrl = mediaObj?.media_details?.sizes?.medium_large?.source_url || 
                             mediaObj?.source_url || 
                             "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

              const cats = post._embedded?.['wp:term']?.[0];
              const catName = cats && cats[0] ? cats[0].name : "Insights";

              return {
                id: post.id,
                title: decodeHtml(post.title?.rendered || 'Honest Journal Article'),
                excerpt: decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]+>/g, '')).substring(0, 150) + '...',
                date: post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Update',
                image: imgUrl,
                category: catName,
                link: post.link || 'https://www.blog.honestcreatives.com.ng'
              };
            });
            setPosts(formatted);
            setIsLiveSync(true);
            setBlogLoading(false);
            return;
          }
        }
      } catch (fallbackErr) {
        console.error('All dynamic sync queries timed out. Activating local cached entries...', fallbackErr);
      }

      // 4. Inevitable local database placeholder model cache
      if (active) {
        setPosts(FallbackBlogPosts);
        setIsLiveSync(false);
        setBlogLoading(false);
      }
    };

    fetchLivePosts();
    return () => { active = false; };
  }, []);

  return (
    <div className={`w-full transition-colors duration-300 animate-in fade-in duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-stone-100' : 'bg-white text-black'
    }`} id="home-view-container">
      
      {/* Prime Hero Panel */}
      <section className={`relative overflow-hidden py-16 sm:py-24 border-b ${
        theme === 'dark' ? 'border-neutral-900 bg-neutral-950/20' : 'border-stone-100 bg-white'
      }`} id="hero-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-layout">
            
            {/* Visual Text Panel */}
            <div className="lg:col-span-7 space-y-6 text-left" id="hero-creative-text">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold font-mono tracking-wider uppercase border ${
                theme === 'dark' 
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                  : 'bg-orange-50/50 text-orange-600 border-orange-150'
              }`}>
                Now serving modern brands across borders
              </span>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-neutral-950'
              }`}>
                {customContent?.homeHeadline ? (
                  customContent.homeHeadline.includes('|') ? (
                    <>
                      {customContent.homeHeadline.split('|')[0].trim()} <br />
                      <span className="text-orange-500">{customContent.homeHeadline.split('|')[1].trim()}</span>
                    </>
                  ) : (
                    customContent.homeHeadline
                  )
                ) : (
                  <>
                    Design with integrity. <br />
                    <span className="text-orange-500">Scale with honesty.</span>
                  </>
                )}
              </h1>
              <p className={`text-base sm:text-lg max-w-xl leading-relaxed ${
                theme === 'dark' ? 'text-stone-300' : 'text-black font-medium'
              }`}>
                {customContent?.homeSubheadline || "We are a meticulous multi-disciplinary agency. We design pixel-perfect, ultra-responsive websites, craft powerful brand books, handle digital marketing campaigns, and plan unforgettable corporate events. No fluff, no false claims—only verified results and transparent development."}
              </p>
              
              <div className="flex flex-wrap gap-3.5 pt-2" id="hero-cta-buttons">
                <button
                  id="hero-get-started-btn"
                  onClick={() => handleServiceClick('send-brief')}
                  className="bg-orange-500 hover:bg-orange-600 font-mono text-xs uppercase font-bold tracking-wider text-stone-50 px-7 py-4 rounded-sm transition-all flex items-center gap-2 cursor-pointer border border-orange-500 hover:shadow-md hover:-translate-y-0.5"
                >
                  Send Project Brief <ArrowRight size={14} />
                </button>
                <button
                  id="hero-about-learn-btn"
                  onClick={() => handleServiceClick('about')}
                  className={`border px-7 py-4 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-stone-100 border-neutral-700' 
                      : 'bg-stone-50 hover:bg-stone-100 text-neutral-950 border-stone-300'
                  }`}
                >
                  Learn About Us
                </button>
              </div>
            </div>

            {/* Structured Stats & Graphic Block */}
            <div className={`p-8 rounded-sm shadow-sm text-left border ${
              theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-stone-50 border-stone-250 shadow-xs'
            }`} id="hero-quick-dashboard">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-6 border-b pb-2">
                Operational Framework
              </h3>
              <div className="space-y-6" id="dashboard-stats-grid">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-xs font-mono font-bold uppercase ${theme === 'dark' ? 'text-stone-300' : 'text-black font-bold'}`}>Average Page Speed Rank</span>
                    <span className="text-sm font-bold text-orange-605">98% (A-Grade)</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-sm overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-stone-200'}`}>
                    <div className="bg-orange-500 h-full w-[98%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-xs font-mono font-bold uppercase ${theme === 'dark' ? 'text-stone-300' : 'text-black font-bold'}`}>Customer Lead Spike Margin</span>
                    <span className="text-sm font-bold text-orange-605">+180% spikes</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-sm overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-stone-200'}`}>
                    <div className="bg-orange-500 h-full w-[92%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-xs font-mono font-bold uppercase ${theme === 'dark' ? 'text-stone-300' : 'text-black font-bold'}`}>Unforgettable Event Rating</span>
                    <span className="text-sm font-bold text-orange-605">4.9 / 5.0 Rating</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-sm overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-stone-200'}`}>
                    <div className="bg-orange-500 h-full w-[96%]"></div>
                  </div>
                </div>
              </div>

              <div className={`mt-8 pt-6 border-t border-stone-200/40 dark:border-neutral-800 text-xs font-mono flex justify-between ${theme === 'dark' ? 'text-stone-500' : 'text-black font-semibold'}`} id="dashboard-footing-meta">
                <span>VERIFICATION: SECURE</span>
                <span>LAGOS & BEYOND</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Structured Services Grid Section */}
      <section className={`py-20 sm:py-24 ${
        theme === 'dark' ? 'bg-neutral-900/10' : 'bg-stone-50/50'
      }`} id="home-services-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-3.5 mb-14 text-center" id="services-header-panel">
            <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold">Comprehensive Capabilities</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-neutral-950'
            }`}>
              Our Core <span className="text-orange-500">Creative Capabilities</span>
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
            <p className={`text-sm max-w-xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-stone-250 font-normal' : 'text-black font-medium'}`}>
              We cover five primary disciplines with absolute precision. Select any service below to explore our work structures and custom processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left" id="services-grid-wrapper">
            {listServices.map((service) => (
              <div
                key={service.tab}
                id={`service-card-${service.marker}`}
                className={`p-8 rounded-sm border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${
                  theme === 'dark' 
                    ? 'bg-neutral-900 border-neutral-800 hover:border-orange-500' 
                    : 'bg-white border-stone-250 hover:border-orange-500'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-sm flex items-center justify-center border border-orange-100 dark:border-orange-950/40 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
                    {service.icon}
                  </div>
                  <h3 className={`text-lg font-bold font-display group-hover:text-orange-500 transition-colors ${
                    theme === 'dark' ? 'text-stone-150' : 'text-neutral-950'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black'}`}>
                    {service.desc}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-stone-200/50 dark:border-neutral-850">
                  <button
                    onClick={() => handleServiceClick(service.tab)}
                    className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 group-hover:text-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Explore service details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* "Why Honest Creatives" Section */}
      <section className={`py-20 sm:py-24 border-t ${
        theme === 'dark' ? 'border-neutral-900 bg-neutral-950' : 'border-stone-200 bg-white'
      }`} id="home-advantages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-12" id="advantages-header">
            <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold">Uncompromising Values</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Why modern clients decide on <span className="text-orange-500 font-black">Honest Creatives</span>
            </h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto"></div>
            <p className={`text-sm leading-relaxed max-w-2xl mx-auto ${theme === 'dark' ? 'text-stone-300' : 'text-black'}`}>
              Our name is not a slogan—it is the governing architecture of everything we compile and organize. We avoid confusing vanity terms, provide direct timelines, and deploy code structures engineered exclusively to expand your bottom line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4" id="advantages-bullet-points">
            {/* Point 1 */}
            <div className={`p-6 border rounded-sm flex flex-col items-start text-left ${
              theme === 'dark' ? 'border-neutral-800 bg-neutral-900/35' : 'border-stone-200 bg-stone-50/50'
            }`} id="advantage-card-1">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-150 dark:border-orange-950/45 flex items-center justify-center rounded-xs mb-4">
                <Shield size={18} className="text-orange-500" />
              </div>
              <h4 className={`font-bold text-sm tracking-tight mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-black'}`}>Absolute Cost Transparency</h4>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black'}`}>
                No surprise line items or hidden maintenance bills. Every cost projection matches the deliverables exactly.
              </p>
            </div>

            {/* Point 2 */}
            <div className={`p-6 border rounded-sm flex flex-col items-start text-left ${
              theme === 'dark' ? 'border-neutral-800 bg-neutral-900/35' : 'border-stone-200 bg-stone-50/50'
            }`} id="advantage-card-2">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-150 dark:border-orange-950/45 flex items-center justify-center rounded-xs mb-4">
                <Award size={18} className="text-orange-500" />
              </div>
              <h4 className={`font-bold text-sm tracking-tight mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-black'}`}>Bespoke Visual Craft</h4>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black'}`}>
                No generic templates or cheap pre-packaged graphics. Everything is drawn, structured, and customized to reflect your identity.
              </p>
            </div>

            {/* Point 3 */}
            <div className={`p-6 border rounded-sm flex flex-col items-start text-left ${
              theme === 'dark' ? 'border-neutral-800 bg-neutral-900/35' : 'border-stone-200 bg-stone-50/50'
            }`} id="advantage-card-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-150 dark:border-orange-950/45 flex items-center justify-center rounded-xs mb-4">
                <Users size={18} className="text-orange-500" />
              </div>
              <h4 className={`font-bold text-sm tracking-tight mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-black'}`}>Direct Team Collaboration</h4>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black'}`}>
                Talk directly with the senior designers, developers, and event architects handling your briefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Brand Blog Section - Dynamically pulling all articles from external blog website */}
      <section className={`py-20 sm:py-24 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-neutral-900/10 border-neutral-900' : 'bg-stone-50/20 border-stone-200'
      }`} id="home-blog-posts-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto space-y-3.5 mb-14 text-center" id="blog-section-header">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1.5 bg-orange-100/40 dark:bg-orange-950/30 px-2 py-0.5 rounded-xs">
                <Globe size={11} /> honestcreatives.com.ng blog sync
              </span>
              {isLiveSync ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold leading-none border border-emerald-200/40 animate-pulse">
                  ● Live Sync
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 font-bold leading-none border border-orange-200/40">
                  ⚡ Offline Cache
                </span>
              )}
            </div>
            
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
              Featured on <span className="text-orange-500">Honest Creatives Journal</span>
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black font-medium'}`}>
              We stream creative strategies and technical frameworks directly from our client journal. Tap any article below to explore insights.
            </p>
          </div>

          {blogLoading ? (
            /* Elegant loading animation mesh */
            <div className="flex flex-col items-center justify-center py-20 space-y-4" id="blog-skeleton-loader">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-stone-400 tracking-wider">SYNCHRONIZING READS WITH INTEGRITY...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-posts-grid">
              {posts.slice(0, visibleCount).map((post) => (
                <div 
                  key={post.id}
                  className={`border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:shadow-md ${
                    theme === 'dark' ? 'bg-neutral-900 border-neutral-800 hover:border-orange-500' : 'bg-white border-stone-250 hover:border-orange-500 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-stone-150">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-orange-500 text-stone-50 text-[9px] font-mono leading-none py-1.5 px-2.5 rounded-sm uppercase font-bold tracking-wider border border-orange-400">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6 space-y-3 text-left">
                      <span className={`text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-stone-400' : 'text-black/80'}`}>
                        {post.date}
                      </span>
                      <h3 className={`text-base font-bold font-display leading-snug group-hover:text-orange-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                        {post.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black font-medium'}`}>
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-stone-100 dark:border-neutral-850 mt-4 text-left">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-500 hover:text-orange-600 cursor-pointer"
                    >
                      Read Live Article <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {posts.length > visibleCount && (
            <div className="text-center mt-12 animate-in fade-in" id="load-more-btn-container">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className={`px-8 py-4 font-mono text-xs font-black uppercase tracking-wider cursor-pointer border-2 transition-all hover:shadow-md hover:border-orange-500 rounded-sm active:scale-95 inline-flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'border-neutral-800 bg-neutral-900 text-white hover:bg-white hover:text-black'
                    : 'border-stone-300 bg-white text-neutral-950 hover:bg-neutral-950 hover:text-white'
                }`}
              >
                Load More Creative Strategies <ChevronRight size={13} className="stroke-[3.5]" />
              </button>
            </div>
          )}

          {/* Central Journal CTA */}
          <div className="mt-8 text-center">
            <a
              href="https://www.blog.honestcreatives.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all text-xs font-mono font-bold tracking-wider uppercase text-orange-500 rounded-sm cursor-pointer"
              id="visit-blog-journal-cta"
            >
              Explore Full Editorial Journal
            </a>
          </div>

        </div>
      </section>

      {/* NEW INTERACTIVE SECTION: Frequently Asked Questions & Client Diagnostic */}
      <section className={`py-20 sm:py-24 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-neutral-900/10 border-neutral-900 shadow-inner' : 'bg-stone-50/10 border-stone-200'
      }`} id="home-diagnostic-faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto space-y-3.5 mb-14 text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-sm">
                FAQ & TRUTHS
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>
              Client <span className="text-orange-500">Honesty Check</span>
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
            <p className={`text-sm max-w-xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-black font-medium'}`}>
              We believe in direct answers. Review key inquiries about our design methodologies, budgets, and post-launch maintenance terms.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4" id="faq-accordions">
            {[
              {
                q: 'What makes your website design "honest" compared to conventional templates?',
                a: 'Most agencies buy a cheap prebuilt WordPress theme, change the colors, and claim they built it. We write 100% clean, hand-crafted React and Tailwind CSS markup. This eliminates bloated plugin files, secures your server, and ensures average Lighthouse speed scores of 98%+ which are crucial for mobile networks in Africa.'
              },
              {
                q: 'How does your project budget planner estimate typical commercial costs?',
                a: 'Our estimator maps exact senior engineering, graphic crafting, and ad coordination assets. We prioritize 100% cost transparency: you pay exactly what is mapped out in the creative brief proposal. Zero hidden surprises or maintenance traps.'
              },
              {
                q: 'Where are you physically located, and can we request strategy workshops?',
                a: 'Yes, absolutely! Our physical studio is located at 4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos, Nigeria. We love to host branding workshops, scenography talks, and product briefings with partners.'
              },
              {
                q: 'Do you offer ongoing technical maintenance or advertising optimization?',
                a: 'Yes, we do. Every deployment gets 30 days of complete, hand-held technical security backups. Beyond that, we provide seamless monthly maintainer options for search optimization audits, campaign ad tracking, and ongoing design updates.'
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
                    className={`w-full p-5 flex justify-between items-center text-xs font-black uppercase tracking-tight text-black focus:outline-none cursor-pointer hover:bg-stone-50 ${isOpened ? 'bg-orange-500/5' : ''}`}
                  >
                    <span className="text-black">{item.q}</span>
                    <span className="text-orange-500 text-lg font-mono leading-none">
                      {isOpened ? '−' : '+'}
                    </span>
                  </button>
                  {isOpened && (
                    <div className="p-5 pt-0 text-xs sm:text-xs leading-relaxed text-black font-semibold border-t border-stone-150 animate-in slide-in-from-top-1">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Newsletter Placement Section - REQUIRED ON HOMEPAGE */}
      <section className={`py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t ${
        theme === 'dark' ? 'border-neutral-900 bg-neutral-950' : 'border-stone-200 bg-white'
      }`} id="home-newsletter-placement">
        <NewsletterForm theme={theme} />
      </section>
    </div>
  );
}
