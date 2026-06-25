import { useState } from "react";
import { X, Volume2, Moon, Bell, Lock, User, Accessibility, Globe, HardDrive, Cpu, Info } from "lucide-react";

const SETTINGS_CATEGORIES = [
  { id: "visual", icon: <Moon className="w-4 h-4" />, name: "Visual" },
  { id: "audio", icon: <Volume2 className="w-4 h-4" />, name: "Audio" },
  { id: "notifications", icon: <Bell className="w-4 h-4" />, name: "Notifications" },
  { id: "privacy", icon: <Lock className="w-4 h-4" />, name: "Privacy" },
  { id: "account", icon: <User className="w-4 h-4" />, name: "Account" },
  { id: "accessibility", icon: <Accessibility className="w-4 h-4" />, name: "Accessibility" },
  { id: "language", icon: <Globe className="w-4 h-4" />, name: "Language" },
  { id: "storage", icon: <HardDrive className="w-4 h-4" />, name: "Storage" },
  { id: "advanced", icon: <Cpu className="w-4 h-4" />, name: "Advanced" },
  { id: "about", icon: <Info className="w-4 h-4" />, name: "About" },
];

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("visual");
  const [visualData, setVisualData] = useState({ brightness: 80, contrast: 100, animations: true });
  const [audioData, setAudioData] = useState({ masterVolume: 100, normalize: true, hdAudio: false });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm px-4">
       <div className="bg-[#0c0d21] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Sidebar */}
          <div className="md:w-64 border-r border-white/10 bg-black/20 flex flex-col h-1/3 md:h-[90vh]">
            <div className="p-6 border-b border-white/10 shrink-0">
               <h2 className="text-xl font-display font-medium text-white">Settings</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {SETTINGS_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${activeCategory === cat.id ? 'bg-brand-500/20 text-brand-300' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#0c0d21] flex flex-col h-2/3 md:h-[90vh]">
             <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-medium text-white capitalize">{activeCategory} Settings</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeCategory === "visual" && (
                  <div className="space-y-8 max-w-md">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white flex justify-between">
                         Brightness <span className="text-gray-500">{visualData.brightness}%</span>
                      </label>
                      <input type="range" min="0" max="100" value={visualData.brightness} onChange={e => setVisualData({...visualData, brightness: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white flex justify-between">
                         Contrast <span className="text-gray-500">{visualData.contrast}%</span>
                      </label>
                      <input type="range" min="50" max="150" value={visualData.contrast} onChange={e => setVisualData({...visualData, contrast: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <div className="text-sm font-medium text-white">Animations</div>
                        <div className="text-xs text-gray-500">Enable UI transitions and motion</div>
                      </div>
                      <button onClick={() => setVisualData({...visualData, animations: !visualData.animations})} className={`w-12 h-6 rounded-full relative transition-colors ${visualData.animations ? 'bg-brand-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${visualData.animations ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {activeCategory === "audio" && (
                  <div className="space-y-8 max-w-md">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white flex justify-between">
                         Master Volume <span className="text-gray-500">{audioData.masterVolume}%</span>
                      </label>
                      <input type="range" min="0" max="100" value={audioData.masterVolume} onChange={e => setAudioData({...audioData, masterVolume: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <div className="text-sm font-medium text-white">Audio Normalization</div>
                          <div className="text-xs text-gray-500">Auto-adjust volume levels between episodes</div>
                        </div>
                        <button onClick={() => setAudioData({...audioData, normalize: !audioData.normalize})} className={`w-12 h-6 rounded-full relative transition-colors ${audioData.normalize ? 'bg-brand-500' : 'bg-gray-700'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${audioData.normalize ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <div className="text-sm font-medium text-white">HD Audio Streaming</div>
                          <div className="text-xs text-gray-500">Use more data for high-fidelity playback</div>
                        </div>
                        <button onClick={() => setAudioData({...audioData, hdAudio: !audioData.hdAudio})} className={`w-12 h-6 rounded-full relative transition-colors ${audioData.hdAudio ? 'bg-brand-500' : 'bg-gray-700'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${audioData.hdAudio ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Default placeholder for other categories */}
                {activeCategory !== "visual" && activeCategory !== "audio" && (
                   <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full space-y-4">
                      {SETTINGS_CATEGORIES.find(c => c.id === activeCategory)?.icon}
                      <p>Settings for {activeCategory} are coming soon.</p>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  )
}
