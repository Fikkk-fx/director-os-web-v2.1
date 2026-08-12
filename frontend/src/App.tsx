import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Film, Image as ImageIcon, Moon, Sun, Video, Type, Wand2,
  Home, FolderKanban, Sparkles, Bot, ChevronDown, Check, Trash2, Plus, X, Download, Settings,
} from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';

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

/* ── Simple inline Markdown renderer (no library needed) ─────────── */
function MarkdownText({ text, isLight }: { text: string; isLight: boolean }) {
  const lines = text.split('\n');
  const codeClass = isLight
    ? 'bg-slate-100 text-slate-800 rounded px-1 font-mono text-[12px]'
    : 'bg-white/10 text-slate-200 rounded px-1 font-mono text-[12px]';
  const preClass = isLight
    ? 'bg-slate-100 text-slate-800 rounded-xl p-3 font-mono text-[12px] overflow-x-auto my-2'
    : 'bg-black/30 text-slate-200 rounded-xl p-3 font-mono text-[12px] overflow-x-auto my-2';
  const h2Class = `font-bold text-base mt-3 mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`;
  const h3Class = `font-bold text-[13px] mt-2 mb-0.5 ${isLight ? 'text-slate-800' : 'text-slate-100'}`;
  const hrClass = `my-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`;
  const tableClass = `w-full text-[12px] my-2 border-collapse`;

  function renderInline(s: string): React.ReactNode {
    // Replace **bold**, *italic*, `code`
    const parts = s.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('`') && p.endsWith('`') && p.length > 2)
        return <code key={i} className={codeClass}>{p.slice(1,-1)}</code>;
      if (p.startsWith('**') && p.endsWith('**') && p.length > 4)
        return <strong key={i}>{p.slice(2,-2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*') && p.length > 2)
        return <em key={i}>{p.slice(1,-1)}</em>;
      return <span key={i}>{p}</span>;
    });
  }

  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Code block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]); i++;
      }
      elements.push(<pre key={i} className={preClass}><code>{codeLines.join('\n')}</code></pre>);
      i++; continue;
    }
    // Table
    if (line.includes('|') && lines[i+1]?.match(/^\s*\|[-| ]+\|\s*$/)) {
      const headers = line.split('|').map(c => c.trim()).filter(Boolean);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean));
        i++;
      }
      elements.push(
        <table key={i} className={tableClass}>
          <thead><tr>{headers.map((h,j) => <th key={j} className={`text-left pb-1 pr-3 font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'} border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} className={`py-0.5 pr-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      );
      continue;
    }
    // HR
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={i} className={hrClass} />); i++; continue;
    }
    // H2
    if (line.startsWith('## ')) {
      elements.push(<p key={i} className={h2Class}>{renderInline(line.slice(3))}</p>); i++; continue;
    }
    // H3
    if (line.startsWith('### ')) {
      elements.push(<p key={i} className={h3Class}>{renderInline(line.slice(4))}</p>); i++; continue;
    }
    // Empty line
    if (line.trim() === '') {
      elements.push(<br key={i} />); i++; continue;
    }
    // Normal
    elements.push(<p key={i} className="leading-[1.75] text-[14px] mb-0">{renderInline(line)}</p>);
    i++;
  }
  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

