import React from 'react';
import { motion } from 'motion/react';

const animatedBirdGif = 'https://cdn.pixabay.com/animation/2024/01/18/16/30/16-30-44-408_512.gif';

interface LovelyBirdsSceneProps {
  phase: string;
}

export const LovelyBirdsScene: React.FC<LovelyBirdsSceneProps> = ({ phase }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {/* Left Bird - Optimized for Mobile & Desktop Spread */}
      <motion.div
        initial={{ left: isMobile ? '0%' : '-10%', top: '-45px', rotate: -4 }}
        animate={
          phase === 'closed' || phase === 'opened'
            ? { left: isMobile ? '0%' : '-10%', top: '-45px', y: [0, -10, 0], rotate: [-4, 2, -4] }
            : phase === 'quarrel'
            ? {
                left: [isMobile ? '0%' : '-10%', '22%', '10%', isMobile ? '0%' : '-10%'],
                top: ['-45px', '5px', '0px', '-35px'],
                rotate: [-8, 10, -8, -12]
              }
            : { left: isMobile ? '0%' : '-10%', top: '-45px', y: [0, -8, 0], rotate: -4 }
        }
        transition={
          phase === 'quarrel'
            ? { duration: 2.0, ease: "easeInOut" }
            : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
        }
        className="absolute"
      >
        <div className="w-28 h-28 sm:w-48 sm:h-48 flex items-center justify-center">
          <motion.img
            src={animatedBirdGif}
            alt="Animated Flying Bird"
            referrerPolicy="no-referrer"
            animate={!isMobile ? { scaleY: [1, 0.92, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className={`w-full h-full object-contain filter ${!isMobile ? 'drop-shadow-[0_4px_12px_rgba(255,255,255,0.7)]' : ''}`}
          />
        </div>
      </motion.div>

      {/* Right Bird - Optimized for Mobile & Desktop Spread */}
      <motion.div
        initial={{ right: isMobile ? '0%' : '-10%', top: '-45px', rotate: 4 }}
        animate={
          phase === 'closed' || phase === 'opened'
            ? { right: isMobile ? '0%' : '-10%', top: '-45px', y: [0, -10, 0], rotate: [4, -2, 4] }
            : phase === 'quarrel'
            ? {
                right: [isMobile ? '0%' : '-10%', '22%', '10%', isMobile ? '0%' : '-10%'],
                top: ['-45px', '5px', '0px', '-35px'],
                rotate: [8, -10, 8, 12]
              }
            : { right: isMobile ? '0%' : '-10%', top: '-45px', y: [0, -8, 0], rotate: 4 }
        }
        transition={
          phase === 'quarrel'
            ? { duration: 2.0, ease: "easeInOut", delay: 0.1 }
            : { repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.3 }
        }
        className="absolute"
      >
        <div className="w-28 h-28 sm:w-48 sm:h-48 flex items-center justify-center">
          <motion.img
            src={animatedBirdGif}
            alt="Animated Flying Bird"
            referrerPolicy="no-referrer"
            animate={!isMobile ? { scaleY: [1, 0.92, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className={`w-full h-full object-contain -scale-x-100 filter ${!isMobile ? 'drop-shadow-[0_4px_12px_rgba(255,255,255,0.7)]' : ''}`}
          />
        </div>
      </motion.div>
    </div>
  );
};
