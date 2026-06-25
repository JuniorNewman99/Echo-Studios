import { useState, useRef, useEffect } from "react";
import { UserPlus, Settings, Hash, Play, Grid3x3, Bookmark, Pencil, MoreVertical, MessageSquare, Mail, UserCheck, Eye } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { SettingsModal } from "./SettingsModal";

export function ProfileView() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<"followers" | "following" | null>(null);

  const [profile, setProfile] = useState({
    username: "echocreator_99",
    displayName: "Next-Gen Audio Producer",
    bio: "Synthesizing the sound patterns of tomorrow.🎙️✨",
    mascotId: "14" // random CSS mascot id
  });

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto p-6 pb-32 mt-12 flex flex-col items-center justify-center space-y-6 text-center">
         <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center border-4 border-[#08091a] shadow-xl">
            <UserPlus className="w-10 h-10 text-white" />
         </div>
         <div>
           <h2 className="text-2xl font-display font-bold text-white tracking-tight">Create your Profile</h2>
           <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">Sign in to publish your podcasts, gain followers, and access your personalized studio dashboard.</p>
         </div>
         <button 
           onClick={() => setIsSignedIn(true)}
           className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
         >
           Sign In with Echo
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-32">
      {/* Profile Header (Instagram style) */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-white/5 pb-8">
        <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 p-1">
             <div className="w-full h-full rounded-full bg-[#08091a] border-4 border-[#08091a] overflow-hidden flex items-center justify-center relative">
               <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.mascotId}&backgroundColor=111229`} alt="Creator Avatar" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <Pencil className="w-6 h-6 text-white drop-shadow-md" />
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
            <h2 className="text-xl font-display font-medium text-white">@{profile.username}</h2>
            <div className="flex items-center gap-2 relative">
              <button 
                onClick={() => setIsInboxOpen(!isInboxOpen)}
                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors relative"
              >
                <Mail className="w-5 h-5"/>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full border border-[#08091a]"></span>
              </button>
              
              {isInboxOpen && (
                <div className="absolute top-10 right-10 md:left-0 md:right-auto w-64 bg-[#111229] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden text-left">
                  <div className="p-3 border-b border-white/10 bg-white/[0.02]">
                    <h4 className="font-bold text-white text-sm">Inbox Activity</h4>
                  </div>
                  <div className="flex flex-col text-sm">
                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-white border-b border-white/5">
                      <MessageSquare className="w-4 h-4 text-blue-400" /> Message Requests <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">3</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-white border-b border-white/5">
                      <UserPlus className="w-4 h-4 text-purple-400" /> Friend Requests <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">12</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-white">
                      <Eye className="w-4 h-4 text-brand-400" /> Profile Visits <span className="ml-auto text-gray-400 text-xs">24 today</span>
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors"
              >
                <Settings className="w-5 h-5"/>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-8 text-sm relative">
            <div className="text-gray-400"><span className="text-white font-medium text-base">4</span> posts</div>
            <div 
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={() => setActiveDropdown(activeDropdown === 'followers' ? null : 'followers')}
            >
              <span className="text-white font-medium text-base">10.2k</span> followers
            </div>
            <div 
              className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={() => setActiveDropdown(activeDropdown === 'following' ? null : 'following')}
            >
              <span className="text-white font-medium text-base">34</span> following
            </div>

            {activeDropdown && (
              <UserListDropdown 
                type={activeDropdown} 
                onClose={() => setActiveDropdown(null)} 
              />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium text-white text-sm">{profile.displayName}</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto md:mx-0">{profile.bio}</p>
            <a href="#" className="text-sm text-brand-400 hover:underline">echostudios.app/{profile.username}</a>
          </div>
        </div>
      </div>

      {/* Grid Tabs */}
      <div className="flex items-center justify-center gap-12 font-medium text-sm border-b border-white/5 mb-6">
        <button className="flex items-center gap-2 text-white border-b-2 border-white pb-3 tracking-widest uppercase">
          <Grid3x3 className="w-4 h-4"/> Published
        </button>
        <button className="flex items-center gap-2 text-gray-500 pb-3 tracking-widest uppercase">
          <Bookmark className="w-4 h-4"/> Drafts
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/5 relative group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all z-10">
               <div className="flex items-center gap-2 text-white font-bold">
                 <Play className="w-6 h-6 fill-current"/> 1.2k
               </div>
            </div>
            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=ep${i}&backgroundColor=1e1b4b,312e81`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Cover"/>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          currentProfile={profile} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={(p) => { setProfile(p); setIsEditModalOpen(false); }} 
        />
      )}
      {isSettingsModalOpen && (
         <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
}

function UserListDropdown({ type, onClose }: { type: 'followers' | 'following', onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const users = [
    { id: 1, name: 'Alex Johnson', handle: 'alex_j' },
    { id: 2, name: 'Sarah Connor', handle: 'sarah_c' },
    { id: 3, name: 'Mike Ross', handle: 'mike_r' },
    { id: 4, name: 'Rachel Zane', handle: 'rachel_z' },
  ];

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-8 left-1/2 md:left-24 transform -translate-x-1/2 md:translate-x-0 w-64 bg-[#111229] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
    >
      <div className="p-3 border-b border-white/10 bg-white/[0.02]">
        <h4 className="font-bold text-white capitalize">{type}</h4>
      </div>
      <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {users.map((u) => (
          <UserListItem key={u.id} user={u} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

function UserListItem({ user, onClose }: { user: any, onClose: () => void }) {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleLeftClick = () => {
    if (contextMenu) {
      setContextMenu(null);
      return;
    }
    // visit profile
    console.log("Visit profile", user.handle);
    onClose();
  };

  useEffect(() => {
    function handleClick() {
      if (contextMenu) setContextMenu(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

  return (
    <>
      <div 
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 p-[1px] flex-shrink-0">
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.handle}&backgroundColor=111229`} alt="" className="w-full h-full rounded-full bg-[#08091a]" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-bold text-white truncate leading-tight">{user.name}</div>
          <div className="text-xs text-gray-400 truncate leading-tight">@{user.handle}</div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="fixed bg-[#1a1b36] border border-white/10 rounded-lg shadow-2xl py-1 z-[100] min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-brand-500/20 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Visit Profile
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-brand-500/20 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Friend
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-brand-500/20 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Send DM
          </button>
        </div>
      )}
    </>
  );
}
