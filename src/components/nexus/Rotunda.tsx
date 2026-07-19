import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BRAND, type BayId } from "@/data/content";
import { prefersReducedMotion } from "@/lib/audio";
import rotundaAsset from "@/assets/rotunda-hero.png.asset.json";
import rotundaLoopAsset from "@/assets/rotunda-hero-loop.mp4.asset.json";
import { MediaConsole } from "@/components/nexus/MediaConsole";
import { FoliageOverlay } from "@/components/nexus/FoliageOverlay";
import { SkyOverlay } from "@/components/nexus/SkyOverlay";
import { useAdaptiveLighting } from "@/lib/adaptiveLighting";
import { useStLouisWeather } from "@/lib/weather";

const ROTUNDA_HERO = rotundaAsset.url;
const ROTUNDA_LOOP = rotundaLoopAsset.url;
// Slow the landing footage so it feels cinematic and extends its perceived length.
const ROTUNDA_LOOP_RATE = 0.5;


interface Props {
  onSelect: (id: BayId) => void;
  onOpenVault: () => void;
}

type ZoneId = BayId | "vault";
type Zone = {
  id: ZoneId;
  label: string;
  sub: string;
  index: string;
  /** Horizontal position along the panorama, 0 = far left, 1 = far right. */
  pos: number;
  synthetic?: boolean;
};

const ZONES: Zone[] = [
  { id: "mission",    label: "Mission Brief",     sub: "The Founder / Boss",   index: "01", pos: 0.08 },
  { id: "technical",  label: "Sine Wave",         sub: "Algorithm Data Bank",  index: "02", pos: 0.30 },
  { id: "capability", label: "Capability Brief",  sub: "Capability Gallery",   index: "03", pos: 0.58 },
  { id: "operations", label: "Operations Center", sub: "Command & Control",    index: "04", pos: 0.82 },
  { id: "vault",      label: "Evidence Vault",    sub: "Secured Archive",      index: "05", pos: 0.97, synthetic: true },
];

const LOCK_THRESHOLD = 0.035;
const STEP_H = 0.08;
const STEP_V = 0.15;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));


