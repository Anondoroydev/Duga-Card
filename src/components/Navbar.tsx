import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Clock, Volume2, Music, Bell, Disc } from 'lucide-react';
import { ActiveTab } from '../types';
import { 
  playDhaakSound, 
  playShankhoSound, 
  toggleFestiveBGM, 
  setBGMTrack, 
  getCurrentBGMTrack,
  getActiveSound,
  ActiveSoundType
} from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetShare: () => void;
  isSharedView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetShare,
  isSharedView,
}) => {
  const [activeSound, setActiveSound] = useState<ActiveSoundType>(getActiveSound());
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'mahalaya' | 'dhaak'>(getCurrentBGMTrack());
  const [showTrackMenu, setShowTrackMenu] = useState(false);

  useEffect(() => {
    const handleSoundUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ activeSound: ActiveSoundType; isBgmActive: boolean; track: 'mahalaya' | 'dhaak' }>;
      if (customEvent.detail) {
        setActiveSound(customEvent.detail.activeSound);
        setIsBgmPlaying(customEvent.detail.isBgmActive);
        if (customEvent.detail.track) {
          setSelectedTrack(customEvent.detail.track);
        }
      }
    };
    window.addEventListener('festive-sound-update', handleSoundUpdate);
    return () => window.removeEventListener('festive-sound-update', handleSoundUpdate);
  }, []);
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-red-950/95 via-amber-950/95 to-red-950/95 border-b border-amber-500/30 text-amber-100 shadow-xl backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Logo & Title */}
        <div 
          onClick={onResetShare}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-md shadow-red-900/50 group-hover:scale-105 transition-transform border border-amber-300">
            <img 
              src="/src/assets/images/durga_logo_1789832821020.jpg" 
              alt="Durga Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide font-serif text-amber-200 drop-shadow-sm leading-tight">
              শুভ শারদীয়া ২০২৬
            </h1>
            <p className="text-[10px] text-amber-300/80 tracking-wider hidden sm:block">
              দুর্গাপূজা শুভেচ্ছা ও শেয়ারিং পোর্টাল
            </p>
          </div>
        </div>

        {/* Navigation Tabs / Actions */}
        {isSharedView ? (
          <div className="flex items-center gap-2">
            <button
              id="nav-shared-create-card-btn"
              onClick={() => {
                onResetShare();
                setActiveTab('create');
              }}
              className="flex items-center bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-medium px-3 py-1.5 rounded-full text-xs shadow-md transition-all hover:scale-105 active:scale-95 border border-amber-300/40"
              title="নতুন কার্ড তৈরি করুন"
              aria-label="নতুন কার্ড তৈরি করুন"
            >
              <span>নতুন কার্ড তৈরি করুন</span>
            </button>
          </div>
        ) : (
          <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-amber-500/20 shadow-inner">
            <button
              id="nav-create-card-btn"
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                  : 'text-amber-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              কার্ড তৈরি
            </button>
            <button
              onClick={() => setActiveTab('wall')}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'wall'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                  : 'text-amber-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              শুভেচ্ছা ওয়াল
            </button>
            <button
              onClick={() => setActiveTab('countdown')}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'countdown'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                  : 'text-amber-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              পূজার দিনপঞ্জি
            </button>
          </nav>
        )}

        {/* Festive Sound Button & Original Music BGM Toggle */}
        <div className="flex items-center gap-1.5 relative">
          {/* Track Selector Dropdown Menu */}
          {showTrackMenu && (
            <div className="absolute top-full right-0 mt-2 bg-stone-900/95 border border-amber-500/40 rounded-xl p-2 shadow-2xl z-50 min-w-[200px] backdrop-blur-md">
              <div className="text-[10px] text-amber-300/80 font-bold px-2 py-1 uppercase tracking-wider border-b border-white/10 mb-1">
                গান / বাদ্য নির্বাচন করুন
              </div>
              <button
                onClick={() => {
                  setSelectedTrack('mahalaya');
                  setBGMTrack('mahalaya');
                  setShowTrackMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                  selectedTrack === 'mahalaya'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                <span>🎶 মহালয়া ও স্তোত্র</span>
                {selectedTrack === 'mahalaya' && <span className="text-[10px] font-bold">✓</span>}
              </button>
              <button
                onClick={() => {
                  setSelectedTrack('dhaak');
                  setBGMTrack('dhaak');
                  setShowTrackMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                  selectedTrack === 'dhaak'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                <span>🥁 আসল পূজার ঢাক</span>
                {selectedTrack === 'dhaak' && <span className="text-[10px] font-bold">✓</span>}
              </button>
            </div>
          )}

          {/* Original BGM Button */}
          <div className="flex items-center rounded-lg bg-amber-500/20 border border-amber-500/40 overflow-hidden shadow-sm">
            <button
              onClick={() => {
                const newState = !isBgmPlaying;
                setIsBgmPlaying(newState);
                toggleFestiveBGM(newState, selectedTrack);
              }}
              title="অরিজিনাল আবহ সঙ্গীত চালু / বন্ধ করুন"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all ${
                isBgmPlaying 
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-amber-500/30' 
                  : 'hover:bg-amber-500/30 text-amber-200'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-spin' : ''}`} />
              <span>{isBgmPlaying ? (selectedTrack === 'mahalaya' ? 'মহালয়া বাজছে' : 'ঢাক বাজছে') : 'আসল মিউজিক'}</span>
            </button>
            <button
              onClick={() => setShowTrackMenu(!showTrackMenu)}
              title="ট্র্যাক পরিবর্তন করুন"
              className={`px-1.5 py-1 text-xs border-l border-amber-500/30 transition-all ${
                isBgmPlaying ? 'bg-amber-400 text-stone-950' : 'hover:bg-white/10 text-amber-300'
              }`}
            >
              <Disc className="w-3 h-3" />
            </button>
          </div>

          {/* Dhaak Button */}
          <button
            onClick={playDhaakSound}
            title={activeSound === 'dhaak' ? "ঢাক বাজছে (থামাতে ক্লিক করুন)" : "আসল লাইভ ঢাকের বোল শুনুন"}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 border ${
              activeSound === 'dhaak'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-amber-500/30 scale-105'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40 hover:scale-105'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${activeSound === 'dhaak' ? 'text-stone-950 animate-bounce' : 'text-amber-400'}`} />
            <span>{activeSound === 'dhaak' ? 'ঢাক বাজছে' : 'ঢাক'}</span>
          </button>

          {/* Shankho Button */}
          <button
            onClick={playShankhoSound}
            title={activeSound === 'shankh' ? "শাঁখ বাজছে (থামাতে ক্লিক করুন)" : "পবিত্র শাঁখের ধ্বনি"}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 border ${
              activeSound === 'shankh'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-amber-500/30 scale-105'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40 hover:scale-105'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${activeSound === 'shankh' ? 'text-stone-950 animate-pulse' : 'text-amber-400'}`} />
            <span>{activeSound === 'shankh' ? 'শাঁখ বাজছে' : 'শাঁখ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
