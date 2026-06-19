import { useState, SyntheticEvent, ChangeEvent } from 'react';
import { Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ContactFormProps {
  theme?: 'light' | 'dark';
}

export default function ContactForm({ theme = 'light' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'website-design',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const servicesOption = [
    { value: 'website-design', label: 'Website Design' },
    { value: 'digital-design', label: 'Digital Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'seo', label: 'SEO Services' },
    { value: 'event-planning', label: 'Event Planning Services' },
    { value: 'other', label: 'General Inquiry / Partner' },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim()) {
      setStatus('error');
      setErrorMsg('Please specify your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setStatus('error');
      setErrorMsg('Please enter a brief message describing your goal.');
      return;
    }

    setStatus('submitting');
    
    // Send form data to the Express backend API
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to submit inquiry to server.');
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        console.error('[ContactForm] Submission failed:', err);
        setStatus('error');
        setErrorMsg(err?.message || 'Server connection error. Please try again.');
      });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'website-design',
      message: '',
    });
    setStatus('idle');
  };

  return (
    <div className={`w-full border rounded-sm p-6 sm:p-10 shadow-sm transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-stone-200 text-black'
    }`} id="contact-form-card">
      {status === 'success' ? (
        <div className="text-center py-12 px-4 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300" id="contact-success-state">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center shadow-xs border border-orange-500/20">
            <CheckCircle size={36} />
          </div>
          <div className="space-y-2.5 max-w-sm">
            <h3 className={`text-2xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Inquiry Received!</h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
              Hey <span className="font-bold text-orange-500">{formData.name}</span>, your inquiry has been logged successfully. One of our Honest Creative specialists will analyze your objective and follow up in under 24 working hours.
            </p>
          </div>
          <div className={`pt-4 border-t w-full max-w-xs text-xs font-mono text-stone-500 ${theme === 'dark' ? 'border-neutral-800 text-stone-400' : 'border-stone-150 text-stone-500'}`}>
            <p>Target Area: <span className="font-bold text-orange-500 uppercase">{formData.service.replace('-', ' ')}</span></p>
            <p className="mt-1">Follow up contact: {formData.email}</p>
          </div>
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider py-3 px-6 rounded-sm border transition-colors cursor-pointer ${
              theme === 'dark' 
                ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750 text-orange-400' 
                : 'bg-orange-50 border-orange-100 hover:bg-orange-100 text-orange-600'
            }`}
            id="contact-form-reset-btn"
          >
            Send Another Message <RefreshCw size={12} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left" id="contact-main-form">
          <div className="space-y-1.5">
            <h3 className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
              Start Your Project with <span className="text-orange-500">Honest Creatives</span>
            </h3>
            <p className="text-stone-400 text-xs text-left">Fill out the brief below, and let us shape your vision into high-impact digital products.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="form-grid-demographics">
            {/* Full Name */}
            <div className="space-y-2" id="input-group-name">
              <label htmlFor="contact-name" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name or Brand Representative"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-neutral-950 text-white border-neutral-800 focus:border-orange-500' 
                    : 'bg-white text-black border-stone-300 focus:border-orange-500'
                }`}
                required
                disabled={status === 'submitting'}
              />
            </div>

            {/* Email */}
            <div className="space-y-2" id="input-group-email">
              <label htmlFor="contact-email" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@business.com"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-neutral-950 text-white border-neutral-800 focus:border-orange-500' 
                    : 'bg-white text-black border-stone-300 focus:border-orange-500'
                }`}
                required
                disabled={status === 'submitting'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="form-grid-details">
            {/* Phone */}
            <div className="space-y-2" id="input-group-phone">
              <label htmlFor="contact-phone" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>
                Active Mobile Number
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. (+234) 915 649 8230"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-neutral-950 text-white border-neutral-800 focus:border-orange-500' 
                    : 'bg-white text-black border-stone-300 focus:border-orange-500'
                }`}
                disabled={status === 'submitting'}
              />
            </div>

            {/* Service Dropdown */}
            <div className="space-y-2" id="input-group-service">
              <label htmlFor="contact-service" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>
                Service of Interest
              </label>
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm font-medium transition-all cursor-pointer appearance-none ${
                  theme === 'dark' 
                    ? 'bg-neutral-950 text-white border-neutral-800 focus:border-orange-500 text-white' 
                    : 'bg-white text-black border-stone-300 focus:border-orange-500 text-black'
                }`}
                disabled={status === 'submitting'}
              >
                {servicesOption.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Brief */}
          <div className="space-y-2" id="input-group-message">
            <label htmlFor="contact-message" className={`block text-xs font-mono uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
            }`}>
              Briefly describe your objectives or event timeline <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us what you want to achieve, your project scope, or your event target date..."
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm font-medium transition-all resize-y ${
                theme === 'dark' 
                  ? 'bg-neutral-950 text-white border-neutral-800 focus:border-orange-500' 
                  : 'bg-white text-black border-stone-300 focus:border-orange-500'
              }`}
              required
              disabled={status === 'submitting'}
            />
          </div>

          {/* Validation Alert */}
          {status === 'error' && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 text-red-700 dark:text-red-400 px-4 py-3 rounded text-xs flex items-center gap-2 animate-in slide-in-from-top-1" id="contact-error-alert">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="contact-submit-btn"
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-mono uppercase font-bold text-xs tracking-wider py-4 rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
}
