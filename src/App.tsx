/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CardCreator } from './components/CardCreator';
import { SharedCardView } from './components/SharedCardView';
import { WishesWall } from './components/WishesWall';
import { PujoGuide } from './components/PujoGuide';
import { FestiveParticles } from './components/FestiveParticles';
import { ActiveTab, GreetingCardData } from './types';
import { DURGA_IMAGES } from './data/durgaImages';
import { Github, ExternalLink } from 'lucide-react';
import { parseCardFromLocation } from './utils/cardShare';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [sharedCard, setSharedCard] = useState<GreetingCardData | null>(null);
  const [isLoadingSharedCard, setIsLoadingSharedCard] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DURGA_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check URL parameters for shared greeting card (?card, ?c, or ?from/to/msg)
    let isMounted = true;

    async function loadCard() {
      const search = window.location.search;
      const hash = window.location.hash;
      const params = new URLSearchParams(search);
      
      console.log('[App] Loading card, search:', search, 'hash:', hash);

      const hasC = params.has('c') || params.has('C') || search.includes('c=') || search.includes('C=') || hash.includes('c=');
      const hasCard = params.has('card') || search.includes('card=');
      const hasLegacy = params.has('from') && params.has('to');

      if (!hasC && !hasCard && !hasLegacy) {
        console.log('[App] No card parameters found in URL');
        if (isMounted) {
          setIsLoadingSharedCard(false);
        }
        return;
      }

      try {
        console.log('[App] Card parameters detected, parsing...');
        // Small delay to ensure browser has fully parsed location
        await new Promise(r => setTimeout(r, 200));
        const card = await parseCardFromLocation();
        
        if (isMounted) {
          if (card) {
            console.log('[App] Card successfully parsed:', card.from, 'to', card.to);
            setSharedCard(card);
          } else {
            console.warn('[App] Card parameters found but parsing returned null');
            setLoadError('দুঃখিত, এই লিঙ্কে কোনো কার্ড খুঁজে পাওয়া যায়নি। সম্ভবত লিঙ্কটি ভুল বা কার্ডটি মুছে ফেলা হয়েছে।');
          }
        }
      } catch (err) {
        console.error('[App] Failed to load shared card:', err);
        setLoadError('কার্ডটি লোড করতে সমস্যা হয়েছে। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন।');
      } finally {
        if (isMounted) {
          setIsLoadingSharedCard(false);
        }
      }
    }

    loadCard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShareCard = (card: GreetingCardData) => {
    // Optionally save locally or preview
  };

  const handleResetShare = () => {
    // Clear URL query params without full reload if possible, or reset sharedCard
    if (window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
    setSharedCard(null);
    setActiveTab('create');
  };

  const handlePostToWallViaShared = async (sender: string, message: string, theme: string) => {
    try {
      await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, message, theme }),
      });
    } catch (err) {
      console.error('Failed to post to wall', err);
    }
  };

  return (
    <div 
      className="h-screen max-h-screen w-full text-amber-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative bg-stone-950 overflow-hidden"
    >
      {/* Background Slideshow Images - Optimized for Mobile Performance */}
      {DURGA_IMAGES.map((slide, index) => {
        // Only render current, next and previous to save memory
        const isVisible = Math.abs(index - currentSlide) <= 1 || 
                         (currentSlide === 0 && index === DURGA_IMAGES.length - 1) ||
                         (currentSlide === DURGA_IMAGES.length - 1 && index === 0);
        
        if (!isVisible) return null;

        return (
          <div
            key={`bg-slide-${index}`}
            className={`fixed inset-0 bg-cover bg-center z-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url('${slide}')`, 
              willChange: 'opacity'
            }}
          />
        );
      })}

      {/* Gentle subtle dark overlay so Maa Durga background images remain crystal clear */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/40 pointer-events-none z-0" />

      {/* Ambient Royal Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-red-600/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col h-full max-h-full min-h-0 overflow-hidden">
        <FestiveParticles />
        <div className="shrink-0">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onResetShare={handleResetShare}
            isSharedView={Boolean(sharedCard)}
          />
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 flex flex-col">
          {sharedCard ? (
            <SharedCardView
              cardData={sharedCard}
              onReset={handleResetShare}
              onPostToWall={handlePostToWallViaShared}
            />
          ) : isLoadingSharedCard ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-4xl animate-bounce">🪔</div>
              <p className="text-amber-300 font-serif text-base animate-pulse">শারদীয় শুভেচ্ছা কার্ডটি খোলা হচ্ছে...</p>
            </div>
          ) : loadError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="text-5xl">😟</div>
              <p className="text-rose-400 font-serif text-lg max-w-md">{loadError}</p>
              <button 
                onClick={handleResetShare}
                className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg"
              >
                নিজে একটি কার্ড তৈরি করুন
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'create' && <CardCreator onShareCard={handleShareCard} />}
              {activeTab === 'wall' && <WishesWall />}
              {activeTab === 'countdown' && <PujoGuide />}
            </>
          )}
        </main>

        {/* Sleek Compact Footer (Single-line, no overflow scrolling) */}
        <footer className="shrink-0 bg-stone-950/90 border-t border-amber-500/25 py-2 px-4 text-xs text-amber-300/80 backdrop-blur-md relative z-20 flex items-center justify-between">
          <p className="font-serif text-[11px] sm:text-xs">
            🌸 শুভ শারদীয়া ২০২৬ • দুর্গাপূজা শুভেচ্ছা পোর্টাল
          </p>
          <p className="text-[11px] text-amber-300/70 flex items-center gap-1.5">
            <span>Developed with ❤️ by</span>
            <a
              id="footer-developer-link"
              href="https://github.com/Anondoroydev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-100 underline decoration-amber-500/50 hover:decoration-amber-300 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Ajoy Sarker Anondo
            </a>
          </p>
        </footer>

        {/* Right Corner: Developer Quick Badge */}
        <a
          id="corner-developer-link"
          href="https://github.com/Anondoroydev"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-12 right-3 z-40 hidden sm:flex items-center gap-1.5 bg-stone-950/85 hover:bg-stone-900 border border-amber-500/40 hover:border-amber-300 text-amber-200 hover:text-white px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-[11px] transition-all hover:scale-105 active:scale-95 group"
          title="Developed by Ajoy Sarker Anondo"
        >
          <Github className="w-3 h-3 text-amber-400 group-hover:text-amber-200 transition-colors" />
          <span className="font-sans font-semibold text-amber-300 group-hover:underline">Anondo</span>
          <ExternalLink className="w-2.5 h-2.5 text-amber-400/70 group-hover:text-amber-200" />
        </a>
      </div>
    </div>
  );
}
