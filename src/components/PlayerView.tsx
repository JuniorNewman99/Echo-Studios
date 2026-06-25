import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Mic2, Sparkles, Loader2, FastForward, Rewind } from "lucide-react";
import { PodcastMetadata } from "../types";

export function PlayerView({ data }: { data: PodcastMetadata | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (data && !audioUrl && !isSynthesizing) {
       // Only synthesize once per new data
       synthesizeAudio();
    }
    // Cleanup URL on unmount or data change
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    };
  }, [data]);

  const synthesizeAudio = async () => {
    if (!data) return;
    setIsSynthesizing(true);
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

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
        <Mic2 className="w-12 h-12 text-brand-500 mb-4" />
        <h3 className="text-xl font-display font-medium text-white mb-2">Nothing Playing</h3>
        <p className="text-gray-400 text-sm text-center">Create a new podcast to start listening.</p>
      </div>
    );
  }

  const getBackgroundColorForSpeaker = (name: string) => {
    const colors = [
      "bg-blue-500/10 border-blue-500/20 text-blue-200",
      "bg-purple-500/10 border-purple-500/20 text-purple-200",
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
      "bg-amber-500/10 border-amber-500/20 text-amber-200",
      "bg-rose-500/10 border-rose-500/20 text-rose-200"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 pb-32">
      {/* Dynamic Player Header */}
      <div className="bg-gradient-to-br from-brand-950 to-black border border-brand-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -inset-24 bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
           {isSynthesizing ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">
                <Loader2 className="w-3 h-3 animate-spin"/> MUXING AUDIO...
              </div>
           ) : (
              <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-mono">
                NOW PLAYING
              </div>
           )}
           <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">{data.title}</h1>
           <p className="text-brand-300 font-medium">{data.tagline}</p>
           
           {ttsError && (
             <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm max-w-lg text-left">
               {ttsError}
             </div>
           )}

           {/* Player Controls */}
           {audioUrl && (
             <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 mt-6 flex items-center justify-between gap-4">
                <button className="text-gray-400 hover:text-white" onClick={() => {if(audioRef.current) audioRef.current.currentTime -= 15}}><Rewind className="w-5 h-5"/></button>
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 text-white flex items-center justify-center pl-1 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  {isPlaying ? <Pause className="w-6 h-6 ml-[-4px]" /> : <Play className="w-6 h-6" />}
                </button>
                <button className="text-gray-400 hover:text-white" onClick={() => {if(audioRef.current) audioRef.current.currentTime += 15}}><FastForward className="w-5 h-5"/></button>
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
             </div>
           )}

           {/* Progress bar info */}
           {audioUrl && (
             <div className="w-full max-w-md pt-2">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all duration-300" style={{width: `${(currentTime/duration)*100}%`}}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
                  <span>{Math.floor(currentTime/60)}:{(Math.floor(currentTime)%60).toString().padStart(2,'0')}</span>
                  <span>{Math.floor(duration/60)}:{(Math.floor(duration)%60).toString().padStart(2,'0')}</span>
                </div>
             </div>
           )}

        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {data.script.map((line) => {
          const styling = getBackgroundColorForSpeaker(line.speakerName);
          return (
            <div key={line.id} className="group flex flex-col gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {line.speakerName}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {Math.floor(line.estimatedStartSeconds / 60)}:{(line.estimatedStartSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className={`p-4 rounded-2xl border ${styling}`}>
                <p className="text-[15px] leading-relaxed font-medium">
                  {line.dialogue}
                </p>
                {line.soundEffect && (
                  <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                    <Sparkles className="w-3 h-3" />
                    <span className="italic">{line.soundEffect}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
