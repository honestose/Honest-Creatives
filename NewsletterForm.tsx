import { useState, SyntheticEvent } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    
    // Simulate API registration call
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing! We will send you our creative insights.');
      setEmail('');
    }, 1200);
  };

  return (
    <div className="w-full bg-stone-950 text-white rounded-lg p-6 sm:p-8 md:p-10 border border-neutral-800 shadow-xl" id="newsletter-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="newsletter-grid">
        <div className="lg:col-span-7 flex flex-col space-y-2.5 text-left" id="newsletter-text">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-500 font-bold">STAY AHEAD of the CURVE</span>
          <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Join the <span className="text-orange-500">Honest Creatives</span> Circle
          </h3>
          <p className="text-stone-400 text-sm leading-relaxed max-w-lg">
            Subscribe to our newsletter and receive curated, practical reviews on conversion design, modern SEO growth tactics, and digital strategy directly in your inbox.
          </p>
        </div>

        <div className="lg:col-span-5 w-full" id="newsletter-action-wrapper">
          {status === 'success' ? (
            <div className="bg-stone-900 border border-orange-500/30 text-stone-100 p-5 rounded-md flex gap-3.5 items-start text-sm animate-in fade-in" id="newsletter-success">
              <CheckCircle2 className="text-orange-500 shrink-0 mt-0.5" size={20} />
              <div className="flex flex-col gap-1 text-left">
                <span className="font-bold text-orange-500 font-display">Subscription Active</span>
                <p className="text-stone-300 leading-relaxed text-xs">{message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" id="newsletter-signup-form">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    id="newsletter-email-field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-white text-black px-4 py-3.5 rounded-sm border-2 border-stone-200 focus:border-orange-500 focus:outline-none text-sm transition-all focus:ring-1 focus:ring-orange-500 font-medium"
                    required
                    disabled={status === 'submitting'}
                  />
                </div>
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-mono uppercase font-bold text-xs tracking-wider px-6 py-3.5 rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer grow-0 hover:shadow-md"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                  <Send size={14} />
                </button>
              </div>

              {status === 'error' && (
                <div className="flex gap-2 items-center text-xs text-red-400 text-left animate-in fade-in-50" id="newsletter-error">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <p className="text-[11px] text-stone-500 font-mono text-left">
                We respects your inbox privacy. Unsubscribe anytime in one single click.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
