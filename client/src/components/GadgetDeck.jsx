// client/src/components/GadgetDeck.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Clipboard,
  Eye,
  Timer,
  Mic,
  X,
  Bell,
  Wifi,
  WifiOff
} from 'lucide-react';

import RemoteCard from './RemoteCard.jsx';
import ClipboardCard from './ClipboardCard.jsx';
import VisionCard from './VisionCard.jsx';
import FocusCard from './FocusCard.jsx';
import VoiceCard from './VoiceCard.jsx';

export default function GadgetDeck({
  isOpen,
  onClose,
  state,
  dispatch,
  onDispatch
}) {
  const tabs = [
    { id: 'remote', label: 'Remote', icon: Gamepad2 },
    { id: 'clipboard', label: 'Clipboard', icon: Clipboard },
    { id: 'vision', label: 'Vision', icon: Eye },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'voice', label: 'Voice', icon: Mic }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Bell className="w-4 h-4 fill-amber-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    Doraemon 4D Gadget Deck
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    {state.connected ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Wifi className="w-3 h-3" />
                        24/7 Wi-Fi LAN Connected ({state.lanIp}:4242)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400">
                        <WifiOff className="w-3 h-3" />
                        Standalone / Local Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-[background]"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-zinc-900/30 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = state.activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-[background,color] ${
                      isActive
                        ? 'bg-sky-500 text-zinc-950 shadow-md shadow-sky-500/20'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Card Body */}
            <div className="p-4 overflow-y-auto flex-grow space-y-4">
              {state.activeTab === 'remote' && <RemoteCard onDispatch={onDispatch} />}
              {state.activeTab === 'clipboard' && <ClipboardCard onDispatch={onDispatch} />}
              {state.activeTab === 'vision' && <VisionCard onDispatch={onDispatch} />}
              {state.activeTab === 'focus' && (
                <FocusCard state={state} dispatch={dispatch} onDispatch={onDispatch} />
              )}
              {state.activeTab === 'voice' && <VoiceCard onDispatch={onDispatch} />}
            </div>

            {/* Footer status */}
            <div className="px-4 py-2 border-t border-white/10 bg-zinc-950 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Zero PC Clutter • Discord Vault Active</span>
              <span className="text-sky-400 font-mono text-[10px]">#doraemon-companion</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
