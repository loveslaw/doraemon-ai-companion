// client/src/components/VoiceCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import { playGadgetChime } from '../utils/doraemonAudio.js';

export default function VoiceCard({ onDispatch }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSupported(false);
      }
    }
  }, []);

  const speakReply = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.25; // Playful anime / companion pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!supported) {
      alert('Speech recognition is not supported in this browser. You can type queries in the Vision tab!');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Supports Hinglish/Hindi/English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      playGadgetChime();
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);

      // Simple witty Doraemon intelligence response
      let reply = `Haan Satyam! Maine suna: "${speechToText}". Main turant ispar gadget nikalta hoon! 🐱🔔`;
      const lower = speechToText.toLowerCase();
      if (lower.includes('volume') || lower.includes('aawaz')) {
        reply = 'Volume adjust kar diya, buddy!';
        onDispatch({ type: 'MEDIA_CONTROL', action: 'volume', direction: lower.includes('kam') ? 'down' : 'up' });
      } else if (lower.includes('pause') || lower.includes('chalao') || lower.includes('play')) {
        reply = 'Media toggle kar diya!';
        onDispatch({ type: 'MEDIA_CONTROL', action: 'toggle' });
      } else if (lower.includes('lock')) {
        reply = 'PC lock ho raha hai! Bye bye!';
        onDispatch({ type: 'SYSTEM_LOCK' });
      } else if (lower.includes('screen') || lower.includes('dekho')) {
        reply = 'Main screen dekh raha hoon, ek second!';
        onDispatch({ type: 'SCREEN_VISION' });
      }

      setAiReply(reply);
      speakReply(reply);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          Translation Konnyaku (Voice)
        </span>
        <span className="flex items-center gap-1 text-[11px] text-sky-400">
          <Sparkles className="w-3 h-3" />
          Hinglish Mic
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.15, 1], filter: 'drop-shadow(0 0 16px #0096E6)' } : {}}
          transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
          onClick={startListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-[background] ${
            isListening
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20'
          }`}
        >
          {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </motion.button>
        <span className="text-xs text-zinc-300 font-medium mt-2">
          {isListening ? 'Doraemon is listening... Speak now!' : 'Tap mic to talk in Hinglish'}
        </span>
      </div>

      {transcript && (
        <div className="p-2.5 bg-zinc-950/70 border border-white/10 rounded-lg text-xs text-zinc-300 space-y-1">
          <div className="text-[10px] uppercase font-bold text-zinc-500">You said:</div>
          <div>"{transcript}"</div>
        </div>
      )}

      {aiReply && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-sky-950/40 border border-sky-400/30 rounded-lg text-xs text-sky-200 space-y-1"
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400">
            <Volume2 className="w-3.5 h-3.5" />
            Doraemon's Voice Reply:
          </div>
          <div>{aiReply}</div>
        </motion.div>
      )}
    </div>
  );
}
