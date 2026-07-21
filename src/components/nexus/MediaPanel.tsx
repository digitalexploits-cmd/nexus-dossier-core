/**
 * Navy-chrome multimedia primitives — dark, technical, no consumer styling.
 *
 * - HeroImage        : full-width atmospheric still with grid overlay + gold ruling.
 * - HoverVideo       : plays on hover / focus; click for controls fullscreen.
 * - InstrumentFrame  : sandboxed iframe embed for interactive HTML instruments.
 */

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const chromeStyle: React.CSSProperties = {
  borderColor: "rgba(201,162,74,0.42)",
  background: "linear-gradient(180deg, rgba(13,27,42,0.94), rgba(10,15,26,0.98))",
  boxShadow:
    "0 30px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 56px rgba(201,162,74,0.14)",
};

const CornerTicks = () => (
  <>
    {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r",
      "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls) => (
      <span key={cls} className={`pointer-events-none absolute w-3 h-3 border-[#d4af37]/70 ${cls}`} />
    ))}
  </>
);

interface HeaderProps {
  eyebrow?: string;
  label: string;
  meta?: string;
}
const PanelHeader = ({ eyebrow, label, meta }: HeaderProps) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(201,162,74,0.32)] bg-[rgba(10,15,26,0.85)]">
    <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#d4af37]">
      {eyebrow ? <><span className="text-[#8fa3b8] mr-2">{eyebrow}</span></> : null}
      <span className="text-[#eef6ff]">{label}</span>
    </div>
    {meta && (
      <div className="mono text-[0.5rem] tracking-[0.28em] uppercase text-[#8fa3b8]">{meta}</div>
    )}
  </div>
);

export const HeroImage = ({
  src,
  alt,
  eyebrow,
  label,
  meta,
  aspect = "aspect-[21/9]",
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  label: string;
  meta?: string;
  aspect?: string;
}) => (
  <div className="relative rounded-sm border overflow-hidden" style={chromeStyle}>
    <PanelHeader eyebrow={eyebrow} label={label} meta={meta} />
    <div className={`relative ${aspect} w-full overflow-hidden bg-[#05070a]`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* crosshair / grid motif */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,7,10,0.7)_100%)]" />
      <CornerTicks />
    </div>
  </div>
);

export const HoverVideo = ({
  src,
  poster,
  eyebrow,
  label,
  meta,
}: {
  src: string;
  poster?: string;
  eyebrow?: string;
  label: string;
  meta?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const pause = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div className="relative rounded-sm border overflow-hidden" style={chromeStyle}>
      <PanelHeader eyebrow={eyebrow} label={label} meta={meta} />
      <div
        className="relative aspect-video w-full bg-black group"
        onMouseEnter={play}
        onMouseLeave={pause}
        onFocus={play}
        onBlur={pause}
        tabIndex={0}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          preload="metadata"
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(5,7,10,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between items-center px-3 mono text-[0.5rem] tracking-[0.28em] uppercase text-[#d4af37]">
          <span>{playing ? "▶ LIVE" : "◇ HOVER TO PLAY"}</span>
          <span className="text-[#8fa3b8]">MUTED / LOOP</span>
        </div>
        <CornerTicks />
      </div>
      <div className="flex justify-end px-3 py-2 border-t border-[rgba(201,162,74,0.32)] bg-[rgba(10,15,26,0.85)]">
        <Button asChild variant="outline" className="mono tracking-widest text-[0.55rem] h-7">
          <a href={src} target="_blank" rel="noopener noreferrer">FULLSCREEN ↗</a>
        </Button>
      </div>
    </div>
  );
};

export const InstrumentFrame = ({
  src,
  eyebrow,
  label,
  meta,
  height = 520,
}: {
  src: string;
  eyebrow?: string;
  label: string;
  meta?: string;
  height?: number;
}) => (
  <div className="relative rounded-sm border overflow-hidden" style={chromeStyle}>
    <PanelHeader eyebrow={eyebrow} label={label} meta={meta ?? "INTERACTIVE INSTRUMENT · LIVE"} />
    <div className="relative bg-[#05070a]">
      <iframe
        src={src}
        title={label}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className="w-full border-0 block"
        style={{ height, background: "#05070a" }}
      />
      <CornerTicks />
    </div>
    <div className="flex justify-end px-3 py-2 border-t border-[rgba(201,162,74,0.32)] bg-[rgba(10,15,26,0.85)]">
      <Button asChild variant="outline" className="mono tracking-widest text-[0.55rem] h-7">
        <a href={src} target="_blank" rel="noopener noreferrer">OPEN INSTRUMENT ↗</a>
      </Button>
    </div>
  </div>
);
