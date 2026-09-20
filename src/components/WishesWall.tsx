import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Send, RefreshCw, Heart, User } from 'lucide-react';
import { CommunityWish } from '../types';
import { playDhaakBeat } from '../utils/audio';
import { motion } from 'motion/react';

export const WishesWall: React.FC = () => {
  const [wishes, setWishes] = useState<CommunityWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setWishes(data);
          return;
        }
      }
    } catch (_err) {
      // Ignore network errors and check local storage
    } finally {
      setLoading(false);
    }

    try {
      const stored = localStorage.getItem('local_durga_wishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      }
    } catch (_e) {
      // LocalStorage access safe
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');
    playDhaakBeat();

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, message, theme: 'royal-maroon' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wish) {
          setWishes((prev) => [data.wish, ...prev]);
          setSender('');
          setMessage('');
          return;
        }
      }
      throw new Error('Server unavailable');
    } catch (_err) {
      // Local fallback so user can still post wishes seamlessly even if server is offline or static
      const localWish = {
        id: Date.now().toString(),
        sender: sender.trim(),
        message: message.trim(),
        theme: 'royal-maroon',
        createdAt: new Date().toISOString(),
      };
      setWishes((prev) => {
        const updated = [localWish, ...prev];
        try {
          localStorage.setItem('local_durga_wishes', JSON.stringify(updated.slice(0, 50)));
        } catch (_e) {}
        return updated;
      });
      setSender('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 custom-scrollbar">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-4 shadow-sm">
            <MessageSquareHeart className="w-3.5 h-3.5" /> কমিউনিটি শুভেচ্ছা ওয়াল
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-200 tracking-tight mb-2">
            শারদীয়ার শুভেচ্ছা আদান-প্রদান
          </h2>
          <p className="text-amber-100/70 max-w-lg mx-auto text-sm">
            সকলের সাথে আপনার দুর্গোৎসবের শুভকামনা শেয়ার করুন এবং অন্যদের বার্তা পড়ুন।
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Wish Form */}
        <div className="lg:col-span-5">
          <div className="bg-stone-950/20 hover:bg-stone-950/25 backdrop-blur-md border border-amber-400/35 rounded-3xl p-6 shadow-xl sticky top-24 text-amber-100 transition-all">
            <h3 className="text-lg font-bold font-serif text-amber-300 mb-4 flex items-center gap-2 border-b border-amber-400/20 pb-3">
              নতুন শুভেচ্ছা লিখুন
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  আপনার নাম (Your Name):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full bg-stone-950/30 backdrop-blur-sm border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                  শুভেচ্ছা বার্তা (Wish):
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার শারদীয়ার শুভকামনা এখানে লিখুন..."
                  rows={4}
                  className="w-full bg-stone-950/30 backdrop-blur-sm border border-amber-400/30 rounded-xl p-4 text-xs text-amber-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 leading-relaxed shadow-inner"
                  required
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> পোস্ট করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> ওয়ালে পোস্ট করুন
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Wishes List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/80">
              সাম্প্রতিক শুভেচ্ছা বার্তা ({wishes.length})
            </span>
            <button
              onClick={fetchWishes}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1 rounded-lg border border-amber-400/30 backdrop-blur-sm transition-all"
            >
              <RefreshCw className="w-3 h-3" /> রিফ্রেশ করুন
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-amber-300/60 text-sm">
              শুভেচ্ছা লোড হচ্ছে...
            </div>
          ) : wishes.length === 0 ? (
            <div className="bg-stone-950/20 backdrop-blur-md border border-amber-400/30 rounded-2xl p-8 text-center text-amber-300/80 text-sm">
              এখনো কোনো শুভেচ্ছা নেই। প্রথম শুভেচ্ছাটি আপনিই লিখুন!
            </div>
          ) : (
            wishes.map((wish, index) => (
              <motion.div
                key={wish.id ? `wish-${wish.id}` : `wish-idx-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-stone-950/20 hover:bg-stone-950/30 border border-amber-400/35 rounded-2xl p-5 shadow-lg backdrop-blur-md text-amber-100 hover:border-amber-400/60 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 text-amber-300">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-serif font-bold text-amber-200 text-sm">
                      {wish.sender}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300/60">
                    {new Date(wish.createdAt).toLocaleDateString('bn-BD', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-amber-100/90 text-sm leading-relaxed font-serif pl-10">
                  "{wish.message}"
                </p>

                <div className="flex justify-end pt-2 border-t border-amber-500/20">
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> শুভ দুর্গোৎসব
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
