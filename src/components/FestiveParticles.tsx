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
    // Elegant warm festive symbols: Diyas and gentle golden sparks
    const symbols = ['🪔', '✨', '🌟', '🔥', '🪔'];
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 14,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Background Ambient Glowing Gradient Orbs Animation */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-red-600/20 rounded-full blur-[150px]"
      />

      {/* Floating Diyas & Sparks */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', x: `${p.x}vw`, opacity: 0, scale: 0.8 }}
          animate={{
            y: ['105vh', '-10vh'],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.8, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          style={{ fontSize: `${p.size}px` }}
          className="absolute select-none filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
