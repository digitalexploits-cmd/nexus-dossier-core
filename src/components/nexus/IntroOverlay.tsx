import { useCallback, useEffect, useRef, useState } from "react";
import { audio, prefersReducedMotion } from "@/lib/audio";

interface Props {
  onComplete: () => void;
}

const INTRO_SRC = "/media/intro-load.mp4";
const HARD_TIMEOUT_MS = 14000;
const STALL_TIMEOUT_MS = 4500;

/**
 * Cold-open intro. Robust guards:
 *  - autoplay muted; if blocked/errored/stalled → skip
 *  - hard 14s timeout (source is ~12s)
 *  - ESC + SKIP always work
 * Never traps the visitor. Fade never blocks on audio unlock.
 */
export const IntroOverlay = ({ onComplete }: Props) => {
  const reducedRef = useRef(prefersReducedMotion());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(true);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Fire-and-forget — never block the reveal on audio unlock.
    audio.start().catch(() => { /* ignore */ });
    setFading(true);
    window.setTimeout(() => {
      onComplete();
      setDone(true);
    }, 420);
  }, [onComplete]);

  // Reduced motion → skip immediately
  useEffect(() => {
    if (reducedRef.current) finish();
  }, [finish]);

  // Escape to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Hard safety timeout — never trap the visitor
  useEffect(() => {
    const t = window.setTimeout(finish, HARD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [finish]);

  // If autoplay is blocked, skip. Try play() explicitly.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const attempt = v.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.catch(() => finish());
    }
  }, [finish]);

  // Stall watchdog
  useEffect(() => {
    let stallTimer: number | null = null;
    const v = videoRef.current;
    if (!v) return;
    const armStall = () => {
      if (stallTimer !== null) window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(finish, STALL_TIMEOUT_MS);
    };
    const disarm = () => {
      if (stallTimer !== null) { window.clearTimeout(stallTimer); stallTimer = null; }
    };
    armStall();
    v.addEventListener("playing", disarm);
    v.addEventListener("timeupdate", armStall);
    v.addEventListener("stalled", finish);
    v.addEventListener("suspend", armStall);
    return () => {
      disarm();
      v.removeEventListener("playing", disarm);
      v.removeEventListener("timeupdate", armStall);
      v.removeEventListener("stalled", finish);
      v.removeEventListener("suspend", armStall);
    };
  }, [finish]);

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = !next;
    setMuted(!next);
    if (next) { try { await v.play(); } catch { /* ignore */ } }
  }, [muted]);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#04060a] overflow-hidden"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 400ms ease-out" }}
    >
      <video
        ref={videoRef}
        src={INTRO_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        onEnded={finish}
        onError={finish}
        onAbort={finish}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(2,4,8,0.85)_100%)]" />

      <button
        onClick={toggleSound}
        className="absolute bottom-6 left-6 mono text-[0.6rem] tracking-[0.28em] text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        {muted ? "SOUND ON" : "SOUND OFF"}
      </button>

      <button
        onClick={finish}
        className="absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        SKIP →
      </button>
    </div>
  );
};
