import { PodcastMetadata } from "../types";
import { Share2, Rss, UploadCloud, Link, Podcast, Music, Cast } from "lucide-react";

export function PublishView({ data }: { data: PodcastMetadata | null }) {
  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40 pb-32">
        <UploadCloud className="w-12 h-12 text-brand-500 mb-4" />
        <h3 className="text-xl font-display font-medium text-white mb-2">Build your pipeline</h3>
        <p className="text-gray-400 text-sm text-center">First create an episode, then publish it everywhere.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-32 space-y-8">
      <div className="text-center space-y-2 mb-8">
         <h1 className="text-3xl font-display font-bold text-white tracking-tight">Publish to Studios</h1>
         <p className="text-gray-400 text-sm">Push your orchestrated show to Spotify, Apple, and beyond.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-32 h-32 shrink-0 bg-gradient-to-tr from-brand-600 to-purple-800 rounded-xl shadow-lg border border-white/10 p-4 flex flex-col justify-end">
           <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/40 self-start px-2 py-0.5 rounded backdrop-blur-md">ECHO</span>
           <span className="text-white text-xs font-medium leading-tight mt-2 line-clamp-2">{data.title}</span>
        </div>
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <h2 className="text-xl font-display font-bold text-white">{data.title}</h2>
          <p className="text-sm text-gray-400 line-clamp-2">{data.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-brand-200 uppercase">Distribution Pipeline</h3>
        
        <div className="grid gap-3">
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/20 transition-colors">
            <span className="font-bold text-[#1DB954] flex items-center gap-3"><Music className="w-5 h-5"/> Spotify for Podcasters</span>
            <Share2 className="w-5 h-5 text-[#1DB954]" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#c250df]/10 hover:bg-[#c250df]/20 border border-[#c250df]/20 transition-colors">
            <span className="font-bold text-[#ea7edc] flex items-center gap-3"><Podcast className="w-5 h-5"/> Apple Podcasts Connect</span>
            <Share2 className="w-5 h-5 text-[#ea7edc]" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors">
            <span className="font-bold text-blue-400 flex items-center gap-3"><Cast className="w-5 h-5"/> Google Podcasts</span>
            <Share2 className="w-5 h-5 text-blue-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors mt-4">
            <span className="font-medium text-orange-400 flex items-center gap-3"><Rss className="w-5 h-5"/> Generate Public RSS Feed</span>
            <Link className="w-5 h-5 text-orange-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors mt-4">
            <span className="font-bold text-cyan-400 flex items-center gap-3"><Podcast className="w-5 h-5"/> Amazon Music</span>
            <Share2 className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
