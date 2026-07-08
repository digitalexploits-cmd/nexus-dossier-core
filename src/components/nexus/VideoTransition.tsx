import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  onDone: () => void;
  /** Safety max duration in ms. Default 8s. */
  maxMs?: number;
}

const STALL_TIMEOUT_MS = 2500;

/**
 * Fullscreen video transition overlay. Cosmetic only — navigation is
 * primary. Any failure (error / stall / autoplay-block / timeout / ESC / SKIP)
 * finishes immediately and reveals the destination.
 */
export const VideoTransition = ({ src, onDone, maxMs = 8000 }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef(false);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onDone, 220);
  }, [onDone]);

  // Hard cap
  useEffect(() => {
    const t = window.setTimeout(finish, maxMs);
    return () => window.clearTimeout(t);
  }, [finish, maxMs]);

  // ESC to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Autoplay attempt; if blocked → skip
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.then === "function") p.catch(() => finish());
  }, [finish]);

  // Stall watchdog
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let stallTimer: number | null = null;
    const arm = () => {
      if (stallTimer !== null) window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(finish, STALL_TIMEOUT_MS);
    };
    const disarm = () => {
      if (stallTimer !== null) { window.clearTimeout(stallTimer); stallTimer = null; }
    };
    arm();
    v.addEventListener("playing", disarm);
    v.addEventListener("timeupdate", arm);
    v.addEventListener("stalled", finish);
    v.addEventListener("suspend", arm);
    return () => {
      disarm();
      v.removeEventListener("playing", disarm);
      v.removeEventListener("timeupdate", arm);
      v.removeEventListener("stalled", finish);
      v.removeEventListener("suspend", arm);
    };
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[95] bg-[#04060a] overflow-hidden"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 220ms ease-out" }}
    >
      <video
        ref={videoRef}
        src={src}
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
        onClick={finish}
        className="absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        SKIP →
      </button>
    </div>
  );
};
