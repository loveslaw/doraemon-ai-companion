// client/src/components/DoraemonWalker.jsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DoraemonAvatar from './DoraemonAvatar.jsx';
import { playGadgetChime, playDorayakiMunch } from '../utils/doraemonAudio.js';

export default function DoraemonWalker({ onOpenPocket, currentMood = 'idle' }) {
  const [posX, setPosX] = useState(120);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [avatarState, setAvatarState] = useState('walk'); // 'walk' | 'idle' | 'eating' | 'sleep' | 'gadget'
  const controls = useAnimation();

  // Screen Walker Autonomous AI Movement loop
  useEffect(() => {
    let timeoutId;

    const walkerCycle = () => {
      // Pick a random behavior
      const rand = Math.random();

      if (rand < 0.5) {
        // Walk for 4-8 seconds
        setAvatarState('walk');
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const step = (Math.random() * 180 + 100) * direction;
        let nextX = posX + step;

        // Bounce back if reaching edge
        if (nextX > screenWidth - 220) {
          nextX = screenWidth - 230;
          setDirection(-1);
        } else if (nextX < 40) {
          nextX = 50;
          setDirection(1);
        }

        setPosX(nextX);
        timeoutId = setTimeout(walkerCycle, 4500);
      } else if (rand < 0.8) {
        // Idle breathing and looking around
        setAvatarState('idle');
        timeoutId = setTimeout(walkerCycle, 3500);
      } else {
        // Snack break with delicious Dorayaki!
        setAvatarState('eating');
        playDorayakiMunch();
        timeoutId = setTimeout(walkerCycle, 4000);
      }
    };

    timeoutId = setTimeout(walkerCycle, 2000);
    return () => clearTimeout(timeoutId);
  }, [posX, direction]);

  const handleClick = () => {
    // Play iconic Doraemon gadget chime!
    playGadgetChime();
    setAvatarState('gadget');

    // Pop the 4D pocket
    if (onOpenPocket) {
      onOpenPocket();
    }

    setTimeout(() => {
      setAvatarState('idle');
    }, 1800);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-40 select-none overflow-hidden h-64">
      {/* Floor glow / subtle floor shadow */}
      <motion.div
        className="absolute bottom-2 pointer-events-auto cursor-grab active:cursor-grabbing"
        animate={{
          x: posX,
          scaleX: direction
        }}
        transition={{
          x: { duration: 4, ease: 'easeInOut' },
          scaleX: { duration: 0.3 }
        }}
      >
        {/* Subtle floor contact shadow */}
        <div className="absolute bottom-1 left-8 w-32 h-4 bg-black/25 rounded-full blur-sm" />

        {/* Doraemon Character */}
        <DoraemonAvatar
          state={avatarState}
          size={160}
          onClick={handleClick}
        />

        {/* Interactive Speech Hint Bubble */}
        {avatarState === 'eating' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 left-12 bg-white/95 text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-amber-300 pointer-events-none"
          >
            Yum! Dorayaki 🥞
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
