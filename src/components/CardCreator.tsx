import React, { useState, useEffect } from 'react';
import { Send, Copy, Check, Share2, Wand2, RefreshCw, MessageCircle, Heart, Image as ImageIcon, Volume2, Shuffle, CheckCheck, BookOpen } from 'lucide-react';
import { GreetingCardData } from '../types';
import { playDhaakBeat, playDhaakSound, getActiveSound, ActiveSoundType } from '../utils/audio';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { LovelyBirdsScene } from './LovelyBirdsScene';
import { DURGA_IMAGES } from '../data/durgaImages';
import { generateBengaliFestiveWish } from '../utils/festiveWishGenerator';
import { buildIndestructibleShareUrl } from '../utils/cardShare';

interface CardCreatorProps {
  onShareCard: (card: GreetingCardData) => void;
}

const THEMES = [
  {
    id: 'royal-maroon',
    name: 'রাজকীয় লাল (Royal Maroon)',
    bg: 'bg-gradient-to-br from-red-950/70 via-rose-900/60 to-amber-950/70',
    cardBg: 'bg-gradient-to-br from-red-950/70 via-rose-900/50 to-amber-950/70 border-amber-400/70',
    textAccent: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'dhunuchi-orange',
    name: 'ধুনুচি উৎসব (Dhunuchi Orange)',
    bg: 'bg-gradient-to-br from-amber-950/70 via-orange-950/60 to-red-950/70',
    cardBg: 'bg-gradient-to-br from-orange-950/70 via-amber-900/50 to-red-950/70 border-orange-400/70',
    textAccent: 'text-orange-200',
    badge: 'bg-orange-500/20 text-orange-200 border-orange-500/40'
  },
  {
    id: 'midnight-gold',
    name: 'নীল আকাশ ও সোনা (Midnight Gold)',
    bg: 'bg-gradient-to-br from-slate-950/70 via-indigo-950/60 to-amber-950/70',
    cardBg: 'bg-gradient-to-br from-indigo-950/70 via-slate-900/50 to-amber-950/70 border-amber-400/70',
    textAccent: 'text-amber-300',
    badge: 'bg-amber-400/20 text-amber-200 border-amber-400/40'
  },
  {
    id: 'festive-red',
    name: 'শুভ শারদীয়া লাল (Festive Red)',
    bg: 'bg-gradient-to-br from-red-900/70 via-rose-950/60 to-stone-900/70',
    cardBg: 'bg-gradient-to-br from-rose-950/70 via-red-950/50 to-stone-900/70 border-rose-400/70',
    textAccent: 'text-rose-200',
    badge: 'bg-rose-500/20 text-rose-200 border-rose-500/40'
  }
];

export const READY_WISH_CATEGORIES = [
  { id: 'all', label: 'সবার জন্য' },
  { id: 'friend', label: '🎉 বন্ধু' },
  { id: 'family', label: '🙏 পরিবার ও গুরুজন' },
  { id: 'love', label: '❤️ প্রিয়জন' },
  { id: 'colleague', label: '💼 সহকর্মী' },
];

