import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
}

export const FestiveParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768;
    
    // Elegant warm festive symbols: Diyas, Flowers and Flames
    const symbols = ['🪔', '🌸', '🪔', '🔥', '🪔'];
    const count = isMobile ? 4 : 20; // Drastically reduced for mobile
    
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isMobile ? Math.random() * 12 + 8 : Math.random() * 18 + 14,
      duration: isMobile ? Math.random() * 6 + 10 : Math.random() * 10 + 8,
      delay: Math.random() * 10,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));
    setParticles(newParticles);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Background Ambient Glowing Gradient Orbs - Only on Desktop to save mobile GPU */}
      {!isMobile && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.1, 0.2, 0.1],
              x: ['-5%', '5%', '-5%'],
              y: ['-5%', '5%', '-5%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
              x: ['5%', '-5%', '5%'],
              y: ['5%', '-5%', '5%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-red-600/10 rounded-full blur-[120px]"
          />
        </>
      )}

      {/* Floating Diyas & Sparks */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', x: `${p.x}vw`, opacity: 0 }}
          animate={{
            y: ['105vh', '-10vh'],
            opacity: [0, 0.7, 0.7, 0],
            ...(isMobile ? {} : {
              x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`],
              scale: [0.8, 1.2, 1],
            })
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          style={{ 
            fontSize: `${p.size}px`,
            willChange: 'transform, opacity'
          }}
          className={`absolute select-none ${!isMobile ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
