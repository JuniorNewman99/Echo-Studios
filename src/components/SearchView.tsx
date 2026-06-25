import React, { useState } from "react";
import { Search, Filter, Mic2, UserCircle, Play, SlidersHorizontal, Flame, Clock } from "lucide-react";

export function SearchView() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"a-z" | "old-new" | "topic" | "popularity" | "duration">("popularity");
  const [searchCategory, setSearchCategory] = useState<"all" | "podcasts" | "users">("all");

  const filterOptions = [
    { id: "a-z", label: "A-Z" },
    { id: "old-new", label: "Old-New" },
    { id: "topic", label: "Topic" },
    { id: "popularity", label: "Popularity" },
    { id: "duration", label: "Duration" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 pb-32">
      <div className="sticky top-0 z-10 bg-[#08091a]/95 backdrop-blur-md pt-2 pb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search users, podcasts, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-between items-start sm:items-center">
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            {(["all", "podcasts", "users"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${searchCategory === cat ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-brand-400 shrink-0 mr-1" />
            {filterOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilterType(opt.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${filterType === opt.id ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Results Mock */}
        {searchCategory !== "users" && (
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2"><Mic2 className="w-5 h-5 text-brand-400"/> Top Podcasts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                       <Play className="w-8 h-8 text-white fill-current" />
                     </div>
                     <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=search${i}&backgroundColor=1e1b4b,312e81`} alt="Podcast" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate group-hover:text-brand-300 transition-colors">The Future of AI #{i}</h4>
                    <p className="text-sm text-gray-400 truncate">Tech Talk Weekly</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400"/> 12.4k</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 45:00</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchCategory !== "podcasts" && (
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2"><UserCircle className="w-5 h-5 text-purple-400"/> People</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-14 h-14 rounded-full bg-[#08091a] border border-white/10 overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=user${i}&backgroundColor=111229`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">Creator User_{i}</h4>
                    <p className="text-sm text-gray-400 truncate">@creator_{i}</p>
                  </div>
                  <button className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
