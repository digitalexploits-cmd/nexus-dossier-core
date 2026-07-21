/**
 * Navy-chrome multimedia primitives — deep-navy, precision-gold, no consumer styling.
 *
 * Interaction model (bay-wide, coherent):
 *  - InstrumentFrame  : click card → "instrument mode" overlay, thin gold border,
 *                       surroundings dimmed, one-shot gold crosshair scan on open,
 *                       slim "LIVE INSTRUMENT • REVIEW-SAFE" status bar. Clean collapse.
 *  - HoverVideo       : hover → soft gold outline + play. Click → contained expanded
 *                       player with minimal dark controls. Freezes on end w/ REPLAY.
 *  - HeroImage        : hover → almost-imperceptible drift + gold vignette. Click →
 *                       dark lightbox with technical title and short caption.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------ shared chrome ------------------------------ */

const chromeStyle: React.CSSProperties = {
  borderColor: "rgba(212,175,55,0.42)",
  background: "linear-gradient(180deg, rgba(13,27,42,0.94), rgba(10,15,26,0.98))",
  boxShadow:
    "0 30px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 56px rgba(212,175,55,0.14)",
};

const CornerTicks = () => (
  <>
    {[
      "top-2 left-2 border-t border-l",
      "top-2 right-2 border-t border-r",
      "bottom-2 left-2 border-b border-l",
      "bottom-2 right-2 border-b border-r",
    ].map((cls) => (
      <span
        key={cls}
        className={`pointer-events-none absolute w-3 h-3 border-[#d4af37]/70 ${cls}`}
      />
    ))}
  </>
);

interface HeaderProps {
  eyebrow?: string;
  label: string;
  meta?: string;
}
const PanelHeader = ({ eyebrow, label, meta }: HeaderProps) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(212,175,55,0.32)] bg-[rgba(10,15,26,0.85)]">
    <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#d4af37]">
      {eyebrow ? <span className="text-[#8fa3b8] mr-2">{eyebrow}</span> : null}
      <span className="text-[#eef6ff]">{label}</span>
    </div>
    {meta && (
      <div className="mono text-[0.5rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
        {meta}
      </div>
    )}
  </div>
);

/* Single-sweep gold scan overlay used when instruments open */
const CrosshairScan = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-y-0 -left-1/3 w-1/3 anim-crosshair-scan">
      <div
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.0) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.0) 70%, transparent 100%)",
          filter: "blur(0.5px)",
        }}
      />
    </div>
    {/* crosshair rulings */}
    <div className="absolute inset-0">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-[rgba(212,175,55,0.35)]" />
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[rgba(212,175,55,0.35)]" />
    </div>
  </div>
);

/* Shared overlay shell (dim surroundings, thin gold border, esc/backdrop close) */
const OverlayShell = ({
  onClose,
  children,
  maxWidth = "max-w-6xl",
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8 anim-media-fade"
      style={{ background: "rgba(5,7,10,0.86)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidth} anim-media-scale`}
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "1px solid rgba(212,175,55,0.55)",
          background: "linear-gradient(180deg, rgba(13,27,42,0.98), rgba(10,15,26,1))",
          boxShadow:
            "0 40px 120px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.15), 0 0 80px rgba(212,175,55,0.12)",
        }}
      >
        {children}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 z-10 h-8 w-8 flex items-center justify-center border border-[rgba(212,175,55,0.55)] bg-[rgba(10,15,26,0.9)] text-[#d4af37] hover:bg-[rgba(212,175,55,0.12)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const StatusStrip = ({ text = "LIVE INSTRUMENT • REVIEW-SAFE" }: { text?: string }) => (
  <div className="flex items-center gap-3 px-4 py-1.5 border-b border-[rgba(212,175,55,0.4)] bg-[rgba(10,15,26,0.95)]">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
    <span className="mono text-[0.55rem] tracking-[0.32em] uppercase text-[#d4af37]">
      {text}
    </span>
  </div>
);

/* ------------------------------ HeroImage --------------------------------- */

export const HeroImage = ({
  src,
  alt,
  eyebrow,
  label,
  meta,
  caption,
  aspect = "aspect-[21/9]",
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  label: string;
  meta?: string;
  caption?: string;
  aspect?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-no-interactive
        className="group relative block w-full text-left rounded-sm border overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]"
        style={chromeStyle}
        aria-label={`Expand image: ${label}`}
      >
        <PanelHeader eyebrow={eyebrow} label={label} meta={meta} />
        <div className={`relative ${aspect} w-full overflow-hidden bg-[#05070a]`}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover anim-slow-drift"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* base vignette + hover intensification */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,7,10,0.7)_100%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(212,175,55,0.08) 75%, rgba(5,7,10,0.85) 100%)",
            }}
          />
          <CornerTicks />
          <div className="pointer-events-none absolute bottom-2 right-3 mono text-[0.5rem] tracking-[0.28em] uppercase text-[#d4af37]/0 group-hover:text-[#d4af37] transition-colors">
            ⤢ EXPAND
          </div>
        </div>
      </button>

      {open && (
        <OverlayShell onClose={() => setOpen(false)} maxWidth="max-w-6xl">
          <PanelHeader eyebrow={eyebrow} label={label} meta={meta ?? "FIGURE"} />
          <div className="relative bg-[#05070a]">
            <img
              src={src}
              alt={alt}
              className="block w-full max-h-[75vh] object-contain"
            />
            <CornerTicks />
          </div>
          {caption && (
            <div className="px-4 py-3 border-t border-[rgba(212,175,55,0.32)] bg-[rgba(10,15,26,0.95)] mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8fa3b8]">
              {caption}
            </div>
          )}
        </OverlayShell>
      )}
    </>
  );
};

