import React, { useState } from 'react';
import { Sparkles, MessageSquareHeart, Clock, Volume2, Music, Bell } from 'lucide-react';
import { ActiveTab } from '../types';
import { playDhaakSound, playShankhoSound, toggleFestiveBGM } from '../utils/audio';

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
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
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
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-medium px-3 py-1.5 rounded-full text-xs shadow-md transition-all hover:scale-105 active:scale-95 border border-amber-300/40"
              title="নতুন কার্ড তৈরি করুন"
              aria-label="নতুন কার্ড তৈরি করুন"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>নতুন কার্ড তৈরি করুন</span>
            </button>
          </div>
        ) : (
          <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-amber-500/20 shadow-inner">
            <button
              id="nav-create-card-btn"
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                  : 'text-amber-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
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

        {/* Festive Sound Button & BGM Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const newState = !isBgmPlaying;
              setIsBgmPlaying(newState);
              toggleFestiveBGM(newState);
            }}
            title="ব্যাকগ্রাউন্ড মিউজিক (BGM)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shadow-sm border ${
              isBgmPlaying 
                ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-amber-500/30' 
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isBgmPlaying ? 'মিউজিক চালু' : 'মিউজিক'}</span>
          </button>

          <button
            onClick={playDhaakSound}
            title="মধুর ঢাকের আওয়াজ শুনুন"
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>ঢাক</span>
          </button>

          <button
            onClick={playShankhoSound}
            title="পবিত্র শাঁখের ধ্বনি"
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>শাঁখ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
