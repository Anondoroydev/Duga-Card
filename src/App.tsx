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
import { Sparkles, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [sharedCard, setSharedCard] = useState<GreetingCardData | null>(null);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DURGA_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check URL query parameters for shared greeting card (short code or full params)
    const params = new URLSearchParams(window.location.search);
    const shortCode = params.get('c');
    const from = params.get('from');
    const to = params.get('to');
    const msg = params.get('msg');
    const theme = params.get('theme');
    const img = params.get('img');

    if (shortCode) {
      fetch(`/api/cards/${shortCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.card) {
            setSharedCard({
              from: data.card.from,
              to: data.card.to,
              message: data.card.message,
              theme: data.card.theme || 'royal-maroon',
              imageUrl: data.card.imageUrl || undefined,
            });
          }
        })
        .catch(() => {
          // Keep default if short card fetch fails
        });
    } else if (from && to && msg) {
      setSharedCard({
        from: decodeURIComponent(from),
        to: decodeURIComponent(to),
        message: decodeURIComponent(msg),
        theme: (theme as any) || 'royal-maroon',
        imageUrl: img ? decodeURIComponent(img) : undefined,
      });
    }
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
      {/* Background Slideshow Images - Fixed, Clear & Vibrant */}
      {DURGA_IMAGES.map((slide, index) => (
        <div
          key={slide}
          className={`fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-95 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ backgroundImage: `url('${slide}')`, transitionProperty: 'opacity, transform', transitionDuration: '1.5s' }}
        />
      ))}

      {/* Gentle overlay so Maa Durga's face and idol remain vividly visible */}
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950/60 via-black/25 to-stone-950/65 pointer-events-none z-0" />

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

        <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-2 sm:p-3 flex flex-col">
          {sharedCard ? (
            <SharedCardView
              cardData={sharedCard}
              onReset={handleResetShare}
              onPostToWall={handlePostToWallViaShared}
            />
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
