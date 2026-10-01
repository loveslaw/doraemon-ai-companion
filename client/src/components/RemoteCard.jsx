// client/src/components/RemoteCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Code,
  Globe,
  Music,
  Terminal,
  Calculator,
  Lock
} from 'lucide-react';

export default function RemoteCard({ onDispatch }) {
  const apps = [
    { id: 'code', label: 'VS Code', icon: Code, color: 'from-blue-500/20 to-blue-600/30' },
    { id: 'chrome', label: 'Chrome', icon: Globe, color: 'from-amber-500/20 to-amber-600/30' },
    { id: 'spotify', label: 'Spotify', icon: Music, color: 'from-emerald-500/20 to-emerald-600/30' },
    { id: 'terminal', label: 'Terminal', icon: Terminal, color: 'from-zinc-500/20 to-zinc-600/30' },
    { id: 'calc', label: 'Calc', icon: Calculator, color: 'from-purple-500/20 to-purple-600/30' }
  ];

  return (
    <div className="space-y-4">
      {/* Media & Volume Control Grid */}
      <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          Anywhere Media & Volume
        </span>
        
        {/* Volume Row */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'volume', direction: 'down' })}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-[transform,background]"
          >
            <Volume1 className="w-4 h-4 text-sky-400" />
            <span>Vol -</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'volume', direction: 'mute' })}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-medium text-xs transition-[transform,background]"
          >
            <VolumeX className="w-4 h-4 text-rose-400" />
            <span>Mute</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'volume', direction: 'up' })}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-[transform,background]"
          >
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>Vol +</span>
          </motion.button>
        </div>

        {/* Playback Row */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'prev' })}
            className="flex items-center justify-center py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium text-xs transition-[transform,background]"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'toggle' })}
            className="flex items-center justify-center py-2.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 font-semibold text-xs transition-[transform,background]"
          >
            <Play className="w-4 h-4 fill-sky-300 mr-1" />
            <Pause className="w-3.5 h-3.5 fill-sky-300" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'MEDIA_CONTROL', action: 'next' })}
            className="flex items-center justify-center py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium text-xs transition-[transform,background]"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 1-Tap App Launcher Deck */}
      <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          1-Tap Anywhere App Launcher
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {apps.map(app => {
            const Icon = app.icon;
            return (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDispatch({ type: 'APP_LAUNCH', app: app.id })}
                className={`flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-br ${app.color} border border-white/10 text-white text-xs font-medium hover:border-white/20 transition-[transform,border]`}
              >
                <Icon className="w-4 h-4 text-sky-300" />
                <span>{app.label}</span>
              </motion.button>
            );
          })}

          {/* Quick Lock PC button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDispatch({ type: 'SYSTEM_LOCK' })}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition-[transform,border]"
          >
            <Lock className="w-4 h-4" />
            <span>Lock PC</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
