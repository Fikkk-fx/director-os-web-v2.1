import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, Check, Star, Monitor, Smartphone, LayoutDashboard, LayoutTemplate, Shuffle, BarChart2, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'Image' | 'Video';
  models: any[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  isLight: boolean;
  
  // Settings State
  aspectRatio: string;
  setAspectRatio: (v: string) => void;
  numOutputs: number;
  setNumOutputs: (v: number) => void;
  quality: number;
  setQuality: (v: number) => void;
duration: string;
  setDuration: (v: string) => void;
  negPrompt: string;
  setNegPrompt: (v: string) => void;
  format: string;
  setFormat: (v: string) => void;
  guidance: string;
  setGuidance: (v: string) => void;
  steps: string;
  setSteps: (v: string) => void;
  seed: string;
  setSeed: (v: string) => void;
  hasParam: (param: string) => boolean;
}

const ProviderIcon = ({ provider, size = 18 }: { provider: string, size?: number }) => {
  if (provider === 'OpenAI') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829 14.6174 7.2144a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
  if (provider === 'Google') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.907 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
  if (provider === 'ByteDance') return <BarChart2 size={size} />;
  if (provider === 'Stability AI') return <span className="font-extrabold text-sm tracking-tighter">S.</span>;
  if (provider === 'ImagineArt') return <Zap size={size} />;
  return <Star size={size} />;
};