/* ── Demo session — end-to-end 4-Turn workflow example ──────────── */
const DEMO_SESSION: ChatSession = {
  id: 'demo-v1',
  title: 'Contoh: Filmmaker Jakarta',
  tab: 'Home',
  updatedAt: Date.now() - 2000000,
  messages: [
    {
      id: 'dm1', role: 'user',
      content: 'Buat video cinematic tentang seorang filmmaker muda di Jakarta yang berjuang mewujudkan film pertamanya.',
      timestamp: '09:00 AM',
    },
    {
      id: 'dm2', role: 'ai',
      content: `**[VISION-SKILL REASONING]**
Tema: Perjuangan kreator muda — universal, emosional, relatable.
Genre: Coming-of-age Drama / Indie Arthouse.

**[SYS-LOG: RNG INITIATIVE]**
- Rolled Location: Gang sempit Kemang lama, Jakarta Selatan
- Rolled Wardrobe: Kemeja linen lusuh, kamera film 16mm vintage
- Rolled Camera: Dirty Medium OTS + Step-Printing slow motion
- Rolled Lighting: Deakins Practical Chiaroscuro (satu bohlam pijar)

---

**[PHASE 0 GATEWAY — PILIH STYLE]**

**Opsi 1 — "Sinema Realisme Sosial"**
Gaya Kamila Andini. Raw, membumi. Flat kumuh di atas bukit Menteng Atas. Cahaya satu bohlam pijar.

**Opsi 2 — "Indie Noir Jakarta"**
Gaya Wong Kar-Wai × Wim Umboh. Jazz mengalir pelan. Kemang malam hujan. Step-printing di gang sempit.

**Opsi 3 — "Arthouse Ekspresionisme"**
Gaya Tarkovsky. Kamera diam total. Atap gedung tua, cakrawala Jakarta berkilauan, narasi VO puitis.

---
🛑 **MANDATORY HARD STOP (TURN 1 COMPLETE)**
Ketik **1**, **2**, atau **3** untuk memilih style.`,
      timestamp: '09:00 AM',
    },
    {
      id: 'dm3', role: 'user',
      content: '2',
      timestamp: '09:01 AM',
    },
    {
      id: 'dm4', role: 'ai',
      content: `## FASE 1 — NASKAH SCREENPLAY
**Style: Indie Noir Jakarta (Wong Kar-Wai × Wim Umboh)**

---

### KLIP 1 [0s–10s] — "THE FILMMAKER'S PRAYER"

- **Lokasi:** Gang sempit Kemang lama, Jakarta Selatan — malam hujan
- **Karakter:** RAKA (24), filmmaker muda — linen lusuh, Bolex H16 di leher

\`\`\`
[0s-3s] Raka berdiri diam di bawah atap seng. Hujan memercik di depannya.
         Jari menekan-nekan dial aperture kamera — klik, klik, klik.

[3s-6s] PAMAN (OS): "Raka, udah jam berapa ini? Pulang dulu lah."

[6s-10s] Raka menutup mata. Satu helaan napas panjang.
          RAKA (pelan): "Sebentar lagi, Paman. Sebentar lagi."
\`\`\`

---

### KLIP 2 [0s–10s] — "THE LAST ROLL"

\`\`\`
[0s-4s] Step-printing slow motion. Raka berjalan di gang yang basah.
         Pantulan cahaya warung di genangan air. Kamera terangkat — ia merekam.

[4s-7s] CLOSE-UP: wajah nenek tua di balik gerobak nasi goreng. Senyum ompong kaya raya.
         Raka merekam. Mata berkaca-kaca tapi senyum tersungging.

[7s-10s] MACRO INSERT: Roll film terakhir di tangannya.
          Label tulisan tangan: "ROLL 12 — TERAKHIR"
\`\`\`

---

🛑 **MANDATORY HARD STOP (TURN 2 COMPLETE — PHASE 1 SCRIPT)**
Ketik **ACC Naskah** atau **Lanjut** untuk menyetujui naskah.`,
      timestamp: '09:01 AM',
    },
    {
      id: 'dm5', role: 'user',
      content: 'ACC Naskah',
      timestamp: '09:02 AM',
    },
    {
      id: 'dm6', role: 'ai',
      content: `## FASE 2 & 3 — SPATIAL BLUEPRINT & ASSET SPECS

---

### SPATIAL BLUEPRINT V2 — Gang Kemang Lama

**[NORTH]** Tembok bata merah, cat mengelupas, lumut hijau di nat bawah
**[SOUTH]** Warung nasi goreng — neon "ES JERUK" kuning-oranye
**[EAST]** Gang berlanjut ke kegelapan, cahaya jalan 30m jauhnya
**[FLOOR]** Aspal retak dengan genangan air memantulkan neon

---

### CharSheet — RAKA

\`\`\`
3-panel casting reference on pure white background. Indonesian male, 24yo,
sun-darkened warm brown skin, deep-set eyes, faint stubble. Cream linen shirt
(2 buttons open), navy trousers, rubber sandals. Bolex H16 camera on neck strap.
Shot on iPhone 15 Pro 24mm f/1.7, zero airbrushing. --ar 16:9 --style raw
\`\`\`

---

### EnvSheet — Gang Kemang Lama

\`\`\`
Narrow Jakarta alley (gang), Kemang, circa 1990s. Night, heavy rain.
Red brick walls with peeling white paint. Neon-lit warung on right.
Wet asphalt reflecting orange-yellow neon. Single tungsten bulb at entrance.
Shot on Kodak Portra 400 film. --ar 16:9 --style raw
\`\`\`

---

🛑 **MANDATORY HARD STOP (TURN 3 COMPLETE)**
Ketik **ACC Assets** atau **Lanjut** untuk output FASE 4 & 5 (Prompt Video + Storyboard).`,
      timestamp: '09:02 AM',
    },
    {
      id: 'dm7', role: 'user',
      content: 'ACC Assets',
      timestamp: '09:03 AM',
    },
    {
      id: 'dm8', role: 'ai',
      content: `## FASE 4 — MASTER VIDEO PROMPT

---

### KLIP 1 — "THE FILMMAKER'S PRAYER"

\`\`\`
[PROSE & IN-LINE SPATIAL & GLOBAL LOCK]: [0s-3s] [NIGHT, KEMANG GANG]
In an organic human-held medium shot, Raka (@image_char) — 24yo Indonesian
male in wrinkled cream linen shirt, single Bolex H16 16mm camera hanging
on neck — stands frozen under corrugated tin roof, heavy rain curtain
in foreground, warm orange neon warung glow bleeding onto wet asphalt
midground. [3s-6s] [RACK FOCUS] Fingers press aperture dial in rhythmic
clicks. Off-screen voice cuts through rain. [6s-10s] Eyes close one beat.
Single slow exhale. Raka speaking quietly in fluent Indonesian: "Sebentar
lagi, Paman. Sebentar lagi." [LOCK: cream linen + navy trousers | gang:
red brick, wet asphalt, single tungsten | zero duplicate characters]

[ACTING & LIGHTING SCIENCE]: Wong Kar-Wai intimate social realism. Calm
grounded gaze, occasional single eyelid motion every 4-5s. Warm Indonesian
skin, velvet complexion, zero speckling. Deakins Practical Chiaroscuro:
single 2800K tungsten key, deep shadow separation, natural rain diffusion.
32-bit float audio, rain ambience, clear vocal headroom. [COLOR GRADE]:
Kodak Portra warm shadows, muted cyan-green midtones, deep blacks.

[CAMERA SCIENCE & KINETIC PHYSICS]: [SUBJECT MOTION: static breath, finger
clicks on aperture] [CAMERA MOTION: human-held shoulder-rig, gentle breath
sway, 24fps, 180-degree shutter]. Panavision DXL2, Primo 70, Light Iron
Color 3, f/1.4 creamy bokeh. Real-time 1.0x. Zero duplicates.
\`\`\`

---

## FASE 5 — AUDIT CLEARANCE

| # | Check | Status |
|---|-------|--------|
| 1 | Action-First <3s | ✅ |
| 2 | Single-Tag Reference | ✅ |
| 3 | Full-Body Wardrobe Lock | ✅ |
| 4 | Spatial Blueprint V2 | ✅ |
| 5 | Deakins Practical Light | ✅ |
| 6 | Char Cap ≤1950 | ✅ ~1,842 |

**🎬 FINAL DELIVERY COMPLETE — Prompt siap di-generate di Kling/Seedance/Sora.**`,
      timestamp: '09:03 AM',
    },
  ],
};

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
    try {
      const s = localStorage.getItem('chat_sessions');
      if (s) { const parsed = JSON.parse(s); return parsed.length > 0 ? parsed : [DEMO_SESSION]; }
      return [DEMO_SESSION];
    }
    catch { return [DEMO_SESSION]; }
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
  const [selectedImageModel, setSelectedImageModel] = useState('openai/gpt-image-2/text-to-image');
  const [selectedVideoModel, setSelectedVideoModel] = useState('bytedance/seedance-2.5/text-to-video');
  const [selectedHomeModel, setSelectedHomeModel]   = useState('openai/gpt-5.6-sol');

  /* ── Generated Assets ── */
  const [assets, setAssets] = useState<Array<{id: string; type: 'Image'|'Video'; url: string; prompt: string; model: string; modelName: string; ts: string}>>(() => {
    try { const s = localStorage.getItem('director_assets'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem('director_assets', JSON.stringify(assets)); }, [assets]);

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
  const [resolution, setResolution]         = useState('1080p');
  const [generateAudio, setGenerateAudio]   = useState(false);
  const [hd, setHd]                         = useState(false);
  const [stylize, setStylize]               = useState(0);
  const [motion, setMotion]                 = useState("low");
  const [chaos, setChaos]                   = useState(0);
  const [weird, setWeird]                   = useState(0);
  const [sref, setSref]                     = useState('');
  const [watermark, setWatermark]           = useState(false);
  const [returnLastFrame, setReturnLastFrame] = useState(false);
  const [thinkingLevel, setThinkingLevel]   = useState('default');
  const [mediaResolution, setMediaResolution] = useState('default');

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
      // Explicit defaults — validate they exist in catalogue
      const DEFAULT_IMAGE = 'openai/gpt-image-2/text-to-image';
      const DEFAULT_VIDEO = 'bytedance/seedance-2.5/text-to-video';
      const imgExists = res.data.models.some((m: any) => m.id === DEFAULT_IMAGE);
      const vidExists = res.data.models.some((m: any) => m.id === DEFAULT_VIDEO);
      if (!imgExists) {
        const fi = res.data.models.find((m: any) => m.type === 'Image');
        if (fi) setSelectedImageModel(fi.id);
      }
      if (!vidExists) {
        const fv = res.data.models.find((m: any) => m.type === 'Video');
        if (fv) setSelectedVideoModel(fv.id);
      }
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
    const mdl = models.find((m: any) => m.id === model);
    const supported: string[] = mdl?.supported_params ?? [];
    const has = (p: string) => supported.includes(p);
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
      fd.append('type', type);
      fd.append('prompt', up);
      fd.append('model_keyword', model);

      // aspect_ratio — for Kling, Google, Imagen4 (uses aspect_ratio)
      // ratio — for ByteDance, Wan, MiniMax (backend maps aspect_ratio form field → payload 'ratio')
      const ar = isImg ? aspectRatioImg : aspectRatioVid;
      if (has('aspect_ratio') || has('ratio')) fd.append('aspect_ratio', ar);
      if (!isImg && has('duration')) fd.append('duration', durationVid);

      // Only append params supported by this model
      if (has('negative_prompt') && negPromptImg.trim()) fd.append('negative_prompt', negPromptImg.trim());
      if (has('guidance_scale')  && guidanceImg)         fd.append('guidance_scale', guidanceImg);
      if (has('seed')            && seedImg)             fd.append('seed', seedImg);
      if (has('resolution')      && resolution)          fd.append('resolution', resolution);
      if (has('num_outputs')     && numOutputsImg > 1)   fd.append('num_outputs', numOutputsImg.toString());
      if (has('output_format')   && formatImg !== 'webp')fd.append('output_format', formatImg);
      // quality (OpenAI string) — send as output_quality int, backend maps to string
      if (has('quality')         && qualityImg !== 80)   fd.append('output_quality', qualityImg.toString());
      if (has('output_quality')  && qualityImg !== 80)   fd.append('output_quality', qualityImg.toString());
      if (has('num_inference_steps') && stepsImg)        fd.append('num_inference_steps', stepsImg);
      if (has('hd')              && hd)                  fd.append('hd', String(hd));
      if (has('stylize')         && stylize !== 0)       fd.append('stylize', String(stylize));
      if (has('motion')          && motion)              fd.append('motion', motion);
      if (has('chaos')           && chaos !== 0)         fd.append('chaos', String(chaos));
      if (has('weird')           && weird !== 0)         fd.append('weird', String(weird));
      if (has('sref')            && sref)                fd.append('sref', sref);
      if (has('thinking_level')  && thinkingLevel !== 'default') fd.append('thinking_level', thinkingLevel);
      if (has('media_resolution')&& mediaResolution !== 'default') fd.append('media_resolution', mediaResolution);
      // generate_audio for Google Veo; sound for Kling — both mapped from same UI toggle
      if (has('generate_audio') || has('sound'))         fd.append('generate_audio', String(generateAudio));
      if (has('watermark')       && watermark)           fd.append('watermark', String(watermark));
      if (has('return_last_frame')&& returnLastFrame)    fd.append('return_last_frame', String(returnLastFrame));

      if (refFile && mdl?.supports_image) fd.append('reference_file', refFile);

      const res = await axios.post(`${API_BASE}/api/atlas/generate`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const predId = res.data.prediction_id;
      const modelName = res.data.model_name || mdl?.name || model;

      setRefFile(null);
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai',
        content: `**Generating ${type}...**\n*Model: ${modelName}*\n\nID: \`${predId}\`\nPolling for result...`,
        timestamp: new Date().toLocaleTimeString(),
      }]);

      // Poll Atlas status until completed or failed
      let attempts = 0;
      const maxAttempts = 60; // ~5 min at 5s intervals
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await axios.get(`${API_BASE}/api/atlas/status/${predId}`);
          const { status, output } = statusRes.data;
          // Normalize output — Atlas may return a string or array of URLs
          const outputUrl: string | null = Array.isArray(output)
            ? (output.length > 0 ? output[0] : null)
            : (output || null);

          if (status === 'completed' || status === 'succeeded' || outputUrl) {
            clearInterval(pollInterval);
            setGeneratingSessions(p => ({ ...p, [tid]: false }));

            if (outputUrl) {
              // Add to assets
              setAssets(prev => [{
                id: predId,
                type: type as 'Image' | 'Video',
                url: outputUrl,
                prompt: up,
                model: model,
                modelName,
                ts: new Date().toLocaleTimeString(),
              }, ...prev]);
              updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai',
                content: `✅ **${type} ready!** Check the Assets tab to view your result.`,
                timestamp: new Date().toLocaleTimeString(),
              }]);
            } else {
              updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai',
                content: `✅ **${type} submitted.** No output URL returned — check Atlas dashboard.`,
                timestamp: new Date().toLocaleTimeString(),
              }]);
            }
          } else if (status === 'failed' || status === 'error') {
            clearInterval(pollInterval);
            setGeneratingSessions(p => ({ ...p, [tid]: false }));
            updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai',
              content: `❌ **Generation failed.** Atlas status: ${status}`,
              timestamp: new Date().toLocaleTimeString(),
            }]);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setGeneratingSessions(p => ({ ...p, [tid]: false }));
            updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai',
              content: `⏳ **Generation timed out.** ID: \`${predId}\` — still may complete on Atlas.`,
              timestamp: new Date().toLocaleTimeString(),
            }]);
          }
        } catch {
          // Network hiccup — keep polling
        }
      }, 5000);

    } catch (e: any) {
      const detail = e.response?.data?.detail || e.message;
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai',
        content: `❌ **Error:** ${detail}`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setGeneratingSessions(p => ({ ...p, [tid]: false }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); }
  };

  /* ── Classes & Styling ────────────────────────────────────────── */
  const navItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: 'Home',   label: 'Home',      icon: Home         },
    { id: 'Assets', label: 'Assets',    icon: FolderKanban },
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
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center`}>
                    {s.tab === 'Image' ? <ImageIcon size={10} className={activeSessionId === s.id ? (isLight ? tc.accentL : tc.accent) : ''} /> :
                     s.tab === 'Video' ? <Video size={10} className={activeSessionId === s.id ? (isLight ? tc.accentL : tc.accent) : ''} /> :
                     <Home size={10} className={activeSessionId === s.id ? (isLight ? tc.accentL : tc.accent) : ''} />}
                  </span>
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
                      <div className={`text-[14px] ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {msg.role === 'ai' ? <MarkdownText text={msg.content} isLight={isLight} /> : <span className="whitespace-pre-wrap leading-[1.75]">{msg.content}</span>}
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

                  {/* Powered by Atlas Cloud */}
                  <p className={`mt-2 text-center text-[10px] font-medium tracking-wide select-none ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Powered by&nbsp;
                    <a
                      href="https://atlascloud.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-semibold transition-colors duration-200 ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Atlas Cloud
                    </a>
                  </p>
              </div>
            </div>
          </div>
        ) : (
          /* ══ ASSETS ══ */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.22em] ${isLight ? cfg.accentL : cfg.accent}`}>Library</p>
                  <h1 className={`text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Asset Library</h1>
                  <p className={`mt-1.5 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Generated images and videos from this session.</p>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${isLight ? `${cfg.border} ${cfg.accentL}` : `${cfg.border} ${cfg.accent}`} bg-white/5`}>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
              </div>

              {assets.length === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className={`soft-panel-hover flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed ${isLight ? 'border-slate-300/60 text-slate-400' : 'border-white/10 text-slate-600'}`}>
                    <ImageIcon size={28} className="opacity-40" />
                    <span className="text-sm font-medium">No assets yet — generate something!</span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {assets.map(asset => (
                    <div key={asset.id} className={`group relative overflow-hidden rounded-[22px] border ${isLight ? 'border-black/8 bg-white' : 'border-white/8 bg-white/4'} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                      {/* Media */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                        {asset.type === 'Video' ? (
                          <video
                            src={asset.url}
                            controls
                            className="h-full w-full object-cover"
                            poster=""
                          />
                        ) : (
                          <img
                            src={asset.url}
                            alt={asset.prompt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        {/* Download button */}
                        <a
                          href={asset.url}
                          download={`director-os-${asset.type.toLowerCase()}-${asset.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:bg-black/80"
                        >
                          <Download size={14} />
                        </a>
                        {/* Type badge */}
                        <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${asset.type === 'Video' ? 'bg-orange-500/90 text-white' : 'bg-violet-500/90 text-white'}`}>
                          {asset.type}
                        </span>
                      </div>
                      {/* Meta */}
                      <div className="p-4">
                        <p className={`text-xs font-semibold line-clamp-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{asset.prompt}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{asset.modelName}</span>
                          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{asset.ts}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
        resolution={resolution}
        setResolution={setResolution}
        generateAudio={generateAudio}
        setGenerateAudio={setGenerateAudio}
        hd={hd}
        setHd={setHd}
        stylize={stylize}
        setStylize={setStylize}
        motion={motion}
        setMotion={setMotion}
        chaos={chaos}
        setChaos={setChaos}
        weird={weird}
        setWeird={setWeird}
        sref={sref}
        setSref={setSref}
        watermark={watermark}
        setWatermark={setWatermark}
        returnLastFrame={returnLastFrame}
        setReturnLastFrame={setReturnLastFrame}
        thinkingLevel={thinkingLevel}
        setThinkingLevel={setThinkingLevel}
        mediaResolution={mediaResolution}
        setMediaResolution={setMediaResolution}
      />
    </div>
  );
}

export default App;
