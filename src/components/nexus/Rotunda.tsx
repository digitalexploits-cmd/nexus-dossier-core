import { useEffect, useState } from "react";

import { BRAND, type BayId } from "@/data/content";
import { prefersReducedMotion } from "@/lib/audio";
import rotundaAsset from "@/assets/rotunda-hero.png.asset.json";
import rotundaLoopAsset from "@/assets/rotunda-hero-loop.mp4.asset.json";
import { MediaConsole } from "@/components/nexus/MediaConsole";

const ROTUNDA_HERO = rotundaAsset.url;
const ROTUNDA_LOOP = rotundaLoopAsset.url;
// Keep the live view moving at normal speed so it feels like a real window, not a screenshot.
const ROTUNDA_LOOP_RATE = 1;

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
  synthetic?: boolean;
};

const ZONES: Zone[] = [
  { id: "mission",    label: "Mission Brief",     sub: "The Founder / Boss",   index: "01" },
  { id: "technical",  label: "Sine Wave",         sub: "Algorithm Data Bank",  index: "02" },
  { id: "capability", label: "Capability Brief",  sub: "Capability Gallery",   index: "03" },
  { id: "operations", label: "Operations Center", sub: "Command & Control",    index: "04" },
  { id: "vault",      label: "Evidence Vault",    sub: "Secured Archive",      index: "05", synthetic: true },
];

export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const reduced = prefersReducedMotion();
  const [mediaConsoleOpen, setMediaConsoleOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setHintVisible(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  const enterZone = (z: Zone) => {
    if (z.id === "vault") onOpenVault();
    else onSelect(z.id as BayId);
  };

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
                onClick={() => enterZone(z)}
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

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#05070a] select-none">
      {/* Rotunda interior — walls, floor, ceiling, and the built-in bay kiosk. */}
      <img
        src={ROTUNDA_HERO}
        alt="Nexus rotunda"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Live view through the central rotunda window.
          The clip-path traces the inside of the glass frame so the video replaces
          the static painted view without touching the rotunda architecture. */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(30% 25%, 70% 25%, 70% 74%, 30% 74%)",
        }}
      >
        <video
          src={ROTUNDA_LOOP}
          className="block h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={(el) => { if (el) { el.playbackRate = ROTUNDA_LOOP_RATE; el.play?.().catch(() => {}); } }}
          onLoadedMetadata={(e) => { (e.currentTarget as HTMLVideoElement).playbackRate = ROTUNDA_LOOP_RATE; }}
        />
      </div>

      {/* ===== CONSOLIDATED KIOSK — top translucent bar ===== */}
      <div className="absolute left-0 right-0 top-14 z-30 anim-fade-up">
        <div className="mx-auto w-[min(98vw,1400px)] border-y border-primary/40 bg-background/40 backdrop-blur-md">
          <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto whitespace-nowrap">
            {/* Brand */}
            <div className="flex items-center gap-2 mono text-[0.6rem] tracking-[0.28em] uppercase text-primary shrink-0">
              <span className="status-dot status-live" />
              <span>NEXUS</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-foreground/80">{BRAND.company}</span>
            </div>

            <span className="mx-1 h-4 w-px bg-primary/30 shrink-0" />

            {/* Bay tiles */}
            {ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => enterZone(z)}
                className="shrink-0 px-2.5 py-1 border border-primary/30 bg-transparent mono text-[0.6rem] tracking-[0.24em] uppercase text-foreground/85 hover:border-primary/70 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="text-primary/80 mr-1.5">{z.index}</span>
                {z.label}
              </button>
            ))}

            <span className="mx-1 h-4 w-px bg-primary/30 shrink-0" />

            <button
              onClick={() => setMediaConsoleOpen(true)}
              className="shrink-0 mono text-[0.6rem] tracking-[0.24em] uppercase text-primary/90 hover:text-primary border border-primary/40 hover:border-primary/70 bg-transparent hover:bg-primary/10 px-2.5 py-1"
            >◇ MEDIA</button>
            <button
              onClick={onOpenVault}
              className="shrink-0 mono text-[0.6rem] tracking-[0.24em] uppercase text-primary/90 hover:text-primary border border-primary/40 hover:border-primary/70 bg-transparent hover:bg-primary/10 px-2.5 py-1"
            >◆ VAULT</button>
          </div>
        </div>
      </div>

      <MediaConsole open={mediaConsoleOpen} onClose={() => setMediaConsoleOpen(false)} />

      {/* Hint */}
      {hintVisible && (
        <div className="absolute inset-x-0 top-16 z-40 flex justify-center pointer-events-none">
          <div className="panel px-4 py-2 pointer-events-auto mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/90 flex items-center gap-3">
            <span>SELECT A BAY FROM THE KIOSK</span>
            <button
              onClick={() => setHintVisible(false)}
              className="text-primary/70 hover:text-primary border border-primary/40 px-2 py-0.5"
            >×</button>
          </div>
        </div>
      )}
    </section>
  );
};
