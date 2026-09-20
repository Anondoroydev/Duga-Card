import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Music, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const PujoGuide: React.FC = () => {
  // Approximate Durga Puja 2026 dates countdown (e.g. October 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: Oct 17, 2026 Maha Sasthi
    const targetDate = new Date('2026-10-17T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const PUJO_DAYS = [
    { 
      name: "মহাষষ্ঠী (Maha Sasthi)", 
      date: "১৭ অক্টোবর ২০২৬ (শনিবার)", 
      desc: "সায়ংকালে দেবীর বোধন, আমন্ত্রণ ও অধিবাসের মাধ্যমে মা দুর্গার আবাহন।" 
    },
    { 
      name: "মহাসপ্তমী - ১ম দিন (Maha Saptami Day 1)", 
      date: "১৭ অক্টোবর ২০২৬ (অপরাহ্ন)", 
      desc: "সপ্তমী তিথি প্রবেশ, পূর্বাহ্ন কল্পারম্ভ ও সপ্তমী ব্রত সূচনা।" 
    },
    { 
      name: "মহাসপ্তমী - ২য় দিন (Maha Saptami Day 2)", 
      date: "১৮ অক্টোবর ২০২৬ (রবিবার)", 
      desc: "নবপত্রিকা (কলাবউ) স্নান ও প্রবেশ, মহাসপ্তমী বিহিত পূজা ও মহা আরতি।" 
    },
    { 
      name: "মহাঅষ্টমী (Maha Ashtami)", 
      date: "১৯ অক্টোবর ২০২৬ (সোমবার)", 
      desc: "মহাঅষ্টমীর পুষ্পাঞ্জলি, কুমারী পূজা ও মহা সন্ধিপূজা।" 
    },
    { 
      name: "মহানবমী (Maha Navami)", 
      date: "২০ অক্টোবর ২০২৬ (মঙ্গলবার)", 
      desc: "মহানবমী পূজা, নবমী হোম ও বিশেষ অঞ্জলি প্রদান।" 
    },
    { 
      name: "বিজয়া দশমী (Bijoya Dashami)", 
      date: "২১ অক্টোবর ২০২৬ (বুধবার)", 
      desc: "দর্পণ বিসর্জন, অপরাজিতা পূজা, সিঁদুর খেলা ও প্রতিমা বিসর্জন।" 
    }
  ];

  return (
    <div className="h-full overflow-y-auto max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 text-amber-100 custom-scrollbar">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-4 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> দুর্গোৎসব কাউন্টডাউন ও সূচি
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-200 tracking-tight mb-2">
            দুর্গাপূজা ২০২৬ কাউন্টডাউন
          </h2>
          <p className="text-amber-100/70 max-w-lg mx-auto text-sm">
            মা আসার বাকি আর মাত্র কটি দিন! পঞ্জিকা অনুযায়ী দুর্গাপূজার দিনগুলির সময়সূচি।
          </p>
        </motion.div>
      </div>

      {/* Countdown Timer Box - Transparent Frosted Glass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-stone-950/25 hover:bg-stone-950/30 backdrop-blur-md border-2 border-amber-400/40 rounded-3xl p-8 shadow-2xl mb-12 text-center relative overflow-hidden transition-all"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <h3 className="text-xl font-serif font-bold text-amber-200 mb-6 flex items-center justify-center gap-2">
          🌸 মহাষষ্ঠী পর্যন্ত বাকি সময়
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto relative z-10">
          <div className="bg-stone-950/35 border border-amber-400/30 rounded-2xl p-4 backdrop-blur-sm shadow-inner">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif mb-1">
              {timeLeft.days}
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-200/80 font-semibold">দিন (Days)</span>
          </div>
          <div className="bg-stone-950/35 border border-amber-400/30 rounded-2xl p-4 backdrop-blur-sm shadow-inner">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif mb-1">
              {timeLeft.hours}
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-200/80 font-semibold">ঘণ্টা (Hours)</span>
          </div>
          <div className="bg-stone-950/35 border border-amber-400/30 rounded-2xl p-4 backdrop-blur-sm shadow-inner">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif mb-1">
              {timeLeft.minutes}
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-200/80 font-semibold">মিনিট (Mins)</span>
          </div>
          <div className="bg-stone-950/35 border border-amber-400/30 rounded-2xl p-4 backdrop-blur-sm shadow-inner">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif mb-1">
              {timeLeft.seconds}
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-200/80 font-semibold">সেকেন্ড (Secs)</span>
          </div>
        </div>
      </motion.div>

      {/* Pujo Days Schedule */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-400/25 pb-3 mb-6">
          <h3 className="text-xl font-bold font-serif text-amber-300 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> দুর্গোৎসব ২০২৬ এর দিনপঞ্জি
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/40 w-fit shadow-sm">
            🌸 সপ্তমী তিথি বিস্তার: ২ দিনব্যাপী পূজা (১ম ও ২য় দিন)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PUJO_DAYS.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-stone-950/20 hover:bg-stone-950/30 border border-amber-400/35 rounded-2xl p-6 shadow-md backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-400/60 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-400/40">
                    0{idx + 1}
                  </span>
                  <h4 className="text-lg font-bold font-serif text-white">
                    {day.name}
                  </h4>
                </div>
                <p className="text-xs text-amber-100/80 pl-11">
                  {day.desc}
                </p>
              </div>
              <div className="bg-stone-950/40 backdrop-blur-sm border border-amber-400/30 px-4 py-2 rounded-xl text-amber-300 font-medium text-xs text-center shrink-0">
                📅 {day.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
