import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Copy, Check, Share2, Wand2, RefreshCw, MessageCircle, Heart, Image as ImageIcon, Volume2, Bell } from 'lucide-react';
import { GreetingCardData } from '../types';
import { playDhaakBeat, playDhaakSound, playShankhoSound, getActiveSound, ActiveSoundType } from '../utils/audio';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { DURGA_IMAGES } from '../data/durgaImages';

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

const PRESET_WISHES = [
  "শুভ শারদীয়া! মা দুর্গার আশীর্বাদে তোমার ও তোমার পরিবারের জীবন সুখ, শান্তি ও আনন্দে ভরে উঠুক। শুভ দুর্গোৎসব!",
  "শারদীয়ার এই পবিত্র লগ্নে প্রার্থনা করি মা দুর্গা আপনার সমস্ত মনস্কামনা পূরণ করুন। শুভ শারদীয়া!",
  "আকাশে মেঘের ভেলা, ঢাকে কাঠি বাজলো বেলা! সবাইকে জানাই শারদীয়ার প্রীতি ও শুভেচ্ছা। ভালো থেকো!",
  "পুজোর কটা দিন কাটুক আনন্দে আর উল্লাসে। শুভ মহা সপ্তমী, অষ্টমী, নবমী ও বিজয়া দশমীর অনেক শুভেচ্ছা!"
];

