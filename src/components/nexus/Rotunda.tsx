import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import rotundaAsset from "@/assets/nexus-rotunda.jpg.asset.json";
import { BRAND, type BayId } from "@/data/content";
import { audio, prefersReducedMotion } from "@/lib/audio";

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
  { id: "mission",    label: "Mission Brief",     sub: "Founder Office",      index: "01", pos: 0.08 },
  { id: "technical",  label: "Technical Brief",   sub: "Research Lab",        index: "02", pos: 0.30 },
  { id: "capability", label: "Capability Brief",  sub: "Capability Gallery",  index: "03", pos: 0.58 },
  { id: "operations", label: "Operations Center", sub: "Command & Control",   index: "04", pos: 0.82 },
  { id: "vault",      label: "Evidence Vault",    sub: "Secured Archive",     index: "05", pos: 0.97, synthetic: true },
];

const LOCK_THRESHOLD = 0.035;
const STEP = 0.08;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));


export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const reduced = prefersReducedMotion();

  // ---------- Reduced-motion fallback ----------
  if (reduced) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-[#05070a]">
        <img src={rotundaAsset.url} alt="Nexus rotunda" className="absolute inset-0 w-full h-full object-cover opacity-70" draggable={false} />
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
  const [heading, setHeading] = useState(0.30);
  const [pitch, setPitch] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const interactedRef = useRef(false);
  const headingRef = useRef(heading);
  headingRef.current = heading;

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
    if (lockedZone && lockedZone.id !== prevLockRef.current) audio.blip(720);
    prevLockRef.current = lockedZone?.id ?? null;
  }, [lockedZone]);

  const dismissHint = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      setHintVisible(false);
    }
  }, []);

  const enterZone = useCallback((z: Zone) => {
    audio.blip(920);
    if (z.id === "vault") onOpenVault();
    else onSelect(z.id as BayId);
  }, [onOpenVault, onSelect]);

  const snapTo = useCallback((pos: number) => {
    dismissHint();
    setSnapping(true);
    setHeading(clamp(pos));
    window.setTimeout(() => setSnapping(false), 650);
  }, [dismissHint]);

  const step = useCallback((delta: number) => {
    dismissHint();
    setSnapping(true);
    setHeading((h) => clamp(h + delta));
    window.setTimeout(() => setSnapping(false), 350);
  }, [dismissHint]);

  // Measured travel
  const sectionRef = useRef<HTMLElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [viewW, setViewW] = useState(0);
  const [worldW, setWorldW] = useState(0);
  const travelPx = Math.max(0, worldW - viewW);

  const measure = useCallback(() => {
    if (sectionRef.current) setViewW(sectionRef.current.clientWidth);
    if (worldRef.current) setWorldW(worldRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (worldRef.current) ro.observe(worldRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  // Drag
  const dragStartRef = useRef<{ x: number; heading: number } | null>(null);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStartRef.current = { x: e.clientX, heading: headingRef.current };
    setDragging(true);
    setSnapping(false);
    dismissHint();
  }, [dismissHint]);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    if (travelPx <= 0) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dh = -(dx / travelPx);
    setHeading(clamp(dragStartRef.current.heading + dh));
  }, [travelPx]);
  const endDrag = useCallback(() => {
    dragStartRef.current = null;
    setDragging(false);
  }, []);

  // subtle vertical parallax
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    setPitch(clamp(ny, -1, 1) * 0.5);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-STEP); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(STEP); }
      else if ((e.key === "Enter" || e.key === " ") && lockedZone) { e.preventDefault(); enterZone(lockedZone); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lockedZone, enterZone, step]);

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const translateX = travelPx > 0
    ? -heading * travelPx
    : (viewW - worldW) / 2;
  const worldTransform = `translate3d(${translateX}px, ${pitch * 18}px, 0)`;
  const worldTransition = snapping
    ? "transform 600ms cubic-bezier(0.22,1,0.36,1)"
    : dragging
      ? "none"
      : "transform 140ms linear";

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#05070a] select-none"
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      {/* WORLD */}
      <div
        ref={worldRef}
        className="absolute top-0 left-0 h-full w-auto"
        style={{
          transform: worldTransform,
          transition: worldTransition,
          willChange: "transform",
        }}
      >
        <img
          src={rotundaAsset.url}
          alt="Nexus rotunda panorama"
          className="block h-full w-auto max-w-none"
          style={{ filter: "brightness(1.08) contrast(1.06) saturate(1.10)" }}
          draggable={false}
          onLoad={measure}
        />

        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_14%_38%,rgba(110,200,255,0.18)_0%,transparent_45%)]" />
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_86%_88%,rgba(255,180,100,0.16)_0%,transparent_52%)]" />

        <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,170,255,0.18)_0%,transparent_65%)]" />

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
              onClick={(e) => { e.stopPropagation(); if (isLocked) enterZone(z); else snapTo(z.pos); }}
              className="absolute top-1/2 group"
              style={{ left: `${z.pos * 100}%`, transform: "translate(-50%, -50%)" }}
              aria-label={`${z.label} — ${isLocked ? "enter" : "look toward"}`}
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

      {/* Top HUD */}
      <div className="absolute inset-x-0 top-12 z-20 anim-fade-up">
        <div className="container flex items-center justify-between text-[0.68rem] mono tracking-[0.28em] uppercase text-foreground/80">
          <div className="flex items-center gap-3">
            <span className="text-primary">NEXUS</span>
            <span className="text-muted-foreground">|</span>
            <span>{BRAND.company}</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
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
        onClick={() => step(-STEP)}
        aria-label="Look left"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >◄</button>
      <button
        onClick={() => step(STEP)}
        aria-label="Look right"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 mono text-primary/80 hover:text-primary border border-primary/40 hover:border-primary/80 bg-background/40 backdrop-blur-sm w-10 h-16 flex items-center justify-center text-lg"
      >►</button>

      {/* Lock-on ENTER prompt */}
      {lockedZone && (
        <div className="absolute inset-x-0 bottom-32 z-20 flex justify-center pointer-events-none">
          <button
            onClick={() => enterZone(lockedZone)}
            className="pointer-events-auto mono uppercase text-primary border border-primary/70 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm px-6 py-3 tracking-[0.32em] text-sm shadow-[0_0_40px_rgba(70,150,255,0.35)] transition-colors"
          >
            ▶ {lockedZone.id === "vault" ? "OPEN" : "ENTER"} — {lockedZone.label.toUpperCase()}
          </button>
        </div>
      )}

      {/* Compass */}
      <div className="absolute inset-x-0 bottom-6 z-20">
        <div className="container">
          <div className="mono text-[0.55rem] tracking-[0.32em] uppercase text-muted-foreground mb-2 text-center">HEADING · DRAG · ARROWS · CLICK ZONE</div>
          <div className="relative h-10 border border-primary/25 bg-background/50 backdrop-blur-sm">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px bg-primary/10" style={{ left: `${(i / 20) * 100}%` }} />
            ))}
            {ZONES.map((z) => {
              const isLocked = lockedZone?.id === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => snapTo(z.pos)}
                  className={`absolute top-1/2 -translate-y-1/2 mono text-[0.55rem] tracking-[0.28em] uppercase px-2 py-1 border transition-colors whitespace-nowrap ${
                    isLocked
                      ? "border-primary text-primary bg-primary/15"
                      : "border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/60 bg-background/60"
                  }`}
                  style={{ left: `${z.pos * 100}%`, transform: "translate(-50%, -50%)" }}
                >
                  {z.index} · {z.label.split(" ")[0]}
                </button>
              );
            })}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_rgba(70,150,255,0.9)]"
              style={{ left: `${heading * 100}%`, transition: "left 200ms linear" }}
            />
          </div>
        </div>
      </div>

      {/* Vault quick-open */}
      <div className="absolute right-4 top-24 z-20 anim-fade-up" style={{ animationDelay: "300ms" }}>
        <button
          onClick={onOpenVault}
          className="mono text-[0.65rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1.5 transition-colors bg-background/40 backdrop-blur-sm"
        >
          OPEN EVIDENCE VAULT →
        </button>
      </div>

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
              Pan left and right to explore the four bays and the evidence vault.
              Use arrow keys or the compass below. Press <span className="mono text-primary">ENTER</span> when a zone locks on.
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
