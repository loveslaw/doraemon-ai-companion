// client/src/components/ClipboardCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy, ClipboardPaste, Send, Check } from 'lucide-react';

export default function ClipboardCard({ onDispatch }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSendToPc = () => {
    if (!text.trim()) return;
    onDispatch({ type: 'CLIPBOARD_SET', text });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePullFromPc = async () => {
    try {
      const res = await fetch('/api/clipboard');
      const data = await res.json();
      if (data.success && data.text) {
        setText(data.text);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.text);
        }
      }
    } catch (err) {
      console.warn('Failed to pull clipboard:', err);
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          Copy-Paste Cannon (Phone ⇄ PC)
        </span>
        <span className="text-[11px] text-zinc-400">Zero Friction Sync</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type, paste text, link, or OTP to sync with PC..."
        rows={4}
        className="w-full bg-zinc-950/70 border border-white/10 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition-[border]"
      />

      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSendToPc}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-xs transition-[transform,background]"
        >
          {copied ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          <span>{copied ? 'Sent to PC!' : 'Send to PC Clip'}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePullFromPc}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-[transform,background]"
        >
          <ClipboardCopy className="w-4 h-4 text-sky-400" />
          <span>Pull PC Clip</span>
        </motion.button>
      </div>
    </div>
  );
}
