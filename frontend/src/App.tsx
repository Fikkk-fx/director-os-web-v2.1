import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Film, Image as ImageIcon, Moon, Sun, Upload, Send, Video,
  Home, FolderKanban, Sparkles, Bot, ChevronDown, Check, LogOut, Trash2, Plus,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';

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
  label: string; value: string; options: SelectOption[];
  onChange: (v: string) => void; isLight: boolean; accentClass: string;
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

/* ── Small reusable label ─────────────────────────────────────── */
function SettingLabel({ children, isLight }: { children: React.ReactNode; isLight: boolean }) {
  return (
    <p className={`mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
      {children}
    </p>
  );
}

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

  /* ── Prompts ── */
  const [promptHome, setPromptHome]   = useState('');
  const [promptImage, setPromptImage] = useState('');
  const [promptVideo, setPromptVideo] = useState('');

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
  const [negPromptImg, setNegPromptImg]     = useState('');
  const [numOutputsImg, setNumOutputsImg]   = useState<number>(1);
  const [formatImg, setFormatImg]           = useState('webp');
  const [qualityImg, setQualityImg]         = useState<number>(80);
  const [guidanceImg, setGuidanceImg]       = useState('');
  const [stepsImg, setStepsImg]             = useState('');
  const [seedImg, setSeedImg]               = useState('');

  /* ── Files ── */
  const [refFileHome, setRefFileHome]   = useState<File | null>(null);
  const [refFileImage, setRefFileImage] = useState<File | null>(null);
  const [refFileVideo, setRefFileVideo] = useState<File | null>(null);
  const fileInputRefHome  = useRef<HTMLInputElement>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
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
    if (!promptHome.trim() && !refFileHome) return;
    if (!activeSessionId) createSession('Home');
    const up = promptHome.trim(); setPromptHome('');
    const tid = activeSessionId!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user',
      content: up || (refFileHome ? 'Sent an image.' : ''),
      imageUrl: refFileHome ? URL.createObjectURL(refFileHome) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('prompt', up); fd.append('model', selectedHomeModel);
      fd.append('history', JSON.stringify(activeSession?.messages.map(m => ({ role: m.role, content: m.content })) ?? []));
      if (refFileHome) fd.append('reference_image', refFileHome);
      const res = await axios.post(`${API_BASE}/api/chat`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: res.data.response, timestamp: new Date().toLocaleTimeString() }]);
      setRefFileHome(null);
    } catch (e: any) {
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `**Error:** ${e.response?.data?.detail || e.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally { setGeneratingSessions(p => ({ ...p, [tid]: false })); }
  };

  const handleSendMedia = async (type: 'Image' | 'Video') => {
    const isImg = type === 'Image';
    const prompt = isImg ? promptImage : promptVideo;
    const refFile = isImg ? refFileImage : refFileVideo;
    const model   = isImg ? selectedImageModel : selectedVideoModel;
    if (!prompt.trim() || !model) return;
    if (!activeSessionId) createSession(type);
    const up = prompt.trim();
    if (isImg) setPromptImage(''); else setPromptVideo('');
    const mdl = models.find(m => m.id === model);
    const tid = activeSessionId!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user', content: up,
      imageUrl: refFile ? URL.createObjectURL(refFile) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('type', type); fd.append('prompt', up); fd.append('model_keyword', model);
      fd.append('aspect_ratio', isImg ? aspectRatioImg : aspectRatioVid);
      if (isImg) {
        if (negPromptImg.trim())  fd.append('negative_prompt',    negPromptImg.trim());
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
      if (isImg) setRefFileImage(null); else setRefFileVideo(null);
    } catch (e: any) {
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `**Error:** ${e.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally { setGeneratingSessions(p => ({ ...p, [tid]: false })); }
  };

  const handleKeyDown = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
  };

  /* ── Computed ── */
  const activeModel = activeTab === 'Image'
    ? models.find(m => m.id === selectedImageModel)
    : models.find(m => m.id === selectedVideoModel);
  const hasParam = (p: string) => activeModel?.supported_params?.includes(p) ?? false;

  const RATIO_OPTIONS: SelectOption[] = ['16:9','9:16','1:1','21:9','4:3','3:4'].map(r => ({ value: r, label: r }));

  /* ── Helpers ── */
  const navItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: 'Home',   label: 'Home',   icon: Home         },
    { id: 'Image',  label: 'Image',  icon: ImageIcon    },
    { id: 'Video',  label: 'Video',  icon: Video        },
    { id: 'Assets', label: 'Assets', icon: FolderKanban },
  ];

  const tabCfg = (id: TabKey) => TAB_CFG[id];

  const inputCls = `glass-input w-full`;

  /* ════════════════ RENDER ════════════════ */
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
                <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-48">

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
                      {msg.imageUrl && <img src={msg.imageUrl} alt="Reference" className="mb-3 max-h-48 w-full rounded-xl object-cover" />}
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
                  <div ref={feedEndRef} />
                </div>
              </div>

              {/* ── Prompt Bar ── */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mx-auto max-w-3xl">
                  <div className={`glass-elevated rounded-[24px] p-3 transition-all duration-300 hover:-translate-y-0.5`}>

                    {/* Home: model chip */}
                    {activeTab === 'Home' && (
                      <div className="mb-2.5 flex items-center gap-2">
                        <div className="glass-chip flex items-center rounded-full">
                          <CustomSelect
                            label="Model" isLight={isLight}
                            value={selectedHomeModel} onChange={setSelectedHomeModel}
                            options={HOME_MODELS} accentClass={cfg.accent}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-end gap-2.5">
                      {/* Upload */}
                      <button type="button"
                        onClick={() => {
                          if (activeTab === 'Home')  fileInputRefHome.current?.click();
                          if (activeTab === 'Image') fileInputRefImage.current?.click();
                          if (activeTab === 'Video') fileInputRefVideo.current?.click();
                        }}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition duration-200 hover:-translate-y-0.5 ${
                          isLight ? 'border-black/8 bg-black/5 text-slate-600 hover:bg-black/10 hover:text-slate-900' : 'border-white/10 bg-white/6 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}>
                        <Upload size={16} className={
                          (activeTab === 'Home' && refFileHome) || (activeTab === 'Image' && refFileImage) || (activeTab === 'Video' && refFileVideo)
                            ? 'text-emerald-400' : ''
                        } />
                      </button>

                      <input type="file" accept="image/*" ref={fileInputRefHome}  className="hidden" onChange={e => { if (e.target.files?.[0]) setRefFileHome(e.target.files[0]); }} />
                      <input type="file" accept="image/*" ref={fileInputRefImage} className="hidden" onChange={e => { if (e.target.files?.[0]) setRefFileImage(e.target.files[0]); }} />
                      <input type="file" accept="image/*" ref={fileInputRefVideo} className="hidden" onChange={e => { if (e.target.files?.[0]) setRefFileVideo(e.target.files[0]); }} />

                      {/* ── Textarea — FIXED color ── */}
                      <textarea
                        value={activeTab === 'Home' ? promptHome : activeTab === 'Image' ? promptImage : promptVideo}
                        onChange={e => {
                          if (activeTab === 'Home')  setPromptHome(e.target.value);
                          if (activeTab === 'Image') setPromptImage(e.target.value);
                          if (activeTab === 'Video') setPromptVideo(e.target.value);
                        }}
                        onKeyDown={e => handleKeyDown(e, () => {
                          if (activeTab === 'Home')  handleSendHome();
                          if (activeTab === 'Image') handleSendMedia('Image');
                          if (activeTab === 'Video') handleSendMedia('Video');
                        })}
                        rows={1}
                        placeholder={`Message ${activeTab === 'Home' ? modelLabel(selectedHomeModel) : `Agent ${activeTab}`}…`}
                        className="prompt-textarea flex-1"
                        style={{
                          color: isLight ? '#0f172a' : '#f8fafc',
                          background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                          border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.10)',
                        }}
                      />

                      {/* Send */}
                      <button type="button"
                        onClick={() => {
                          if (activeTab === 'Home')  handleSendHome();
                          if (activeTab === 'Image') handleSendMedia('Image');
                          if (activeTab === 'Video') handleSendMedia('Video');
                        }}
                        disabled={isGenerating || (
                          activeTab === 'Home'  ? !promptHome.trim()  && !refFileHome :
                          activeTab === 'Image' ? !promptImage.trim() : !promptVideo.trim()
                        )}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${cfg.grad} text-white shadow-lg ${cfg.shadow} transition duration-200 hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40`}>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ SETTINGS PANEL ══ */}
            {(activeTab === 'Image' || activeTab === 'Video') && (
              <div className="glass-settings flex w-[284px] shrink-0 flex-col overflow-y-auto p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.grad} shadow-md ${cfg.shadow}`}>
                    {activeTab === 'Image' ? <ImageIcon size={13} className="text-white" /> : <Video size={13} className="text-white" />}
                  </div>
                  <h3 className={`text-[10px] font-bold uppercase tracking-[0.22em] ${isLight ? cfg.accentL : cfg.accent}`}>
                    {activeTab} Settings
                  </h3>
                </div>

                {/* Model */}
                <div className="mb-4">
                  <SettingLabel isLight={isLight}>Active Model</SettingLabel>
                  <select className={inputCls}
                    value={activeTab === 'Image' ? selectedImageModel : selectedVideoModel}
                    onChange={e => { activeTab === 'Image' ? setSelectedImageModel(e.target.value) : setSelectedVideoModel(e.target.value); }}>
                    {models.filter(m => m.type === activeTab).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Ratio */}
                {hasParam('aspect_ratio') && (
                  <div className="mb-4">
                    <SettingLabel isLight={isLight}>Aspect Ratio</SettingLabel>
                    <select className={inputCls}
                      value={activeTab === 'Image' ? aspectRatioImg : aspectRatioVid}
                      onChange={e => { activeTab === 'Image' ? setAspectRatioImg(e.target.value) : setAspectRatioVid(e.target.value); }}>
                      {RATIO_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                )}

                {/* Duration */}
                {activeTab === 'Video' && (
                  <div className="mb-4">
                    <SettingLabel isLight={isLight}>Duration</SettingLabel>
                    <select className={inputCls} value={durationVid} onChange={e => setDurationVid(e.target.value)}>
                      {['5s','10s','15s','30s'].map(d => <option key={d} value={d}>{d.replace('s',' sec')}</option>)}
                    </select>
                  </div>
                )}

                {/* Advanced Image */}
                {activeTab === 'Image' && (
                  <div className={`mt-1 space-y-3.5 border-t pt-4 ${isLight ? 'border-black/6' : 'border-white/8'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.22em] ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>Advanced</p>

                    {hasParam('negative_prompt') && (
                      <div>
                        <SettingLabel isLight={isLight}>Negative Prompt</SettingLabel>
                        <textarea className={`${inputCls} min-h-[56px]`} value={negPromptImg}
                          onChange={e => setNegPromptImg(e.target.value)} placeholder="Ugly, blurry, distorted…" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {hasParam('num_outputs')    && <div><SettingLabel isLight={isLight}>Outputs</SettingLabel><input type="number" min={1} max={4} className={inputCls} value={numOutputsImg} onChange={e => setNumOutputsImg(parseInt(e.target.value)||1)} /></div>}
                      {hasParam('output_format')  && <div><SettingLabel isLight={isLight}>Format</SettingLabel><select className={inputCls} value={formatImg} onChange={e => setFormatImg(e.target.value)}><option value="webp">WebP</option><option value="png">PNG</option><option value="jpg">JPG</option></select></div>}
                      {hasParam('output_quality') && <div><SettingLabel isLight={isLight}>Quality</SettingLabel><input type="number" min={1} max={100} className={inputCls} value={qualityImg} onChange={e => setQualityImg(parseInt(e.target.value)||80)} /></div>}
                      {hasParam('seed')           && <div><SettingLabel isLight={isLight}>Seed</SettingLabel><input type="number" className={inputCls} placeholder="Random" value={seedImg} onChange={e => setSeedImg(e.target.value)} /></div>}
                      {hasParam('guidance_scale') && <div><SettingLabel isLight={isLight}>CFG Scale</SettingLabel><input type="number" step={0.1} className={inputCls} placeholder="Default" value={guidanceImg} onChange={e => setGuidanceImg(e.target.value)} /></div>}
                      {hasParam('num_inference_steps') && <div><SettingLabel isLight={isLight}>Steps</SettingLabel><input type="number" className={inputCls} placeholder="Default" value={stepsImg} onChange={e => setStepsImg(e.target.value)} /></div>}
                    </div>
                  </div>
                )}

                <div className={`mt-auto pt-5 text-[11px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                  <strong className={`${isLight ? cfg.accentL : cfg.accent}`}>Tip:</strong> Click Upload to attach a reference image before generating.
                </div>
              </div>
            )}
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
    </div>
  );
}

export default App;