export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const reduced = prefersReducedMotion();
  const lighting = useAdaptiveLighting();
  const weather = useStLouisWeather();



  // ---------- Reduced-motion fallback ----------
  if (reduced) {
    return (
      <section className="relative h-[100dvh] w-full overflow-hidden bg-[#05070a]">
        <img src={ROTUNDA_HERO} alt="Nexus rotunda" className="absolute inset-0 w-full h-full object-cover opacity-70" draggable={false} />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 container">
          <h1 className="mono text-primary text-lg tracking-[0.32em]">NEXUS ROTUNDA</h1>
          <p className="mono text-xs text-muted-foreground tracking-widest">SELECT A ZONE</p>
          <div className="grid gap-3 w-full max-w-md mt-4">
            {ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => (z.id === "vault" ? onOpenVault() : onSelect(z.id as BayId))}
                className="panel px-4 py-3 flex items-center justify-between hover:border-primary/60 transition-colors"
              >
                <div className="text-left">
                  <div className="mono text-[0.6rem] tracking-widest text-primary">{z.index} · {z.label.toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground">{z.sub}</div>
                </div>
                <span className="mono text-xs text-primary">ENTER →</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---------- First-person camera ----------
  // Initial framing differs on mobile: center on the Arch so the centerpiece,
  // right-leg river, and Busch Stadium all read on a narrow viewport.
  const isMobileInitial = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const [heading, setHeading] = useState(isMobileInitial ? 0.50 : 0.30);
  const [headingV, setHeadingV] = useState(isMobileInitial ? 0.50 : 0.58);
  const [dragging, setDragging] = useState(false);
  const [windStrength, setWindStrength] = useState(1);
  const [windSpeed, setWindSpeed] = useState(1);
  const [windUserOverride, setWindUserOverride] = useState(false);
  const [windPanelOpen, setWindPanelOpen] = useState(false);

  const [snapping, setSnapping] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [vaultPanelOpen, setVaultPanelOpen] = useState(false);
  const [mediaPanelOpen, setMediaPanelOpen] = useState(false);
  const [mediaConsoleOpen, setMediaConsoleOpen] = useState(false);
  const interactedRef = useRef(false);
  const headingRef = useRef(heading);
  const headingVRef = useRef(headingV);
  headingRef.current = heading;
  headingVRef.current = headingV;

  // Sync foliage sway with live St. Louis wind unless the user tuned it.
  useEffect(() => {
    if (windUserOverride || !weather.ok) return;
    setWindStrength(weather.windScale);
    setWindSpeed(Math.max(0.4, Math.min(2.2, 0.6 + weather.windMps * 0.12)));
  }, [weather.windScale, weather.windMps, weather.ok, windUserOverride]);


  const lockedZone = useMemo(() => {
    let best: { z: Zone; d: number } | null = null;
    for (const z of ZONES) {
      const d = Math.abs(z.pos - heading);
      if (d < LOCK_THRESHOLD && (!best || d < best.d)) best = { z, d };
    }
    return best?.z ?? null;
  }, [heading]);

  const prevLockRef = useRef<ZoneId | null>(null);
  useEffect(() => {
    prevLockRef.current = lockedZone?.id ?? null;
  }, [lockedZone]);

  const dismissHint = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      setHintVisible(false);
    }
  }, []);

  const enterZone = useCallback((z: Zone) => {
    if (z.id === "vault") onOpenVault();
    else onSelect(z.id as BayId);
  }, [onOpenVault, onSelect]);


  const stepH = useCallback((delta: number) => {
    dismissHint();
    setSnapping(true);
    setHeading((h) => clamp(h + delta));
    window.setTimeout(() => setSnapping(false), 350);
  }, [dismissHint]);

  const stepV = useCallback((delta: number) => {
    dismissHint();
    setSnapping(true);
    setHeadingV((v) => clamp(v + delta));
    window.setTimeout(() => setSnapping(false), 350);
  }, [dismissHint]);

  // Measured travel (both axes)
  const sectionRef = useRef<HTMLElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [viewW, setViewW] = useState(0);
  const [viewH, setViewH] = useState(0);
  const [worldW, setWorldW] = useState(0);
  const [worldH, setWorldH] = useState(0);
  const travelX = Math.max(0, worldW - viewW);
  const travelY = Math.max(0, worldH - viewH);

  const measure = useCallback(() => {
    if (sectionRef.current) {
      setViewW(sectionRef.current.clientWidth);
      setViewH(sectionRef.current.clientHeight);
    }
    if (worldRef.current) {
      const r = worldRef.current.getBoundingClientRect();
      setWorldW(r.width);
      setWorldH(r.height);
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (worldRef.current) ro.observe(worldRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  // Drag: horizontal + vertical
  const dragStartRef = useRef<{ x: number; y: number; heading: number; headingV: number } | null>(null);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStartRef.current = {
      x: e.clientX, y: e.clientY,
      heading: headingRef.current, headingV: headingVRef.current,
    };
    setDragging(true);
    setSnapping(false);
    dismissHint();
  }, [dismissHint]);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    if (travelX > 0) {
      const dx = e.clientX - dragStartRef.current.x;
      setHeading(clamp(dragStartRef.current.heading + -(dx / travelX)));
    }
    if (travelY > 0) {
      const dy = e.clientY - dragStartRef.current.y;
      setHeadingV(clamp(dragStartRef.current.headingV + -(dy / travelY)));
    }
  }, [travelX, travelY]);
  const endDrag = useCallback(() => {
    dragStartRef.current = null;
    setDragging(false);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); stepH(-STEP_H); }
      else if (e.key === "ArrowRight") { e.preventDefault(); stepH(STEP_H); }
      else if (e.key === "ArrowUp") { e.preventDefault(); stepV(-STEP_V); }
      else if (e.key === "ArrowDown") { e.preventDefault(); stepV(STEP_V); }
      else if ((e.key === "Enter" || e.key === " ") && lockedZone) { e.preventDefault(); enterZone(lockedZone); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lockedZone, enterZone, stepH, stepV]);

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const translateX = travelX > 0 ? -heading * travelX : (viewW - worldW) / 2;
  const translateY = travelY > 0 ? -headingV * travelY : (viewH - worldH) / 2;
  const worldTransform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  const worldTransition = snapping
    ? "transform 600ms cubic-bezier(0.22,1,0.36,1)"
    : dragging
      ? "none"
      : "transform 140ms linear";

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#05070a] select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      {/* WORLD — panorama scaled so height fills the viewport, width preserves aspect.
          Mobile uses 100dvh (Arch-centered initial framing keeps stadium/river readable);
          tablet/desktop uses 135dvh for a fuller first-person feel. */}
      <div
        ref={worldRef}
        className="absolute top-0 left-0 h-[170dvh] md:h-[190dvh] w-auto min-w-full"
        style={{
          transform: worldTransform,
          transition: worldTransition,
          willChange: "transform",
        }}
      >
        <video
          src={ROTUNDA_LOOP}
          poster={ROTUNDA_HERO}
          className="block max-w-none h-[170dvh] md:h-[190dvh] w-auto min-w-full object-cover"
          style={{ filter: `brightness(${lighting.sceneBrightness}) contrast(${lighting.sceneContrast}) saturate(1.10)` }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={(el) => { if (el) { el.playbackRate = ROTUNDA_LOOP_RATE; el.play?.().catch(() => {}); } }}
          onLoadedMetadata={(e) => { (e.currentTarget as HTMLVideoElement).playbackRate = ROTUNDA_LOOP_RATE; measure(); }}
        />






      </div>

      {/* CAMERA-FIXED OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_72%,rgba(5,7,10,0.55)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-background/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background/70 to-transparent" />

      {/* Look arrows */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => stepH(-STEP_H)}
        aria-label="Look left"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >◄</button>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => stepH(STEP_H)}
        aria-label="Look right"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >►</button>

      {/* ===== CONSOLIDATED KIOSK ===== */}
      <div
        className="absolute left-1/2 bottom-4 md:bottom-6 -translate-x-1/2 z-30 w-[min(96vw,880px)] anim-fade-up"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="border border-primary/50 bg-background/75 backdrop-blur-md shadow-[0_0_60px_rgba(70,150,255,0.35)]">
          {/* Header strip */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/30 mono text-[0.6rem] tracking-[0.28em] uppercase">
            <div className="flex items-center gap-2 text-primary">
              <span className="status-dot status-live" />
              <span>NEXUS · {BRAND.company}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <span>KIOSK</span>
              <span>·</span>
              <span className="text-primary/80">SELECT ZONE</span>
            </div>
          </div>

          {/* Bay grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3">
            {ZONES.map((z) => {
              const isLocked = lockedZone?.id === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => enterZone(z)}
                  className={`text-left px-3 py-2 border transition-colors ${
                    isLocked
                      ? "border-primary bg-primary/15 shadow-[0_0_24px_rgba(70,150,255,0.45)]"
                      : "border-primary/30 bg-background/40 hover:border-primary/70 hover:bg-primary/10"
                  }`}
                >
                  <div className="mono text-[0.55rem] tracking-[0.28em] text-primary">{z.index}</div>
                  <div className="mono text-[0.7rem] tracking-[0.2em] uppercase text-foreground">{z.label}</div>
                  <div className="mono text-[0.55rem] tracking-[0.22em] uppercase text-muted-foreground truncate">{z.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
            <button
              onClick={() => setMediaConsoleOpen(true)}
              className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/90 hover:text-primary border border-primary/50 hover:border-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5"
            >◇ MEDIA CONSOLE</button>
            <button
              onClick={onOpenVault}
              className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/90 hover:text-primary border border-primary/50 hover:border-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5"
            >◆ EVIDENCE VAULT</button>

            {/* Wind mini-controls */}
            <div className="ml-auto flex items-center gap-2 mono text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground">
              <span className="hidden sm:inline">≈ WIND</span>
              <input
                type="range" min={0} max={2.5} step={0.05}
                value={windStrength}
                onChange={(e) => { setWindUserOverride(true); setWindStrength(parseFloat(e.target.value)); }}
                className="w-20 accent-primary"
                aria-label="Wind strength"
              />
              <input
                type="range" min={0.25} max={3} step={0.05}
                value={windSpeed}
                onChange={(e) => { setWindUserOverride(true); setWindSpeed(parseFloat(e.target.value)); }}
                className="w-20 accent-primary"
                aria-label="Wind speed"
              />
              <button
                onClick={() => setWindUserOverride(false)}
                className="text-primary/80 hover:text-primary border border-primary/40 px-1.5 py-0.5"
                title="Sync to live St. Louis wind"
              >LIVE</button>
            </div>
          </div>
        </div>
      </div>

      <MediaConsole open={mediaConsoleOpen} onClose={() => setMediaConsoleOpen(false)} />

      {/* Hint */}
      {hintVisible && (
        <div className="absolute inset-x-0 top-16 z-40 flex justify-center pointer-events-none">
          <div className="panel px-4 py-2 pointer-events-auto mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/90 flex items-center gap-3">
            <span>DRAG TO LOOK · SELECT A BAY FROM THE KIOSK</span>
            <button
              onClick={() => { interactedRef.current = true; setHintVisible(false); }}
              className="text-primary/70 hover:text-primary border border-primary/40 px-2 py-0.5"
            >×</button>
          </div>
        </div>
      )}
    </section>
  );
};

