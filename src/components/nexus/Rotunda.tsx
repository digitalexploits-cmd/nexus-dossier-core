import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BRAND, type BayId } from "@/data/content";
import { prefersReducedMotion } from "@/lib/audio";
import rotundaAsset from "@/assets/rotunda-hero.png.asset.json";
import { MediaConsole } from "@/components/nexus/MediaConsole";
import { SkyWindow } from "@/components/nexus/SkyWindow";
import sineWaivLogo from "@/assets/sine-waiv-logo.png.asset.json";

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
  const [headingV, setHeadingV] = useState(isMobileInitial ? 0.55 : 0.60);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [hintVisible, setHintVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return window.localStorage.getItem("nexus.rotunda.hintSeen") !== "1"; }
    catch { return true; }
  });
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
          style={{ filter: "brightness(1.08) contrast(1.06) saturate(1.10)" }}
          draggable={false}
          onLoad={measure}
        />

        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_14%_38%,rgba(110,200,255,0.18)_0%,transparent_45%)]" />
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_86%_88%,rgba(255,180,100,0.16)_0%,transparent_52%)]" />

        <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,170,255,0.18)_0%,transparent_65%)]" />

        {/* Rotunda floor — feathered concrete band grounding the etched crest. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "22%",
            background:
              "linear-gradient(to top, rgba(26,31,40,0.92) 0%, rgba(30,36,46,0.55) 55%, transparent 100%)",
          }}
        />
        {/* Ambient pool of light under the dome */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "12%",
            background:
              "radial-gradient(ellipse 60% 100% at 50% 40%, rgba(120,170,220,0.16) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />


        {/* Etched-in-concrete floor emblem — SINE~WaiV crest embossed into the
            rotunda floor. Perspective-tilted, low-opacity, blended so it reads
            as milled/engraved stone rather than a pasted graphic. */}
        <div
          aria-hidden
          className="absolute left-1/2 pointer-events-none"
          style={{
            bottom: "0.5%",
            width: "min(28%, 380px)",
            aspectRatio: "1550 / 640",
            transform: "translateX(-50%) perspective(900px) rotateX(72deg)",
            transformOrigin: "50% 100%",
          }}
        >
          {/* Engraved fill — desaturated, low opacity, soft-light blend */}
          <img
            src={sineWaivLogo.url}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: 0.22,
              mixBlendMode: "soft-light",
              filter: "grayscale(1) contrast(1.15) brightness(0.9)",
            }}
          />
          {/* Highlight pass — thin warm rim to fake chiseled edges */}
          <img
            src={sineWaivLogo.url}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: 0.18,
              mixBlendMode: "overlay",
              filter: "grayscale(1) brightness(1.4) contrast(1.3)",
              transform: "translateY(-1px)",
            }}
          />
          {/* Shadow pass — deep inset shadow below to fake depth */}
          <img
            src={sineWaivLogo.url}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: 0.35,
              mixBlendMode: "multiply",
              filter: "grayscale(1) brightness(0.35) blur(0.6px)",
              transform: "translateY(1.5px)",
            }}
          />
        </div>


        {/* Synthetic Vault doorway — scales down on mobile so it never crops */}
        <div
          className="absolute top-[46%] pointer-events-none"
          style={{ left: `${ZONES[4].pos * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative w-[150px] h-[240px] sm:w-[220px] sm:h-[360px] border border-primary/50 bg-gradient-to-b from-primary/15 via-background/60 to-background/90 backdrop-blur-[2px] shadow-[0_0_60px_rgba(70,150,255,0.35)]">
            <div className="absolute inset-2 border border-primary/30" />
            <div className="absolute inset-x-0 top-3 sm:top-4 text-center mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.32em] text-primary/80">EVIDENCE</div>
            <div className="absolute inset-x-0 top-7 sm:top-9 text-center mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.32em] text-primary/80">VAULT</div>
            <div className="absolute inset-x-6 top-12 sm:top-16 h-px bg-primary/40" />
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 text-center mono text-[0.45rem] sm:text-[0.5rem] tracking-[0.32em] text-primary/70">◆ SECURED ◆</div>
          </div>
        </div>

        {/* Zone markers — kiosk labels with strict 3-tier hierarchy:
            (1) index chip · (2) title · (3) sub. Label block is width-capped
            so adjacent zones never overlap on any breakpoint. */}
        {ZONES.map((z) => {
          const isLocked = lockedZone?.id === z.id;
          return (
            <button
              key={z.id}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); dismissHint(); enterZone(z); }}
              className="bay-hover-glow absolute top-[46%] group rounded-sm px-3 py-4 -m-3 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 hidden md:block"
              style={{ left: `${z.pos * 100}%`, transform: "translate(-50%, -50%)", minWidth: 56, minHeight: 88 }}
              aria-label={`${z.id === "vault" ? "Open" : "Enter"} ${z.label}`}
            >
              <div className="relative flex flex-col items-center pointer-events-auto">
                {/* Beacon */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    isLocked
                      ? "bg-primary shadow-[0_0_24px_rgba(70,150,255,1)] scale-150"
                      : "bg-primary/70 shadow-[0_0_10px_rgba(70,150,255,0.9)] anim-flicker"
                  }`}
                />
                {/* Stem */}
                <div className={`mt-2 w-px transition-all ${isLocked ? "h-14 sm:h-20 bg-primary/60" : "h-8 sm:h-12 bg-primary/30"}`} />

                {/* Label stack — capped width, centered, tiered typography */}
                <div className={`mt-2 flex flex-col items-center gap-1 transition-opacity ${
                  isLocked ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                }`}
                  style={{ width: isLocked ? "min(11rem, 40vw)" : "min(8.5rem, 32vw)" }}
                >
                  {/* Tier 1 — index chip */}
                  <div className={`mono tracking-[0.32em] px-1.5 py-[1px] border transition-colors ${
                    isLocked
                      ? "text-primary border-primary/70 bg-primary/10 text-[0.55rem] sm:text-[0.6rem]"
                      : "text-primary/70 border-primary/25 bg-background/40 text-[0.5rem] sm:text-[0.55rem] group-hover:text-primary group-hover:border-primary/60"
                  }`}>
                    {z.index}
                  </div>

                  {/* Tier 2 — title */}
                  <div
                    className={`mono uppercase text-center leading-tight transition-all ${
                      isLocked
                        ? "text-primary text-[0.72rem] sm:text-sm tracking-[0.22em] sm:tracking-[0.28em]"
                        : "text-primary/85 text-[0.6rem] sm:text-[0.68rem] tracking-[0.18em] sm:tracking-[0.24em] group-hover:text-primary"
                    }`}
                    style={isLocked ? { textShadow: "0 0 18px hsl(var(--primary) / 0.7)" } : undefined}
                  >
                    {z.label}
                  </div>

                  {/* Tier 3 — sub (only on lock or hover, never wraps to more than 2 lines) */}
                  <div className={`mono uppercase text-center leading-tight tracking-[0.2em] sm:tracking-[0.24em] transition-opacity ${
                    isLocked
                      ? "text-primary/70 opacity-100 text-[0.5rem] sm:text-[0.55rem]"
                      : "text-muted-foreground opacity-0 group-hover:opacity-70 text-[0.5rem] sm:text-[0.55rem]"
                  }`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {z.sub}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Mobile-only: minimal beacons on the panorama so the scene still
            reads as populated, but without overlapping labels. The stacked
            selector below the console handles the actual choice. */}
        {ZONES.map((z) => {
          const isLocked = lockedZone?.id === z.id;
          return (
            <div
              key={`m-${z.id}`}
              aria-hidden
              className="absolute top-[46%] pointer-events-none md:hidden"
              style={{ left: `${z.pos * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isLocked
                    ? "bg-primary shadow-[0_0_18px_rgba(70,150,255,1)] scale-150"
                    : "bg-primary/60 shadow-[0_0_8px_rgba(70,150,255,0.7)] anim-flicker"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Living exterior — subtle sky-life ambient over the whole scene */}
      <div aria-hidden className="bay-exterior-life" />
      {/* Wind-swayed tree branches — clipped to a thin outer sliver so they never bleed into the interior */}
      <div aria-hidden className="sky-storm-band branches-only">
        <div className="bay-hero-branch left" />
        <div className="bay-hero-branch right" />
      </div>
      {/* Drifting clouds through the dome oculus / upper glass — clipped, never inside */}
      <SkyWindow top={0} left={12} right={12} bottom={72} branchRight debugLabel="rotunda dome" />

      {/* PREMIUM LIGHTING RIG — cinematic key/fill/rays/rim/bloom/grade */}
      <div aria-hidden className="premium-lighting" style={{ ["--bay-accent" as any]: "#4db7ff" }}>
        <div className="pl-key" />
        <div className="pl-fill" />
        <div className="pl-rays" />
        <div className="pl-rim" />
        <div className="pl-bloom" />
        <div className="pl-flare" />
        <div className="pl-grade" />
      </div>



      {/* CAMERA-FIXED OVERLAYS — vignette + top scrim only, no HUD chrome. */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_72%,rgba(5,7,10,0.55)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-background/50 to-transparent" />

      <MediaConsole open={mediaConsoleOpen} onClose={() => setMediaConsoleOpen(false)} />

    </section>
  );
};
