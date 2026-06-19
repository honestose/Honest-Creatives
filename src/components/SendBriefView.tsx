import { useState, ChangeEvent, FormEvent } from 'react';
import { Sparkles, Calendar, Heart, Shield, CheckCircle2, ChevronRight, ChevronLeft, Globe, Send, Mail, Phone, Info } from 'lucide-react';
import { ActiveTab } from '../types';

interface SendBriefViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  theme?: 'light' | 'dark';
}

interface BriefFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  services: string[];
  businessDescription: string;
  projectGoals: string;
  targetAudience: string;
  timeline: string;
  budget: string;
  inspirations: string;
  fileConsent: boolean;
}

const initialFormState: BriefFormData = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  website: '',
  services: [],
  businessDescription: '',
  projectGoals: '',
  targetAudience: '',
  timeline: '',
  budget: '',
  inspirations: '',
  fileConsent: false,
};

export default function SendBriefView({ setActiveTab, theme = 'light' }: SendBriefViewProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<BriefFormData>(initialFormState);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BriefFormData, string>>>({});

  const servicesOptions = [
    { label: 'Website Design & Development', value: 'website-design' },
    { label: 'Digital Design & Branding Book', value: 'digital-design' },
    { label: 'Digital Marketing & Social Ads', value: 'digital-marketing' },
    { label: 'Search Engine Optimization (SEO)', value: 'seo' },
    { label: 'Premium Event Planning Services', value: 'event-planning' },
  ];

  const timelineOptions = [
    { label: 'As soon as possible', value: 'ASAP' },
    { label: '1 - 2 Weeks', value: '1-2-weeks' },
    { label: '3 - 4 Weeks', value: '3-4-weeks' },
    { label: '1 - 3 Months', value: '1-3-months' },
    { label: 'Flexible / Ongoing support', value: 'flexible' },
  ];

  const budgetOptions = [
    { label: 'Less than ₦500,000', value: 'under-500k' },
    { label: '₦500,000 - ₦1,500,000', value: '500k-1.5m' },
    { label: '₦1,500,000 - ₦5,000,000', value: '1.5m-5m' },
    { label: '₦5,000,000 - ₦10,000,000', value: '5m-10m' },
    { label: '₦10,000,000+ / Enterprise Custom', value: 'above-10m' },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BriefFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (serviceValue: string) => {
    setFormData((prev) => {
      const selected = prev.services.includes(serviceValue)
        ? prev.services.filter((item) => item !== serviceValue)
        : [...prev.services, serviceValue];
      return { ...prev, services: selected };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof BriefFormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    }

    if (currentStep === 2) {
      if (formData.services.length === 0) {
        newErrors.services = 'Please select at least one creative service.';
      }
    }

    if (currentStep === 3) {
      if (!formData.businessDescription.trim()) {
        newErrors.businessDescription = 'Please describe your business or organization.';
      }
      if (!formData.projectGoals.trim()) {
        newErrors.projectGoals = 'Please outline your primary project goals.';
      }
    }

    if (currentStep === 4) {
      if (!formData.timeline) newErrors.timeline = 'Please select a timeline option.';
      if (!formData.budget) newErrors.budget = 'Please select your investment range.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setApiError('');

    fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to persist creative brief on server.');
        }
        return res.json();
      })
      .then(() => {
        setFormSubmitted(true);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error('[SendBriefView] API Error:', err);
        setApiError(err?.message || 'Server connection issue. Please retry.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setFormSubmitted(false);
    setStep(1);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const getServiceLabel = (val: string) => {
    return servicesOptions.find((opt) => opt.value === val)?.label || val;
  };

  return (
    <div className={`w-full min-h-screen py-16 sm:py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'}`} id="send-brief-view-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Main Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-1 text-xs uppercase font-mono font-bold tracking-widest text-orange-500 bg-orange-100/40 dark:bg-orange-950/40 px-3 py-1 rounded-sm border border-orange-200/40">
            <Sparkles size={13} /> Project Intake System
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none">
            Send Brief to <span className="text-orange-500">Honest Creatives</span>
          </h1>
          <p className="text-sm max-w-xl mx-auto text-stone-600 dark:text-stone-300 font-medium">
            Tell us about your brand goals, target metrics, and specifications. Use this digital brief builder to outline custom deliverables.
          </p>
        </div>

        {formSubmitted ? (
          /* Submission Success Feedback Module */
          <div className={`p-8 sm:p-12 border-2 rounded-sm text-center space-y-8 animate-in fade-in duration-300 ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700' : 'bg-stone-50 border-stone-300 shadow-xl'}`} id="submit-success-card">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-orange-500 text-stone-50 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 size={36} />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-display">Brief Successfully Delivered</h2>
              <p className="text-xs text-orange-500 font-mono tracking-wider uppercase font-bold">REFERENCE CODE: HC-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p className="text-sm text-stone-800 dark:text-stone-200 max-w-md mx-auto leading-relaxed font-medium">
                Thank you, <span className="font-extrabold text-neutral-950 dark:text-white">{formData.fullName}</span>! Your detailed creative brief has been recorded. Our Honest Creatives consultants will analyze your specifications and reach out with a direct project roadmap within 24 working hours.
              </p>
            </div>

            {/* Summary Breakdown Card */}
            <div className={`text-left p-6 sm:p-8 rounded-sm space-y-4 border-2 ${theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-stone-250'}`}>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 border-b pb-2">Brief Parameters Received</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-800 dark:text-stone-200">
                <div>
                  <span className="text-stone-400 font-mono block text-[10px] uppercase">Client:</span>
                  <span className="font-bold text-sm text-neutral-950 dark:text-white">{formData.fullName}</span> {formData.companyName ? `(${formData.companyName})` : ''}
                </div>
                <div>
                  <span className="text-stone-400 font-mono block text-[10px] uppercase">Preferred Email:</span>
                  <span className="font-bold text-sm text-neutral-950 dark:text-white">{formData.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono block text-[10px] uppercase">Budget Tier:</span>
                  <span className="font-bold text-sm text-orange-500">
                    {budgetOptions.find((o) => o.value === formData.budget)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono block text-[10px] uppercase">Timeline:</span>
                  <span className="font-bold text-sm text-neutral-950 dark:text-white">
                    {timelineOptions.find((o) => o.value === formData.timeline)?.label}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-stone-400 font-mono text-[10px] uppercase block">Requested Focus Sectors:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {formData.services.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-orange-500/10 text-orange-505 rounded-sm font-mono text-[10px] font-bold">
                      {getServiceLabel(item)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="bg-orange-500 hover:bg-orange-600 font-mono text-xs font-bold uppercase tracking-wider text-white px-8 py-4 cursor-pointer rounded-sm hover:shadow-md transition-all inline-flex items-center gap-2"
                id="success-back-home-btn"
              >
                Return to Homepage <Globe size={13} />
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Intake Canvas */
          <div className={`border-2 rounded-sm overflow-hidden shadow-xl flex flex-col sm:grid sm:grid-cols-12 min-h-[500px] ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 shadow-black' : 'bg-white border-stone-300'}`} id="brief-multi-step-wrapper">
            
            {/* Left Nav Steps Indicator Frame */}
            <div className={`sm:col-span-4 p-6 sm:p-8 flex flex-row sm:flex-col justify-between sm:justify-start gap-4 border-b sm:border-b-0 sm:border-r ${theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-stone-50 border-stone-200'}`} id="steps-indicator-sidebar">
              <div className="hidden sm:block space-y-2 mb-8 animate-in fade-in">
                <h3 className="font-bold text-sm tracking-tight text-orange-505">Intake Milestone</h3>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-mono font-bold">Honest Creatives</p>
              </div>

              <div className="flex sm:flex-col gap-3 sm:gap-6 w-full justify-around sm:justify-start" id="timeline-bullets">
                {[1, 2, 3, 4, 5].map((s) => {
                  const stepLabels = ['Identity', 'Capabilities', 'Description', 'Timeline/Budget', 'Transmission'];
                  return (
                    <div key={s} className="flex items-center gap-3 group text-left">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-black text-xs border-2 transition-all ${
                        step === s
                          ? 'bg-orange-500 text-stone-50 border-orange-500 shadow-md scale-105'
                          : step > s
                          ? 'bg-orange-500/10 text-orange-500 border-orange-400'
                          : 'bg-stone-105 text-stone-600 border-stone-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-stone-300'
                      }`}>
                        {s}
                      </div>
                      <span className={`hidden md:inline font-mono text-[10px] uppercase font-bold tracking-wider ${step === s ? 'text-orange-500' : 'text-stone-500 dark:text-stone-400'}`}>
                        {stepLabels[s - 1]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="hidden sm:block mt-auto pt-8 border-t border-stone-200/50 dark:border-neutral-800 text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400">
                <Info size={11} className="inline mr-1 text-orange-500" /> Secure SSL Server
              </div>
            </div>

            {/* Right Interactive Form Area */}
            <form onSubmit={handleSubmit} className="sm:col-span-8 p-6 sm:p-8 flex flex-col justify-between h-full" id="brief-main-form">
              <div className="space-y-6 animate-in fade-in duration-300" id="active-step-fields">
                
                {/* Step 1: Client Specifications */}
                {step === 1 && (
                  <div className="space-y-5 text-left">
                    <div className="border-b border-stone-200 dark:border-neutral-800 pb-3">
                      <h2 className="text-xl font-bold font-display text-neutral-950 dark:text-white">Client Specifications</h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">Please introduce yourself and your organization.</p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Your Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g., Emeka Obi"
                        className={`w-full py-3 px-4 text-sm bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-neutral-950 dark:text-white font-medium ${
                          errors.fullName ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                        }`}
                      />
                      {errors.fullName && <span className="text-[10px] font-mono text-red-500 block">{errors.fullName}</span>}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Company Name / Brand</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g., Obi Enterprises Ltd"
                        className="w-full py-3 px-4 text-sm bg-stone-50 dark:bg-neutral-950 border border-stone-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g., client@company.com"
                          className={`w-full py-3 px-4 text-sm bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all ${
                            errors.email ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                          }`}
                        />
                        {errors.email && <span className="text-[10px] font-mono text-red-500 block">{errors.email}</span>}
                      </div>

                      <div className="space-y-2">
                        <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g., +234 812 345 6789"
                          className={`w-full py-3 px-4 text-sm bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all ${
                            errors.phone ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                          }`}
                        />
                        {errors.phone && <span className="text-[10px] font-mono text-red-500 block">{errors.phone}</span>}
                      </div>
                    </div>

                    {/* Current Website */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Current Website URL (optional)</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="e.g., https://yoursite.com"
                        className="w-full py-3 px-4 text-sm bg-stone-50 dark:bg-neutral-950 border border-stone-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Capabilities Mapping */}
                {step === 2 && (
                  <div className="space-y-5 text-left">
                    <div className="border-b border-stone-200 dark:border-neutral-800 pb-3">
                      <h2 className="text-xl font-bold font-display text-neutral-950 dark:text-white">Requested Capabilities</h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">Select all tactical services required for this brief with Honest Creatives.</p>
                    </div>

                    <div className="space-y-3" id="services-checklist">
                      {servicesOptions.map((opt) => {
                        const isChecked = formData.services.includes(opt.value);
                        return (
                          <div
                            key={opt.value}
                            onClick={() => handleCheckboxChange(opt.value)}
                            className={`p-4 border-2 rounded-sm flex items-center justify-between cursor-pointer transition-all select-none hover:bg-orange-505/5 ${
                              isChecked
                                ? 'border-orange-500 bg-orange-500/5 font-extrabold text-orange-500'
                                : 'border-stone-250 dark:border-neutral-800 hover:border-orange-205 text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            <span className="text-sm font-bold">{opt.label}</span>
                            <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-orange-500 border-orange-500 text-stone-50' : 'border-stone-300 dark:border-neutral-700'
                            }`}>
                              {isChecked && <CheckCircle2 size={13} className="stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.services && <span className="text-[10px] font-mono text-red-500 block">{errors.services}</span>}
                  </div>
                )}

                {/* Step 3: Context & Creative Scope */}
                {step === 3 && (
                  <div className="space-y-5 text-left">
                    <div className="border-b border-stone-200 dark:border-neutral-800 pb-3">
                      <h2 className="text-xl font-bold font-display text-neutral-950 dark:text-white">Business & Creative Scope</h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">Provide clear operational context so we can craft fitting solutions.</p>
                    </div>

                    {/* Business Description */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Describe Your Brand / Business *</label>
                      <textarea
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describe what services you provide, who your competitors are, and what makes your business unique."
                        className={`w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all ${
                          errors.businessDescription ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                        }`}
                      />
                      {errors.businessDescription && <span className="text-[10px] font-mono text-red-500 block">{errors.businessDescription}</span>}
                    </div>

                    {/* Project Goals */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>What are the Primary Project Goals? *</label>
                      <textarea
                        name="projectGoals"
                        value={formData.projectGoals}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Provide exact metrics or visual outcomes you want to achieve (e.g., increase web sales by 50%, launch modern brand book assets)."
                        className={`w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-950 dark:text-white font-medium transition-all ${
                          errors.projectGoals ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                        }`}
                      />
                      {errors.projectGoals && <span className="text-[10px] font-mono text-red-500 block">{errors.projectGoals}</span>}
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Who is your Core Target Audience?</label>
                      <textarea
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Describe your ideal customers (demographics, habits, regional locations, preferences)."
                        className="w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border border-stone-300 dark:border-neutral-800 text-neutral-950 dark:text-white font-medium rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Timeline & Budgets */}
                {step === 4 && (
                  <div className="space-y-5 text-left">
                    <div className="border-b border-stone-200 dark:border-neutral-800 pb-3">
                      <h2 className="text-xl font-bold font-display text-neutral-950 dark:text-white">Timeline & Investment</h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">Specify timeline goals and maximum investment limit so we structure within boundaries.</p>
                    </div>

                    {/* Project timeline dropdown */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Projected Timeline *</label>
                      <div className="relative">
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className={`w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer text-neutral-950 dark:text-white font-medium transition-all ${
                            errors.timeline ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                          }`}
                        >
                          <option value="">-- Select Preference --</option>
                          {timelineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-500">
                          <Calendar size={13} />
                        </div>
                      </div>
                      {errors.timeline && <span className="text-[10px] font-mono text-red-500 block">{errors.timeline}</span>}
                    </div>

                    {/* Investment budget range */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Allocated Investment Budget *</label>
                      <div className="relative">
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className={`w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer text-neutral-950 dark:text-white font-medium transition-all ${
                            errors.budget ? 'border-red-500' : 'border-stone-300 dark:border-neutral-800'
                          }`}
                        >
                          <option value="">-- Select Budget Range --</option>
                          {budgetOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-500">
                          <Shield size={13} />
                        </div>
                      </div>
                      {errors.budget && <span className="text-[10px] font-mono text-red-500 block">{errors.budget}</span>}
                    </div>

                    {/* Design Inspirations Links */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-300' : 'text-neutral-950 font-black'}`}>Design Inspirations or URLs</label>
                      <textarea
                        name="inspirations"
                        value={formData.inspirations}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="List website links or brand systems you love, separated by commas (e.g. apple.com, stripe.com)."
                        className="w-full py-3 px-4 text-xs bg-stone-50 dark:bg-neutral-950 border border-stone-300 dark:border-neutral-800 text-neutral-950 dark:text-white font-medium rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Final Verification Review */}
                {step === 5 && (
                  <div className="space-y-5 text-left">
                    <div className="border-b border-stone-200 dark:border-neutral-800 pb-3">
                      <h2 className="text-xl font-bold font-display text-neutral-950 dark:text-white">Confirm & Transmit</h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">Review your corporate brief details before sending to Honest Creatives.</p>
                    </div>

                    <div className={`p-5 rounded-sm space-y-4 border-2 ${theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-stone-50 border-stone-250'}`} id="submission-preview-card">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-stone-800 dark:text-stone-200">
                        <div>
                          <span className="text-stone-505 block uppercase font-bold text-[10px]">Client Profile</span>
                          <span className="font-extrabold text-sm text-neutral-950 dark:text-white leading-relaxed block mt-1">{formData.fullName}</span>
                          {formData.companyName && <span className="text-stone-600 dark:text-stone-400 block font-bold">{formData.companyName}</span>}
                          <span className="text-stone-750 dark:text-stone-300 block flex items-center gap-1 mt-1 font-semibold"><Mail size={12} className="text-orange-505" /> {formData.email}</span>
                          <span className="text-stone-750 dark:text-stone-300 block flex items-center gap-1 mt-0.5 font-semibold"><Phone size={12} className="text-orange-505" /> {formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-stone-505 block uppercase font-bold text-[10px]">Commercials</span>
                          <div className="space-y-1.5 mt-2 font-semibold">
                            <div>
                              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-mono font-bold">TIME FRAME:</span>
                              <span className="font-extrabold text-neutral-950 dark:text-white">{timelineOptions.find((o) => o.value === formData.timeline)?.label}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-mono font-bold">INVESTMENT LEVEL:</span>
                              <span className="font-extrabold text-orange-500">{budgetOptions.find((o) => o.value === formData.budget)?.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-stone-250 dark:border-neutral-850 pt-4">
                        <span className="text-[10px] font-mono text-stone-505 uppercase tracking-wider block font-bold">Requested Capabilities ({formData.services.length})</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {formData.services.map((item) => (
                            <span key={item} className="px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-sm font-mono text-[9px] font-bold">
                              {getServiceLabel(item)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-stone-250 dark:border-neutral-850 pt-4 text-xs space-y-2">
                        <div>
                          <span className="text-[10px] font-mono text-stone-520 uppercase tracking-wider block font-bold">Project Spec Overview</span>
                          <p className="text-stone-850 dark:text-stone-200 mt-1 italic leading-relaxed font-semibold">
                            "{formData.businessDescription.substring(0, 150)}..."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Data Consent Checklist */}
                    <div className="flex items-start gap-3 mt-4">
                      <input
                        type="checkbox"
                        id="fileConsent"
                        checked={formData.fileConsent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fileConsent: e.target.checked }))}
                        className="w-4.5 h-4.5 text-orange-500 bg-stone-100 border-stone-300 rounded-xs focus:ring-orange-500 dark:bg-neutral-950 dark:border-neutral-800 shrink-0 mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="fileConsent" className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed select-none cursor-pointer font-bold">
                        I hereby authorize <span className="font-extrabold text-orange-505">Honest Creatives</span> to store and process this commercial creative brief to construct a custom technical spec sheet. *
                        {errors.fileConsent && <span className="text-[10px] font-mono text-red-500 block mt-1">{errors.fileConsent}</span>}
                      </label>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons Console Footer */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-stone-200 dark:border-neutral-800 animate-in fade-in" id="step-nav-console">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`border-2 px-5 py-2.5 rounded-sm font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:shadow-md transition-all active:scale-95 ${
                      theme === 'dark'
                        ? 'border-neutral-700 hover:border-white bg-neutral-950 text-white'
                        : 'border-neutral-950 bg-stone-50 text-neutral-950 hover:bg-neutral-950 hover:text-white'
                    }`}
                    id="prev-step-btn"
                  >
                    <ChevronLeft size={16} className="stroke-[3.5]" /> Previous
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border-2 border-orange-500 hover:shadow-md transition-all active:scale-95"
                    id="next-step-btn"
                  >
                    Continue <ChevronRight size={16} className="stroke-[3.5]" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    {apiError && (
                      <div className="text-red-500 text-xs font-mono font-bold max-w-sm text-right bg-red-50 dark:bg-red-950/20 p-2 border border-red-200 dark:border-red-950/40 rounded-sm">
                        ⚠️ {apiError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={!formData.fileConsent || isSubmitting}
                      className={`font-mono text-xs font-black uppercase tracking-wider px-8 py-3 cursor-pointer rounded-sm hover:shadow-md transition-all border-2 inline-flex items-center gap-2 active:scale-95 ${
                        formData.fileConsent && !isSubmitting
                          ? 'bg-orange-500 hover:bg-orange-600 text-stone-50 border-orange-500'
                          : 'bg-stone-300 text-stone-600 border-stone-305 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-510 dark:border-neutral-805'
                      }`}
                      id="submit-brief-final-btn"
                    >
                      {isSubmitting ? (
                        <>Transmitting Brief... <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span></>
                      ) : (
                        <>Transmit Creative Brief <Send size={14} className="stroke-[2.5]" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}
