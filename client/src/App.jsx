// client/src/App.jsx
import React, { useReducer, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Smartphone,
  Monitor,
  Wifi,
  Sparkles,
  Volume2
} from 'lucide-react';

import DoraemonWalker from './components/DoraemonWalker.jsx';
import DoraemonAvatar from './components/DoraemonAvatar.jsx';
import GadgetDeck from './components/GadgetDeck.jsx';
import { initialGadgetState, reduceGadgetAction } from './utils/gadgetState.js';
import { playGadgetChime } from './utils/doraemonAudio.js';

export default function App() {
  const [state, dispatch] = useReducer(reduceGadgetAction, null, initialGadgetState);
  const [isMobile, setIsMobile] = useState(false);
  const wsRef = useRef(null);

  // Viewport detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // WebSocket Connection to Local PC Hub (:4242)
  useEffect(() => {
    let reconnectTimer;
    const connectWs = () => {
      const host = window.location.hostname || 'localhost';
      const port = window.location.port || '4242';
      const wsUrl = `ws://${host}:${port}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        dispatch({ type: 'SET_CONNECTED', connected: true, lanIp: host });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INIT') {
            dispatch({ type: 'SET_CONNECTED', connected: true, lanIp: data.lanIp });
          } else if (data.type === 'SYNC_EVENT') {
            if (data.event.type === 'CLIPBOARD_SET') {
              dispatch({ type: 'SET_CLIPBOARD', text: data.event.text });
            }
          }
        } catch (e) {
          console.warn('[WS] Parse error:', e);
        }
      };

      ws.onclose = () => {
        dispatch({ type: 'SET_CONNECTED', connected: false });
        reconnectTimer = setTimeout(connectWs, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWs();
    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Dispatch Action via WebSocket or REST fallback
  const handleDispatch = (event) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    } else {
      fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => console.warn('REST action fallback error:', err));
    }
  };

  const handleOpenPocket = () => {
    playGadgetChime();
    dispatch({ type: 'TOGGLE_POCKET' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white font-sans selection:bg-sky-500 selection:text-black overflow-x-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25 border border-sky-400/40">
            <Bell className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              DORAEMON AI COMPANION 🐱🔔
            </h1>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span>Satyam's Screen Mate & 4D Hub</span>
              <span>•</span>
              <span className="text-sky-400">24/7 Wi-Fi</span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
            {isMobile ? <Smartphone className="w-3.5 h-3.5 text-sky-400" /> : <Monitor className="w-3.5 h-3.5 text-sky-400" />}
            <span className="text-zinc-300">{isMobile ? 'Phone PWA' : 'PC Desktop'}</span>
            <span className={`w-2 h-2 rounded-full ${state.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenPocket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-zinc-950 text-xs font-bold shadow-md shadow-sky-500/20 transition-[background,transform]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4D Pocket</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* On Mobile Phone: Direct prominent Doraemon face + Gadget deck buttons */}
        {isMobile ? (
          <div className="w-full flex flex-col items-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={handleOpenPocket}
            >
              <DoraemonAvatar state="idle" size={200} />
              <div className="mt-2 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Tap Doraemon to Open 4D Pocket!
              </div>
            </motion.div>

            {/* Always accessible Mobile Gadget Deck */}
            <div className="w-full">
              <GadgetDeck
                isOpen={true}
                onClose={() => {}}
                state={state}
                dispatch={dispatch}
                onDispatch={handleDispatch}
              />
            </div>
          </div>
        ) : (
          /* On Desktop PC: Welcome Hero + Instructions + Bottom Screen Mate */
          <div className="w-full text-center space-y-6 pt-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-3 h-3" /> Screen Mate Running Active
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Doraemon is Walking on Your Screen! 🐱🔔
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
                Look at the bottom of your screen — Doraemon is exploring, munching Dorayaki, and reacting. Click him to play his iconic gadget chime and access your 4D controls!
              </p>
            </motion.div>

            {/* Quick Actions Grid on PC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 text-left">
              <div
                onClick={handleOpenPocket}
                className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-400/40 cursor-pointer transition-[border,transform] hover:-translate-y-0.5 space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  🎮
                </div>
                <div className="text-xs font-bold text-white">Anywhere Remote</div>
                <div className="text-[11px] text-zinc-400">Control volume, media & launch apps with 1-click.</div>
              </div>

              <div
                onClick={() => { dispatch({ type: 'SET_TAB', tab: 'clipboard' }); handleOpenPocket(); }}
                className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-400/40 cursor-pointer transition-[border,transform] hover:-translate-y-0.5 space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  📋
                </div>
                <div className="text-xs font-bold text-white">Copy-Paste Cannon</div>
                <div className="text-[11px] text-zinc-400">Instant clipboard synchronization between Phone & PC.</div>
              </div>

              <div
                onClick={() => { dispatch({ type: 'SET_TAB', tab: 'vision' }); handleOpenPocket(); }}
                className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-400/40 cursor-pointer transition-[border,transform] hover:-translate-y-0.5 space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  🔍
                </div>
                <div className="text-xs font-bold text-white">Screen Vision Lens</div>
                <div className="text-[11px] text-zinc-400">Gemini multimodal vision to analyze your PC screen.</div>
              </div>
            </div>

            {/* Desktop Screen Walker Component */}
            <DoraemonWalker onOpenPocket={handleOpenPocket} />
          </div>
        )}

        {/* 4D Gadget Deck Modal (For Desktop) */}
        {!isMobile && (
          <GadgetDeck
            isOpen={state.isPocketOpen}
            onClose={() => dispatch({ type: 'TOGGLE_POCKET' })}
            state={state}
            dispatch={dispatch}
            onDispatch={handleDispatch}
          />
        )}
      </main>
    </div>
  );
}