export const READY_WISHES: Record<string, string[]> = {
  all: [
    "শুভ শারদীয়া! মা দুর্গার আশীর্বাদে তোমার ও তোমার পরিবারের জীবন সুখ, শান্তি ও অপার আনন্দে ভরে উঠুক। শুভ দুর্গোৎসব!",
    "আকাশে মেঘের ভেলা, কাশের বনে দোলা! ঢাকের কাঠি বাজলো বেলা। সবাইকে জানাই শারদীয়ার প্রীতি ও শুভেচ্ছা!",
    "দেবী দুর্গার আগমনী আলোয় দূর হোক মনের সমস্ত অন্ধকার। জীবনের প্রতিটি পদক্ষেপে আসুক অপার সাফল্য ও মঙ্গল। শুভ শারদীয়া!",
    "পুজোর প্রতিটি দিন কাটুক অফুরন্ত আনন্দ ও শুভকামনায়। শুভ মহা সপ্তমী, মহা অষ্টমী, নবমী ও বিজয়া দশমী!"
  ],
  friend: [
    "দোস্ত, শুভ শারদীয়া! ঢাকের তালে, কাশের দোলায় আর নতুন জামার গন্ধে কাটুক পুজো। প্যান্ডেল হপিং আর ফুচকার আড্ডায় মেতে ওঠো!",
    "পুজো মানেই বন্ধুদের জমজমাট আড্ডা আর অফুরন্ত উল্লাস! মা দুর্গার কৃপায় তোর জীবন হাসিখুশি আর সাফল্যে ভরে উঠুক। শুভ দুর্গোৎসব!",
    "শারদ উৎসবের এই কটা দিন সব চিন্তা ভুলে হইচই আর আনন্দে মেতে ওঠ বন্ধু। অনেক অনেক শারদীয় প্রীতি ও ভালোবাসা!"
  ],
  family: [
    "চরণকমলে সশ্রদ্ধ প্রণাম জানাই। শারদীয়ার এই পুণ্যলগ্নে মা দুর্গার কাছে আপনার সুস্বাস্থ্য, দীর্ঘায়ু ও পরম শান্তি কামনা করি। শুভ শারদীয়া!",
    "মায়ের আগমনী বার্তায় আমাদের পরিবারে বিরাজ করুক চিরন্তন সুখ ও সম্প্রীতি। পরিবারের সকলকে শারদীয়ার আন্তরিক প্রীতি ও প্রণাম!",
    "দেবী দুর্গার আশীর্বাদে সংসারের সকল অমঙ্গল দূর হোক। শান্তি ও সমৃদ্ধিতে ভরে উঠুক প্রতিটি দিন। শুভ বিজয়া ও শারদীয়া!"
  ],
  love: [
    "আমার প্রিয়, শুভ শারদীয়া! কাশফুলের শুভ্রতা আর অষ্টমীর অঞ্জলির মতো পবিত্র হোক আমাদের ভালোবাসা। মা দুর্গা তোমাকে সর্বদা হাসিখুশি রাখুন।",
    "শারদীয়ার আলোর রোশনাই আর ঢাকের মিষ্টি ছন্দে তোমার সাথে কাটুক উৎসবের প্রতিটি মুহূর্ত। হৃদয়ের অন্তস্তল থেকে শারদীয় ভালোবাসা!",
    "ধূপ-ধুনো আর শিউলির সুবাসে সেজে উঠুক তোমার পৃথিবী। দেবী দুর্গার কৃপায় আমাদের বন্ধন চিরন্তন হোক। শুভ শারদীয়া!"
  ],
  colleague: [
    "শুভ শারদীয়া! উৎসবের এই দিনগুলো পরিবার-পরিজনের সাথে আনন্দে কাটুক। দেবী দুর্গার আশীর্বাদে কর্মজীবনে আসুক বিরাট সাফল্য।",
    "শারদ উৎসবের পুণ্য তিথিতে জানাই আন্তরিক অভিনন্দন ও শারদীয় শুভেচ্ছা। আপনার আগামীর প্রতিটি দিন সাফল্যমণ্ডিত হোক।"
  ]
};

const PRESET_WISHES = READY_WISHES.all;

