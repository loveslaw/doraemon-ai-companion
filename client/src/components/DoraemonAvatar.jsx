// client/src/components/DoraemonAvatar.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function DoraemonAvatar({ state = 'idle', size = 180, onClick }) {
  // Animation variants based on current state
  const bodyVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
    },
    walk: {
      y: [0, -8, 0],
      rotate: [-3, 3, -3],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
    },
    eating: {
      y: [0, -3, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    },
    sleep: {
      y: [0, -2, 0],
      rotate: [0, 2, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
    },
    gadget: {
      scale: [1, 1.08, 1],
      transition: { duration: 0.6, repeat: 2, ease: 'easeOut' }
    }
  };

  const bellVariants = {
    gadget: {
      scale: [1, 1.4, 1],
      filter: ['drop-shadow(0 0 2px gold)', 'drop-shadow(0 0 12px gold)', 'drop-shadow(0 0 2px gold)'],
      transition: { duration: 0.4, repeat: Infinity }
    },
    idle: {
      scale: 1,
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.15 }}
      variants={bodyVariants}
      animate={state}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Doraemon Classic Blue Gradient */}
          <radialGradient id="doraBlue" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#29B6F6" />
            <stop offset="60%" stopColor="#0288D1" />
            <stop offset="100%" stopColor="#01579B" />
          </radialGradient>
          {/* Golden Bell Gradient */}
          <linearGradient id="goldBell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="40%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>
          {/* Nose Gradient */}
          <radialGradient id="redNose" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="80%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#8E0000" />
          </radialGradient>
          {/* Dorayaki Gradient */}
          <linearGradient id="dorayaki" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D78F49" />
            <stop offset="50%" stopColor="#795548" />
            <stop offset="100%" stopColor="#A26B36" />
          </linearGradient>
        </defs>

        {/* --- BODY & FEET --- */}
        {/* Left Foot */}
        <ellipse cx="70" cy="216" rx="28" ry="12" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
        {/* Right Foot */}
        <ellipse cx="130" cy="216" rx="28" ry="12" fill="#FFFFFF" stroke="#222" strokeWidth="3" />

        {/* Main Body */}
        <path
          d="M 50 130 C 50 100, 150 100, 150 130 C 158 175, 145 205, 100 205 C 55 205, 42 175, 50 130 Z"
          fill="url(#doraBlue)"
          stroke="#222"
          strokeWidth="3.5"
        />

        {/* White Belly */}
        <circle cx="100" cy="155" r="38" fill="#FFFFFF" stroke="#222" strokeWidth="3" />

        {/* 4D Pocket (Half-circle pouch) */}
        <path
          d="M 72 155 Q 100 156 128 155 C 128 178, 72 178, 72 155 Z"
          fill="#FAFAFA"
          stroke="#222"
          strokeWidth="2.5"
        />

        {/* Left Hand / Paw */}
        <circle cx="40" cy="148" r="15" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
        {/* Right Hand / Paw */}
        <circle cx="160" cy="148" r="15" fill="#FFFFFF" stroke="#222" strokeWidth="3" />

        {/* --- HEAD --- */}
        {/* Blue Head Sphere */}
        <circle cx="100" cy="75" r="68" fill="url(#doraBlue)" stroke="#222" strokeWidth="4" />

        {/* White Face Mask */}
        <path
          d="M 46 80 C 44 48, 156 48, 154 80 C 154 116, 46 116, 46 80 Z"
          fill="#FFFFFF"
          stroke="#222"
          strokeWidth="3"
        />

        {/* --- EYES --- */}
        {state === 'sleep' ? (
          /* Sleeping Eyes (Happy curved arcs) */
          <>
            <path d="M 74 48 Q 84 40 94 48" stroke="#222" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 106 48 Q 116 40 126 48" stroke="#222" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Sleep Bubble */}
            <circle cx="128" cy="70" r="14" fill="rgba(144, 202, 249, 0.65)" stroke="#90CAF9" strokeWidth="1.5" />
          </>
        ) : state === 'shocked' ? (
          /* Shocked Tiny Pupils */
          <>
            <ellipse cx="85" cy="45" rx="14" ry="18" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
            <ellipse cx="115" cy="45" rx="14" ry="18" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
            <circle cx="85" cy="45" r="3" fill="#222" />
            <circle cx="115" cy="45" r="3" fill="#222" />
          </>
        ) : (
          /* Normal Anime Eyes with Glistening Highlights */
          <>
            <ellipse cx="85" cy="45" rx="14" ry="18" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
            <ellipse cx="115" cy="45" rx="14" ry="18" fill="#FFFFFF" stroke="#222" strokeWidth="3" />
            {/* Left Pupil */}
            <circle cx="88" cy="46" r="6" fill="#111" />
            <circle cx="89" cy="44" r="2" fill="#FFF" />
            {/* Right Pupil */}
            <circle cx="112" cy="46" r="6" fill="#111" />
            <circle cx="113" cy="44" r="2" fill="#FFF" />
          </>
        )}

        {/* --- NOSE --- */}
        <circle cx="100" cy="62" r="10" fill="url(#redNose)" stroke="#222" strokeWidth="2.5" />
        <circle cx="97" cy="59" r="3" fill="#FFFFFF" opacity="0.8" />

        {/* Philtrum line */}
        <line x1="100" y1="72" x2="100" y2="102" stroke="#222" strokeWidth="2.5" />

        {/* --- MOUTH --- */}
        {state === 'eating' ? (
          /* Cheerful Open Munching Mouth with Dorayaki */
          <>
            <path d="M 76 92 Q 100 115 124 92 Z" fill="#D32F2F" stroke="#222" strokeWidth="2.5" />
            {/* Dorayaki Snack */}
            <g transform="translate(90, 80)">
              <ellipse cx="10" cy="10" rx="16" ry="10" fill="url(#dorayaki)" stroke="#4E342E" strokeWidth="2" />
              <line x1="-3" y1="10" x2="23" y2="10" stroke="#3E2723" strokeWidth="3" />
            </g>
          </>
        ) : state === 'shocked' ? (
          /* Big O Shaped Mouth */
          <ellipse cx="100" cy="98" rx="14" ry="18" fill="#D32F2F" stroke="#222" strokeWidth="2.5" />
        ) : (
          /* Classic Wide Doraemon Grin */
          <path d="M 68 88 Q 100 120 132 88" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* --- WHISKERS (3 on each side) --- */}
        {/* Left Whiskers */}
        <line x1="52" y1="68" x2="80" y2="72" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="50" y1="79" x2="80" y2="79" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="52" y1="90" x2="80" y2="86" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />

        {/* Right Whiskers */}
        <line x1="148" y1="68" x2="120" y2="72" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="150" y1="79" x2="120" y2="79" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="148" y1="90" x2="120" y2="86" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />

        {/* --- RED COLLAR --- */}
        <rect x="58" y="125" width="84" height="13" rx="6" fill="#E53935" stroke="#222" strokeWidth="3" />

        {/* --- GOLDEN BELL --- */}
        <motion.g variants={bellVariants} animate={state === 'gadget' ? 'gadget' : 'idle'}>
          <circle cx="100" cy="142" r="11" fill="url(#goldBell)" stroke="#222" strokeWidth="2.5" />
          {/* Bell slit and hole */}
          <line x1="91" y1="139" x2="109" y2="139" stroke="#333" strokeWidth="2" />
          <circle cx="100" cy="144" r="2.2" fill="#222" />
          <line x1="100" y1="146" x2="100" y2="152" stroke="#222" strokeWidth="2" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
