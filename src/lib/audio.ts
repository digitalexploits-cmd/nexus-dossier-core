/**
 * Nexus procedural audio.
 * A tiny Web Audio drone + UI blip. No external files — all synthesized.
 * Module-level singleton so mute state and the AudioContext survive across
 * component remounts and hash-based view changes.
 */

type Listener = (muted: boolean) => void;

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let started = false;
let muted = false;
const MASTER_UNMUTED = 0.18; // overall ceiling, kept low so it's ambient
const listeners = new Set<Listener>();

const readStoredMute = (): boolean => {
  try { return sessionStorage.getItem("nexus:muted") === "1"; } catch { return false; }
};

muted = readStoredMute();

const persistMute = () => {
  try { sessionStorage.setItem("nexus:muted", muted ? "1" : "0"); } catch { /* ignore */ }
};

const ensureContext = () => {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  masterGain = ctx.createGain();
  masterGain.gain.value = muted ? 0 : MASTER_UNMUTED;
  masterGain.connect(ctx.destination);
  return ctx;
};

const buildDrone = () => {
  if (!ctx || !masterGain) return;

  // Two detuned low oscillators for a warm hum.
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = "sine"; osc1.frequency.value = 55;   // A1
  osc2.type = "sine"; osc2.frequency.value = 82.4; // E2 (fifth)

  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.55;
  osc1.connect(oscGain); osc2.connect(oscGain);

  // Slow LFO for gentle amplitude breathing.
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.18;
  lfo.connect(lfoGain).connect(oscGain.gain);

  // Filtered white-noise pad for air.
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf; noise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 420;
  noiseFilter.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.09;
  noise.connect(noiseFilter).connect(noiseGain);

  oscGain.connect(masterGain);
  noiseGain.connect(masterGain);

  osc1.start(); osc2.start(); lfo.start(); noise.start();
};

export const audio = {
  /** Call from a user gesture (click). Safe to call more than once. */
  async start() {
    const c = ensureContext();
    if (c.state === "suspended") { try { await c.resume(); } catch { /* ignore */ } }
    if (!started) { buildDrone(); started = true; }
  },

  isMuted() { return muted; },

  setMuted(next: boolean) {
    muted = next;
    persistMute();
    if (masterGain && ctx) {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.linearRampToValueAtTime(muted ? 0 : MASTER_UNMUTED, now + 0.25);
    }
    listeners.forEach((l) => l(muted));
  },

  toggle() { this.setMuted(!muted); },

  subscribe(l: Listener) { listeners.add(l); return () => listeners.delete(l); },

  /** Short UI select/confirm blip. No-op if muted or not started. */
  blip(freq = 880) {
    if (!ctx || !masterGain || muted) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, now);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.18);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.28, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    o.connect(g).connect(masterGain);
    o.start(now); o.stop(now + 0.24);
  },
};

/** React hook — returns [muted, setMuted]. */
import { useSyncExternalStore } from "react";
export const useMuted = (): [boolean, (v: boolean) => void] => {
  const isMuted = useSyncExternalStore(
    (cb) => audio.subscribe(() => cb()),
    () => audio.isMuted(),
    () => false,
  );
  return [isMuted, (v: boolean) => audio.setMuted(v)];
};

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
