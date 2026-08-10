import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Film, Image as ImageIcon, Moon, Sun, Upload, Send, Video, Home, FolderKanban, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  tab: 'Home' | 'Image' | 'Video';
  messages: ChatMessage[];
  updatedAt: number;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('Connecting...');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'Home' | 'Image' | 'Video' | 'Assets'>('Home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('active_session_id');
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('chat_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { 
    if (activeSessionId) localStorage.setItem('active_session_id', activeSessionId); 
    else localStorage.removeItem('active_session_id');
  }, [activeSessionId]);

  // Derived state for current session
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession ? activeSession.messages : [];
  
  // Ensure we switch to the right tab if a session is selected
  useEffect(() => {
    if (activeSession && activeSession.tab !== activeTab) {
      setActiveTab(activeSession.tab);
    }
  }, [activeSessionId]);

  const createNewSession = (tab: 'Home' | 'Image' | 'Video') => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      tab: tab,
      messages: [{ 
        id: 'welcome', 
        role: 'ai', 
        content: tab === 'Home' ? 'Hello, Director. I am GPT-5.6 Sol. What are we creating today?' : 
                 tab === 'Image' ? 'Ready to generate images. Describe your vision.' : 
                 'Ready to generate cinematic videos. What is the scene?', 
        timestamp: new Date().toLocaleTimeString() 
      }],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (activeTab !== tab) setActiveTab(tab);
  };

  const updateActiveSessionMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setSessions(prevSessions => prevSessions.map(session => {
      if (session.id === activeSessionId) {
        const newMessages = updater(session.messages);
        // Update title based on first user message if it's still 'New Chat'
        let title = session.title;
        if (title === 'New Chat') {
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (firstUserMsg) title = firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
        }
        return { ...session, messages: newMessages, title, updatedAt: Date.now() };
      }
      return session;
    }).sort((a, b) => b.updatedAt - a.updatedAt));
  };
  
  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this chat session?")) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) setActiveSessionId(null);
    }
  };

  // Prompts State
  const [promptHome, setPromptHome] = useState('');
  const [promptImage, setPromptImage] = useState('');
  const [promptVideo, setPromptVideo] = useState('');

  // Generation Loading State
  const [isGeneratingHome, setIsGeneratingHome] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // File Inputs
  const [refFileHome, setRefFileHome] = useState<File | null>(null);
  const [refFileImage, setRefFileImage] = useState<File | null>(null);
  const [refFileVideo, setRefFileVideo] = useState<File | null>(null);
  const fileInputRefHome = useRef<HTMLInputElement>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Models State
  const [models, setModels] = useState<any[]>([]);
  const [selectedImageModel, setSelectedImageModel] = useState<string>('');
  const [selectedVideoModel, setSelectedVideoModel] = useState<string>('');
  
  // Generation Settings State
  const [aspectRatioImg, setAspectRatioImg] = useState('16:9');
  const [aspectRatioVid, setAspectRatioVid] = useState('16:9');
  const [durationVid, setDurationVid] = useState('5s');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, activeTab]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/health`)
      .then(() => setHealthStatus(`System: Online`))
      .catch(() => setHealthStatus(`System: Offline`));
    
    axios.get(`${API_BASE}/api/atlas/models`)
      .then(res => {
        setModels(res.data.models);
        const firstVideo = res.data.models.find((m: any) => m.type === 'Video');
        if (firstVideo) setSelectedVideoModel(firstVideo.id);
        const firstImage = res.data.models.find((m: any) => m.type === 'Image');
        if (firstImage) setSelectedImageModel(firstImage.id);
      })
      .catch(err => console.error("Failed to load models", err));
  }, []);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleSendHome = async () => {
    if (!promptHome.trim() && !refFileHome) return;
    if (!activeSessionId) createNewSession('Home'); // Ensure session exists
    
    const userPrompt = promptHome.trim();
    setPromptHome(''); 
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt || (refFileHome ? 'Sent an image.' : ''),
      imageUrl: refFileHome ? URL.createObjectURL(refFileHome) : undefined,
      timestamp: new Date().toLocaleTimeString()
    };
    
    updateActiveSessionMessages(prev => [...prev, newUserMsg]);
    setIsGeneratingHome(true);
    
    try {
      const formData = new FormData();
      formData.append('prompt', userPrompt);
      const historyPayload = activeSession ? activeSession.messages.map(m => ({ role: m.role, content: m.content })) : [];
      formData.append('history', JSON.stringify(historyPayload));
      if (refFileHome) formData.append('reference_image', refFileHome);

      const response = await axios.post(`${API_BASE}/api/chat`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString()
      };
      updateActiveSessionMessages(prev => [...prev, newAiMsg]);
      setRefFileHome(null);
    } catch (error: any) {
      updateActiveSessionMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**Error:** ${error.response?.data?.detail || error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsGeneratingHome(false);
    }
  };

  const handleSendMedia = async (type: 'Image' | 'Video') => {
    const isImage = type === 'Image';
    const prompt = isImage ? promptImage : promptVideo;
    const refFile = isImage ? refFileImage : refFileVideo;
    const selectedModel = isImage ? selectedImageModel : selectedVideoModel;
    
    if (!prompt.trim() || !selectedModel) return;
    if (!activeSessionId) createNewSession(isImage ? 'Image' : 'Video');
    
    const userPrompt = prompt.trim();
    if (isImage) setPromptImage(''); else setPromptVideo('');
    
    const currentModelData = models.find(m => m.id === selectedModel);
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      imageUrl: refFile ? URL.createObjectURL(refFile) : undefined,
      timestamp: new Date().toLocaleTimeString()
    };
    
    updateActiveSessionMessages(prev => [...prev, newUserMsg]);
    
    if (isImage) setIsGeneratingImage(true);
    else setIsGeneratingVideo(true);
    
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('prompt', userPrompt);
      formData.append('model_keyword', selectedModel);
      formData.append('aspect_ratio', isImage ? aspectRatioImg : aspectRatioVid);
      if (!isImage) formData.append('duration', durationVid);
      
      if (refFile && currentModelData?.supports_image) {
        formData.append('reference_file', refFile);
      }

      const response = await axios.post(`${API_BASE}/api/atlas/generate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**Task Submitted**\nID: ${response.data.prediction_id}\n*Model: ${currentModelData?.name}*\n\nYour ${type} is being generated on Atlas Cloud. It will appear in the Assets tab when ready.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      updateActiveSessionMessages(prev => [...prev, newAiMsg]);
      if (isImage) setRefFileImage(null); else setRefFileVideo(null);

    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'ai', content: `**Error:** ${error.message}`, timestamp: new Date().toLocaleTimeString()
      };
      updateActiveSessionMessages(prev => [...prev, errorMsg]);
    } finally {
      if (isImage) setIsGeneratingImage(false);
      else setIsGeneratingVideo(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, sendFunc: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendFunc();
    }
  };

  const isGenerating = activeTab === 'Home' ? isGeneratingHome : activeTab === 'Image' ? isGeneratingImage : isGeneratingVideo;
  
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 10px' }}>
            <Film size={24} color="var(--primary-color)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.5px' }}>Director OS</h2>
          </div>
          
          <button 
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => createNewSession(activeTab === 'Assets' ? 'Home' : activeTab)}
          >
            + New Chat
          </button>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
            <div className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => setActiveTab('Home')}>
              <Home size={18} /><span>Home</span>
            </div>
            <div className={`nav-item ${activeTab === 'Image' ? 'active' : ''}`} onClick={() => setActiveTab('Image')}>
              <ImageIcon size={18} /><span>Image</span>
            </div>
            <div className={`nav-item ${activeTab === 'Video' ? 'active' : ''}`} onClick={() => setActiveTab('Video')}>
              <Video size={18} /><span>Video</span>
            </div>
            <div className={`nav-item ${activeTab === 'Assets' ? 'active' : ''}`} onClick={() => setActiveTab('Assets')}>
              <FolderKanban size={18} /><span>Assets</span>
            </div>
          </nav>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 10px', marginBottom: '8px', textTransform: 'uppercase' }}>Recent Chats</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sessions.map(session => (
              <div 
                key={session.id} 
                className={`nav-item ${activeSessionId === session.id ? 'active' : ''}`} 
                style={{ padding: '8px 10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setActiveSessionId(session.id)}
              >
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                   {session.title}
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: activeSessionId === session.id ? 1 : 0.4 }}
                  className="delete-session-btn"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div style={{ padding: '0 10px', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No recent chats.</div>
            )}
          </div>
        </div>

        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </div>

        <div style={{ padding: '0 12px', fontSize: '12px', color: healthStatus.includes('Online') ? '#34c759' : '#ff3b30' }}>
          {healthStatus}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workspace-container">
        
        {/* Chat Feed or Dashboard */}
        <div className="main-canvas liquid-glass" style={{ flex: 1, position: 'relative' }}>
          {activeTab !== 'Assets' ? (
            <>
              <div className="feed-area" style={{ position: 'relative' }}>
                {!activeSessionId && (
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                     <p>Select a chat from the sidebar or start a new one.</p>
                     <button onClick={() => createNewSession(activeTab as 'Home'|'Image'|'Video')} style={{ marginTop: '12px', padding: '8px 16px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Start New Chat</button>
                   </div>
                )}
                {activeMessages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                    {msg.role === 'ai' && <div style={{ fontSize: '12px', color: 'var(--primary-color)', marginBottom: '4px', fontWeight: 600 }}>{activeTab === 'Home' ? 'GPT-5.6 Sol' : `Agent ${activeTab}`}</div>}
                    {msg.imageUrl && (
                       <img src={msg.imageUrl} alt="Reference" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '8px', border: '1px solid var(--glass-border)' }} />
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'right' }}>{msg.timestamp}</div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="message msg-ai">
                    <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      {activeTab === 'Home' ? 'GPT-5.6 Sol is thinking...' : 'Sending request to Atlas Cloud...'}
                    </span>
                  </div>
                )}
                <div ref={feedEndRef} />
              </div>

              {/* Prompt Bar */}
              <div className="prompt-bar-container">
                <div className="prompt-bar liquid-glass" style={{ border: '1px solid var(--primary-color)', boxShadow: '0 8px 32px rgba(0, 113, 227, 0.15)' }}>
                  
                  {/* File Upload Button */}
                  <button 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                    onClick={() => {
                      if (activeTab === 'Home') fileInputRefHome.current?.click();
                      if (activeTab === 'Image') fileInputRefImage.current?.click();
                      if (activeTab === 'Video') fileInputRefVideo.current?.click();
                    }}
                  >
                    <Upload size={20} color={(activeTab === 'Home' && refFileHome) || (activeTab === 'Image' && refFileImage) || (activeTab === 'Video' && refFileVideo) ? '#34c759' : 'currentColor'} />
                  </button>
                  
                  {/* Hidden File Inputs */}
                  <input type="file" accept="image/*" ref={fileInputRefHome} style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files.length > 0) setRefFileHome(e.target.files[0]); }} />
                  <input type="file" accept="image/*" ref={fileInputRefImage} style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files.length > 0) setRefFileImage(e.target.files[0]); }} />
                  <input type="file" accept="image/*" ref={fileInputRefVideo} style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files.length > 0) setRefFileVideo(e.target.files[0]); }} />

                  <textarea 
                    className="prompt-input"
                    placeholder={`Message ${activeTab === 'Home' ? 'GPT-5.6 Sol' : `Agent ${activeTab}`}...`}
                    value={activeTab === 'Home' ? promptHome : activeTab === 'Image' ? promptImage : promptVideo}
                    onChange={(e) => {
                      if (activeTab === 'Home') setPromptHome(e.target.value);
                      if (activeTab === 'Image') setPromptImage(e.target.value);
                      if (activeTab === 'Video') setPromptVideo(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      if (activeTab === 'Home') handleSendHome();
                      if (activeTab === 'Image') handleSendMedia('Image');
                      if (activeTab === 'Video') handleSendMedia('Video');
                    })}
                    rows={1}
                  />
                  <button 
                    className="send-btn" 
                    onClick={() => {
                      if (activeTab === 'Home') handleSendHome();
                      if (activeTab === 'Image') handleSendMedia('Image');
                      if (activeTab === 'Video') handleSendMedia('Video');
                    }}
                    disabled={isGenerating || (activeTab === 'Home' ? (!promptHome.trim() && !refFileHome) : activeTab === 'Image' ? !promptImage.trim() : !promptVideo.trim())}
                  >
                    <Send size={18} style={{ marginLeft: '2px' }} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // ASSETS DASHBOARD
            <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
               <h1 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '8px' }}>Asset Library</h1>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Review your generated images and videos here.</p>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {/* Mock Assets */}
                  <div className="liquid-glass" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexDirection: 'column', gap: '8px' }}>
                    <ImageIcon size={32} opacity={0.5} />
                    <span>No assets generated yet.</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Right Settings Panel (Only for Image/Video Tabs) */}
        {(activeTab === 'Image' || activeTab === 'Video') && (
          <div className="settings-panel liquid-glass" style={{ width: '320px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '8px' }}>{activeTab} Settings</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '13px', color: 'var(--text-secondary)' }}>Active Model</label>
              <select 
                className="apple-input" 
                style={{ padding: '10px 14px', fontSize: '14px' }}
                value={activeTab === 'Image' ? selectedImageModel : selectedVideoModel} 
                onChange={(e) => {
                  if (activeTab === 'Image') setSelectedImageModel(e.target.value);
                  else setSelectedVideoModel(e.target.value);
                }}
              >
                {models.filter(m => m.type === activeTab).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'Video' ? '1fr 1fr' : '1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '13px', color: 'var(--text-secondary)' }}>Aspect Ratio</label>
                  <select className="apple-input" style={{ padding: '10px', fontSize: '13px' }} 
                    value={activeTab === 'Image' ? aspectRatioImg : aspectRatioVid} 
                    onChange={(e) => {
                      if (activeTab === 'Image') setAspectRatioImg(e.target.value);
                      else setAspectRatioVid(e.target.value);
                    }}
                  >
                    <option value="16:9">16:9</option>
                    <option value="9:16">9:16</option>
                    <option value="1:1">1:1</option>
                    <option value="21:9">21:9</option>
                  </select>
                </div>
              {activeTab === 'Video' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '13px', color: 'var(--text-secondary)' }}>Duration</label>
                  <select className="apple-input" style={{ padding: '10px', fontSize: '13px' }} value={durationVid} onChange={(e) => setDurationVid(e.target.value)}>
                      <option value="5s">5 Sec</option>
                      <option value="10s">10 Sec</option>
                  </select>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--sidebar-bg)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Tip:</strong> Click the Upload icon in the prompt bar to attach a reference image before sending your prompt.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
