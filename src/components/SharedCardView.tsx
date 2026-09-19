import React, { useState } from 'react';
import { Sparkles, Heart, Volume2, RotateCcw, Send, MessageSquareHeart, Mail, Bell } from 'lucide-react';
import { playDhaakSound, playShankhoSound, playDhaakBeat } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface SharedCardViewProps {
  cardData: {
    from: string;
    to: string;
    message: string;
    theme: string;
    imageUrl?: string;
  };
  onReset: () => void;
  onPostToWall: (sender: string, message: string, theme: string) => void;
}

const THEMES: Record<string, { bg: string; cardBg: string; badge: string }> = {
  'royal-maroon': {
    bg: 'bg-gradient-to-br from-red-950/80 via-rose-950/70 to-amber-950/80',
    cardBg: 'bg-gradient-to-br from-red-950/70 via-rose-900/50 to-amber-950/70 border-amber-400/70',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  'dhunuchi-orange': {
    bg: 'bg-gradient-to-br from-amber-950/80 via-orange-950/70 to-red-950/80',
    cardBg: 'bg-gradient-to-br from-orange-950/70 via-amber-900/50 to-red-950/70 border-orange-400/70',
    badge: 'bg-orange-500/20 text-orange-200 border-orange-500/40'
  },
  'midnight-gold': {
    bg: 'bg-gradient-to-br from-slate-950/80 via-indigo-950/70 to-amber-950/80',
    cardBg: 'bg-gradient-to-br from-indigo-950/70 via-slate-900/50 to-amber-950/70 border-amber-400/70',
    badge: 'bg-amber-400/20 text-amber-200 border-amber-400/40'
  },
  'festive-red': {
    bg: 'bg-gradient-to-br from-red-900/80 via-rose-950/70 to-stone-900/80',
    cardBg: 'bg-gradient-to-br from-rose-950/70 via-red-950/50 to-stone-900/70 border-rose-400/70',
    badge: 'bg-rose-500/20 text-rose-200 border-rose-500/40'
  }
};

export const SharedCardView: React.FC<SharedCardViewProps> = ({ cardData, onReset, onPostToWall }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isSindoorBursting, setIsSindoorBursting] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySender, setReplySender] = useState('');
  const [replied, setReplied] = useState(false);

  const themeObj = THEMES[cardData.theme] || THEMES['royal-maroon'];

  const triggerFlowerBlessing = () => {
    playDhaakBeat();
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#f59e0b', '#dc2626', '#fbbf24', '#f43f5e', '#ffffff', '#e11d48']
    });
  };

  const handleOpenCard = () => {
    setIsSindoorBursting(true);
    playShankhoSound();
    triggerFlowerBlessing();
    setTimeout(() => {
      setIsOpened(true);
      setIsSindoorBursting(false);
    }, 1100);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replySender.trim() || !replyMessage.trim()) return;
    playDhaakSound();
    triggerFlowerBlessing();
    onPostToWall(replySender, replyMessage, cardData.theme);
    setReplied(true);
  };

  return (
    <div className={`h-full overflow-y-auto text-amber-100 py-4 px-3 flex flex-col items-center justify-start sm:justify-center relative custom-scrollbar`}>
      {/* Background Floating Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sindoor Burst / Opening Animation Overlay */}
      <AnimatePresence>
        {isSindoorBursting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 bg-opacity-95 backdrop-blur-md"
          >
            <div className="text-center space-y-4 p-8">
              <div className="text-6xl animate-bounce">🔴✨</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-widest drop-shadow-lg">
                সিঁদুর আশীর্বাদ ও শাঁখ ধ্বনি...
              </h2>
              <p className="text-amber-100 text-lg font-serif">আপনার জন্য শারদীয়ার পবিত্র চিঠি খোলা হচ্ছে!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-xl w-full mx-auto relative z-10 space-y-6">
        {/* Top bar with back to home option */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-amber-300/80 font-serif flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> শারদীয় শুভেচ্ছা কার্ড
          </span>
          <button
            id="shared-header-back-btn"
            onClick={onReset}
            className="text-xs text-amber-300/70 hover:text-amber-200 underline decoration-amber-500/40 transition-colors font-serif"
          >
            মূল পাতায় ফিরুন
          </button>
        </div>

        {!isOpened ? (
          /* Letter Box / Envelope View with Glass Finish */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-stone-950/20 hover:bg-stone-950/25 backdrop-blur-md border-2 border-amber-400/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden ring-4 ring-amber-500/20 group cursor-pointer"
            onClick={handleOpenCard}
          >
            <div className="absolute top-3 left-3 text-amber-400 text-sm">🪷</div>
            <div className="absolute top-3 right-3 text-amber-400 text-sm">🪷</div>

            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-red-900/55 group-hover:scale-110 transition-transform">
              <Mail className="w-10 h-10 text-amber-300 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                🌸 একটি বিশেষ চিঠি এসেছে
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-200">
                {cardData.from} এর পক্ষ থেকে শারদীয়ার শুভেচ্ছা!
              </h2>
              <p className="text-xs text-amber-300/80">প্রাপক: <span className="font-bold text-white">{cardData.to}</span></p>
            </div>

            <div className="bg-stone-950/40 backdrop-blur-sm p-4 rounded-2xl border border-amber-500/30 text-xs text-amber-200/90 italic font-serif">
              "চিঠিটি খুলতে নিচের বাটনে ক্লিক করুন..."
            </div>

            <button
              onClick={handleOpenCard}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-bold py-4 px-8 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
            >
              <Sparkles className="w-5 h-5" /> চিঠি খুলুন (Open with Sindoor Blessing)
            </button>
          </motion.div>
        ) : (
          /* Opened Greeting Card View */
          <>
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> শারদীয়ার বিশেষ শুভেচ্ছা কার্ড
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-200 tracking-wide drop-shadow-md">
                শুভ শারদীয়া ২০২৬!
              </h2>
            </div>

            {/* The Greeting Card with Floating Motion & Glowing Aura */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-400/50 to-red-500/30 blur-xl opacity-85 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

              <div className={`rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-amber-400/70 ${themeObj.cardBg} backdrop-blur-xl relative overflow-hidden ring-2 ring-amber-300/30`}>
                {/* Traditional Corner Ornaments */}
                <div className="absolute top-2 left-2 text-amber-400 text-xs opacity-75 select-none">🪷</div>
                <div className="absolute top-2 right-2 text-amber-400 text-xs opacity-75 select-none">🪷</div>

                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/25 flex items-center justify-center border border-amber-400/50 shadow-sm">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                    <span className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                      দুর্গাপূজা শুভেচ্ছা ২০২৬
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={triggerFlowerBlessing}
                      title="পুষ্পাঞ্জলি দিন"
                      className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-400/40 transition-all backdrop-blur-sm"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> পুষ্পাঞ্জলি
                    </button>
                    <button
                      onClick={playDhaakSound}
                      title="ঢাক বাজান"
                      className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-400/40 transition-all backdrop-blur-sm"
                    >
                      <Volume2 className="w-3 h-3 text-amber-400" /> ঢাক
                    </button>
                    <button
                      onClick={playShankhoSound}
                      title="শাঁখ বাজান"
                      className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-400/40 transition-all backdrop-blur-sm"
                    >
                      <Bell className="w-3 h-3 text-amber-400" /> শাঁখ
                    </button>
                  </div>
                </div>

                {/* Divine Sanskrit Shlok Banner */}
                <div className="py-1 px-3 my-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center backdrop-blur-sm">
                  <p className="text-[10px] sm:text-[11px] font-serif text-amber-200/90 tracking-wide">
                    সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে। শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তু তে॥
                  </p>
                </div>

                {/* Divine Festive Banner */}
                <div className="mb-5 rounded-2xl overflow-hidden border-2 border-amber-400/50 h-48 sm:h-64 shadow-lg relative group bg-stone-950">
                  <img
                    src={cardData.imageUrl || '/slide1.jpg'}
                    alt="Maa Durga Artwork"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex items-end justify-between p-3 pointer-events-none">
                    <span className="text-xs sm:text-sm font-serif text-amber-200 font-bold drop-shadow">🌸 শুভ শারদীয়া শুভেচ্ছা ২০২৬</span>
                    <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">ঐশ্বরিক রূপ</span>
                  </div>
                </div>

                {/* To */}
                <div className="mb-3 space-y-1">
                  <p className="text-xs text-amber-300/80 uppercase tracking-widest font-semibold">প্রিয়:</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight drop-shadow-sm">
                    {cardData.to}
                  </h3>
                </div>

                {/* Message */}
                <div className="bg-stone-950/35 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-amber-400/30 mb-6 shadow-inner">
                  <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-serif italic whitespace-pre-wrap">
                    "{cardData.message}"
                  </p>
                </div>

                {/* From */}
                <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-300/70 uppercase tracking-wider">শুভেচ্ছান্তে:</p>
                    <h4 className="text-base sm:text-lg font-bold text-amber-200 font-serif">
                      {cardData.from}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-400/40">
                    <Heart className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-semibold">শুভ দুর্গোৎসব</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reply / Send Wish Back Box - Transparent Glass */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-stone-950/20 hover:bg-stone-950/25 border border-amber-400/35 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden"
            >
              <h3 className="text-lg font-bold font-serif text-amber-300 mb-4 flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-amber-400" /> আপনিও শুভেচ্ছা পাঠান বা উত্তর দিন
              </h3>

              {replied ? (
                <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/40 rounded-2xl p-5 text-center space-y-2">
                  <p className="text-emerald-300 font-bold text-sm">আপনার শুভেচ্ছা সফলভাবে পাবলিক ওয়ালে পোস্ট করা হয়েছে! 🎉</p>
                  <p className="text-xs text-emerald-200/80">ধন্যবাদ শারদীয়ার আনন্দ ভাগ করে নেওয়ার জন্য।</p>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                      আপনার নাম (Your Name):
                    </label>
                    <input
                      type="text"
                      value={replySender}
                      onChange={(e) => setReplySender(e.target.value)}
                      placeholder="আপনার নাম লিখুন..."
                      className="w-full bg-stone-950/30 backdrop-blur-sm border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                      আপনার বার্তা (Reply Message):
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="পাল্টা শুভেচ্ছা বা বার্তা লিখুন..."
                      rows={3}
                      className="w-full bg-stone-950/30 backdrop-blur-sm border border-amber-400/30 rounded-xl p-4 text-xs text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 leading-relaxed"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" /> শুভেচ্ছা পাঠান (Send Wish)
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

