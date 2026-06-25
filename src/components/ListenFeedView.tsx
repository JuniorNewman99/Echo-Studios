import { useState } from "react";
import { Mic2, PlayCircle, Search, Filter, Headphones, Heart, Share2, Clock, CheckCircle } from "lucide-react";
import { AUDIO_MOODS } from "../presets";

// Mock data for the feed
const DISCOVERY_PODCASTS = [
  {
    id: 1,
    title: "The Future of AI Hardware",
    author: "@tech_guru",
    duration: "4:20",
    mood: "Analytical",
    hostCount: 2,
    likes: 1240,
    plays: "14.2k",
    gradient: "from-blue-600 to-indigo-900"
  },
  {
    id: 2,
    title: "Meditations on Mars",
    author: "@space_cadet",
    duration: "7:15",
    mood: "Chill",
    hostCount: 1,
    likes: 856,
    plays: "8.9k",
    gradient: "from-orange-500 to-red-900"
  },
  {
    id: 3,
    title: "Syntax Error: Why We Love Bugs",
    author: "@dev_life",
    duration: "12:05",
    mood: "Energetic",
    hostCount: 3,
    likes: 2100,
    plays: "45k",
    gradient: "from-green-500 to-emerald-900"
  },
  {
    id: 4,
    title: "Deep Dive: Quiet Quitting",
    author: "@hr_insights",
    duration: "5:30",
    mood: "Professional",
    hostCount: 2,
    likes: 420,
    plays: "3.1k",
    gradient: "from-slate-600 to-slate-900"
  },
  {
    id: 5,
    title: "Midnight Lo-Fi Beats & Chat",
    author: "@nightowl",
    duration: "45:00",
    mood: "Chill",
    hostCount: 1,
    likes: 3500,
    plays: "112k",
    gradient: "from-purple-600 to-fuchsia-900"
  }
];

export function ListenFeedView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("All");

  const filtered = DISCOVERY_PODCASTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood === "All" || p.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 pb-32 space-y-6">
      <div className="space-y-2 mb-8">
         <h1 className="text-3xl font-display font-bold text-white tracking-tight">Discover</h1>
         <p className="text-gray-400 text-sm">Listen to AI-synthesized podcasts from the community.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search shows and creators..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors text-sm"
          />
        </div>
        <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-x-auto custom-scrollbar">
           <button 
             onClick={() => setSelectedMood("All")}
             className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${selectedMood === "All" ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:text-white"}`}
           >
             All
           </button>
           {AUDIO_MOODS.map(m => (
             <button 
               key={m.id}
               onClick={() => setSelectedMood(m.name)}
               className={`px-4 py-3 text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${selectedMood === m.name ? "bg-white/10 text-white font-medium border-l border-white/5" : "text-gray-400 hover:text-white border-l border-transparent"}`}
             >
               {m.name}
             </button>
           ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No podcasts found matching your search.</div>
        )}
        {filtered.map(podcast => (
          <div key={podcast.id} className="group bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer">
            <div className={`w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br ${podcast.gradient} flex items-center justify-center shadow-inner relative overflow-hidden`}>
              <PlayCircle className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"/>
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-semibold text-brand-300 uppercase tracking-widest">{podcast.mood}</span>
                 <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {podcast.duration}</span>
               </div>
               <h3 className="text-lg font-bold text-white truncate">{podcast.title}</h3>
               <p className="text-sm text-gray-400 mt-0.5">{podcast.author}</p>
            </div>
            
            <div className="hidden sm:flex items-center gap-6 pr-4">
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-pink-400 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium">{podcast.likes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-400 transition-colors">
                <Headphones className="w-4 h-4" />
                <span className="text-xs font-medium">{podcast.plays}</span>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors p-2">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