export const CardCreator: React.FC<CardCreatorProps> = ({ onShareCard }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [activeWishCategory, setActiveWishCategory] = useState<string>('all');
  const [message, setMessage] = useState(READY_WISHES.all[0]);
  const [selectedTheme, setSelectedTheme] = useState<'royal-maroon' | 'dhunuchi-orange' | 'midnight-gold' | 'festive-red'>('royal-maroon');
  const [selectedImage, setSelectedImage] = useState(DURGA_IMAGES[0]);
  const [relationship, setRelationship] = useState('friend');
  const [mood, setMood] = useState('joyful and poetic');
  const [showAiHelper, setShowAiHelper] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  
  const [shareLink, setShareLink] = useState('');
  const [tinyUrlLink, setTinyUrlLink] = useState('');
  const [isCreatingShortLink, setIsCreatingShortLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // Single page mobile display control
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [activeSound, setActiveSound] = useState<ActiveSoundType>(getActiveSound());

  useEffect(() => {
    const handleSoundUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ activeSound: ActiveSoundType }>;
      if (customEvent.detail) {
        setActiveSound(customEvent.detail.activeSound);
      }
    };
    window.addEventListener('festive-sound-update', handleSoundUpdate);
    return () => window.removeEventListener('festive-sound-update', handleSoundUpdate);
  }, []);

  const currentThemeObj = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  const triggerFlowerBlessing = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#dc2626', '#fbbf24', '#f43f5e', '#ffffff', '#e11d48']
    });
  };

  const handleCategorySelect = (catId: string) => {
    setActiveWishCategory(catId);
    if (catId !== 'all') {
      setRelationship(catId);
    }
    const list = READY_WISHES[catId] || READY_WISHES.all;
    if (list.length > 0) {
      setMessage(list[0]);
    }
  };

  const handleNextReadyWish = () => {
    const list = READY_WISHES[activeWishCategory] || READY_WISHES.all;
    const currentIndex = list.indexOf(message);
    const nextIndex = (currentIndex + 1) % list.length;
    setMessage(list[nextIndex]);
  };

  const handleGenerateAI = async () => {
    if (!sender.trim() || !recipient.trim()) {
      setAiError('দয়া করে প্রথমে প্রেরক ও প্রাপকের নাম লিখুন।');
      return;
    }
    setAiError('');
    setIsGeneratingAI(true);

    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, recipient, relationship, mood }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessage(data.message);
          return;
        }
      }
      // If server responded with error or non-JSON fallback
      const fallbackWish = generateBengaliFestiveWish({ sender, recipient, relationship, mood });
      setMessage(fallbackWish);
    } catch (_err) {
      // If server connection fails (e.g. static hosting on Vercel without serverless)
      const fallbackWish = generateBengaliFestiveWish({ sender, recipient, relationship, mood });
      setMessage(fallbackWish);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateAndShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !recipient.trim() || !message.trim()) {
      alert('দয়া করে সমস্ত ঘর পূরণ করুন।');
      return;
    }
    triggerFlowerBlessing();

    const cardData: GreetingCardData = {
      from: sender.trim(),
      to: recipient.trim(),
      message: message.trim(),
      theme: selectedTheme,
      imageUrl: selectedImage,
    };

    onShareCard(cardData);

    // Initial fallback: Indestructible link (client-side generated)
    const directCardUrl = buildIndestructibleShareUrl(cardData);
    setShareLink(directCardUrl);

    // Call API to create a persistent short link via Firestore
    setIsCreatingShortLink(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.id) {
          // Build the short URL using the reliable local origin
          const baseUrl = window.location.origin + window.location.pathname;
          const shortUrl = `${baseUrl}?c=${data.id}`;
          setShareLink(shortUrl);
        }
      }
    } catch (_err) {
      // Ignore background errors, we have the directCardUrl fallback
    } finally {
      setIsCreatingShortLink(false);
      // Automatically switch to 1-page preview on mobile so user sees the complete card
      setMobileView('preview');
    }
  };

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    if (!shareLink) return;
    const text = `🌸 শুভ শারদীয়া! ${sender} আপনাকে একটি বিশেষ দুর্গাপূজার শুভেচ্ছা কার্ড পাঠিয়েছেন: \n\n${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col min-h-0 py-0.5">
      {/* Sleek Compact Header Bar */}
      <div className="flex items-center justify-between mb-2 shrink-0 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-serif font-bold text-amber-200 flex items-center gap-1.5">
            শারদীয়ার শুভেচ্ছা কার্ড সাজান
          </span>
          <span className="text-[11px] text-amber-300/85 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-serif hidden sm:inline-flex items-center gap-1">
            🌸 শুভ দুর্গোৎসব ২০২৬
          </span>
        </div>
        <span className="text-[11px] text-amber-300/70 font-serif hidden md:inline">
          সপ্তমী আর মাত্র কদিন বাকি • বন্ধুদের সাথে আনন্দ ভাগ করুন
        </span>
      </div>

      {/* Mobile Screen Switcher: lets phone users switch between Edit Form and 1-Page Card View */}
      <div className="flex lg:hidden items-center justify-between p-1 bg-stone-900/90 border border-amber-500/30 rounded-xl mb-2 gap-1.5 shadow-md shrink-0">
        <button
          type="button"
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-semibold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'edit'
              ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-sm'
              : 'text-amber-200/80 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" /> ✍️ কার্ডের তথ্য সাজান
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-semibold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'preview'
              ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-sm'
              : 'text-amber-200/80 hover:text-white'
          }`}
        >
          👁️ ফোনে ১ পেজে কার্ড দেখুন
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 items-stretch">
        {/* Transparent Glass Form Section - Compact & non-overflowing */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-7 bg-stone-950/70 border border-amber-400/30 rounded-2xl p-3 sm:p-4 shadow-xl text-amber-100 flex flex-col relative min-h-0 ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleCreateAndShare} className="flex flex-col h-full relative z-10 min-h-0">
            {/* Scrollable inputs area */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 pb-2">
              {/* Row 1: Recipient and Sender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  প্রাপকের নাম:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="যেমন: প্রিয় রাহুল"
                  className="w-full bg-stone-950/80 border border-amber-400/30 rounded-xl px-3 py-1.5 sm:py-2 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  প্রেরকের নাম (আপনার নাম):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="যেমন: অজয় সরকার"
                  className="w-full bg-stone-950/80 border border-amber-400/30 rounded-xl px-3 py-1.5 sm:py-2 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Row 2: Theme Selector (Compact Chips) */}
            <div className="shrink-0">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                পছন্দের থিম:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id as any)}
                    className={`py-1 px-2 rounded-lg border text-[11px] font-medium text-center transition-all truncate ${
                      selectedTheme === theme.id
                        ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-sm ring-1 ring-amber-400 font-bold'
                        : 'border-amber-500/20 bg-stone-950/30 text-stone-300 hover:border-amber-400/40 hover:text-amber-200'
                    }`}
                  >
                    {theme.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Durga Artwork Horizontal Strip */}
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> প্রতিমা পছন্দ করুন:
                </span>
                <span className="text-[10px] text-amber-400/75">স্ক্রোল করে পছন্দ করুন</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 px-1 scrollbar-thin scrollbar-thumb-amber-500/30">
                {DURGA_IMAGES.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative rounded-lg overflow-hidden h-12 w-14 shrink-0 border-2 transition-all ${
                      selectedImage === imgUrl 
                        ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/60 z-10' 
                        : 'border-amber-500/25 opacity-75 hover:opacity-100 hover:border-amber-400/60'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`মা দুর্গা রূপ ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    {selectedImage === imgUrl && (
                      <div className="absolute top-0.5 right-0.5 bg-amber-500 text-stone-950 rounded-full p-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 py-0.2 text-center pointer-events-none">
                      <span className="text-[8px] text-amber-200 font-serif font-bold">{idx + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Magic AI & Ready-made Bengali Wishes */}
            <div className="bg-stone-950/70 p-2.5 rounded-xl border border-amber-400/25 space-y-2 shrink-0 relative overflow-hidden group">
              {/* Premium Glow for AI section */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all duration-700" />
              
              {/* AI Helper - High Priority */}
              <div className="pb-1.5 mb-1.5 border-b border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ম্যাজিক এআই (AI) দিয়ে লিখুন:
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">PREMIUM</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                  <div className="sm:col-span-4">
                    <select
                      value={relationship}
                      onChange={(e) => {
                        setRelationship(e.target.value);
                        if (READY_WISHES[e.target.value]) {
                          setActiveWishCategory(e.target.value);
                        }
                      }}
                      className="w-full bg-stone-950/50 border border-amber-500/30 rounded-lg px-2 py-1.5 text-[11px] text-amber-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="friend" className="bg-stone-900 text-amber-100">বন্ধু</option>
                      <option value="family" className="bg-stone-900 text-amber-100">পরিবার</option>
                      <option value="colleague" className="bg-stone-900 text-amber-100">সহকর্মী</option>
                      <option value="love" className="bg-stone-900 text-amber-100">প্রিয়জন</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full bg-stone-950/50 border border-amber-500/30 rounded-lg px-2 py-1.5 text-[11px] text-amber-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="joyful and poetic" className="bg-stone-900 text-amber-100">আনন্দময়</option>
                      <option value="emotional and warm" className="bg-stone-900 text-amber-100">আন্তরিক</option>
                      <option value="short and sweet" className="bg-stone-900 text-amber-100">সংক্ষিপ্ত</option>
                      <option value="traditional and festive" className="bg-stone-900 text-amber-100">ঐতিহ্যবাহী</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={isGeneratingAI}
                      className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] transition-all shadow-md flex items-center justify-center gap-1 disabled:opacity-50 active:scale-95"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" /> তৈরি হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3" /> এআই দিয়ে লিখুন
                        </>
                      )}
                    </button>
                  </div>
                  {aiError && <p className="text-[10px] text-rose-400 col-span-12 text-center mt-1">{aiError}</p>}
                </div>
              </div>

              {/* Ready-made Suggestions - Secondary Priority */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> শুভেচ্ছা বার্তা পছন্দ করুন:
                </span>
                <button
                  type="button"
                  onClick={handleNextReadyWish}
                  className="text-[10px] text-amber-300 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all"
                  title="ক্লিক করে পরের রেডিমেড বার্তাটি দেখুন"
                >
                  <Shuffle className="w-3 h-3" /> অন্য বার্তা
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {READY_WISH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                      activeWishCategory === cat.id
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-bold'
                        : 'bg-stone-900/60 text-amber-200/80 border-amber-500/20 hover:bg-amber-500/15'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Ready wishes clickable list */}
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-500/30">
                {(READY_WISHES[activeWishCategory] || READY_WISHES.all).map((wishText, wIdx) => {
                  const isSelected = message === wishText;
                  return (
                    <button
                      key={wIdx}
                      type="button"
                      onClick={() => setMessage(wishText)}
                      className={`w-full text-left p-1.5 rounded-lg border text-[10px] leading-relaxed transition-all flex items-start gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400/60 text-amber-100 font-medium'
                          : 'bg-stone-900/40 border-stone-800 text-stone-300 hover:bg-stone-900/80 hover:text-amber-200'
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {isSelected ? (
                          <CheckCheck className="w-3 h-3 text-amber-400" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 inline-block"></span>
                        )}
                      </span>
                      <span className="line-clamp-2">{wishText}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Row 5: Message Input & Quick Customization */}
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90">
                  শুভেচ্ছা বার্তা (সম্পাদনা করুন):
                </label>
                <span className="text-[9px] text-amber-400/70">সরাসরি টাইপও করতে পারেন</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full bg-stone-950/80 border border-amber-400/30 rounded-xl p-2.5 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs leading-relaxed shadow-inner resize-none"
                required
              />
            </div>
          </div>

          {/* Row 6: Submit / Generate Link Button - Always at the bottom */}
            <div className="pt-2 border-t border-amber-500/20 shrink-0">
              <button
                type="submit"
                disabled={isCreatingShortLink}
                className="w-full bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 text-sm sm:text-base transition-all transform hover:-translate-y-0.5 disabled:opacity-75 active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span>{isCreatingShortLink ? 'তৈরি হচ্ছে...' : 'লিংক তৈরি করে শেয়ার করুন'}</span>
              </button>
            </div>
          </form>

          {/* Share Link Modal/Box if generated */}
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 bg-stone-950 border border-emerald-500/40 rounded-xl p-3 space-y-2 shadow-2xl shrink-0 z-20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> লিংক প্রস্তুত!
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                  সরাসরি লিংক
                </span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="w-full bg-stone-950/70 border border-stone-700/70 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none select-all font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all shadow shrink-0 active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'কপি!' : 'কপি'}
                </button>
              </div>

              <div className="flex gap-2 pt-0.5">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপ
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow text-center active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" /> ফেসবুক
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Live Preview Card Section with Animations & Divine Ornaments */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-5 flex flex-col justify-center items-center min-h-0 ${
            mobileView === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Outer Card Wrapper - Sized to fit screen */}
          <div className="w-full max-w-sm px-2 sm:px-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                লাইভ কার্ড প্রিভিউ
              </span>
              <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                অ্যানিমেটেড ডিজাইন
              </span>
            </div>

            {/* Floating animated wrapper */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative group pt-10"
            >
              {/* Animated Birds Always Present on Top Corners of Preview Card */}
              <LovelyBirdsScene phase="opened" />

              {/* Outer golden halo pulse */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-red-500/30 blur-lg opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

              <div className={`relative rounded-2xl p-4 sm:p-4.5 shadow-2xl border-2 border-amber-400/70 ${currentThemeObj.cardBg} text-amber-100 overflow-hidden flex flex-col justify-between ring-1 ring-amber-300/30`}>
                {/* Corner Traditional Decorative Ornaments */}
                <div className="absolute top-2 left-2 text-amber-400 text-[11px] opacity-75 select-none">🪷</div>
                <div className="absolute top-2 right-2 text-amber-400 text-[11px] opacity-75 select-none">🪷</div>

                <div>
                  {/* Card Header with Animated Diya */}
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center border border-amber-400/50 text-[10px]">
                        🪔
                      </div>
                      <span className="font-serif font-bold text-amber-200 tracking-wide text-xs drop-shadow">
                        শুভ শারদীয়া ২০২৬
                      </span>
                    </div>

                    {/* Animated Diya Flame */}
                    <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-400/40">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                      </span>
                      <span className="text-[9px] text-amber-200 font-serif font-semibold">🪔 মঙ্গলপ্রদীপ</span>
                    </div>
                  </div>

                  {/* Divine Sanskrit Shlok Banner */}
                  <div className="py-0.5 px-2 mb-2 rounded-lg bg-amber-500/10 border border-amber-400/20 text-center backdrop-blur-sm">
                    <p className="text-[9px] font-serif text-amber-200/90 tracking-wide leading-tight truncate">
                      সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে। শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তু তে॥
                    </p>
                  </div>

                  {/* Divine Festive Banner */}
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-amber-400/50 h-28 sm:h-32 shadow-md relative group/banner bg-stone-950">
                    <img
                      src={selectedImage}
                      alt="Maa Durga Artwork"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/banner:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/15 to-transparent flex items-end justify-between p-2 pointer-events-none">
                      <span className="text-[10px] font-serif text-amber-200 font-bold drop-shadow">🌸 শুভ শারদীয়া শুভেচ্ছা ২০২৬</span>
                      <span className="text-[8px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded-full border border-amber-400/30">ঐশ্বরিক রূপ</span>
                    </div>
                  </div>

                  {/* To and From */}
                  <div className="mb-1.5">
                    <p className="text-[9px] text-amber-300/90 font-serif font-bold tracking-wide">💖 যার জন্য এই শুভেচ্ছা:</p>
                    <h4 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight truncate">
                      {recipient || 'প্রিয় বন্ধু'}
                    </h4>
                  </div>

                  {/* Message Content */}
                  <div className="bg-stone-950/40 backdrop-blur-md p-2.5 rounded-xl border border-amber-500/30 mb-2 shadow-inner">
                    <p className="text-amber-100/95 text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap font-serif italic line-clamp-3">
                      "{message || 'শারদীয়ার এই পবিত্র লগ্নে আপনার জীবন আনন্দ ও শান্তিতে ভরে উঠুক।'}"
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div>
                  <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-amber-300/70 uppercase tracking-wider">শুভকামনায়:</p>
                      <p className="text-xs font-bold text-amber-200 font-serif drop-shadow-sm truncate">
                        {sender || 'আপনার নাম (Sender Name)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                      <Heart className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] font-semibold">শারদীয় শুভেচ্ছা</span>
                    </div>
                  </div>

                  {/* Card Interactive Blessing & Audio Actions */}
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-amber-500/20">
                    <button
                      type="button"
                      onClick={triggerFlowerBlessing}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-red-600/30 to-amber-600/30 hover:from-red-600/50 hover:to-amber-600/50 text-amber-200 px-3 py-1 rounded-full text-[11px] font-serif border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
                    >
                      🌸 পুষ্পাঞ্জলি দিন
                    </button>
                    <button
                      type="button"
                      onClick={() => { playDhaakSound(); }}
                      className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-[11px] font-serif border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
                      title="আসল লাইভ ঢাকের বোল শুনুন"
                    >
                      <Volume2 className="w-3 h-3 text-amber-300" /> 🥁 ঢাক
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

