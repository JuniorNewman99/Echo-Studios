import { useState } from "react";
import { Mic2, Play, Loader2, Sparkles, Wand2, Settings2 } from "lucide-react";
import { PRESET_TOPICS, HOSTER_PROFILES, AUDIO_MOODS, LANGUAGES } from "../presets";
import { PodcastMetadata } from "../types";

export function CreateView({ onGenerated, generatedPodcast }: { onGenerated: (data: PodcastMetadata) => void, generatedPodcast?: PodcastMetadata | null }) {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("short");
  const [selectedHosts, setSelectedHosts] = useState<string[]>(["maya", "marcus"]);
  const [musicMood, setMusicMood] = useState(AUDIO_MOODS[0].id);
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please provide a topic."); return; }
    if (selectedHosts.length === 0) { setError("Select at least one host."); return; }

    setIsGenerating(true);
    setError(null);

    try {
      const selectedProfiles = HOSTER_PROFILES.filter(h => selectedHosts.includes(h.id));
      const response = await fetch("/api/generate-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          duration,
          numSpeakers: selectedProfiles.length,
          speakers: selectedProfiles,
          musicMood: AUDIO_MOODS.find(m => m.id === musicMood)?.name || musicMood,
          language
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate podcast");
      }

      const data = await response.json();
      onGenerated(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleHost = (id: string) => {
    if (selectedHosts.includes(id)) {
      setSelectedHosts(prev => prev.filter(h => h !== id));
    } else {
      setSelectedHosts(prev => [...prev, id]);
    }
  };

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
    <div className={`p-6 pb-40 ${generatedPodcast ? "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl" : "max-w-2xl mx-auto space-y-8"}`}>
      <div className="space-y-8">
        <div className="text-center lg:text-left space-y-2 mb-8">
           <div className={`w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 ${!generatedPodcast ? "mx-auto" : ""}`}>
             <Mic2 className="w-8 h-8 text-brand-400" />
           </div>
           <h1 className="text-3xl font-display font-bold text-white tracking-tight">Create an Episode</h1>
           <p className="text-gray-400 text-sm">Design the topic, pick your hosts, and let ECHO do the rest.</p>
        </div>

        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wide text-brand-200 uppercase flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Topic
            </label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should the hosts discuss?"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors resize-none h-24 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(preset.topic + " - " + preset.description)}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-300 transition-colors"
                >
                  {preset.emoji} {preset.category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wide text-brand-200 uppercase flex items-center gap-2">
              <Mic2 className="w-3 h-3" /> Select Cast
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOSTER_PROFILES.map((host) => {
                const isSelected = selectedHosts.includes(host.id);
                return (
                  <button
                    key={host.id}
                    onClick={() => toggleHost(host.id)}
                    className={`flex items-start text-left p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? "bg-brand-500/20 border-brand-500/50" 
                        : "bg-white/5 border-white/5 hover:border-white/20 opacity-70"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">{host.name}</span>
                        <span className="text-[9px] text-brand-300 uppercase tracking-wider">{host.role}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-xs font-semibold tracking-wide text-brand-200 uppercase flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> Production Settings
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none"
              >
                <option value="short">Short Snack</option>
                <option value="medium">Standard Size</option>
                <option value="long">Deep Dive</option>
              </select>
              <select 
                value={musicMood} 
                onChange={(e) => setMusicMood(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none"
              >
                {AUDIO_MOODS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim() || selectedHosts.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Writing Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Episode
              </>
            )}
          </button>
        </div>
      </div>

      {generatedPodcast && (
        <div className="bg-[#0c0d21]/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-mono">
            SCRIPT PREVIEW
          </div>
          <h2 className="text-2xl font-display font-medium text-white">{generatedPodcast.title}</h2>
          <p className="text-gray-400 text-sm">{generatedPodcast.tagline}</p>
          
          <div className="space-y-4 mt-6">
            {generatedPodcast.script.map((line) => {
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
                  <div className={`p-4 rounded-xl border ${styling}`}>
                    <p className="text-[14px] leading-relaxed font-medium">
                      {line.dialogue}
                    </p>
                    {line.soundEffect && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] opacity-70">
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
      )}
    </div>
  );
}
