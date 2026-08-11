import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, Star, Monitor, Smartphone, LayoutDashboard, LayoutTemplate } from 'lucide-react';

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
  hasParam: (param: string) => boolean;
}

export function SettingsModal({
  isOpen, onClose, mode, models, selectedModelId, onSelectModel, isLight,
  aspectRatio, setAspectRatio,
  numOutputs, setNumOutputs,
  quality, setQuality,
  duration, setDuration,
  hasParam
}: SettingsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [promptEnhancer, setPromptEnhancer] = useState(false);
  const [resolutionPreset, setResolutionPreset] = useState('1K');

  const filteredModels = useMemo(() => {
    let filtered = models.filter(m => m.type === mode);
    if (searchQuery) {
      filtered = filtered.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [models, mode, searchQuery]);

  if (!isOpen) return null;

  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#1e1e24] text-slate-100';
  const bgPanel = isLight ? 'bg-slate-50' : 'bg-[#151519]';
  const borderCol = isLight ? 'border-slate-200' : 'border-white/10';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const btnHover = isLight ? 'hover:bg-slate-200' : 'hover:bg-white/5';
  
  // Helpers to get Provider from ID
  const getProvider = (id: string) => {
    const parts = id.split('/');
    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return 'Unknown';
  };

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
              <button className={`flex items-center gap-1 rounded-xl border ${borderCol} px-4 py-2 text-sm font-medium ${isLight ? 'bg-white hover:bg-slate-50' : 'bg-[#1e1e24] hover:bg-white/5'}`}>
                Providers <ChevronDown size={14} />
              </button>
              <button className={`flex items-center gap-1 rounded-xl border ${borderCol} px-4 py-2 text-sm font-medium ${isLight ? 'bg-white hover:bg-slate-50' : 'bg-[#1e1e24] hover:bg-white/5'}`}>
                Resolutions <ChevronDown size={14} />
              </button>
            </div>

            {/* Model List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className={`mb-3 text-xs font-semibold uppercase tracking-wider ${textMuted} flex items-center gap-1.5`}>
                <Star size={12} /> Featured models
              </div>
              
              <div className="flex flex-col gap-2">
                {filteredModels.map((m, idx) => {
                  const isSelected = selectedModelId === m.id;
                  const provider = getProvider(m.id);
                  const isNew = idx % 5 === 0; // Fake "new" badge for aesthetics
                  
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelectModel(m.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all ${
                        isSelected 
                          ? `border-violet-500/50 ${isLight ? 'bg-violet-50' : 'bg-violet-500/10'}` 
                          : `${borderCol} transparent ${btnHover}`
                      }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${borderCol} ${isLight ? 'bg-white' : 'bg-[#2a2a32]'}`}>
                        <span className="font-bold text-sm">{provider.charAt(0)}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-bold truncate text-[15px]">{m.name}</span>
                          {isNew && <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">New</span>}
                        </div>
                        <p className={`truncate text-xs ${textMuted} mt-0.5`}>
                          By {provider} • {m.type} Generation
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
              <div className="flex items-center justify-between">
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

          </div>
        </div>
      </div>
    </div>
  );
}
