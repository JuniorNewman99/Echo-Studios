/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useEffect } from "react";
import { Mic2, PlayCircle, PlusCircle, Share, UserCircle, Sparkles, Search, MessageSquare, Bot } from "lucide-react";

import { PodcastMetadata } from "./types";
import { CreateView } from "./components/CreateView";
import { ListenFeedView } from "./components/ListenFeedView";
import { PublishView } from "./components/PublishView";
import { ProfileView } from "./components/ProfileView";
import { PodcastPlayer } from "./components/PodcastPlayer";
import { SearchView } from "./components/SearchView";
import { DmChat } from "./components/DmChat";
import { AiOracleChat } from "./components/AiOracleChat";

export default function App() {
  const [activeTab, setActiveTab] = useState<"create" | "listen" | "publish" | "profile" | "search">("create");
  const [podcastData, setPodcastData] = useState<PodcastMetadata | null>(null);
  const [isDmOpen, setIsDmOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Player state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const synthesizeAudio = async (data: PodcastMetadata) => {
    setIsSynthesizing(true);
    setTtsError(null);
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: data.script, speakers: data.speakers })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed connecting to TTS engine");
      }
      const { audio } = await response.json();
      
      const buffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
      const blob = new Blob([buffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch(err: any) {
      console.error(err);
      setTtsError(`Audio generation failed: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleGenerated = (data: PodcastMetadata) => {
    setPodcastData(data);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsPlaying(false);
    
    // Automatically synthesize audio for newly generated podcast
    synthesizeAudio(data);
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#08091a] text-white flex flex-col relative overflow-hidden">
      {/* App Shell Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Floating Message Button */}
      <button 
        onClick={() => setIsDmOpen(!isDmOpen)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-[#1a1b36] border border-white/10 rounded-full text-brand-400 hover:text-brand-300 hover:bg-[#25274d] transition-all shadow-[0_0_15px_rgba(139,92,246,0.6)]"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-6 h-6 scale-x-[-1]" />
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a1b36]"></span>
        </div>
      </button>

      {/* Floating AI Bot Button */}
      <button 
        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-[#1a1b36] border border-white/10 rounded-full text-[#8b5cf6] hover:text-[#a78bfa] hover:bg-[#25274d] transition-all shadow-[0_0_15px_rgba(59,130,246,0.6)]"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
      </button>

      {/* Top Protocol Header */}
      <header className="sticky top-0 z-40 bg-[#08091a]/80 backdrop-blur-md border-b border-brand-500/20 px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-3 w-1/3">
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white flex gap-1">
              <span className="text-brand-500">E</span>
              <span className="text-brand-400">C</span>
              <span className="text-brand-300">H</span>
              <span className="text-brand-200">O</span>
              <span className="ml-1 opacity-80 hidden sm:inline">Studios</span>
            </h1>
          </div>
        </div>
        
        {/* Centered Favicon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] bg-transparent">
          <img src="/src/assets/images/echo_studios_favicon_1782358750086.jpg" alt="ECHO Studios Logo" className="w-[115%] h-[115%] max-w-none -ml-[7.5%] -mt-[7.5%] rounded-full object-cover mix-blend-lighten" />
        </div>

        <div className="flex items-center justify-end gap-3 text-xs font-mono text-brand-200/50 w-1/3">
          <span className="hidden md:flex items-center gap-2"><Sparkles className="w-3 h-3" /> AUDIO.SYNT</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto relative z-10 custom-scrollbar">
        {activeTab === "create" && <CreateView onGenerated={handleGenerated} generatedPodcast={podcastData} />}
        {activeTab === "listen" && <ListenFeedView />}
        {activeTab === "publish" && <PublishView data={podcastData} />}
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "search" && <SearchView />}
      </main>

      {/* DM Chat Overlay */}
      <DmChat isOpen={isDmOpen} onClose={() => setIsDmOpen(false)} />

      {/* AI Oracle Chat Overlay */}
      <AiOracleChat isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />

      {/* Global Embedded Audio Element */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          autoPlay
        />
      )}

      {/* Player Overlay (if creating/listening to own podcast) */}
      <PodcastPlayer 
         data={podcastData}
         audioUrl={audioUrl}
         isSynthesizing={isSynthesizing}
         ttsError={ttsError}
         onPlayToggle={togglePlay}
         isPlaying={isPlaying}
         audioRef={audioRef}
         currentTime={currentTime}
         duration={duration}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0c0d21]/90 backdrop-blur-xl border-t border-white/10 pb-safe pt-2">
        <div className="w-full mx-auto flex items-stretch justify-between px-0 pb-4">
          <NavItem 
            icon={<UserCircle className="w-6 h-6" />} 
            label="Profile" 
            isActive={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
          />
          <NavItem 
            icon={<Search className="w-6 h-6" />} 
            label="Search" 
            isActive={activeTab === "search" as any} 
            onClick={() => setActiveTab("search" as any)} 
          />
          <NavItem 
            icon={<PlusCircle className="w-6 h-6" />} 
            label="Create" 
            isActive={activeTab === "create"} 
            onClick={() => setActiveTab("create")} 
          />
          <NavItem 
            icon={<PlayCircle className="w-6 h-6" />} 
            label="Listen" 
            isActive={activeTab === "listen"} 
            onClick={() => setActiveTab("listen")} 
          />
          <NavItem 
            icon={<Share className="w-6 h-6" />} 
            label="Publish" 
            isActive={activeTab === "publish"} 
            onClick={() => setActiveTab("publish")} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-colors w-full ${isActive ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
    >
      <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} transition-all`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}

