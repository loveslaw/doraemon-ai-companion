// client/src/utils/doraemonAudio.js

export function getGadgetChimeFrequencies() {
  // Iconic Doraemon Gadget Reveal ascending chime: C5, E5, G5, C6
  return [523.25, 659.25, 783.99, 1046.50];
}

export function getDorayakiChompFrequencies() {
  return [440.00, 587.33]; // A4, D5 playful snack bite
}

let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

export function playGadgetChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = getGadgetChimeFrequencies();
  const now = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Triangle wave gives warm, anime bell-like chime
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.1);

    // Harmonic bell envelope
    gain.gain.setValueAtTime(0, now + index * 0.1);
    gain.gain.linearRampToValueAtTime(0.35, now + index * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.1);
    osc.stop(now + index * 0.1 + 0.4);
  });
}

export function playDorayakiMunch() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.18);
}
