import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Film, Image as ImageIcon, Moon, Sun, Video, Type, Wand2,
  Home, FolderKanban, Sparkles, Bot, ChevronDown, Check, Trash2, Plus, X, Download, Settings,
} from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';
// import { useAuth } from './AuthContext';
// import LoginPage from './LoginPage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ── Tab accent system ─────────────────────────────────────────── */
const TAB_CFG = {
  Home:   { grad: 'from-blue-500   to-cyan-400',   shadow: 'shadow-blue-500/35',   accent: 'text-cyan-400',    accentL: 'text-cyan-600',    orb1: 'bg-blue-500/28',    orb2: 'bg-violet-500/18',  border: 'border-blue-400/30'   },
  Image:  { grad: 'from-violet-500 to-purple-400', shadow: 'shadow-violet-500/35', accent: 'text-violet-400',  accentL: 'text-violet-600',  orb1: 'bg-violet-500/28',  orb2: 'bg-pink-500/18',    border: 'border-violet-400/30' },
  Video:  { grad: 'from-orange-500 to-amber-400',  shadow: 'shadow-orange-500/35', accent: 'text-amber-400',   accentL: 'text-orange-600',  orb1: 'bg-orange-400/25',  orb2: 'bg-rose-400/15',    border: 'border-orange-400/30' },
  Assets: { grad: 'from-teal-500   to-emerald-400',shadow: 'shadow-teal-500/30',   accent: 'text-teal-400',    accentL: 'text-teal-600',    orb1: 'bg-teal-500/24',    orb2: 'bg-emerald-500/16', border: 'border-teal-400/30'   },
} as const;
type TabKey = keyof typeof TAB_CFG;

