/**
 * HeroVideo — seamlessly-looping ambient hero.
 *
 * Two <video> layers play the same clip staggered by half its duration. Each
 * layer crossfades against the other near its loop boundary, so the natural
 * discontinuity at video.loop time is always covered by a fading-in copy.
 * The result is a living hero the viewer cannot tell is on loop.
 *
 * Falls back to the still hero image while the video loads or if it fails.
 */
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Crossfade window in seconds. */
  fade?: number;
}

export const HeroVideo = ({ src, poster, alt, className, style, fade = 0.9 }: Props) => {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // opacity of layer A (layer B = 1 - opA when crossfading)
  const [opA, setOpA] = useState(1);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let raf = 0;
    let started = false;

    const onMeta = () => {
      const dur = a.duration;
      if (!dur || !isFinite(dur)) return;
      // Stagger B by half the duration so it is always mid-clip when A loops.
      b.currentTime = dur / 2;
      const kick = async () => {
        try {
          a.muted = true; b.muted = true;
          await a.play();
          await b.play();
          started = true;
          setReady(true);
        } catch {
          // Autoplay blocked — keep poster.
        }
      };
      void kick();
    };

    const tick = () => {
      if (started && a.duration && b.duration) {
        const dur = a.duration;
        const tA = a.currentTime;
        const tB = b.currentTime;
        // Distance from each layer's next loop-boundary (end of its clip).
        const distA = dur - tA;
        const distB = dur - tB;
        // Whichever layer is closer to its boundary should be fading OUT.
        // Fade progress goes 0 → 1 across the last `fade` seconds.
        const fadeOutA = distA < fade ? 1 - distA / fade : 0;
        const fadeOutB = distB < fade ? 1 - distB / fade : 0;
        // Base opacity favors A. When A is fading out, lower it and reveal B.
        // When B is fading out, raise A. Sum is always ~1.
        let next = 1 - fadeOutA + fadeOutB;
        if (next > 1) next = 1;
        if (next < 0) next = 0;
        setOpA(next);
      }
      raf = requestAnimationFrame(tick);
    };

    a.addEventListener("loadedmetadata", onMeta);
    raf = requestAnimationFrame(tick);
    return () => {
      a.removeEventListener("loadedmetadata", onMeta);
      cancelAnimationFrame(raf);
    };
  }, [src, fade]);

  const commonProps = {
    muted: true,
    playsInline: true,
    loop: true,
    autoPlay: true,
    preload: "auto" as const,
    disablePictureInPicture: true,
    onError: () => setFailed(true),
    draggable: false,
    "aria-hidden": true as const,
  };

  return (
    <div className={className} style={style}>
      {/* Poster / fallback still */}
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready && !failed ? "opacity-0" : "opacity-100"}`}
        draggable={false}
      />
      {!failed && (
        <>
          <video
            ref={aRef}
            src={src}
            {...commonProps}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: ready ? opA : 0, transition: "opacity 120ms linear" }}
          />
          <video
            ref={bRef}
            src={src}
            {...commonProps}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: ready ? 1 - opA : 0, transition: "opacity 120ms linear" }}
          />
        </>
      )}
    </div>
  );
};
