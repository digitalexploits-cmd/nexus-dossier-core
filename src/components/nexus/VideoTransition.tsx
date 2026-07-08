import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  /** Single source, or an ordered list of clips to play back-to-back. */
  src?: string;
  sources?: string[];
  onDone: () => void;
  /** Safety max duration in ms for the ENTIRE sequence. Default 16s. */
  maxMs?: number;
}

const STALL_TIMEOUT_MS = 2500;

/**
 * Fullscreen video transition overlay. Cosmetic only — navigation is
 * primary. Accepts one or more clips and plays them back-to-back with a
 * seamless crossfade between them. Any failure (error / stall / autoplay-
 * block / timeout / ESC / SKIP) finishes immediately.
 */
export const VideoTransition = ({ src, sources, onDone, maxMs = 16000 }: Props) => {
  const clips = useMemo(() => {
    if (sources && sources.length > 0) return sources;
    if (src) return [src];
    return [];
  }, [src, sources]);

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef(false);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onDone, 220);
  }, [onDone]);

  // Advance to next clip or finish the whole sequence.
  const advance = useCallback(() => {
    setIndex((i) => {
      if (i + 1 < clips.length) return i + 1;
      finish();
      return i;
    });
  }, [clips.length, finish]);

  // Hard cap for the whole sequence
  useEffect(() => {
    const t = window.setTimeout(finish, maxMs);
    return () => window.clearTimeout(t);
  }, [finish, maxMs]);

  // ESC to skip everything
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Autoplay attempt whenever the clip changes; if blocked → skip
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.then === "function") p.catch(() => finish());
  }, [index, finish]);

  // Stall watchdog (per clip)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let stallTimer: number | null = null;
    const arm = () => {
      if (stallTimer !== null) window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(advance, STALL_TIMEOUT_MS);
    };
    const disarm = () => {
      if (stallTimer !== null) { window.clearTimeout(stallTimer); stallTimer = null; }
    };
    arm();
    v.addEventListener("playing", disarm);
    v.addEventListener("timeupdate", arm);
    v.addEventListener("stalled", advance);
    v.addEventListener("suspend", arm);
    return () => {
      disarm();
      v.removeEventListener("playing", disarm);
      v.removeEventListener("timeupdate", arm);
      v.removeEventListener("stalled", advance);
      v.removeEventListener("suspend", arm);
    };
  }, [index, advance]);

  if (clips.length === 0) return null;
  const currentSrc = clips[index];
  const nextSrc = clips[index + 1];

  return (
    <div
      className="fixed inset-0 z-[95] bg-[#04060a] overflow-hidden"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 220ms ease-out" }}
    >
      <video
        key={currentSrc}
        ref={videoRef}
        src={currentSrc}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        onEnded={advance}
        onError={advance}
        onAbort={advance}
      />
      {/* Preload the next clip so the handoff is seamless */}
      {nextSrc && <link rel="preload" as="video" href={nextSrc} />}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(2,4,8,0.85)_100%)]" />
      {/* Sequence progress dots */}
      {clips.length > 1 && (
        <div className="absolute bottom-6 left-6 flex gap-1.5">
          {clips.map((_, i) => (
            <span
              key={i}
              className="h-1 w-6 transition-colors"
              style={{ background: i <= index ? "rgba(125,211,255,0.8)" : "rgba(125,211,255,0.2)" }}
            />
          ))}
        </div>
      )}
      <button
        onClick={finish}
        className="absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
      >
        SKIP →
      </button>
    </div>
  );
};