/* ── Custom Select ─────────────────────────────────────────────── */
interface SelectOption { value: string; label: string; }
interface CustomSelectProps {
  label: string; value: string; onChange: (v: string) => void;
  options: SelectOption[]; isLight: boolean; accentClass: string;
  compact?: boolean;
}
function CustomSelect({ label, value, options, onChange, isLight, accentClass }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value)?.label ?? value;
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button" onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold outline-none select-none transition-all
          ${isLight ? 'text-slate-700 hover:bg-black/5' : 'text-slate-200 hover:bg-white/10'}`}
      >
        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
        <span className={accentClass}>{selected}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} opacity-50`} />
      </button>

      <div
        role="listbox"
        className={`absolute bottom-[calc(100%+10px)] left-1/2 z-50 min-w-[150px] -translate-x-1/2 origin-bottom rounded-2xl p-1.5
          transition-all duration-200 glass-elevated
          ${open ? 'pointer-events-auto scale-100 opacity-100 translate-y-0' : 'pointer-events-none scale-90 opacity-0 translate-y-3'}`}
      >
        {options.map(opt => (
          <button key={opt.value} type="button" role="option" aria-selected={opt.value === value}
            onClick={() => { onChange(opt.value); close(); }}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-100
              ${opt.value === value
                ? isLight ? 'bg-blue-50 text-blue-700 font-semibold' : `${accentClass} bg-white/10 font-semibold`
                : isLight ? 'text-slate-600 hover:bg-black/5' : 'text-slate-300 hover:bg-white/8'}`}
          >
            <span>{opt.label}</span>
            {opt.value === value && <Check size={11} className="shrink-0 opacity-70" />}
          </button>
        ))}
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────────────────────── */

interface ChatMessage {
  id: string; role: 'user' | 'ai'; content: string; timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
}
interface ChatSession {
  id: string; title: string; tab: 'Home' | 'Image' | 'Video';
  messages: ChatMessage[]; updatedAt: number;
}

const HOME_MODELS: SelectOption[] = [
  { value: 'openai/gpt-5.6-sol',         label: 'GPT-5.6 Sol'     },
  { value: 'moonshotai/kimi-k3',          label: 'Kimi K3'         },
  { value: 'deepseek-ai/deepseek-v4-pro', label: 'Deepseek V4 Pro' },
];
const modelLabel = (id: string) => HOME_MODELS.find(m => m.value === id)?.label ?? 'GPT-5.6 Sol';

/* ── Dot bounce typing indicator ─────────────────────────────── */
function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 150, 300].map((delay, i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}

/* ════════════════════ APP ════════════════════ */
function App() {
  // --- Auth Disabled for now ---
  // const { user, logout } = useAuth();
  // if (!user) return <LoginPage />;

  /* ── Theme ── */
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('director_theme') as 'light' | 'dark') || 'dark'
  );
  const isLight = theme === 'light';

  /* ── State ── */
  const [healthStatus, setHealthStatus] = useState('Connecting…');
  const [activeTab, setActiveTab] = useState<TabKey>('Home');
  const cfg = TAB_CFG[activeTab];

  /* ── Sessions ── */
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try { const s = localStorage.getItem('chat_sessions'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() =>
    localStorage.getItem('active_session_id')
  );
  useEffect(() => { localStorage.setItem('chat_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => {
    if (activeSessionId) localStorage.setItem('active_session_id', activeSessionId);
    else localStorage.removeItem('active_session_id');
  }, [activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession?.messages ?? [];

  const handleSessionClick = (id: string, tab: string) => {
    setActiveSessionId(id);
    if (activeTab !== tab) {
      setActiveTab(tab as TabKey);
    }
  };

  const createSession = (tab: 'Home' | 'Image' | 'Video') => {
    const s: ChatSession = {
      id: Date.now().toString(), title: 'New Chat', tab,
      messages: [{ id: 'w', role: 'ai', timestamp: new Date().toLocaleTimeString(),
        content: tab === 'Home' ? 'Hello, Director. What are we creating today?'
          : tab === 'Image' ? 'Ready to generate images. Describe your vision.'
          : 'Ready to generate cinematic videos. What is the scene?',
      }],
      updatedAt: Date.now(),
    };
    setSessions(p => [s, ...p]);
    setActiveSessionId(s.id);
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleTabChange = (newTab: TabKey) => {
    setActiveTab(newTab);
    if (newTab !== 'Assets') {
      const ex = sessions.filter(s => s.tab === newTab);
      if (ex.length > 0) setActiveSessionId(ex[0].id);
      else createSession(newTab);
    }
  };

  const updateMsgs = (fn: (p: ChatMessage[]) => ChatMessage[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const msgs = fn(s.messages);
      let title = s.title;
      if (title === 'New Chat') {
        const f = msgs.find(m => m.role === 'user');
        if (f) title = f.content.substring(0, 32) + (f.content.length > 32 ? '…' : '');
      }
      return { ...s, messages: msgs, title, updatedAt: Date.now() };
    }).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(p => p.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  /* ── Prompts & Mode ── */
  const [generateMode, setGenerateMode] = useState<'Brief' | 'Image' | 'Video'>('Brief');
  const [prompt, setPrompt]   = useState('');
  const [showSettings, setShowSettings] = useState(false);

  /* ── Generation tracking ── */
  const [generatingSessions, setGeneratingSessions] = useState<Record<string, boolean>>({});
  const isGenerating = activeSessionId ? !!generatingSessions[activeSessionId] : false;

  /* ── Models ── */
  const [models, setModels]                         = useState<any[]>([]);
  const [selectedImageModel, setSelectedImageModel] = useState('');
  const [selectedVideoModel, setSelectedVideoModel] = useState('');
  const [selectedHomeModel, setSelectedHomeModel]   = useState('openai/gpt-5.6-sol');

  /* ── Media settings ── */
  const [aspectRatioImg, setAspectRatioImg] = useState('16:9');
  const [aspectRatioVid, setAspectRatioVid] = useState('16:9');
  const [durationVid, setDurationVid]       = useState('5s');
  const [numOutputsImg, setNumOutputsImg]   = useState<number>(1);
  const [qualityImg, setQualityImg]         = useState<number>(80);
  const [negPromptImg, setNegPromptImg]     = useState('');
  const [formatImg, setFormatImg]           = useState('webp');
  const [guidanceImg, setGuidanceImg]       = useState('');
  const [stepsImg, setStepsImg]             = useState('');
  const [seedImg, setSeedImg]               = useState('');

  /* ── Files ── */
  const [refFile, setRefFile]   = useState<File | null>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  /* ── Effects ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('director_theme', theme);
  }, [theme]);
  useEffect(() => { feedEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeMessages, activeTab]);
  useEffect(() => {
    axios.get(`${API_BASE}/api/health`).then(() => setHealthStatus('System: Online')).catch(() => setHealthStatus('System: Offline'));
    axios.get(`${API_BASE}/api/atlas/models`).then(res => {
      setModels(res.data.models);
      const fv = res.data.models.find((m: any) => m.type === 'Video');
      const fi = res.data.models.find((m: any) => m.type === 'Image');
      if (fv) setSelectedVideoModel(fv.id);
      if (fi) setSelectedImageModel(fi.id);
    }).catch(err => console.error('Failed to load models', err));
  }, []);

  /* ── Handlers ── */
  const handleSendHome = async () => {
    if (!prompt.trim() && !refFile) return;
    if (!activeSessionId) createSession('Home');
    const up = prompt.trim(); setPrompt('');
    const tid = activeSessionId!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user',
      content: up || (refFile ? 'Sent a reference file.' : ''),
      imageUrl: refFile && refFile.type.startsWith('image') ? URL.createObjectURL(refFile) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('prompt', up); fd.append('model', selectedHomeModel);
      fd.append('history', JSON.stringify(activeSession?.messages.map(m => ({ role: m.role, content: m.content })) ?? []));
      if (refFile) fd.append('reference_image', refFile);
      const res = await axios.post(`${API_BASE}/api/chat`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: res.data.response, timestamp: new Date().toLocaleTimeString() }]);
      setRefFile(null);
    } catch (e: any) {
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `**Error:** ${e.response?.data?.detail || e.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally { setGeneratingSessions(p => ({ ...p, [tid]: false })); }
  };

  const handleSendMedia = async (type: 'Image' | 'Video') => {
    const isImg = type === 'Image';
    const up = prompt.trim();
    const model = isImg ? selectedImageModel : selectedVideoModel;
    if (!up || !model) return;
    if (!activeSessionId) createSession('Home');
    setPrompt('');
    const mdl = models.find(m => m.id === model);
    const tid = activeSessionId!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user', content: up,
      imageUrl: refFile && refFile.type.startsWith('image') ? URL.createObjectURL(refFile) : undefined,
      videoUrl: refFile && refFile.type.startsWith('video') ? URL.createObjectURL(refFile) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('type', type); fd.append('prompt', up); fd.append('model_keyword', model);
      fd.append('aspect_ratio', isImg ? aspectRatioImg : aspectRatioVid);
      if (isImg) {
        if (negPromptImg.trim())  fd.append('negative_prompt',     negPromptImg.trim());
        if (numOutputsImg > 1)    fd.append('num_outputs',         numOutputsImg.toString());
        if (formatImg !== 'webp') fd.append('output_format',       formatImg);
        if (qualityImg !== 80)    fd.append('output_quality',      qualityImg.toString());
        if (guidanceImg)          fd.append('guidance_scale',      guidanceImg);
        if (stepsImg)             fd.append('num_inference_steps', stepsImg);
        if (seedImg)              fd.append('seed',                seedImg);
      } else { fd.append('duration', durationVid); }
      if (refFile && mdl?.supports_image) fd.append('reference_file', refFile);
      const res = await axios.post(`${API_BASE}/api/atlas/generate`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai',
        content: `**Task Submitted**\nID: ${res.data.prediction_id}\n*Model: ${mdl?.name}*\n\nYour ${type} is being generated on Atlas Cloud. It will appear in the Assets tab when ready.`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setRefFile(null);
    } catch (e: any) {
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `**Error:** ${e.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally { setGeneratingSessions(p => ({ ...p, [tid]: false })); }
  };

  const handleKeyDown = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
  };

  /* ── Computed ── */



  /* ── Classes & Styling ────────────────────────────────────────── */
  const navItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: 'Home',   label: 'Home',   icon: Home         },
    { id: 'Assets', label: 'Assets', icon: FolderKanban },
  ];

  const tabCfg = (id: TabKey) => TAB_CFG[id];

  /* ── RENDER ────────────────────────────────────────── */
  return (
    <div className={`flex h-screen gap-3 p-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className="glass-panel flex w-[252px] shrink-0 flex-col rounded-[28px] p-4">

        {/* Logo */}
        <div className="mb-5 flex items-center gap-3 px-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.grad} shadow-lg ${cfg.shadow}`}>
            <Film size={20} className="text-white" />
          </div>
          <div>
            <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Director OS</h2>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Creative control center</p>
          </div>
        </div>

        {/* New Chat */}
        <button
          type="button"
          onClick={() => createSession(activeTab === 'Assets' ? 'Home' : activeTab as 'Home' | 'Image' | 'Video')}
          className={`mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${cfg.grad} px-3 py-2.5 text-sm font-bold text-white shadow-lg ${cfg.shadow} transition duration-200 hover:-translate-y-0.5`}
        >
          <Plus size={14} /> New Chat
        </button>

        {/* Nav */}
        <nav className="mb-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            const tc = tabCfg(id);
            return (
              <button
                key={id} type="button" onClick={() => handleTabChange(id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200
                  ${active
                    ? `bg-gradient-to-r ${tc.grad} text-white shadow-lg ${tc.shadow}`
                    : `nav-item-glass ${isLight ? 'text-slate-600' : 'text-slate-400'}`}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl transition
                  ${active ? 'bg-white/20' : isLight ? 'bg-black/6 group-hover:bg-black/10' : 'bg-white/6 group-hover:bg-white/10'}`}>
                  <Icon size={15} className={active ? 'text-white' : active ? tc.accent : ''} />
                </span>
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />}
              </button>
            );
          })}
        </nav>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <p className={`mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
            Recent
          </p>
          <div className="flex flex-col gap-0.5">
            {sessions.map(s => {
              const tc = tabCfg(s.tab as TabKey);
              return (
                <button key={s.id} type="button" onClick={() => handleSessionClick(s.id, s.tab)}
                  className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all duration-150
                    ${activeSessionId === s.id
                      ? isLight ? `bg-blue-50 ${tc.accentL}` : `bg-white/8 ${tc.accent}`
                      : isLight ? 'text-slate-600 hover:bg-black/5' : 'text-slate-400 hover:bg-white/6'}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${tc.grad}`} />
                  <span className="flex-1 truncate">{s.title}</span>
                  <span onClick={e => deleteSession(e, s.id)}
                    className={`shrink-0 rounded-lg p-1 opacity-0 transition group-hover:opacity-100 ${isLight ? 'hover:text-red-500' : 'hover:text-red-400'}`}>
                    <Trash2 size={10} />
                  </span>
                </button>
              );
            })}
            {sessions.length === 0 && (
              <p className={`px-2 text-xs italic ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>No recent chats.</p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-3 space-y-2">
          {/* User card (Disabled for now) */}
          {/* 
          <div className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${isLight ? 'border-black/6 bg-black/4' : 'border-white/8 bg-white/5'}`}>
            <img src={user.picture} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-blue-500/40" />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{user.name}</p>
              <p className={`truncate text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{user.email}</p>
            </div>
            <button type="button" onClick={logout} title="Sign out"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition ${isLight ? 'text-slate-400 hover:bg-black/8 hover:text-red-500' : 'text-slate-500 hover:bg-white/10 hover:text-red-400'}`}>
              <LogOut size={13} />
            </button>
          </div>
          */}

          {/* Theme */}
          <button type="button" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className={`nav-item-glass flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${isLight ? 'border-black/6 text-slate-700' : 'border-white/8 text-slate-300'}`}>
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>

          {/* Health */}
          <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-semibold ${
            healthStatus.includes('Online')
              ? 'border-emerald-500/20 bg-emerald-500/8 text-emerald-400'
              : 'border-rose-500/20 bg-rose-500/8 text-rose-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${healthStatus.includes('Online') ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {healthStatus}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="movie-shell glass-panel relative flex flex-1 overflow-hidden rounded-[28px]">
        {/* Ambient orbs — color changes per tab */}
        <div className={`floating-orb left-16 top-10 h-40 w-40 ${cfg.orb1}`} />
        <div className={`floating-orb bottom-14 right-20 h-48 w-48 ${cfg.orb2}`} style={{ animationDelay: '3s' }} />
        <div className="floating-orb left-1/2 top-1/3 h-24 w-24 bg-white/4" style={{ animationDelay: '6s' }} />

        {activeTab !== 'Assets' ? (
          <div className="relative flex flex-1 overflow-hidden">

            {/* ── Chat column ── */}
            <div className="relative flex flex-1 flex-col overflow-hidden">

              {/* Header */}
              <header className="glass-header px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.24em] ${isLight ? cfg.accentL : cfg.accent}`}>
                      Production Desk
                    </p>
                    <h1 className={`mt-0.5 bg-gradient-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent ${cfg.grad}`}>
                      {activeTab === 'Home' ? 'AI Director Studio' : activeTab === 'Image' ? 'Image Lab' : 'Video Lab'}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isLight ? `${cfg.border} bg-current/5 ${cfg.accentL}` : `${cfg.border} bg-white/5 ${cfg.accent}`
                    }`}>
                      <span className={`h-1.5 w-1.5 animate-pulse rounded-full bg-current`} />
                      Live
                    </span>
                  </div>
                </div>
              </header>

              {/* Feed */}
              <div className="flex-1 overflow-y-auto px-5 pt-5 relative">
                <div className="mx-auto flex max-w-3xl flex-col gap-4">

                  {/* Creative Flow — Home only */}
                  {activeTab === 'Home' && (
                    <div className="cinema-hero soft-panel-hover rounded-[24px] p-5">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-[0.24em] ${isLight ? cfg.accentL : cfg.accent}`}>
                            Creative flow
                          </p>
                          <h2 className={`mt-1.5 text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            Shape the story before the shot.
                          </h2>
                        </div>
                        <div className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold md:flex ${isLight ? `${cfg.border} ${cfg.accentL}` : `${cfg.border} ${cfg.accent}`} bg-white/5`}>
                          <Sparkles size={10} /> Atlas ready
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                        {[{ label: 'Mood', value: 'Cinematic' }, { label: 'Format', value: '4K' }, { label: 'Pipeline', value: 'AI-first' }].map(item => (
                          <div key={item.label} className={`soft-panel-hover rounded-2xl border px-4 py-3 ${isLight ? 'border-black/6 bg-black/4' : 'border-white/6 bg-white/5'}`}>
                            <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isLight ? cfg.accentL : cfg.accent}`}>{item.label}</p>
                            <p className={`mt-1.5 text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {!activeSessionId && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${cfg.grad} shadow-lg ${cfg.shadow}`}>
                        {activeTab === 'Image' ? <ImageIcon size={28} className="text-white" /> : activeTab === 'Video' ? <Video size={28} className="text-white" /> : <Sparkles size={28} className="text-white" />}
                      </div>
                      <p className={`text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Select a chat or start a new one.</p>
                      <button type="button" onClick={() => createSession(activeTab as 'Home' | 'Image' | 'Video')}
                        className={`mt-4 rounded-2xl bg-gradient-to-r ${cfg.grad} px-5 py-2.5 text-sm font-bold text-white shadow-lg ${cfg.shadow} transition hover:-translate-y-0.5`}>
                        Start New Chat
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  {activeMessages.map(msg => (
                    <div key={msg.id} className={`message-shell max-w-[80%] rounded-[22px] px-4 py-3
                      ${msg.role === 'user' ? 'ml-auto glass-msg-user' : 'glass-msg-ai'}`}>
                      {msg.role === 'ai' && (
                        <div className={`mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLight ? cfg.accentL : cfg.accent}`}>
                          <Bot size={11} />
                          {activeTab === 'Home' ? modelLabel(selectedHomeModel) : `Agent ${activeTab}`}
                        </div>
                      )}
                      {msg.imageUrl && (
                        <div className="group relative mb-3 max-w-full">
                          <img src={msg.imageUrl} alt="Result" className="max-h-48 w-full rounded-xl object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = msg.imageUrl!;
                              a.download = `download-${msg.id}.jpg`;
                              a.click();
                            }}
                            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:bg-black/70"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      )}
                      {msg.videoUrl && (
                        <div className="group relative mb-3 max-w-full">
                          <video src={msg.videoUrl} controls className="max-h-64 w-full rounded-xl object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = msg.videoUrl!;
                              a.download = `download-${msg.id}.mp4`;
                              a.click();
                            }}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:bg-black/70"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      )}
                      <div className={`whitespace-pre-wrap text-[14px] leading-[1.75] ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {msg.content}
                      </div>
                      <div className={`mt-2 text-right text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{msg.timestamp}</div>
                    </div>
                  ))}

                  {/* Generating — dot animation */}
                  {isGenerating && (
                    <div className="glass-msg-ai max-w-[80%] rounded-[22px] px-4 py-3.5">
                      <div className={`mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLight ? cfg.accentL : cfg.accent}`}>
                        <Bot size={11} />
                        {activeTab === 'Home' ? modelLabel(selectedHomeModel) : `Agent ${activeTab}`}
                      </div>
                      <div className="flex items-center gap-3">
                        <TypingDots color={activeTab === 'Video' ? 'bg-amber-400' : activeTab === 'Image' ? 'bg-violet-400' : 'bg-cyan-400'} />
                        <span className={`text-[13px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {activeTab === 'Home' ? `${modelLabel(selectedHomeModel)} is thinking…` : 'Sending to Atlas Cloud…'}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Spacer block to prevent collision with absolute prompt bar */}
                  <div ref={feedEndRef} className="h-[260px] w-full shrink-0" />
                </div>
              </div>

              {/* ── Prompt Bar ── */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mx-auto max-w-4xl">
                  
                  {/* Settings Panel is now external */}

                  <div className={`glass-elevated rounded-[24px] p-2 transition-all duration-300 hover:-translate-y-0.5`}>
                    
                    {/* Image Preview */}
                    {refFile && (
                      <div className="relative self-start mb-2 ml-4 mt-2 group">
                        <img 
                          src={refFile.type.startsWith('image') ? URL.createObjectURL(refFile) : ''} 
                          alt="Reference" 
                          className="h-20 rounded-[12px] object-cover border border-white/20 shadow-md transition-opacity duration-200 group-hover:opacity-90"
                        />
                        {refFile.type.startsWith('video') && <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40 rounded-[12px]"><Film size={20}/></span>}
                        <button 
                          type="button"
                          onClick={() => setRefFile(null)}
                          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-transform duration-200 hover:scale-110"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center px-2 pt-2">
                      {/* Upload Button */}
                      <button type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-200 ${
                          isLight ? 'text-slate-500 hover:bg-black/5 hover:text-slate-900' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}>
                        <Plus size={22} className={refFile ? 'text-emerald-400' : ''} />
                      </button>
                      <input type="file" accept="image/*,video/*" ref={fileInputRef} className="hidden" onChange={e => { if (e.target.files?.[0]) setRefFile(e.target.files[0]); }} />

                      {/* Textarea */}
                      <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => handleKeyDown(e, () => {
                          if (generateMode === 'Brief') handleSendHome();
                          else handleSendMedia(generateMode);
                        })}
                        rows={1}
                        placeholder={generateMode === 'Brief' ? 'Ask anything...' : `Describe the ${generateMode.toLowerCase()} you imagine...`}
                        className="prompt-textarea flex-1 bg-transparent px-3 py-2 outline-none resize-none"
                        style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                      />
                    </div>

                    {/* Bottom Controls Row */}
                    <div className="mt-2 flex items-center justify-between px-2 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* Mode Selector Pill */}
                        <div className={`flex items-center rounded-xl p-1 ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                          <button onClick={() => setGenerateMode('Brief')} className={`flex h-8 px-3 items-center justify-center rounded-lg text-xs font-medium transition-all ${generateMode === 'Brief' ? (isLight ? 'bg-white text-slate-900 shadow' : 'bg-[#2a2b36] text-white shadow') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')}`}>
                            <Type size={14} className="mr-1.5" /> Brief
                          </button>
                          <button onClick={() => setGenerateMode('Image')} className={`flex h-8 px-3 items-center justify-center rounded-lg text-xs font-medium transition-all ${generateMode === 'Image' ? (isLight ? 'bg-white text-slate-900 shadow' : 'bg-[#2a2b36] text-white shadow') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')}`}>
                            <Wand2 size={14} className="mr-1.5" /> Image
                          </button>
                          <button onClick={() => setGenerateMode('Video')} className={`flex h-8 px-3 items-center justify-center rounded-lg text-xs font-medium transition-all ${generateMode === 'Video' ? (isLight ? 'bg-white text-slate-900 shadow' : 'bg-[#2a2b36] text-white shadow') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')}`}>
                            <Film size={14} className="mr-1.5" /> Video
                          </button>
                        </div>

                        {/* Model Selector */}
                        {generateMode === 'Brief' ? (
                          <div className="w-56">
                            <CustomSelect
                              label="Model" isLight={isLight}
                              value={selectedHomeModel}
                              onChange={setSelectedHomeModel}
                              options={HOME_MODELS}
                              accentClass={cfg.accent}
                              compact={true}
                            />
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => setShowSettings(true)}
                            className={`flex h-9 items-center gap-2 rounded-xl border px-4 transition-all ${
                              isLight ? 'border-black/8 bg-white text-slate-700 hover:bg-slate-50' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            <Settings size={14} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
                            <span className="text-xs font-semibold truncate max-w-[150px]">
                              {models.find(m => m.id === (generateMode === 'Image' ? selectedImageModel : selectedVideoModel))?.name || 'Select Model'}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Send */}
                      <button type="button"
                        onClick={() => {
                          if (generateMode === 'Brief') handleSendHome();
                          else handleSendMedia(generateMode);
                        }}
                        disabled={isGenerating || (!prompt.trim() && !refFile)}
                        className={`flex h-10 px-6 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${cfg.grad} text-white text-sm font-bold shadow-lg ${cfg.shadow} transition duration-200 hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40`}>
                        Create
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ══ ASSETS ══ */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.22em] ${isLight ? cfg.accentL : cfg.accent}`}>Library</p>
                  <h1 className={`text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Asset Library</h1>
                  <p className={`mt-1.5 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Review your generated images and videos here.</p>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${isLight ? `${cfg.border} ${cfg.accentL}` : `${cfg.border} ${cfg.accent}`} bg-white/5`}>0 assets</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className={`soft-panel-hover flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed ${isLight ? 'border-slate-300/60 text-slate-400' : 'border-white/10 text-slate-600'}`}>
                  <ImageIcon size={28} className="opacity-40" />
                  <span className="text-sm font-medium">No assets generated yet.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        mode={generateMode === 'Brief' ? 'Image' : generateMode}
        models={models}
        selectedModelId={generateMode === 'Image' ? selectedImageModel : selectedVideoModel}
        onSelectModel={(id) => generateMode === 'Image' ? setSelectedImageModel(id) : setSelectedVideoModel(id)}
        isLight={isLight}
        aspectRatio={generateMode === 'Image' ? aspectRatioImg : aspectRatioVid}
        setAspectRatio={(v) => generateMode === 'Image' ? setAspectRatioImg(v) : setAspectRatioVid(v)}
        numOutputs={numOutputsImg}
        setNumOutputs={setNumOutputsImg}
        quality={qualityImg}
        setQuality={setQualityImg}
        duration={durationVid}
        setDuration={setDurationVid}
        negPrompt={negPromptImg}
        setNegPrompt={setNegPromptImg}
        format={formatImg}
        setFormat={setFormatImg}
        guidance={guidanceImg}
        setGuidance={setGuidanceImg}
        steps={stepsImg}
        setSteps={setStepsImg}
        seed={seedImg}
        setSeed={setSeedImg}
        
      />
    </div>
  );
}

export default App;