export const CardCreator: React.FC<CardCreatorProps> = ({ onShareCard }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState(PRESET_WISHES[0]);
  const [selectedTheme, setSelectedTheme] = useState<'royal-maroon' | 'dhunuchi-orange' | 'midnight-gold' | 'festive-red'>('royal-maroon');
  const [selectedImage, setSelectedImage] = useState(DURGA_IMAGES[0]);
  const [relationship, setRelationship] = useState('friend');
  const [mood, setMood] = useState('joyful and poetic');
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
    playDhaakBeat();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#dc2626', '#fbbf24', '#f43f5e', '#ffffff', '#e11d48']
    });
  };

  const handleGenerateAI = async () => {
    if (!sender.trim() || !recipient.trim()) {
      setAiError('দয়া করে প্রথমে প্রেরক ও প্রাপকের নাম লিখুন।');
      return;
    }
    setAiError('');
    setIsGeneratingAI(true);
    playDhaakBeat();

    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, recipient, relationship, mood }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessage(data.message);
      } else {
        setAiError(data.error || 'Wish generation failed');
      }
    } catch (err: any) {
      setAiError('সার্ভারের সাথে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।');
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

    // Initial link
    const params = new URLSearchParams({
      from: cardData.from,
      to: cardData.to,
      msg: cardData.message,
      theme: cardData.theme,
      img: cardData.imageUrl || '',
    });
    const fallbackLink = `${window.location.origin}/?${params.toString()}`;
    setShareLink(fallbackLink);

    // Generate clean Short URL from backend
    setIsCreatingShortLink(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      const data = await res.json();
      if (data.success) {
        const short = data.shortUrl || `${window.location.origin}/?c=${data.id}`;
        setShareLink(short);
        if (data.tinyUrl) {
          setTinyUrlLink(data.tinyUrl);
        }
      }
    } catch (_err) {
      // Keep fallback query link if request fails
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
    <div className="w-full max-w-6xl mx-auto h-full max-h-full flex flex-col justify-center min-h-0 py-0.5">
      {/* Sleek Compact Header Bar */}
      <div className="flex items-center justify-between mb-2 shrink-0 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> শারদীয়ার শুভেচ্ছা কার্ড সাজান
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
          <Sparkles className="w-3.5 h-3.5" /> 👁️ ফোনে ১ পেজে কার্ড দেখুন
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 items-stretch overflow-hidden">
        {/* Transparent Glass Form Section - Compact & non-overflowing */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-7 bg-stone-950/35 hover:bg-stone-950/40 border border-amber-400/30 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md text-amber-100 flex flex-col justify-between overflow-y-auto max-h-full relative ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleCreateAndShare} className="space-y-2.5 relative z-10 flex flex-col justify-between h-full">
            {/* Row 1: Recipient and Sender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  যার উদ্দেশে চিঠি (কার কাছে পাঠাচ্ছেন):
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="যেমন: প্রিয় রাহুল"
                  className="w-full bg-stone-950/40 backdrop-blur-sm border border-amber-400/30 rounded-xl px-3 py-1.5 sm:py-2 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  আপনার নাম (From):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="যেমন: অজয় সরকার"
                  className="w-full bg-stone-950/40 backdrop-blur-sm border border-amber-400/30 rounded-xl px-3 py-1.5 sm:py-2 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Row 2: Theme Selector (Compact Chips) */}
            <div className="shrink-0">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                কার্ডের থিম (Theme):
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
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> মা দুর্গার রূপ (১৬টি প্রতিমা):
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

            {/* Row 4: Compact Wish Assistant */}
            <div className="bg-stone-950/30 backdrop-blur-sm p-2.5 rounded-xl border border-amber-400/25 space-y-1.5 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" /> শুভেচ্ছা সহকারী
                </span>
                <span className="text-[9px] text-amber-400/80 bg-amber-500/15 px-2 py-0.5 rounded-full">সহজ তৈরি</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                <div className="sm:col-span-4">
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-stone-950/50 border border-amber-500/30 rounded-lg px-2 py-1.5 text-[11px] text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="friend" className="bg-stone-900 text-amber-100">বন্ধু (Friend)</option>
                    <option value="family" className="bg-stone-900 text-amber-100">পরিবার (Family)</option>
                    <option value="colleague" className="bg-stone-900 text-amber-100">সহকর্মী (Colleague)</option>
                    <option value="love" className="bg-stone-900 text-amber-100">প্রিয়জন (Loved One)</option>
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-stone-950/50 border border-amber-500/30 rounded-lg px-2 py-1.5 text-[11px] text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="joyful and poetic" className="bg-stone-900 text-amber-100">আনন্দময় ও কাব্যিক</option>
                    <option value="emotional and warm" className="bg-stone-900 text-amber-100">আন্তরিক ও আবেগঘন</option>
                    <option value="short and sweet" className="bg-stone-900 text-amber-100">সংক্ষিপ্ত ও মিষ্টি</option>
                    <option value="traditional and festive" className="bg-stone-900 text-amber-100">ঐতিহ্যবাহী</option>
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-medium py-1.5 px-2 rounded-lg text-[11px] transition-all shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" /> তৈরি হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" /> শুভেচ্ছা সাজান
                      </>
                    )}
                  </button>
                </div>
              </div>
              {aiError && <p className="text-[10px] text-rose-400 text-center">{aiError}</p>}
            </div>

            {/* Row 5: Message Input & Presets */}
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90">
                  শুভেচ্ছা বার্তা (Message):
                </label>
                <div className="flex gap-1">
                  {PRESET_WISHES.slice(0, 2).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(preset)}
                      className="text-[9px] bg-stone-950/40 hover:bg-amber-500/25 text-amber-200/90 hover:text-amber-200 px-2 py-0.5 rounded border border-amber-500/30"
                    >
                      টেমপ্লেট #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full bg-stone-950/40 backdrop-blur-sm border border-amber-400/30 rounded-xl p-2.5 text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-xs leading-relaxed shadow-inner resize-none"
                required
              />
            </div>

            {/* Row 6: Submit / Generate Link Button */}
            <button
              type="submit"
              disabled={isCreatingShortLink}
              className="w-full shrink-0 bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-75"
            >
              <Share2 className="w-4 h-4" />
              <span>{isCreatingShortLink ? 'শর্ট লিংক তৈরি হচ্ছে...' : 'শেয়ার করার শর্ট লিংক তৈরি করুন'}</span>
            </button>
          </form>

          {/* Share Link Modal/Box if generated */}
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2.5 bg-stone-950/60 backdrop-blur-md border border-amber-400/40 rounded-xl p-3 space-y-2 shadow-inner shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> শর্ট লিংক তৈরি হয়েছে!
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                  {isCreatingShortLink ? 'তৈরি হচ্ছে...' : 'Short URL'}
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
          className="lg:col-span-5 flex flex-col justify-center items-center h-full min-h-0"
        >
          {/* Outer Card Wrapper - Sized to fit screen */}
          <div className="w-full max-w-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> লাইভ কার্ড প্রিভিউ
              </span>
              <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                অ্যানিমেটেড ডিজাইন
              </span>
            </div>

            {/* Floating animated wrapper */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative group"
            >
              {/* Outer golden halo pulse */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-red-500/30 blur-lg opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

              <div className={`relative rounded-2xl p-4 sm:p-4.5 shadow-2xl border-2 border-amber-400/70 ${currentThemeObj.cardBg} backdrop-blur-xl text-amber-100 overflow-hidden flex flex-col justify-between ring-1 ring-amber-300/30`}>
                {/* Corner Traditional Decorative Ornaments */}
                <div className="absolute top-2 left-2 text-amber-400 text-[11px] opacity-75 select-none">🪷</div>
                <div className="absolute top-2 right-2 text-amber-400 text-[11px] opacity-75 select-none">🪷</div>

                <div>
                  {/* Card Header with Animated Diya */}
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center border border-amber-400/50">
                        <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
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
                      <Sparkles className="w-3 h-3 text-amber-300" /> 🌸 পুষ্পাঞ্জলি দিন
                    </button>
                    <button
                      type="button"
                      onClick={() => { playDhaakSound(); }}
                      className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-[11px] font-serif border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
                      title="আসল লাইভ ঢাকের বোল শুনুন"
                    >
                      <Volume2 className="w-3 h-3 text-amber-300" /> 🥁 ঢাক
                    </button>
                    <button
                      type="button"
                      onClick={() => { playShankhoSound(); }}
                      className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-1 rounded-full text-[11px] font-serif border border-amber-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
                      title="পবিত্র শাঁখের ধ্বনি"
                    >
                      <Bell className="w-3 h-3 text-amber-300" /> 🐚 শাঁখ
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