/* ------------------------------ HoverVideo -------------------------------- */

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
  const previewRef = useRef<HTMLVideoElement>(null);
  const expandedRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);

  const play = () => {
    const v = previewRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const pause = () => {
    const v = previewRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  const replay = useCallback(() => {
    const v = expandedRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    setEnded(false);
  }, []);

  return (
    <>
      <div
        className="group relative rounded-sm border overflow-hidden transition-shadow"
        style={chromeStyle}
      >
        <PanelHeader eyebrow={eyebrow} label={label} meta={meta} />
        <button
          type="button"
          onClick={() => {
            pause();
            setEnded(false);
            setOpen(true);
          }}
          onMouseEnter={play}
          onMouseLeave={pause}
          onFocus={play}
          onBlur={pause}
          data-no-interactive
          className="relative aspect-video w-full bg-black block focus:outline-none"
          aria-label={`Expand video: ${label}`}
        >
          <video
            ref={previewRef}
            src={src}
            poster={poster}
            preload="metadata"
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* soft gold outline on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.75),inset_0_0_40px_rgba(212,175,55,0.18)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(5,7,10,0.7)_100%)]" />
          {/* thin gold play indicator */}
          {!playing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 border border-[#d4af37]/80 flex items-center justify-center bg-[rgba(10,15,26,0.55)]">
                <span className="mono text-[0.6rem] tracking-[0.2em] text-[#d4af37]">▶</span>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between items-center px-3 mono text-[0.5rem] tracking-[0.28em] uppercase text-[#d4af37]">
            <span>{playing ? "▶ PREVIEW" : "◇ HOVER"}</span>
            <span className="text-[#8fa3b8]">CLICK ⤢ EXPAND</span>
          </div>
          <CornerTicks />
        </button>
      </div>

      {open && (
        <OverlayShell onClose={() => setOpen(false)} maxWidth="max-w-5xl">
          <PanelHeader eyebrow={eyebrow} label={label} meta={meta ?? "VIDEO"} />
          <div className="relative bg-black">
            <video
              ref={expandedRef}
              src={src}
              poster={poster}
              autoPlay
              controls
              playsInline
              onEnded={() => setEnded(true)}
              className="block w-full max-h-[75vh] bg-black"
              style={{ colorScheme: "dark" }}
            />
            {ended && (
              <button
                type="button"
                onClick={replay}
                data-no-interactive
                className="absolute inset-0 flex items-center justify-center bg-[rgba(5,7,10,0.55)] mono text-[0.65rem] tracking-[0.35em] uppercase text-[#d4af37] hover:text-[#eef6ff]"
              >
                <span className="border border-[#d4af37] px-4 py-2 bg-[rgba(10,15,26,0.9)]">
                  ↺ REPLAY
                </span>
              </button>
            )}
            <CornerTicks />
          </div>
        </OverlayShell>
      )}
    </>
  );
};

/* ---------------------------- InstrumentFrame ----------------------------- */

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
}) => {
  const [open, setOpen] = useState(false);
  const [scanKey, setScanKey] = useState(0);

  const openInstrument = () => {
    setScanKey((k) => k + 1);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openInstrument}
        data-no-interactive
        className="group relative block w-full text-left rounded-sm border overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]"
        style={chromeStyle}
        aria-label={`Activate instrument: ${label}`}
      >
        <PanelHeader eyebrow={eyebrow} label={label} meta={meta ?? "INSTRUMENT · CLICK TO ACTIVATE"} />
        <div className="relative bg-[#05070a] pointer-events-none">
          <iframe
            src={src}
            title={label}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full border-0 block"
            style={{ height, background: "#05070a", pointerEvents: "none" }}
            tabIndex={-1}
          />
          {/* dim + affordance while collapsed */}
          <div className="absolute inset-0 bg-[rgba(5,7,10,0.35)] group-hover:bg-[rgba(5,7,10,0.15)] transition-colors" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.75)]" />
          <div className="absolute bottom-2 right-3 mono text-[0.5rem] tracking-[0.28em] uppercase text-[#d4af37]">
            ⤢ ACTIVATE
          </div>
          <CornerTicks />
        </div>
      </button>

      {open && (
        <OverlayShell onClose={() => setOpen(false)} maxWidth="max-w-[92rem]">
          <StatusStrip />
          <PanelHeader eyebrow={eyebrow} label={label} meta={meta ?? "INTERACTIVE INSTRUMENT · LIVE"} />
          <div className="relative bg-[#05070a]">
            <iframe
              key={scanKey}
              src={src}
              title={label}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="w-full border-0 block"
              style={{ height: "min(78vh, 900px)", background: "#05070a" }}
            />
            {/* one-shot gold crosshair scan sweep */}
            <div key={`scan-${scanKey}`} className="pointer-events-none absolute inset-0">
              <CrosshairScan />
            </div>
            <CornerTicks />
          </div>
          <div className="flex justify-end px-3 py-2 border-t border-[rgba(212,175,55,0.32)] bg-[rgba(10,15,26,0.95)]">
            <Button asChild variant="outline" className="mono tracking-widest text-[0.55rem] h-7">
              <a href={src} target="_blank" rel="noopener noreferrer">OPEN IN NEW TAB ↗</a>
            </Button>
          </div>
        </OverlayShell>
      )}
    </>
  );
};
