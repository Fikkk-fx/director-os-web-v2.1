import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, Monitor, Smartphone, LayoutDashboard, LayoutTemplate } from 'lucide-react';

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
  resolution: string;
  setResolution: (v: string) => void;
  generateAudio: boolean;
  setGenerateAudio: (v: boolean) => void;
  hd: boolean;
  setHd: (v: boolean) => void;
  stylize: number;
  motion: string;
  setMotion: (v: string) => void;
  setStylize: (v: number) => void;
  chaos: number;
  setChaos: (v: number) => void;
  weird: number;
  setWeird: (v: number) => void;
  sref: string;
  setSref: (v: string) => void;
  watermark: boolean;
  setWatermark: (v: boolean) => void;
  returnLastFrame: boolean;
  setReturnLastFrame: (v: boolean) => void;
  thinkingLevel: string;
  setThinkingLevel: (v: string) => void;
  mediaResolution: string;
  setMediaResolution: (v: string) => void;
}

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
  resolution, setResolution,
  generateAudio, setGenerateAudio,
  hd, setHd,
  stylize, setStylize, motion, setMotion,
  chaos, setChaos,
  weird, setWeird,
  sref, setSref,
  watermark, setWatermark,
  returnLastFrame, setReturnLastFrame
}: SettingsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const activeModalModel = models.find(m => m.id === selectedModelId);
  const hasParam = (p: string) => activeModalModel?.supported_params?.includes(p) ?? false;
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const [providerFilter, setProviderFilter] = useState('');
  const [showResMenu, setShowResMenu] = useState(false);
  const [resFilter, setResFilter] = useState('');
  const [promptEnhancer, setPromptEnhancer] = useState(false);

  // Helpers to get Provider from ID
  const getProvider = (id: string) => {
    const parts = id.split('/');
    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return 'Unknown';
  };

  const availableProviders = useMemo(() => {
    const s = new Set<string>();
    // Use m.provider directly (set by backend) for consistent grouping
    models.filter(m => m.type === mode).forEach(m => s.add(m.provider || getProvider(m.id)));
    return Array.from(s).sort();
  }, [models, mode]);

  const filteredModels = useMemo(() => {
    let filtered = models.filter(m => m.type === mode);
    if (searchQuery) {
      filtered = filtered.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (providerFilter) {
      filtered = filtered.filter(m => getProvider(m.id) === providerFilter);
    }
    if (resFilter) {
      // Mock resolution filter (e.g., if a model supports 4K, it usually has 'resolution' param or '4k' in name)
      if (resFilter === '4K') {
        filtered = filtered.filter(m => (m.supported_params?.includes('resolution') || m.name.toLowerCase().includes('4k') || m.name.toLowerCase().includes('pro')));
      } else if (resFilter === '1080p') {
        filtered = filtered.filter(m => m.type === 'Video');
      }
    }
    return filtered;
  }, [models, mode, searchQuery, providerFilter, resFilter]);

  if (!isOpen) return null;

  const bgModal = 'glass-elevated';
  const bgPanel = 'transparent';
  const borderCol = isLight ? 'border-black/5' : 'border-white/10';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const btnHover = isLight ? 'hover:bg-black/5' : 'hover:bg-white/10';
  const dropdownBg = isLight ? 'bg-white/90 backdrop-blur-md border-black/10' : 'bg-[#151519]/90 backdrop-blur-md border-white/10';

  const getLogo = (name: string, id: string) => {
    const s = (name + ' ' + id).toLowerCase();
    if (s.includes('seedream') || s.includes('seedance') || s.includes('douyin') || s.includes('bytedance')) return '/logos/bytedance.png';
    if (s.includes('gemini') || s.includes('google')) return '/logos/google.png';
    if (s.includes('kling') || s.includes('kwaivgi')) return '/logos/kling.jpeg';
    if (s.includes('wan') || s.includes('qwen') || s.includes('alibaba')) return '/logos/wan.png';

    if (s.includes('openai') || s.includes('gpt') || s.includes('dall')) return '/logos/openai.png';
    if (s.includes('deepseek')) return '/logos/deepseek.png';
    if (s.includes('moonshot') || s.includes('kimi')) return '/logos/moonshot.png';

    if (s.includes('ideogram')) return '/logos/ideogram.png';
    if (s.includes('microsoft')) return '/logos/microsoft.jpeg';
    if (s.includes('minimax')) return '/logos/minimax.jpeg';
    if (s.includes('pixverse')) return '/logos/pixverse.png';
    if (s.includes('reve')) return '/logos/reve.png';
    if (s.includes('vidu')) return '/logos/vidu.jpeg';
    if (s.includes('xai') || s.includes('grok')) return '/logos/grok.jpg';
    if (s.includes('youchuan')) return '/logos/midjourney.png';
    if (s.includes('z-image')) return '/logos/zimage.webp';
    if (s.includes('black-forest') || s.includes('flux') || s.includes('bfl')) return '/logos/blackforest.jpg';
    if (s.includes('atlascloud')) return '/logos/atlascloud.png';

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`relative flex w-full max-w-5xl h-[80vh] max-h-[800px] flex-col rounded-[32px] overflow-hidden shadow-2xl ${bgModal}`} onClick={() => { setShowProviderMenu(false); setShowResMenu(false); }}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderCol}`}>
          <h2 className={`text-xl font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>Settings</h2>
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
              <div className={`flex-1 flex items-center rounded-xl border ${borderCol} px-3 py-1.5 ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                <Search size={16} className={textMuted} />
                <input
                  type="text"
                  placeholder="Search models"
                  className={`w-full bg-transparent px-2 py-1 text-sm outline-none ${isLight ? 'text-slate-900' : 'text-white'}`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProviderMenu(!showProviderMenu); setShowResMenu(false); }}
                  className={`flex items-center gap-1 rounded-xl border ${borderCol} px-4 py-2 text-sm font-medium ${providerFilter ? 'border-violet-500/50 text-violet-500' : isLight ? 'bg-black/5 hover:bg-black/10 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-200'}`}>
                  {providerFilter || 'Providers'} <ChevronDown size={14} className="opacity-50" />
                </button>
                {showProviderMenu && (
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-xl border shadow-xl z-50 p-1.5 flex flex-col gap-1 ${dropdownBg}`}>
                    <button onClick={() => setProviderFilter('')} className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${!providerFilter ? (isLight ? 'bg-black/5 text-slate-900' : 'bg-white/10 text-white') : textMuted + ' ' + btnHover}`}>All Providers</button>
                    {availableProviders.map(p => (
                      <button key={p} onClick={() => setProviderFilter(p)} className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${providerFilter === p ? (isLight ? 'bg-black/5 text-slate-900' : 'bg-white/10 text-white') : textMuted + ' ' + btnHover}`}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowResMenu(!showResMenu); setShowProviderMenu(false); }}
                  className={`flex items-center gap-1 rounded-xl border ${borderCol} px-4 py-2 text-sm font-medium ${resFilter ? 'border-violet-500/50 text-violet-500' : isLight ? 'bg-black/5 hover:bg-black/10 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-200'}`}>
                  {resFilter || (mode === 'Image' ? 'Ratio' : 'Resolution')} <ChevronDown size={14} className="opacity-50" />
                </button>
                {showResMenu && (
                  <div className={`absolute top-full left-0 mt-2 w-40 rounded-xl border shadow-xl z-50 p-1.5 flex flex-col gap-1 ${dropdownBg}`}>
                    <button onClick={() => setResFilter('')} className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${!resFilter ? (isLight ? 'bg-black/5 text-slate-900' : 'bg-white/10 text-white') : textMuted + ' ' + btnHover}`}>All</button>
                    {(mode === 'Image' ? ['1:1', '16:9', '9:16', '3:4', '4:3'] : ['720p', '1080p', '2K', '4K']).map(r => (
                      <button key={r} onClick={() => setResFilter(r)} className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${resFilter === r ? (isLight ? 'bg-black/5 text-slate-900' : 'bg-white/10 text-white') : textMuted + ' ' + btnHover}`}>{r}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Model List Grouped by Provider */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {availableProviders.map(provider => {
                const pModels = filteredModels.filter(m => (m.provider || getProvider(m.id)) === provider);
                if (pModels.length === 0) return null;

                return (
                  <div key={provider} className="mb-6">
                    <div className={`mb-3 text-[10px] font-bold uppercase tracking-wider ${textMuted} flex items-center gap-1.5`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${borderCol} ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                        {getLogo('', pModels[0].id) ? (
                           <img src={getLogo('', pModels[0].id)!} alt={provider} className="w-full h-full object-cover rounded-full" />
                        ) : (
                           <span>{provider.charAt(0)}</span>
                        )}
                      </div>
                      {provider}
                    </div>

                    <div className="flex flex-col gap-2">
                      {pModels.map((m) => {
                        const isSelected = selectedModelId === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => onSelectModel(m.id)}
                            className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all ${isSelected
                              ? `border-violet-500/50 ${isLight ? 'bg-violet-50 text-slate-900' : 'bg-violet-500/20 text-white'}`
                              : `${borderCol} transparent ${btnHover} ${isLight ? 'text-slate-700' : 'text-slate-300'}`
                              }`}
                          >
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="font-bold truncate text-sm">{m.name}</span>
                              </div>
                              <p className={`truncate text-[10px] uppercase font-bold tracking-widest ${textMuted} mt-0.5`}>
                                {m.mode || m.type}
                              </p>
                            </div>
                            {isSelected && <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                );
              })}
              {filteredModels.length === 0 && (
                <div className={`text-center py-10 text-sm ${textMuted}`}>No models found.</div>
              )}
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
                    { val: '3:4', icon: <Smartphone size={16} className="rotate-90" /> },
                    { val: '1:1', icon: <LayoutDashboard size={16} /> },
                    { val: '4:3', icon: <Monitor size={16} /> },
                    { val: '3:2', icon: <LayoutTemplate size={16} /> },
                    { val: '16:9', icon: <Monitor size={16} className="scale-x-110" /> },
                    { val: '21:9', icon: <Monitor size={16} className="scale-x-125" /> },
                  ].map(ar => (
                    <button
                      key={ar.val}
                      onClick={() => setAspectRatio(ar.val)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border py-3 transition-all ${aspectRatio === ar.val
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

            {hasParam('prompt_enhancer') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Prompt Enhancer</span>
                <button
                  onClick={() => setPromptEnhancer(!promptEnhancer)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${promptEnhancer ? 'bg-violet-500' : isLight ? 'bg-slate-300' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${promptEnhancer ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {hasParam('num_outputs') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Variations</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => setNumOutputs(n)}
                      className={`flex h-8 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all ${numOutputs === n
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

            {hasParam('resolution') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Resolution</span>
                <div className="flex gap-4">
                  {['480p', '720p', '1080p', '1K', '2K', '4K'].map(res => (
                    <label key={res} className="flex items-center gap-2 cursor-pointer">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${resolution === res ? 'border-violet-500' : borderCol}`}>
                        {resolution === res && <div className="h-2 w-2 rounded-full bg-violet-500" />}
                      </div>
                      <input type="radio" className="hidden" checked={resolution === res} onChange={() => setResolution(res)} />
                      <span className="text-sm font-medium">{res}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {hasParam('generate_audio') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Generate Audio</span>
                <button
                  onClick={() => setGenerateAudio(!generateAudio)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${generateAudio ? 'bg-violet-500' : (isLight ? 'bg-slate-300' : 'bg-slate-600')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generateAudio ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {hasParam('output_quality') && (
              <div className="flex items-center justify-between border-b ${borderCol} pb-5 mb-5">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Quality</span>
                <div className="flex gap-4">
                  {[{ l: 'Low', v: 60 }, { l: 'Medium', v: 80 }, { l: 'High', v: 100 }].map(q => (
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

            {hasParam('duration') && (
              <div className={`flex items-center justify-between ${hasParam('output_quality') || hasParam('resolution') ? 'border-t mt-5 pt-5 ' + borderCol : ''}`}>
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
                <select className={`bg-transparent border ${borderCol} rounded-lg px-2 py-1 text-sm outline-none ${isLight ? 'text-slate-900 bg-white/50' : 'text-white bg-black/20'}`} value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="webp" className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-800'}>WebP</option>
                  <option value="png" className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-800'}>PNG</option>
                  <option value="jpg" className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-800'}>JPG</option>
                  <option value="mp4" className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-800'}>MP4</option>
                  <option value="mov" className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-800'}>MOV</option>
                </select>
              </div>
            )}

            {hasParam('seed') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Seed</span>
                <input type="number" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="Random" value={seed} onChange={e => setSeed(e.target.value)} />
              </div>
            )}

            {hasParam('hd') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Native 2K HD</span>
                <button
                  onClick={() => setHd(!hd)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hd ? 'bg-violet-500' : (isLight ? 'bg-slate-300' : 'bg-slate-600')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hd ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
            
            {hasParam('watermark') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Watermark</span>
                <button
                  onClick={() => setWatermark(!watermark)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${watermark ? 'bg-violet-500' : (isLight ? 'bg-slate-300' : 'bg-slate-600')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${watermark ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {hasParam('return_last_frame') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Return Last Frame</span>
                <button
                  onClick={() => setReturnLastFrame(!returnLastFrame)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${returnLastFrame ? 'bg-violet-500' : (isLight ? 'bg-slate-300' : 'bg-slate-600')}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${returnLastFrame ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
            
                        {hasParam('motion') && (
              <div className="flex items-center justify-between mt-4">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Motion</span>
                <select className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none ${isLight ? 'text-slate-900' : 'text-white'}`} value={motion} onChange={e => setMotion(e.target.value)}>
                  <option value="low" className="text-black">Low</option>
                  <option value="high" className="text-black">High</option>
                </select>
              </div>
            )}

            {hasParam('stylize') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Stylize</span>
                <input type="number" min="0" max="1000" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="0" value={stylize} onChange={e => setStylize(Number(e.target.value))} />
              </div>
            )}
            
            {hasParam('chaos') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Chaos</span>
                <input type="number" min="0" max="100" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="0" value={chaos} onChange={e => setChaos(Number(e.target.value))} />
              </div>
            )}
            
            {hasParam('weird') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Weird</span>
                <input type="number" min="0" max="3000" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="0" value={weird} onChange={e => setWeird(Number(e.target.value))} />
              </div>
            )}
            
            {hasParam('sref') && (
              <div className={`flex flex-col border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Style Reference (sref URL)</span>
                <input type="text" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-2 text-sm outline-none w-full ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="https://..." value={sref} onChange={e => setSref(e.target.value)} />
              </div>
            )}

            {hasParam('guidance_scale') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>CFG Scale</span>
                <input type="number" step={0.1} className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="Default" value={guidance} onChange={e => setGuidance(e.target.value)} />
              </div>
            )}

            {hasParam('num_inference_steps') && (
              <div className={`flex items-center justify-between border-b ${borderCol} pb-5 mb-5`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Steps</span>
                <input type="number" className={`bg-transparent border ${borderCol} rounded-lg px-3 py-1 text-sm outline-none w-32 ${isLight ? 'text-slate-900' : 'text-white'}`} placeholder="Default" value={steps} onChange={e => setSteps(e.target.value)} />
              </div>
            )}

            {hasParam('negative_prompt') && (
              <div className="mt-4">
                <span className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Negative Prompt</span>
                <textarea className={`w-full bg-transparent border ${borderCol} rounded-xl p-3 text-sm outline-none min-h-[80px] ${isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'}`} value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="Ugly, blurry, distorted…" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
