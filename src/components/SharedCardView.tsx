import React, { useState } from 'react';
import { Heart, Volume2, RotateCcw, Send, MessageSquareHeart, Mail } from 'lucide-react';
import { playDhaakSound, playDhaakBeat } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { LovelyBirdsScene } from './LovelyBirdsScene';

import whitePigeonImg from '../assets/images/white_pigeon_bird_1789841410480.jpg';
import colorfulBirdImg from '../assets/images/colorful_bird_1789841425106.jpg';

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

export const SharedCardView: React.FC<SharedCardViewProps> = ({ cardData, onReset, onPostToWall }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [openingPhase, setOpeningPhase] = useState<'closed' | 'quarrel' | 'ripping' | 'burst'>('closed');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySender, setReplySender] = useState('');
  const [replied, setReplied] = useState(false);

  const themeObj = THEMES[cardData.theme] || THEMES['royal-maroon'];

  const triggerFlowerBlessing = () => {
    // Immediate big festive flower confetti explosion
    confetti({
      particleCount: 140,
      spread: 120,
      startVelocity: 50,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#dc2626', '#fbbf24', '#f43f5e', '#ffffff', '#e11d48', '#d97706']
    });
    // Secondary burst for extra excitement
    setTimeout(() => {
      confetti({
        particleCount: 85,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#fbbf24', '#dc2626', '#ffffff']
      });
      confetti({
        particleCount: 85,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#fbbf24', '#dc2626', '#ffffff']
      });
    }, 280);
  };

  const handleOpenCard = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    setOpeningPhase('quarrel');

    // Doves fly towards center flap and pull apart gracefully
    setTimeout(() => {
      setOpeningPhase('ripping');
      triggerFlowerBlessing();
    }, 2000);

    // Flap tears open with festive burst
    setTimeout(() => {
      setOpeningPhase('burst');
    }, 2800);

    // Reveal full card
    setTimeout(() => {
      setIsOpened(true);
      setIsOpening(false);
      setOpeningPhase('closed');
    }, 3600);
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

      <div className="max-w-xl w-full mx-auto relative z-10 space-y-6 pt-16 sm:pt-20">
        {/* Top bar with back to home option */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-amber-300/80 font-serif flex items-center gap-1.5">
            শারদীয় শুভেচ্ছা কার্ড
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
          /* Fixed Envelope View with Stationary Container & Pecking/Nibbling Birds Animation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-red-950/40 via-amber-950/30 to-red-950/40 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-9 shadow-2xl text-center space-y-5 relative overflow-visible ring-4 ring-amber-400/30 group cursor-pointer"
            style={{ perspective: '1200px' }}
            onClick={handleOpenCard}
          >
            <div className="absolute top-3 left-3 text-amber-300 text-base">🪷</div>
            <div className="absolute top-3 right-3 text-amber-300 text-base">🪷</div>

            {/* Envelope Container with Splitting Halves on Tear */}
            <div className="relative w-full max-w-md mx-auto min-h-[220px] flex items-center justify-center overflow-visible">
              
              {/* Left Envelope Half (Rips & Swings Left with Jagged Torn Paper Edges & Fibers) */}
              <motion.div
                animate={
                  openingPhase === 'ripping' || openingPhase === 'burst'
                    ? { x: -240, rotate: -35, opacity: 0, scale: 0.85 }
                    : { x: 0, rotate: 0, opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-red-900/95 via-red-950/95 to-amber-900/95 border-2 border-r-0 border-amber-300/90 rounded-l-2xl shadow-2xl z-20 overflow-hidden pointer-events-none flex items-center justify-end"
              >
                {/* White inner paper tear fibers texture */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-amber-100/90 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                <svg viewBox="0 0 24 200" preserveAspectRatio="none" className="h-full w-6 text-amber-100 fill-amber-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] z-10">
                  <polygon points="0,0 24,12 8,25 24,40 6,55 24,70 8,85 24,100 5,115 24,130 8,145 24,160 5,175 24,200 0,200" />
                </svg>
              </motion.div>

              {/* Right Envelope Half (Rips & Swings Right with Jagged Torn Paper Edges & Fibers) */}
              <motion.div
                animate={
                  openingPhase === 'ripping' || openingPhase === 'burst'
                    ? { x: 240, rotate: 35, opacity: 0, scale: 0.85 }
                    : { x: 0, rotate: 0, opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-red-900/95 via-red-950/95 to-amber-900/95 border-2 border-l-0 border-amber-300/90 rounded-r-2xl shadow-2xl z-20 overflow-hidden pointer-events-none flex items-center justify-start"
              >
                {/* White inner paper tear fibers texture */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-100 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                <svg viewBox="0 0 24 200" preserveAspectRatio="none" className="h-full w-6 text-amber-100 fill-amber-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] z-10">
                  <polygon points="24,0 0,12 18,25 0,40 18,55 0,70 18,85 0,100 19,115 0,130 18,145 0,160 19,175 0,200 24,200" />
                </svg>
              </motion.div>

              {/* Ethereal Graceful Doves Component */}
              <LovelyBirdsScene phase={openingPhase} />

              {/* Flying Torn Paper Shreds & Scraps Effect */}
              {openingPhase === 'ripping' && (
                <div className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center">
                  {/* Paper Shred 1 */}
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0.5, rotate: 0, opacity: 1 }}
                    animate={{ x: -140, y: -90, scale: 1.4, rotate: -280, opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute bg-amber-100 text-red-900 border border-amber-400 font-serif text-xs px-2 py-1 rounded shadow-lg"
                  >
                    📜 কাগজ...
                  </motion.div>

                  {/* Paper Shred 2 */}
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0.5, rotate: 0, opacity: 1 }}
                    animate={{ x: 140, y: -80, scale: 1.4, rotate: 280, opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute bg-red-800 text-amber-100 border border-amber-300 font-serif text-xs px-2 py-1 rounded shadow-lg"
                  >
                    📄 ছিঁড়ে গেল!
                  </motion.div>

                  {/* Paper Shred 3 & 4 */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute text-5xl pointer-events-none"
                  >
                    📜📄🪶🌸
                  </motion.div>
                </div>
              )}

              {/* Golden Seal in Middle */}
              <motion.div
                animate={
                  openingPhase === 'ripping' || openingPhase === 'burst'
                    ? { scale: 2.5, opacity: 0 }
                    : openingPhase === 'quarrel'
                    ? { scale: [1, 1.25, 1], rotate: [0, 12, -12, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
                className="absolute z-30 w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border-2 border-white flex items-center justify-center shadow-2xl shadow-red-950 ring-2 ring-red-600 pointer-events-none"
              >
                <span className="text-2xl">🔴</span>
              </motion.div>

              {/* Inner Letter Card (Bursts Out of Rip Seam) */}
              <motion.div
                animate={
                  openingPhase === 'burst'
                    ? { scale: 1.05, y: 0, opacity: 1 }
                    : openingPhase === 'ripping'
                    ? { scale: 0.98, y: 0, opacity: 1 }
                    : { scale: 0.92, y: 0 }
                }
                transition={{ duration: 0.5, ease: "backOut" }}
                className="w-full bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border-2 border-amber-400 rounded-xl p-5 shadow-2xl relative z-10 space-y-3 text-stone-900"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center shadow-md">
                  <Mail className="w-8 h-8 text-red-700 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-red-900">
                    {cardData.from} এর বিশেষ বার্তা
                  </h2>
                  <p className="text-xs sm:text-sm font-serif font-bold text-amber-950">
                    প্রাপক: <span className="text-red-900 font-extrabold">{cardData.to}</span>
                  </p>
                </div>
              </motion.div>
            </div>

            <button
              id="open-card-bird-btn"
              onClick={handleOpenCard}
              disabled={isOpening}
              className="w-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-200 disabled:opacity-80"
            >
              {isOpening ? 'চিঠি খোলা হচ্ছে... 🌸' : 'চিঠি খুলুন ✉️'}
            </button>
          </motion.div>
        ) : (
          /* Opened Greeting Card View */
          <>
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm">
                শারদীয়ার বিশেষ শুভেচ্ছা কার্ড
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-200 tracking-wide drop-shadow-md">
                শুভ শারদীয়া ২০২৬!
              </h2>
            </div>

            {/* The Greeting Card with Floating Motion & Glowing Aura */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Animated Birds Always Present on Top Corners of Opened Card */}
              <LovelyBirdsScene phase="opened" />

              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-400/50 to-red-500/30 blur-xl opacity-85 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

              <div className={`rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-amber-400/70 ${themeObj.cardBg} relative overflow-hidden ring-2 ring-amber-300/30`}>
                {/* Traditional Corner Ornaments */}
                <div className="absolute top-2 left-2 text-amber-400 text-xs opacity-75 select-none">🪷</div>
                <div className="absolute top-2 right-2 text-amber-400 text-xs opacity-75 select-none">🪷</div>

                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2.5 mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/25 flex items-center justify-center border border-amber-400/50 shadow-sm text-xs sm:text-sm">
                      🪔
                    </div>
                    <span className="font-serif font-bold text-amber-200 text-xs sm:text-sm tracking-wide">
                      দুর্গাপূজা শুভেচ্ছা ২০২৬
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={triggerFlowerBlessing}
                      title="পুষ্পাঞ্জলি দিন"
                      className="flex items-center gap-1 bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border border-amber-400/40 transition-all"
                    >
                      🌸 <span>পুষ্পাঞ্জলি</span>
                    </button>
                    <button
                      onClick={playDhaakSound}
                      title="ঢাক বাজান"
                      className="flex items-center gap-1 bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border border-amber-400/40 transition-all"
                    >
                      <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" /> <span>ঢাক</span>
                    </button>
                  </div>
                </div>

                {/* Divine Sanskrit Shlok Banner */}
                <div className="py-0.5 sm:py-1 px-3 my-1.5 sm:my-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-center">
                  <p className="text-[9px] sm:text-[11px] font-serif text-amber-200/90 tracking-wide">
                    সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে। শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তু তে॥
                  </p>
                </div>

                {/* Divine Festive Banner */}
                <div className="mb-4 rounded-2xl overflow-hidden border-2 border-amber-400/50 h-40 sm:h-64 shadow-lg relative group bg-stone-950">
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
                <div className="mb-2 space-y-0.5">
                  <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-semibold">প্রিয়:</p>
                  <h3 className="text-xl sm:text-3xl font-bold text-white font-serif tracking-tight drop-shadow-sm">
                    {cardData.to}
                  </h3>
                </div>

                {/* Message */}
                <div className="bg-stone-950/60 p-4 sm:p-6 rounded-2xl border border-amber-400/30 mb-4 shadow-inner">
                  <p className="text-amber-100 text-xs sm:text-base leading-relaxed font-serif italic whitespace-pre-wrap">
                    "{cardData.message}"
                  </p>
                </div>

                {/* From */}
                <div className="pt-2.5 border-t border-amber-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-amber-300/70 uppercase tracking-wider">শুভেচ্ছান্তে:</p>
                    <h4 className="text-sm sm:text-lg font-bold text-amber-200 font-serif">
                      {cardData.from}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/40">
                    <Heart className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-[10px] font-semibold">শুভ দুর্গোৎসব</span>
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

