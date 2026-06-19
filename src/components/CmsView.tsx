import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Shield, MessageCircle, Mail, FileText, CheckCircle, Send, Users, Sparkles, RefreshCw, Key, Power } from 'lucide-react';

interface CmsViewProps {
  theme?: 'light' | 'dark';
  customContent?: any;
  onContentChange?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  time: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  name: string;
  email: string;
  mode: 'ai_auto' | 'active';
  messages: ChatMessage[];
  lastUpdated: number;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  replied: boolean;
  replies: string[];
}

interface CreativeBrief {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  services: string[];
  budget: string;
  timeline: string;
  businessDescription: string;
  projectGoals: string;
  date: string;
  replied: boolean;
  replies: string[];
}

interface NewsletterEmail {
  id: string;
  email: string;
  date: string;
}

interface CmsData {
  chatsCount: number;
  contactsCount: number;
  briefsCount: number;
  newsletterCount: number;
  chats: ChatSession[];
  contacts: ContactInquiry[];
  briefs: CreativeBrief[];
  newsletter: NewsletterEmail[];
}

export default function CmsView({ theme = 'light', customContent, onContentChange }: CmsViewProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [activeUserEmail, setActiveUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [cmsTab, setCmsTab] = useState<'chats' | 'contacts' | 'briefs' | 'newsletter' | 'editor'>('chats');
  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState('');

  // Website dynamic content editor state fields
  const [editHomeHeadline, setEditHomeHeadline] = useState('');
  const [editHomeSubheadline, setEditHomeSubheadline] = useState('');
  const [editAboutIntro, setEditAboutIntro] = useState('');
  const [editContactHeader, setEditContactHeader] = useState('');
  const [editContactSubtitle, setEditContactSubtitle] = useState('');
  const [saveContentLoading, setSaveContentLoading] = useState(false);
  const [saveContentSuccess, setSaveContentSuccess] = useState(false);
  const [saveContentError, setSaveContentError] = useState('');

  useEffect(() => {
    if (customContent) {
      setEditHomeHeadline(customContent.homeHeadline || '');
      setEditHomeSubheadline(customContent.homeSubheadline || '');
      setEditAboutIntro(customContent.aboutIntro || '');
      setEditContactHeader(customContent.contactHeader || '');
      setEditContactSubtitle(customContent.contactSubtitle || '');
    }
  }, [customContent]);

  // Active items selected
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Static response states
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);
  const [contactReplyText, setContactReplyText] = useState('');
  
  const [currentBriefId, setCurrentBriefId] = useState<string | null>(null);
  const [briefReplyText, setBriefReplyText] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll chat replies in cms
  useEffect(() => {
    if (selectedChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  // Handle live polling on the selected active session while on the chats tab
  useEffect(() => {
    if (isAuthenticated && cmsTab === 'chats' && selectedChat) {
      pollingRef.current = setInterval(() => {
        pollSelectedChat();
      }, 3500);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isAuthenticated, cmsTab, selectedChat?.id]);

  const pollSelectedChat = async () => {
    if (!selectedChat) return;
    try {
      const res = await fetch(`/api/chats/session?email=${encodeURIComponent(selectedChat.email)}`);
      if (res.ok) {
        const session = await res.json();
        if (session.messages?.length !== selectedChat.messages?.length || session.mode !== selectedChat.mode) {
          setSelectedChat(session);
          // Also update the parent data state so lists updates in side column
          setData((prev) => {
            if (!prev) return null;
            const updatedChats = prev.chats.map((c) => (c.email === session.email ? session : c));
            return { ...prev, chats: updatedChats };
          });
        }
      }
    } catch {
      // Slit silent poll failure
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'honest123') {
      const cleanEmail = emailInput.trim().toLowerCase();
      if (cleanEmail !== 'xtremelyhonest@gmail.com') {
        setAuthError('Access Denied. Only the authorized owner email (xtremelyhonest@gmail.com) is permitted to edit website contents.');
        return;
      }
      setActiveUserEmail(cleanEmail);
      setIsAuthenticated(true);
      setAuthError('');
      fetchCmsData();
    } else {
      setAuthError('Access Denied. Passcode is invalid.');
    }
  };

  const handleSaveWebContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveContentLoading(true);
    setSaveContentSuccess(false);
    setSaveContentError('');

    try {
      const res = await fetch('/api/cms/update-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activeUserEmail,
          content: {
            homeHeadline: editHomeHeadline,
            homeSubheadline: editHomeSubheadline,
            aboutIntro: editAboutIntro,
            contactHeader: editContactHeader,
            contactSubtitle: editContactSubtitle,
          }
        })
      });

      if (res.ok) {
        setSaveContentSuccess(true);
        if (onContentChange) {
          onContentChange();
        }
        setTimeout(() => setSaveContentSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setSaveContentError(errData.error || 'Failed to update website content.');
      }
    } catch (err) {
      setSaveContentError('Network communication error updating content.');
    } finally {
      setSaveContentLoading(false);
    }
  };

  const fetchCmsData = async () => {
    setLoading(true);
    setRefreshError('');
    try {
      const res = await fetch('/api/cms/data');
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
        
        // Persist currently selected chat reference with updated data
        if (selectedChat) {
          const matching = payload.chats.find((c: ChatSession) => c.id === selectedChat.id);
          if (matching) setSelectedChat(matching);
        }
      } else {
        setRefreshError('Could not sync metrics with disk store.');
      }
    } catch (err) {
      setRefreshError('Network communication error syncing store.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Admin Direct Live Support Chat reply
  const handleReplyChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChat || !replyText.trim() || replySubmitting) return;

    const textPayload = replyText.trim();
    setReplyText('');
    setReplySubmitting(true);

    try {
      const res = await fetch('/api/cms/reply-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedChat.id, text: textPayload }),
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.session) {
          setSelectedChat(responseData.session);
          setData((prev) => {
            if (!prev) return null;
            const updatedChats = prev.chats.map((c) => (c.id === responseData.session.id ? responseData.session : c));
            return { ...prev, chats: updatedChats };
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit panel reply:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  // Toggle chat active mode between AI automatic and operator intervention
  const handleToggleMode = async (mode: 'ai_auto' | 'active') => {
    if (!selectedChat) return;
    try {
      const res = await fetch('/api/cms/toggle-chat-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedChat.id, mode }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.session) {
          setSelectedChat(payload.session);
          setData((prev) => {
            if (!prev) return null;
            const updatedChats = prev.chats.map((c) => (c.id === payload.session.id ? payload.session : c));
            return { ...prev, chats: updatedChats };
          });
        }
      }
    } catch (err) {
      console.error('Toggle issue:', err);
    }
  };

  // Reply to static Contact forms
  const handleReplyContact = async (contactId: string) => {
    if (!contactReplyText.trim()) return;
    try {
      const res = await fetch('/api/cms/reply-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, text: contactReplyText.trim() })
      });
      if (res.ok) {
        setContactReplyText('');
        setCurrentContactId(null);
        fetchCmsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reply to static Creative Brief logs
  const handleReplyBrief = async (briefId: string) => {
    if (!briefReplyText.trim()) return;
    try {
      const res = await fetch('/api/cms/reply-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, text: briefReplyText.trim() })
      });
      if (res.ok) {
        setBriefReplyText('');
        setCurrentBriefId(null);
        fetchCmsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNewslist = async () => {
    if (confirm('Are you sure you want to sweep/clear all Newsletter rows from the store?')) {
      try {
        const res = await fetch('/api/cms/clear-newsletter', { method: 'DELETE' });
        if (res.ok) fetchCmsData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplyChat();
    }
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setSelectedChat(null);
    setData(null);
    setPasscode('');
  };

  return (
    <div className="w-full min-h-screen py-16 sm:py-24" id="cms-main-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Passcode Entrance Gate Block */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto" id="cms-lock-gate">
            <div className={`p-8 border rounded-sm shadow-xl text-center space-y-6 ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-stone-250 text-neutral-900'
            }`}>
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-200">
                <Shield size={24} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold font-display uppercase tracking-tight text-neutral-950 dark:text-white">Honest Partner Portal</h1>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Enter your private partner key code to establish direct communication links and examine brief entries.
                  <br />
                  <span className="text-orange-500 font-mono font-bold">(Passcode: <span className="underline">honest123</span>)</span>
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label htmlFor="cms-email" className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Security Partner Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="cms-email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="xtremelyhonest@gmail.com"
                      className={`w-full py-3 pl-10 pr-4 text-xs font-mono tracking-wide border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                        theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-200 text-black'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Mail size={13} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="cms-pass" className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Security Passcode Key</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="cms-pass"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="•••••••••••••••"
                      className={`w-full py-3 pl-10 pr-4 text-xs font-mono tracking-widest border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                        theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-200 text-black'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-405">
                      <Key size={13} />
                    </div>
                  </div>
                </div>

                {authError && (
                  <span className="text-[10px] font-mono text-red-500 block text-center font-bold">{authError}</span>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 font-mono text-xs font-extrabold uppercase tracking-wider text-stone-50 rounded-sm cursor-pointer shadow-md transition-all active:scale-95"
                  id="cms-auth-trigger"
                >
                  Verify Partner Credentials
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Dashboard Interface */
          <div className="space-y-8 animate-in fade-in duration-300" id="cms-authenticated-view">
            
            {/* Top Stat bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 text-stone-100 p-6 rounded-sm border border-neutral-850">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-1">
                  Private Administration Console
                </span>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black font-display tracking-tight text-white">Honest Creatives CMS</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-bold leading-none animate-pulse">
                    ONLINE & LINKED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchCmsData}
                  disabled={loading}
                  className="p-2.5 bg-neutral-900 border border-neutral-800 text-stone-300 hover:text-white rounded-sm hover:border-orange-500 transition-colors flex items-center justify-center cursor-pointer"
                  title="Force Sync File Store"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin text-orange-505' : ''} />
                </button>
                <button
                  onClick={handleLogOut}
                  className="px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 text-xs font-mono font-bold uppercase rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Disconnect <Power size={12} />
                </button>
              </div>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="cms-stats-grid">
              {/* Card 1 */}
              <div className={`p-5 rounded-sm border ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-stone-450 uppercase">Active Support Chats</span>
                  <MessageCircle size={15} className="text-orange-500" />
                </div>
                <div className="text-2xl font-black font-display mt-2 dark:text-white">
                  {data?.chatsCount || 0}
                </div>
                <span className="text-[9px] font-mono text-stone-400 block mt-1">Direct sockets open</span>
              </div>

              {/* Card 2 */}
              <div className={`p-5 rounded-sm border ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-stone-450 uppercase">Contact Forms</span>
                  <Mail size={15} className="text-orange-500" />
                </div>
                <div className="text-2xl font-black font-display mt-2 dark:text-white">
                  {data?.contactsCount || 0}
                </div>
                <span className="text-[9px] font-mono text-stone-400 block mt-1">General inbound mail logs</span>
              </div>

              {/* Card 3 */}
              <div className={`p-5 rounded-sm border ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-stone-450 uppercase">Project Briefs</span>
                  <FileText size={15} className="text-orange-500" />
                </div>
                <div className="text-2xl font-black font-display mt-2 dark:text-white">
                  {data?.briefsCount || 0}
                </div>
                <span className="text-[9px] font-mono text-stone-400 block mt-1">Qualified commerce briefs</span>
              </div>

              {/* Card 4 */}
              <div className={`p-5 rounded-sm border ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-stone-450 uppercase">Emails Subscribers</span>
                  <Users size={15} className="text-orange-500" />
                </div>
                <div className="text-2xl font-black font-display mt-2 dark:text-white">
                  {data?.newsletterCount || 0}
                </div>
                <span className="text-[9px] font-mono text-stone-400 block mt-1">Marketing reach addresses</span>
              </div>
            </div>

            {/* Error alerts if any */}
            {refreshError && (
              <div className="p-3.5 bg-red-50 text-red-600 border border-red-200 text-xs font-mono rounded-sm text-left">
                ⚠️ {refreshError}
              </div>
            )}

            {/* Main Tabs Navigation */}
            <div className="flex border-b border-stone-200 dark:border-neutral-800" id="cms-tab-bar">
              <button
                onClick={() => setCmsTab('chats')}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  cmsTab === 'chats'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                Chats Stream ({data?.chats.length || 0})
              </button>
              <button
                onClick={() => { setCmsTab('contacts'); setSelectedChat(null); }}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  cmsTab === 'contacts'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                Inquiries ({data?.contacts.length || 0})
              </button>
              <button
                onClick={() => { setCmsTab('briefs'); setSelectedChat(null); }}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  cmsTab === 'briefs'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                Corporate Briefs ({data?.briefs.length || 0})
              </button>
               <button
                onClick={() => { setCmsTab('newsletter'); setSelectedChat(null); }}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  cmsTab === 'newsletter'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                Newsletter ({data?.newsletter.length || 0})
              </button>
              <button
                onClick={() => { setCmsTab('editor'); setSelectedChat(null); }}
                className={`py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  cmsTab === 'editor'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                ✏️ Edit Site Content
              </button>
            </div>

            {/* Interactive Tab Contents */}
            <div className="text-left" id="cms-data-contents-wrapper">
              
              {/* --- TAB 1: SUPPORT CHATS LIVE CONSOLE --- */}
              {cmsTab === 'chats' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column - Chats lists */}
                  <div className={`lg:col-span-4 border rounded-sm divide-y overflow-hidden ${
                    theme === 'dark' ? 'bg-neutral-900 border-neutral-850 divide-neutral-850' : 'bg-white border-stone-200 divide-stone-200'
                  }`} id="chats-sidebar-list">
                    <div className="p-4 bg-stone-950 text-white font-mono text-[10px] font-bold uppercase tracking-widest flex justify-between">
                      <span>Synchronized Session Links</span>
                      <span className="text-orange-500">Live feed</span>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto divide-y dark:divide-neutral-850">
                      {!data?.chats || data.chats.length === 0 ? (
                        <div className="p-8 text-center text-stone-450 italic text-xs">
                          No customer chats records currently saved in the file system.
                        </div>
                      ) : (
                        data.chats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 cursor-pointer text-left transition-colors flex items-center justify-between ${
                              selectedChat?.id === chat.id
                                ? 'bg-orange-500/10 dark:bg-orange-500/5 border-l-4 border-orange-500'
                                : 'hover:bg-stone-50 dark:hover:bg-neutral-950'
                            }`}
                          >
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold font-display dark:text-stone-105">{chat.name}</h4>
                              <p className="text-[10px] text-stone-400 font-mono tracking-tight">{chat.email}</p>
                              <span className="text-[9px] font-mono text-stone-450 mt-0.5 block uppercase">
                                Msg Count: {chat.messages.length}
                              </span>
                            </div>

                            <span className={`text-[8px] font-mono uppercase bg-orange-100 dark:bg-orange-950/40 text-orange-505 px-1.5 py-0.5 rounded-sm font-bold ${
                              chat.mode === 'active' ? '!bg-emerald-100/60 dark:!bg-emerald-950/20 !text-emerald-500' : ''
                            }`}>
                              {chat.mode === 'active' ? '👤 Human' : '🤖 AI Auto'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column - Active Chat Conversation panel */}
                  <div className="lg:col-span-8">
                    {selectedChat ? (
                      <div className={`border rounded-sm overflow-hidden flex flex-col justify-between ${
                        theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-white border-stone-250 shadow-xs'
                      }`} id="cms-chat-box-area">
                        {/* Selected Session Header */}
                        <div className="p-4 bg-stone-950 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-850 gap-2">
                          <div className="text-left">
                            <h3 className="text-sm font-bold font-display leading-tight">{selectedChat.name}</h3>
                            <span className="text-[10px] font-mono text-stone-300">{selectedChat.email}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleMode('ai_auto')}
                              className={`px-2.5 py-1 text-[9px] font-mono uppercase font-black rounded-sm border cursor-pointer ${
                                selectedChat.mode === 'ai_auto'
                                  ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                                  : 'bg-neutral-900 border-neutral-800 text-stone-400'
                              }`}
                            >
                              🤖 Enable AI Bot
                            </button>
                            <button
                              onClick={() => handleToggleMode('active')}
                              className={`px-2.5 py-1 text-[9px] font-mono uppercase font-black rounded-sm border cursor-pointer ${
                                selectedChat.mode === 'active'
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                  : 'bg-neutral-900 border-neutral-800 text-stone-400'
                              }`}
                            >
                              👤 Intervene (Human)
                            </button>
                          </div>
                        </div>

                        {/* Messages Stream display */}
                        <div className={`h-80 overflow-y-auto p-4 space-y-3 text-xs ${
                          theme === 'dark' ? 'bg-neutral-950' : 'bg-stone-50/70'
                        }`}>
                          {selectedChat.messages.map((m, i) => {
                            const isUser = m.sender === 'user';
                            const isAdmin = m.sender === 'admin';
                            
                            return (
                              <div
                                key={m.id || i}
                                className={`flex flex-col max-w-[80%] ${isUser ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                              >
                                <span className={`text-[8px] font-mono uppercase tracking-wider mb-0.5 ${
                                  isUser ? 'text-orange-500' : isAdmin ? 'text-emerald-500 font-bold' : 'text-stone-400'
                                }`}>
                                  {isUser ? 'Client User' : isAdmin ? '👑 Admin partner (You)' : '🤖 Built-in AI'}
                                </span>

                                <div className={`p-2.5 rounded-sm line-relaxed text-[11px] ${
                                  isUser
                                    ? 'bg-white text-stone-850 border border-stone-200 shadow-3xs dark:bg-neutral-900 dark:border-neutral-800 dark:text-white font-medium'
                                    : isAdmin
                                    ? 'bg-emerald-500 text-white font-bold'
                                    : 'bg-orange-500/10 border border-orange-500/30 text-orange-505 font-bold'
                                }`}>
                                  <p className="whitespace-pre-line">{m.text}</p>
                                </div>
                                <span className="text-[8px] font-mono text-stone-400 mt-0.5">{m.time}</span>
                              </div>
                            );
                          })}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Reply input interface action block */}
                        <form onSubmit={handleReplyChat} className="p-3 border-t bg-stone-50 dark:bg-neutral-950 border-stone-200 dark:border-neutral-850 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a human partner reply. Auto-switches channel to Human mode..."
                            className={`flex-grow p-3 text-xs border rounded-sm focus:outline-none focus:ring-1 focus ring-orange-500 ${
                              theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-stone-250 text-black'
                            }`}
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim() || replySubmitting}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-stone-300 disabled:cursor-not-allowed px-5 text-stone-50 text-xs font-mono font-bold uppercase rounded-sm cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            {replySubmitting ? (
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <>Send <Send size={11} /></>
                            )}
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className={`p-16 text-center border rounded-sm border-dashed ${
                        theme === 'dark' ? 'bg-neutral-900/10 border-neutral-800 text-stone-450' : 'bg-stone-50/50 border-stone-250 text-stone-500'
                      }`}>
                        <MessageCircle size={32} className="mx-auto mb-3 text-stone-400 stroke-[1.5]" />
                        <h4 className="text-sm font-bold font-display">Active operator mode</h4>
                        <p className="text-[11px] leading-relaxed max-w-xs mx-auto mt-1">
                          Select an active support chat session from the left-hand column to start communicating live.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* --- TAB 2: CONTACT FORM RECORDS LIST --- */}
              {cmsTab === 'contacts' && (
                <div className="space-y-4" id="cms-contacts-wrapper">
                  {!data?.contacts || data.contacts.length === 0 ? (
                    <div className="p-16 text-center border border-dashed text-stone-450 italic text-xs">
                      No general inquiry contact forms records saved in the database storage.
                    </div>
                  ) : (
                    data.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-6 border rounded-sm space-y-4 ${
                          theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 dark:border-neutral-850 pb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase bg-stone-100 dark:bg-orange-950/20 text-orange-500 px-2 py-0.5 rounded-sm font-bold">
                              {contact.service.toUpperCase()}
                            </span>
                            <h3 className="text-base font-bold font-display text-neutral-950 dark:text-white mt-1.5 leading-none">{contact.name}</h3>
                            <div className="text-[10px] font-mono text-stone-405 mt-1">Inbound Link: {contact.email} | {contact.phone || 'No phone'}</div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-stone-400 block">{contact.date}</span>
                            <span className={`inline-block text-[9px] font-mono font-bold uppercase rounded-sm px-1.5 py-0.5 mt-1 ${
                              contact.replied ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                            }`}>
                              {contact.replied ? '✓ Repulsed Thread' : '⚠️ UNANSWERED'}
                            </span>
                          </div>
                        </div>

                        {/* Core Message */}
                        <div className="text-xs bg-stone-50 dark:bg-neutral-950 p-4 border dark:border-neutral-800 rounded-sm font-medium text-stone-800 dark:text-stone-100 leading-relaxed">
                          "{contact.message}"
                        </div>

                        {/* Response threads history logs */}
                        {contact.replies && contact.replies.length > 0 && (
                          <div className="space-y-2 text-xs text-left" id="replies-history">
                            <span className="text-[9px] font-mono font-bold uppercase text-stone-400 block">Logged Responses ({contact.replies.length}):</span>
                            {contact.replies.map((reply, rid) => (
                              <div key={rid} className="p-3 bg-emerald-100/10 border border-emerald-500/20 rounded-md text-[11px] text-stone-800 dark:text-stone-300 font-mono">
                                👑 Partner log: {reply}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Action */}
                        <div className="pt-2">
                          {currentContactId === contact.id ? (
                            <div className="space-y-2 text-right">
                              <textarea
                                value={contactReplyText}
                                onChange={(e) => setContactReplyText(e.target.value)}
                                placeholder="Write response to log directly to the file database..."
                                rows={2}
                                className="w-full p-2.5 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:ring-1 focus:ring-orange-500 text-black dark:text-stone-100"
                              />
                              <div className="flex justify-end gap-2 text-xs font-mono">
                                <button
                                  type="button"
                                  onClick={() => { setCurrentContactId(null); setContactReplyText(''); }}
                                  className="px-3 py-1.5 border border-stone-300 rounded-sm hover:bg-stone-100 dark:border-neutral-800 text-stone-450 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReplyContact(contact.id)}
                                  className="px-4 py-1.5 bg-orange-500 text-white rounded-sm hover:bg-orange-600 cursor-pointer"
                                >
                                  Submit Log
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setCurrentContactId(contact.id); setContactReplyText(''); }}
                              className="text-xs font-mono font-black uppercase text-orange-500 hover:text-orange-600 cursor-pointer"
                            >
                              Log Partner Response +
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* --- TAB 3: CREATIVE BRIEF ENTRIES LIST --- */}
              {cmsTab === 'briefs' && (
                <div className="space-y-4" id="cms-briefs-wrapper">
                  {!data?.briefs || data.briefs.length === 0 ? (
                    <div className="p-16 text-center border border-dashed text-stone-450 italic text-xs">
                      No commercial creative briefs submitted in the system.
                    </div>
                  ) : (
                    data.briefs.map((brief) => (
                      <div
                        key={brief.id}
                        className={`p-6 border rounded-sm space-y-4 ${
                          theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 dark:border-neutral-850 pb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase bg-orange-500/10 text-orange-500 px-2.5 py-0.5 rounded-sm font-bold">
                              BRIEF: {brief.budget.toUpperCase()} Range
                            </span>
                            <h3 className="text-base font-bold font-display text-neutral-950 dark:text-white mt-2 leading-none">{brief.fullName}</h3>
                            <span className="text-[10px] font-mono text-stone-400 block mt-1">Brand: {brief.companyName} | Link: {brief.email} | {brief.phone}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-stone-400 block">{brief.date}</span>
                            <span className={`inline-block text-[9px] font-mono font-bold uppercase rounded-sm px-1.5 py-0.5 mt-1.5 ${
                              brief.replied ? 'bg-emerald-100 text-emerald-605' : 'bg-pink-100 text-pink-600 font-extrabold'
                            }`}>
                              {brief.replied ? '✓ Spec Generated' : '⚠️ PENDING REVIEW'}
                            </span>
                          </div>
                        </div>

                        {/* Detailed metrics grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-stone-50 dark:bg-neutral-950 p-4 border dark:border-neutral-850 rounded-sm">
                          <div>
                            <span className="text-orange-505 block uppercase font-bold text-[9px]">Requested Capabilities</span>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {brief.services.map((s) => (
                                <span key={s} className="bg-orange-500/15 text-orange-505 text-[9px] px-2 py-0.5 rounded-sm font-semibold uppercase">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-orange-505 block uppercase font-bold text-[9px]">Time Frame Metric</span>
                            <span className="font-extrabold text-neutral-950 dark:text-white block mt-1.5">{brief.timeline.toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Descripts */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono font-bold uppercase text-stone-450 block">Operational Description</span>
                          <p className="text-xs text-stone-700 dark:text-stone-250 leading-relaxed italic">
                            "{brief.businessDescription}"
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-mono font-bold uppercase text-stone-450 block">Project Core Goals</span>
                          <p className="text-xs text-stone-700 dark:text-stone-250 leading-relaxed italic">
                            "{brief.projectGoals}"
                          </p>
                        </div>

                        {/* Logged partner specification sheet */}
                        {brief.replies && brief.replies.length > 0 && (
                          <div className="space-y-2 text-xs" id="specs-history">
                            <span className="text-[9px] font-mono font-bold uppercase text-stone-400 block">Logged Partner Spec Outlines ({brief.replies.length}):</span>
                            {brief.replies.map((reply, rid) => (
                              <div key={rid} className="p-3.5 bg-emerald-100/10 border border-emerald-500/20 rounded-md text-[11px] text-stone-800 dark:text-stone-300 font-mono">
                                👑 Partner log: {reply}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply / Spec intake actions */}
                        <div className="pt-2 border-t border-stone-105 dark:border-neutral-850">
                          {currentBriefId === brief.id ? (
                            <div className="space-y-2 text-right">
                              <textarea
                                value={briefReplyText}
                                onChange={(e) => setBriefReplyText(e.target.value)}
                                placeholder="Compile creative details or roadmap draft direct log..."
                                rows={2}
                                className="w-full p-2.5 text-xs bg-stone-50 dark:bg-neutral-950 border rounded-sm focus:ring-1 focus:ring-orange-500 text-black dark:text-white"
                              />
                              <div className="flex justify-end gap-2 text-xs font-mono">
                                <button
                                  type="button"
                                  onClick={() => { setCurrentBriefId(null); setBriefReplyText(''); }}
                                  className="px-3 py-1.5 border border-stone-300 rounded-sm hover:bg-stone-100 dark:border-neutral-800 text-stone-450 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReplyBrief(brief.id)}
                                  className="px-4 py-1.5 bg-orange-500 text-white rounded-sm hover:bg-orange-605 cursor-pointer"
                                >
                                  Save Spec Log
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setCurrentBriefId(brief.id); setBriefReplyText(''); }}
                              className="text-xs font-mono font-black uppercase text-orange-500 hover:text-orange-600 cursor-pointer"
                            >
                              Add Partner Spec Outline +
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* --- TAB 4: NEWSLETTER EMAIL LIST --- */}
              {cmsTab === 'newsletter' && (
                <div className={`border rounded-sm overflow-hidden ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-white border-stone-200'
                }`} id="cms-email-subscribers-list">
                  <div className="p-4 bg-stone-950 text-white flex justify-between items-center border-b border-stone-800 font-mono text-xs">
                    <span>Synchronized News Subscriber Logs</span>
                    <button
                      onClick={handleClearNewslist}
                      disabled={!data?.newsletter || data.newsletter.length === 0}
                      className="px-2.5 py-1 text-[9px] bg-red-955 hover:bg-red-900 text-red-200 border border-red-800/40 uppercase font-black rounded-sm disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Clear All Records
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 dark:divide-neutral-855 text-xs text-left">
                    {!data?.newsletter || data.newsletter.length === 0 ? (
                      <div className="p-12 text-center text-stone-400 italic">
                        No newsletter emails subscribed.
                      </div>
                    ) : (
                      data.newsletter.map((n) => (
                        <div key={n.id} className="p-4 flex justify-between items-center hover:bg-stone-50 dark:hover:bg-neutral-950">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="font-mono text-stone-850 dark:text-stone-200 font-bold">{n.email}</span>
                          </div>
                          <span className="font-mono text-[10px] text-stone-400 font-semibold">{n.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB 5: WEBSITE CONTENT EDITOR --- */}
              {cmsTab === 'editor' && (
                <form onSubmit={handleSaveWebContent} className={`p-6 border rounded-sm space-y-6 ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-850 text-white' : 'bg-white border-stone-200 text-neutral-950'
                }`} id="cms-editor-canvas-form">
                  <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-orange-500">
                      ✏️ Live Site Web Content Editor
                    </h2>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Directly edit key text nodes and narrative statements across the Honest Creatives platform.
                    </p>
                  </div>

                  {saveContentSuccess && (
                     <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-500 font-mono text-[11px] font-bold rounded-sm text-center animate-pulse">
                       ✓ Website content successfully synchronized! Changes are active instantly.
                     </div>
                  )}

                  {saveContentError && (
                     <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-500/30 text-red-500 font-mono text-[11px] font-bold rounded-sm text-center">
                       ⚠️ Error: {saveContentError}
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home Headline */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        Homepage Hero Headline (Estimator section)
                      </label>
                      <p className="text-[10px] text-stone-450">
                        Use a pipe character <span className="text-orange-500 font-bold font-mono">|</span> to split the main title and style the second part with orange accent color. Example: <span className="italic">Design with integrity. | Scale with honesty.</span>
                      </p>
                      <input
                        type="text"
                        required
                        value={editHomeHeadline}
                        onChange={(e) => setEditHomeHeadline(e.target.value)}
                        placeholder="Design with integrity. | Scale with honesty."
                        className={`w-full p-3 font-medium text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                          theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-250 text-black'
                        }`}
                      />
                    </div>

                    {/* Home Subheadline */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        Homepage Hero Subheadline (Narrative Description)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editHomeSubheadline}
                        onChange={(e) => setEditHomeSubheadline(e.target.value)}
                        placeholder="We are a meticulous multi-disciplinary agency. We design pixel-perfect, ultra-responsive websites..."
                        className={`w-full p-3 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed ${
                          theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-250 text-black'
                        }`}
                      />
                    </div>

                    {/* About Intro */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        About Page Agency Editorial Narrative (Intro Text)
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editAboutIntro}
                        onChange={(e) => setEditAboutIntro(e.target.value)}
                        placeholder="Honest Creatives is a cross-functional agency based in Lagos, Nigeria..."
                        className={`w-full p-3 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed ${
                          theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-250 text-black'
                        }`}
                      />
                    </div>

                    {/* Contact Header */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        Contact Page Header Title
                      </label>
                      <p className="text-[9px] text-stone-450">
                        Use <span className="text-orange-500 font-bold font-mono">|</span> for Orange accent. Example: <span className="italic">Consult with our specialists. | Uncover clear digital paths.</span>
                      </p>
                      <input
                        type="text"
                        required
                        value={editContactHeader}
                        onChange={(e) => setEditContactHeader(e.target.value)}
                        placeholder="Consult with our specialists. | Uncover clear digital paths."
                        className={`w-full p-3 font-medium text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                          theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-250 text-black'
                        }`}
                      />
                    </div>

                    {/* Contact Subtitle */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        Contact Page Narrative Subtitle
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editContactSubtitle}
                        onChange={(e) => setEditContactSubtitle(e.target.value)}
                        placeholder="We operate with absolute transparency. Talk directly to our directors..."
                        className={`w-full p-3 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed ${
                          theme === 'dark' ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-stone-50 border-stone-200 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={saveContentLoading}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-600 font-mono text-xs font-bold uppercase tracking-wider text-stone-50 rounded-sm cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-2"
                    >
                      {saveContentLoading ? 'Saving changes...' : 'Save Web Content & Push Live'}
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
