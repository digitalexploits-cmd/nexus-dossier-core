import { useCallback, useEffect, useRef, useState } from "react";
import { audio, prefersReducedMotion } from "@/lib/audio";

interface Props {
  onComplete: () => void;
}

const INTRO_SRC = "/media/intro-load.mp4";

/**
 * Cold-open intro. Plays /media/intro-load.mp4 fullscreen (muted autoplay
 * so browsers allow it), overlays SKIP + SOUND toggle, then fades out and
 * boots ambient audio. Reduced-motion skips straight through.
 */
export const IntroOverlay = ({ onComplete }: Props) => {
  const reducedRef = useRef(prefersReducedMotion());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(true);

  const finish = useCallback(async () => {
    if (fading || done) return;
    try { await audio.start(); } catch { /* ignore */ }
    // Mount the underlying view FIRST so it paints beneath the still-opaque
    // black overlay — prevents a white flash between video end and rotunda.
    onComplete();
    // Next frame: swap video for pure black backdrop, then fade the overlay.
    requestAnimationFrame(() => {
      setFading(true);
      setTimeout(() => { setDone(true); }, 450);
    });
  }, [fading, done, onComplete]);

  // Reduced motion: skip immediately
  useEffect(() => {
    if (reducedRef.current) {
      onComplete();
      setDone(true);
    }
  }, [onComplete]);

  // Escape to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Safety timeout in case video fails to fire onEnded
  useEffect(() => {
    const t = window.setTimeout(() => { finish(); }, 30_000);
    return () => window.clearTimeout(t);
  }, [finish]);

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next ? false : true; // next=true → unmute
    setMuted(!next);
    if (next) {
      try { await v.play(); } catch { /* ignore */ }
    }
  }, [muted]);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#04060a] overflow-hidden"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 400ms ease-out",
      }}
    >
      <video
        ref={videoRef}
        src={INTRO_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop={false}
        onEnded={finish}
        onError={finish}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(2,4,8,0.85)_100%)]" />

      {/* SOUND toggle */}
      <button
        onClick={toggleSound}
        className="absolute bottom-6 left-6 mono text-[0.6rem] tracking-[0.28em] text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        {muted ? "SOUND ON" : "SOUND OFF"}
      </button>

      {/* SKIP */}
      <button
        onClick={finish}
        className="absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        SKIP →
      </button>
    </div>
  );
};
