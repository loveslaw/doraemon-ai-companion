// client/src/components/VisionCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, Loader2 } from 'lucide-react';

export default function VisionCard({ onDispatch, visionResult, isCapturing }) {
  const [query, setQuery] = useState('Explain what is on my screen and give me helpful tips');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(visionResult || '');

  const handleCapture = async () => {
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/screen-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setResponse(data.text);
      } else {
        setResponse(data.error || 'Doraemon lens could not process screen frame.');
      }
    } catch (err) {
      setResponse(`Error capturing screen: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          Anywhere Screen Lens (Gemini Multimodal)
        </span>
        <span className="flex items-center gap-1 text-[11px] text-amber-400">
          <Sparkles className="w-3 h-3" />
          Vision AI
        </span>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask Doraemon about your screen (e.g. debug this code)..."
        className="w-full bg-zinc-950/70 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition-[border]"
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={handleCapture}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-[transform,background] shadow-lg shadow-sky-500/20 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
        <span>{loading ? 'Doraemon Lens Analyzing...' : 'Snapshot & Analyze PC Screen'}</span>
      </motion.button>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-zinc-950/80 border border-sky-400/20 rounded-lg text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto"
        >
          <div className="text-[10px] uppercase font-bold text-sky-400 mb-1">
            🐱🔔 Doraemon's Insight:
          </div>
          {response}
        </motion.div>
      )}
    </div>
  );
}
