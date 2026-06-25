import React, { useState } from "react";
import { Mic2, Play, Pause, Volume2, Rewind, FastForward } from "lucide-react";
import { PodcastMetadata } from "../types";

// Note: This is an overlay/embed player strictly for playback inside the CreateView or ListenView
export function PodcastPlayer({ data, audioUrl, isSynthesizing, ttsError, onPlayToggle, isPlaying, audioRef, currentTime, duration }: { 
  data: PodcastMetadata | null;
  audioUrl: string | null;
  isSynthesizing: boolean;
  ttsError: string | null;
  onPlayToggle: () => void;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTime: number;
  duration: number;
}) {

  if (!data) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 md:px-0 pointer-events-none fade-in">
      <div className="max-w-3xl mx-auto rounded-3xl bg-[#111229]/95 backdrop-blur-xl border border-brand-500/30 p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          {duration > 0 && (
             <div className="h-full bg-brand-500" style={{ width: `${(currentTime/duration)*100}%` }} />
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={onPlayToggle} 
            disabled={!audioUrl}
            className="w-14 h-14 shrink-0 rounded-full bg-brand-500 hover:bg-brand-400 disabled:bg-brand-900 disabled:opacity-50 text-white flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 ml-[-4px]" /> : <Play className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 min-w-0">
             {isSynthesizing ? (
                <div className="text-xs text-brand-300 font-mono animate-pulse mb-1">SYNTHESIZING AUDIO...</div>
             ) : ttsError ? (
                <div className="text-xs text-red-400 font-mono mb-1 truncate">{ttsError}</div>
             ) : (
                <div className="text-xs text-brand-300 font-mono mb-1">
                  {Math.floor(currentTime/60)}:{(Math.floor(currentTime)%60).toString().padStart(2,'0')} / 
                  {Math.floor(duration/60)}:{(Math.floor(duration)%60).toString().padStart(2,'0')}
                </div>
             )}
             <h3 className="font-bold text-white text-sm sm:text-base truncate">{data.title}</h3>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 ml-auto">
           <button className="text-gray-400 hover:text-white transition-colors" onClick={() => {if(audioRef.current) audioRef.current.currentTime -= 15}}><Rewind className="w-5 h-5"/></button>
           <button className="text-gray-400 hover:text-white transition-colors" onClick={() => {if(audioRef.current) audioRef.current.currentTime += 15}}><FastForward className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
}
