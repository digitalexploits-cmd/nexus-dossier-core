import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BRAND, type BayId } from "@/data/content";
import { prefersReducedMotion } from "@/lib/audio";
import rotundaAsset from "@/assets/rotunda-hero.png.asset.json";
import { MediaConsole } from "@/components/nexus/MediaConsole";
import { FoliageOverlay } from "@/components/nexus/FoliageOverlay";
import { SkyOverlay } from "@/components/nexus/SkyOverlay";
import { useAdaptiveLighting } from "@/lib/adaptiveLighting";
import { useStLouisWeather } from "@/lib/weather";

const ROTUNDA_HERO = rotundaAsset.url;


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
        className="absolute top-0 left-0 h-[100dvh] md:h-[135dvh] w-auto"
        style={{
          transform: worldTransform,
          transition: worldTransition,
          willChange: "transform",
        }}
      >
        <img
          src={ROTUNDA_HERO}
          alt="Nexus rotunda panorama"
          className="block max-w-none h-[100dvh] md:h-[135dvh] w-auto"
          style={{ filter: `brightness(${lighting.sceneBrightness}) contrast(${lighting.sceneContrast}) saturate(1.10)` }}
          draggable={false}
          onLoad={measure}
        />

        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_14%_38%,rgba(110,200,255,0.18)_0%,transparent_45%)]" />
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_86%_88%,rgba(255,180,100,0.16)_0%,transparent_52%)]" />

        <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,170,255,0.18)_0%,transparent_65%)]" />

        {/* Animated foliage — trees/leaves gently sway outside the windows */}
        <FoliageOverlay
          strength={windStrength}
          speed={windSpeed}
          opacity={lighting.foliageOpacity}
          brightness={lighting.foliageBrightness}
        />

        {/* Synthetic Vault doorway */}
        <div
          className="absolute top-1/2 pointer-events-none"
          style={{ left: `${ZONES[4].pos * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative w-[220px] h-[360px] border border-primary/50 bg-gradient-to-b from-primary/15 via-background/60 to-background/90 backdrop-blur-[2px] shadow-[0_0_60px_rgba(70,150,255,0.35)]">
            <div className="absolute inset-2 border border-primary/30" />
            <div className="absolute inset-x-0 top-4 text-center mono text-[0.55rem] tracking-[0.32em] text-primary/80">EVIDENCE</div>
            <div className="absolute inset-x-0 top-9 text-center mono text-[0.55rem] tracking-[0.32em] text-primary/80">VAULT</div>
            <div className="absolute inset-x-6 top-16 h-px bg-primary/40" />
            <div className="absolute inset-x-0 bottom-6 text-center mono text-[0.5rem] tracking-[0.32em] text-primary/70">◆ SECURED ◆</div>
          </div>
        </div>

        {/* Zone markers */}
        {ZONES.map((z) => {
          const isLocked = lockedZone?.id === z.id;
          return (
            <button
              key={z.id}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); dismissHint(); enterZone(z); }}
              className="bay-hover-glow absolute top-1/2 group rounded-sm"
              style={{ left: `${z.pos * 100}%`, transform: "translate(-50%, -50%)" }}
              aria-label={`${z.id === "vault" ? "Open" : "Enter"} ${z.label}`}
            >
              <div className="relative flex flex-col items-center pointer-events-auto">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    isLocked
                      ? "bg-primary shadow-[0_0_24px_rgba(70,150,255,1)] scale-150"
                      : "bg-primary/70 shadow-[0_0_10px_rgba(70,150,255,0.9)] anim-flicker"
                  }`}
                />
                <div className={`mt-2 w-px transition-all ${isLocked ? "h-24 bg-primary/60" : "h-12 bg-primary/30"}`} />
                <div
                  className={`mt-2 mono uppercase whitespace-nowrap transition-all ${
                    isLocked
                      ? "text-primary text-sm tracking-[0.32em]"
                      : "text-primary/70 text-[0.6rem] tracking-[0.28em] group-hover:text-primary"
                  }`}
                  style={isLocked ? { textShadow: "0 0 18px hsl(var(--primary) / 0.7)" } : undefined}
                >
                  {z.index} · {z.label}
                </div>
                <div className={`mono text-[0.55rem] tracking-[0.28em] uppercase mt-1 transition-opacity ${
                  isLocked ? "text-primary/80 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-70"
                }`}>
                  {z.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CAMERA-FIXED OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_72%,rgba(5,7,10,0.55)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-background/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-background/60 to-transparent" />


      {/* Reticle */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative">
          <div className={`w-8 h-px transition-colors ${lockedZone ? "bg-primary" : "bg-primary/30"}`} />
          <div className={`w-px h-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors ${lockedZone ? "bg-primary" : "bg-primary/30"}`} />
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all ${
            lockedZone ? "w-6 h-6 border-primary shadow-[0_0_18px_rgba(70,150,255,0.7)]" : "w-4 h-4 border-primary/40"
          }`} />
        </div>
      </div>

      {/* Top HUD (below fixed TopBar) */}
      <div className="absolute inset-x-0 top-14 z-20 anim-fade-up pointer-events-none">
        <div className="container flex items-center justify-between text-[0.68rem] mono tracking-[0.28em] uppercase text-foreground/80">
          <div className="flex items-center gap-3 bg-background/40 backdrop-blur-sm px-3 py-1.5 border border-border/40 pointer-events-auto">
            <span className="text-primary">NEXUS</span>
            <span className="text-muted-foreground">|</span>
            <span>{BRAND.company}</span>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-background/40 backdrop-blur-sm px-3 py-1.5 border border-border/40 pointer-events-auto">
            <span className="status-dot status-live" />
            <span>SHELL ONLINE</span>
            <span className="text-muted-foreground">·</span>
            <span className="status-dot status-research" />
            <span>FIRST-PERSON MODE</span>
          </div>
        </div>
      </div>

      {/* Look buttons */}
      <button
        onClick={() => stepH(-STEP_H)}
        aria-label="Look left"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >◄</button>
      <button
        onClick={() => stepH(STEP_H)}
        aria-label="Look right"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >►</button>
      <button
        onClick={() => stepV(-STEP_V)}
        aria-label="Look up"
        className="absolute left-1/2 -translate-x-1/2 top-20 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-16 h-8 flex items-center justify-center"
      >▲</button>
      <button
        onClick={() => stepV(STEP_V)}
        aria-label="Look down"
        className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-16 h-8 flex items-center justify-center"
      >▼</button>

      {/* Lock-on ENTER prompt (keyboard/drag flow) */}
      {lockedZone && (
        <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center pointer-events-none">
          <button
            onClick={() => enterZone(lockedZone)}
            className="pointer-events-auto mono uppercase text-primary border border-primary/70 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm px-6 py-3 tracking-[0.32em] text-sm shadow-[0_0_40px_rgba(70,150,255,0.35)] transition-colors"
          >
            ▶ {lockedZone.id === "vault" ? "OPEN" : "ENTER"} — {lockedZone.label.toUpperCase()}
          </button>
        </div>
      )}

      {/* Compass bar removed — bay tiles on the panorama are the selection buttons. */}

      {/* Vault HUD panel (compact / collapsible) */}
      <div className="absolute right-3 top-28 z-20 anim-fade-up" style={{ animationDelay: "300ms" }}>
        {vaultPanelOpen ? (
          <div className="w-64 border border-primary/40 bg-background/70 backdrop-blur-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="mono text-[0.6rem] tracking-[0.28em] text-primary">EVIDENCE VAULT</div>
              <button
                onClick={() => setVaultPanelOpen(false)}
                aria-label="Collapse vault panel"
                className="mono text-[0.6rem] text-muted-foreground hover:text-primary px-1"
              >×</button>
            </div>
            <div className="text-[0.65rem] text-muted-foreground leading-relaxed">
              Secured archive of evidence artifacts with claim boundaries and audience labels.
            </div>
            <button
              onClick={onOpenVault}
              className="w-full mono text-[0.6rem] tracking-[0.28em] uppercase text-primary border border-primary/50 hover:border-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 transition-colors"
            >
              OPEN VAULT →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setVaultPanelOpen(true)}
            className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1.5 transition-colors bg-background/50 backdrop-blur-sm"
          >
            ◆ VAULT
          </button>
        )}
      </div>

      {/* Viewing Console launcher (left-side mirror of Vault) */}
      <div className="absolute left-3 top-28 z-20 anim-fade-up" style={{ animationDelay: "300ms" }}>
        {mediaPanelOpen ? (
          <div className="w-64 border border-primary/40 bg-background/70 backdrop-blur-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="mono text-[0.6rem] tracking-[0.28em] text-primary">VIEWING CONSOLE</div>
              <button
                onClick={() => setMediaPanelOpen(false)}
                aria-label="Collapse viewing console panel"
                className="mono text-[0.6rem] text-muted-foreground hover:text-primary px-1"
              >×</button>
            </div>
            <div className="text-[0.65rem] text-muted-foreground leading-relaxed">
              Browse and open all installed documents, videos, audio, and images. Preview inline, open externally, or save to disk.
            </div>
            <button
              onClick={() => setMediaConsoleOpen(true)}
              className="w-full mono text-[0.6rem] tracking-[0.28em] uppercase text-primary border border-primary/50 hover:border-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 transition-colors"
            >
              OPEN CONSOLE →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMediaPanelOpen(true)}
            className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1.5 transition-colors bg-background/50 backdrop-blur-sm"
          >
            ◇ MEDIA
          </button>
        )}
      </div>

      {/* Wind controls — tune foliage sway strength and speed */}
      <div className="absolute right-3 bottom-24 z-20 anim-fade-up" style={{ animationDelay: "400ms" }} onPointerDown={(e) => e.stopPropagation()}>
        {windPanelOpen ? (
          <div className="w-60 border border-primary/40 bg-background/70 backdrop-blur-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="mono text-[0.6rem] tracking-[0.28em] text-primary">WIND</div>
              <button
                onClick={() => setWindPanelOpen(false)}
                aria-label="Collapse wind panel"
                className="mono text-[0.6rem] text-muted-foreground hover:text-primary px-1"
              >×</button>
            </div>
            <label className="block space-y-1">
              <div className="flex justify-between mono text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground">
                <span>Strength</span><span className="text-primary">{windStrength.toFixed(2)}×</span>
              </div>
              <input
                type="range" min={0} max={2.5} step={0.05}
                value={windStrength}
                onChange={(e) => setWindStrength(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between mono text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground">
                <span>Speed</span><span className="text-primary">{windSpeed.toFixed(2)}×</span>
              </div>
              <input
                type="range" min={0.25} max={3} step={0.05}
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setWindStrength(0.4); setWindSpeed(0.7); }}
                className="flex-1 mono text-[0.55rem] tracking-[0.24em] uppercase text-primary/80 hover:text-primary border border-primary/40 px-2 py-1"
              >Calm</button>
              <button
                onClick={() => { setWindStrength(1); setWindSpeed(1); }}
                className="flex-1 mono text-[0.55rem] tracking-[0.24em] uppercase text-primary/80 hover:text-primary border border-primary/40 px-2 py-1"
              >Breeze</button>
              <button
                onClick={() => { setWindStrength(2); setWindSpeed(1.8); }}
                className="flex-1 mono text-[0.55rem] tracking-[0.24em] uppercase text-primary/80 hover:text-primary border border-primary/40 px-2 py-1"
              >Gust</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setWindPanelOpen(true)}
            className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1.5 transition-colors bg-background/50 backdrop-blur-sm"
          >
            ≈ WIND
          </button>
        )}
      </div>

      <MediaConsole open={mediaConsoleOpen} onClose={() => setMediaConsoleOpen(false)} />


      {/* Hint */}
      {hintVisible && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div
            className="panel px-8 py-6 max-w-lg text-center pointer-events-auto"
            style={{ animation: "intro-fade-in 400ms ease-out both" }}
          >
            <div className="mono text-primary text-[0.65rem] tracking-[0.32em] mb-3">▲ FIRST-PERSON NAVIGATION ▲</div>
            <div className="text-foreground/90 text-sm mb-2">Drag to look around.</div>
            <div className="text-muted-foreground text-xs">
              Drag or use the arrow keys to look horizontally and vertically across the rotunda.
              Explore the four bays and the evidence vault. Press <span className="mono text-primary">ENTER</span> when a zone locks on.
            </div>
            <button
              onClick={() => { interactedRef.current = true; setHintVisible(false); }}
              className="mt-4 mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/40 px-3 py-1"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
