import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactViewProps {
  theme?: 'light' | 'dark';
  customContent?: any;
}

export default function ContactView({ theme = 'light', customContent }: ContactViewProps) {
  return (
    <div className={`w-full py-16 sm:py-24 transition-colors duration-300 animate-in fade-in duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-stone-100' : 'bg-white text-black'
    }`} id="contact-us-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Contact Intro */}
        <div className="max-w-3xl text-left space-y-4 mb-16" id="contact-header-intro">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold">Get In Touch</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-neutral-950'
          }`}>
            {customContent?.contactHeader ? (
              customContent.contactHeader.includes('|') ? (
                <>
                  {customContent.contactHeader.split('|')[0].trim()} <br />
                  <span className="text-orange-500">{customContent.contactHeader.split('|')[1].trim()}</span>
                </>
              ) : (
                customContent.contactHeader
              )
            ) : (
              <>
                Consult with our specialists. <br />
                <span className="text-orange-500">Uncover clear digital paths.</span>
              </>
            )}
          </h1>
          <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
          <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
            {customContent?.contactSubtitle || "We operate with absolute transparency. Talk directly to our directors to map out website designs, check your SEO health, plan creative ad budgets, or stage outstanding live coordinates."}
          </p>
        </div>

        {/* Master Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-grid-layout">
          
          {/* Left Column: Authoritative Contact Cards */}
          <div className="lg:col-span-5 space-y-8 text-left" id="contact-coordinates-panel">
            
            <div className="space-y-6" id="coordinates-group">
              <h3 className={`text-xs font-mono font-bold uppercase tracking-widest text-orange-500 border-b pb-2 ${
                theme === 'dark' ? 'border-neutral-800' : 'border-stone-200'
              }`}>
                Operational Coordinates
              </h3>

              {/* Email Coordinates Card */}
              <div className={`flex gap-4 p-5 rounded-sm border transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-neutral-900/30' : 'border-stone-200 bg-stone-50/50'
              }`} id="contact-coord-email">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/40 flex items-center justify-center text-orange-500 rounded-xs shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block tracking-wider">Direct Mailbox</span>
                  <a href="mailto:support@honestcreatives.com.ng" className={`text-base font-bold font-display hover:text-orange-500 transition-colors border-b leading-relaxed ${
                    theme === 'dark' ? 'text-white border-neutral-800' : 'text-neutral-900 border-stone-200'
                  }`}>
                    support@honestcreatives.com.ng
                  </a>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Send us your technical specs, RFPs, or event briefs anytime.</p>
                </div>
              </div>

              {/* Mobile Phone Coordinates Card */}
              <div className={`flex gap-4 p-5 rounded-sm border transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-neutral-900/30' : 'border-stone-200 bg-stone-50/50'
              }`} id="contact-coord-phone">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/40 flex items-center justify-center text-orange-500 rounded-xs shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block tracking-wider">Active Hotline</span>
                  <a href="tel:+2349156498230" className={`text-base font-bold font-display hover:text-orange-500 transition-colors border-b leading-relaxed ${
                    theme === 'dark' ? 'text-white border-neutral-800' : 'text-neutral-900 border-stone-200'
                  }`}>
                    (+234) 915 649 8230
                  </a>
                  <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Talk directly with a senior specialist. Active weekdays 8AM — 6PM WAT.</p>
                </div>
              </div>

              {/* Physical Address Card */}
              <div className={`flex gap-4 p-5 rounded-sm border transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-neutral-900/30' : 'border-stone-200 bg-stone-50/50'
              }`} id="contact-coord-address">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/40 flex items-center justify-center text-orange-500 rounded-xs shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1.5 flex-1 text-left">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400 block tracking-wider">Lagos Studio Address</span>
                  <address className={`not-italic text-sm font-bold font-display leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                    4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos, Nigeria
                  </address>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Visit our administrative lounge for direct event mapping workshops.</p>
                </div>
              </div>
            </div>

            {/* Supportive Guidelines Card */}
            <div className="p-6 bg-stone-950 text-white border border-neutral-850 rounded-sm space-y-3" id="contact-support-badge">
              <div className="flex items-center gap-2 text-orange-500 font-mono text-xs font-bold uppercase">
                <ShieldCheck size={16} /> Honest Assurance
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                We never capture your personal details for third party usage. Your briefings, emails, and phone calls remain secured and confidential. We respond within one business day with transparent scope diagnostics.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Us Page Form (Requirements match: Let there be form in the Contact Us page) */}
          <div className="lg:col-span-7" id="contact-form-panel">
            <ContactForm theme={theme} />
          </div>

        </div>

      </div>
    </div>
  );
}