export function SettingsModal({
  isOpen, onClose, mode, models, selectedModelId, onSelectModel, isLight,
  aspectRatio, setAspectRatio,
  numOutputs, setNumOutputs,
quality, setQuality,
  duration, setDuration,
  negPrompt, setNegPrompt,
  format, setFormat,
  guidance, setGuidance,
  steps, setSteps,
  seed, setSeed,
  hasParam
}: SettingsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [promptEnhancer, setPromptEnhancer] = useState(false);
  const [resolutionPreset, setResolutionPreset] = useState('1K');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [isProviderOpen, setIsProviderOpen] = useState(false);

  const getProvider = (_id: string, name?: string) => {
    if (!name) return 'Other';
    const n = name.toLowerCase();
    if (n.includes('gpt') || n.includes('openai')) return 'OpenAI';
    if (n.includes('gemini') || n.includes('nano')) return 'Google';
    if (n.includes('seedream') || n.includes('seedance') || n.includes('kling') || n.includes('bytedance')) return 'ByteDance';
    if (n.includes('flux') || n.includes('stable') || n.includes('sd')) return 'Stability AI';
    if (n.includes('imagineart')) return 'ImagineArt';
    return 'Other';
  };

  const hardcodedProviders = ['All', 'OpenAI', 'Google', 'ByteDance', 'Stability AI', 'ImagineArt'];
  const uniqueProviders = hardcodedProviders;

  const filteredModels = useMemo(() => {
    let filtered = models.filter(m => m.type === mode);
    if (searchQuery) {
      filtered = filtered.filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m.id || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedProvider !== 'All') {
      filtered = filtered.filter(m => getProvider(m.id, m.name) === selectedProvider);
    }
    return filtered;
  }, [models, mode, searchQuery, selectedProvider]);

  if (!isOpen) return null;

  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#1e1e24] text-slate-100';
  const bgPanel = isLight ? 'bg-slate-50' : 'bg-[#151519]';
  const borderCol = isLight ? 'border-slate-200' : 'border-white/10';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const btnHover = isLight ? 'hover:bg-slate-200' : 'hover:bg-white/5';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`relative flex w-full max-w-5xl h-[80vh] max-h-[800px] flex-col rounded-[24px] overflow-hidden shadow-2xl ${bgModal}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderCol}`}>
          <h2 className="text-xl font-bold tracking-wide">Settings</h2>
          <button onClick={onClose} className={`rounded-full p-1.5 transition-colors ${btnHover}`}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT PANE: Models */}
          <div className={`w-1/2 flex flex-col border-r ${borderCol} ${bgPanel}`}>
            
            {/* Filters Row */}
            <div className="p-5 flex items-center gap-3">
              <div className={`flex-1 flex items-center rounded-xl border ${borderCol} px-3 py-1.5 ${isLight ? 'bg-white' : 'bg-[#1e1e24]'}`}>
                <Search size={16} className={textMuted} />
                <input 
                  type="text" 
                  placeholder="Search models" 
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsProviderOpen(!isProviderOpen)}
                  className={`flex items-center gap-1 rounded-xl border ${borderCol} px-4 py-2 text-sm font-medium ${isLight ? 'bg-white hover:bg-slate-50' : 'bg-[#1e1e24] hover:bg-white/5'}`}
                >
                  {selectedProvider === 'All' ? 'Providers' : selectedProvider} <ChevronDown size={14} />
                </button>
                {isProviderOpen && (
                  <div className={`absolute top-11 right-0 z-50 min-w-[200px] rounded-xl border ${borderCol} p-2 shadow-xl ${isLight ? 'bg-white' : 'bg-[#1e1e24]'}`}>
                    {uniqueProviders.map(prov => (
                      <button
                        key={prov}
                        onClick={() => { setSelectedProvider(prov); setIsProviderOpen(false); }}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          selectedProvider === prov 
                            ? (isLight ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white') 
                            : (isLight ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 hover:bg-white/5')
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {prov === 'All' && <Shuffle size={14} />}
                          {prov === 'OpenAI' && <span className="font-bold text-xs">AI</span>}
                          {prov === 'Google' && <span className="font-bold text-xs">G</span>}
                          {prov === 'ByteDance' && <BarChart2 size={14} />}
                          {prov === 'Stability AI' && <span className="font-bold text-xs">S.</span>}
                          {prov === 'ImagineArt' && <Zap size={14} />}
                          {prov !== 'All' && prov !== 'OpenAI' && prov !== 'Google' && prov !== 'ByteDance' && prov !== 'Stability AI' && prov !== 'ImagineArt' && <Star size={14} />}
                          {prov}
                        </div>
                        {selectedProvider === prov && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Model List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className={`mb-3 text-xs font-semibold uppercase tracking-wider ${textMuted} flex items-center gap-1.5`}>
                <Star size={12} /> Featured models
              </div>
              
              <div className="flex flex-col gap-2">
                {filteredModels.map((m, idx) => {
                  const isSelected = selectedModelId === m.id;
                  const provider = getProvider(m.id, m.name);
                  const isNew = idx % 5 === 0; // Fake "new" badge for aesthetics
                  
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelectModel(m.id)}
                      className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition-all ${
                        isSelected 
                          ? `border-violet-500/50 shadow-lg shadow-violet-500/10 ${isLight ? 'bg-white ring-1 ring-violet-500/30' : 'bg-white/5 ring-1 ring-violet-500/30'}` 
                          : `${borderCol} transparent ${btnHover}`
                      }`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${borderCol} ${isLight ? 'bg-slate-50 text-slate-700' : 'bg-white/5 text-white'}`}>
                        <ProviderIcon provider={provider} size={24} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold truncate text-[16px] ${isSelected ? (isLight ? 'text-slate-900' : 'text-white') : (isLight ? 'text-slate-700' : 'text-slate-200')}`}>
                            {m.name || m.id}
                          </span>
                          {isNew && <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">New</span>}
                        </div>
                        <p className={`truncate text-[13px] ${textMuted} mt-1`}>
                          {m.description || `The world's best ${m.type.toLowerCase()} rendering model`}
                        </p>
                      </div>
                    </button>
                  )
                })}
                {filteredModels.length === 0 && (
                  <div className={`text-center py-10 text-sm ${textMuted}`}>No models found.</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Settings */}
          <div className="w-1/2 flex flex-col p-8 overflow-y-auto">
            
            {hasParam('aspect_ratio') && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold ${textMuted}`}>Select Aspect ratio</h3>
                  <button onClick={() => setAspectRatio('1:1')} className={`text-xs font-medium hover:underline ${textMuted}`}>Reset</button>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: '9:16', icon: <Smartphone size={16} /> },
                    { val: '3:4',  icon: <Smartphone size={16} className="rotate-90" /> },
                    { val: '1:1',  icon: <LayoutDashboard size={16} /> },
                    { val: '4:3',  icon: <Monitor size={16} /> },
                    { val: '3:2',  icon: <LayoutTemplate size={16} /> },
                    { val: '16:9', icon: <Monitor size={16} className="scale-x-110" /> },
                    { val: '21:9', icon: <Monitor size={16} className="scale-x-125" /> },
                  ].map(ar => (
                    <button
                      key={ar.val}
                      onClick={() => setAspectRatio(ar.val)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border py-3 transition-all ${
                        aspectRatio === ar.val 
                          ? `border-violet-500/50 ${isLight ? 'bg-violet-50 text-violet-700' : 'bg-violet-500/10 text-violet-300'}` 
                          : `${borderCol} transparent ${btnHover} ${isLight ? 'text-slate-600' : 'text-slate-300'}`
                      }`}
                    >
                      {ar.icon}
                      <span className="text-xs font-semibold">{ar.val}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`mb-4 text-sm font-bold ${textMuted}`}>More options</div>

            <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
              <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Prompt Enhancer</span>
              <button 
                onClick={() => setPromptEnhancer(!promptEnhancer)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${promptEnhancer ? 'bg-violet-500' : isLight ? 'bg-slate-300' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${promptEnhancer ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </button>
            </div>

            {hasParam('num_outputs') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Variations</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => setNumOutputs(n)}
                      className={`flex h-8 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                        numOutputs === n
                          ? `border-violet-500/50 ${isLight ? 'bg-violet-50 text-violet-700' : 'bg-violet-500/10 text-violet-300'}`
                          : `${borderCol} transparent ${btnHover}`
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
              <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Resolution</span>
              <div className="flex gap-4">
                {['1K', '2K', '4K'].map(res => (
                  <label key={res} className="flex items-center gap-2 cursor-pointer">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${resolutionPreset === res ? 'border-violet-500' : borderCol}`}>
                      {resolutionPreset === res && <div className="h-2 w-2 rounded-full bg-violet-500" />}
                    </div>
                    <input type="radio" className="hidden" checked={resolutionPreset === res} onChange={() => setResolutionPreset(res)} />
                    <span className="text-sm font-medium">{res}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasParam('output_quality') && (
              <div className="flex items-center justify-between border-b ${borderCol} pb-5 mb-5">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Quality</span>
                <div className="flex gap-4">
                  {[{l: 'Low', v: 60}, {l: 'Medium', v: 80}, {l: 'High', v: 100}].map(q => (
                    <label key={q.l} className="flex items-center gap-2 cursor-pointer">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${quality === q.v ? 'border-violet-500' : borderCol}`}>
                        {quality === q.v && <div className="h-2 w-2 rounded-full bg-violet-500" />}
                      </div>
                      <input type="radio" className="hidden" checked={quality === q.v} onChange={() => setQuality(q.v)} />
                      <span className="text-sm font-medium">{q.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {mode === 'Video' && (
              <div className={`flex items-center justify-between border-t mt-5 pt-5 ${borderCol}`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Duration</span>
                <div className="flex gap-4">
                  {['5s', '10s', '15s'].map(d => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${duration === d ? 'border-violet-500' : borderCol}`}>
                        {duration === d && <div className="h-2 w-2 rounded-full bg-violet-500" />}
                      </div>
                      <input type="radio" className="hidden" checked={duration === d} onChange={() => setDuration(d)} />
                      <span className="text-sm font-medium">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}


            {hasParam('output_format') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Format</span>
                <select className={`bg-transparent border ${borderCol} rounded-lg px-2 py-1 text-sm outline-none`} value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="webp">WebP</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
            )}
            
            {hasParam('seed') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Seed</span>
                <input type="number" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32`} placeholder="Random" value={seed} onChange={e => setSeed(e.target.value)} />
              </div>
            )}
            
            {hasParam('guidance_scale') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>CFG Scale</span>
                <input type="number" step={0.1} className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32`} placeholder="Default" value={guidance} onChange={e => setGuidance(e.target.value)} />
              </div>
            )}
            
            {hasParam('num_inference_steps') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Steps</span>
                <input type="number" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32`} placeholder="Default" value={steps} onChange={e => setSteps(e.target.value)} />
              </div>
            )}

            {hasParam('negative_prompt') && (
              <div className="mt-4">
                <span className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Negative Prompt</span>
                <textarea className={`w-full bg-transparent border ${borderCol} rounded-xl p-3 text-sm outline-none min-h-[80px]`} value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="Ugly, blurry, distorted…" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
