import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  onDone: () => void;
  /** Safety max duration in ms. Default 8s. */
  maxMs?: number;
}

/**
 * Fullscreen video transition overlay. Auto-plays muted, calls onDone on
 * end / error / safety timeout / SKIP click. No controls.
 */
export const VideoTransition = ({ src, onDone, maxMs = 8000 }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef(false);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onDone, 250);
  }, [onDone]);

  useEffect(() => {
    const t = window.setTimeout(finish, maxMs);
    return () => window.clearTimeout(t);
  }, [finish, maxMs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[95] bg-[#04060a] overflow-hidden"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 250ms ease-out" }}
    >
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop={false}
        onEnded={finish}
        onError={finish}
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
