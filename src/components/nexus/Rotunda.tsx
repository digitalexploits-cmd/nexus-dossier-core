import { useEffect, useState } from "react";
import rotundaAsset from "@/assets/nexus-rotunda.jpg.asset.json";
import { BAYS, BRAND, type BayId } from "@/data/content";

interface Props {
  onSelect: (id: BayId) => void;
  onOpenVault: () => void;
}

// Hotspot positions calibrated to the approved rotunda image.
// Each entry: bay id, left%, top%, width (vw), height (vh)
const BAY_HOTSPOTS: Array<{ id: BayId; left: string; top: string; w: string; h: string }> = [
  { id: "mission",    left: "6%",  top: "28%", w: "11vw", h: "22vh" },
  { id: "technical",  left: "27%", top: "28%", w: "13vw", h: "22vh" },
  { id: "capability", left: "58%", top: "28%", w: "13vw", h: "22vh" },
  { id: "operations", left: "82%", top: "28%", w: "11vw", h: "22vh" },
];

// Small console-button hotspots over the physical console in the image
const CONSOLE_HOTSPOTS: Array<{ id: BayId; left: string }> = [
  { id: "mission",    left: "40.5%" },
  { id: "technical",  left: "46.5%" },
  { id: "capability", left: "52.5%" },
  { id: "operations", left: "58.5%" },
];

type Level = "dim" | "default" | "bright";

/**
 * Split lighting model — OUTSIDE and INSIDE tune independently, each with
 * its own dim/default/bright curve. Clarity is a global tone-map nudge.
 */

// EXTERIOR curve — dusk outside the glass. Higher level = brighter exterior
// (less dim overlay). Also nudges base image brightness a touch to lift the
// exterior when set to BRIGHT.
const EXTERIOR: Record<Level, { dim: number; halo: number; brightnessAdd: number; label: string }> = {
  dim:     { dim: 0.95, halo: 0.92, brightnessAdd: -0.05, label: "DIM" },
  default: { dim: 0.70, halo: 0.60, brightnessAdd:  0.00, label: "DEFAULT" },
  bright:  { dim: 0.35, halo: 0.25, brightnessAdd:  0.08, label: "BRIGHT" },
};

// INTERIOR curve — room accent lighting, console spill, rim. Higher level =
// more accent light and a slightly softer vignette so the room reads open.
const INTERIOR: Record<Level, {
  key: number; warm: number; rim: number; floor: number; shaft: number;
  vignette: number; brightnessAdd: number; label: string;
}> = {
  dim:     { key: 0.45, warm: 0.45, rim: 0.40, floor: 0.55, shaft: 0.50, vignette: 0.70, brightnessAdd: -0.08, label: "DIM" },
  default: { key: 1.00, warm: 1.00, rim: 1.00, floor: 1.00, shaft: 0.85, vignette: 0.52, brightnessAdd:  0.00, label: "DEFAULT" },
  bright:  { key: 1.40, warm: 1.35, rim: 1.25, floor: 1.45, shaft: 1.10, vignette: 0.32, brightnessAdd:  0.14, label: "BRIGHT" },
};

// Clarity — small tone-mapping nudges per screen.
type Clarity = "soft" | "standard" | "sharp";
const CLARITY: Record<Clarity, { contrastAdd: number; satAdd: number; label: string }> = {
  soft:     { contrastAdd: -0.04, satAdd: -0.02, label: "SOFT" },
  standard: { contrastAdd:  0.00, satAdd:  0.00, label: "STD" },
  sharp:    { contrastAdd:  0.08, satAdd:  0.03, label: "SHARP" },
};

export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const [ready, setReady] = useState(false);
  const [outside, setOutside] = useState<Level>("default");
  const [inside, setInside] = useState<Level>("default");
  const [clarity, setClarity] = useState<Clarity>("standard");
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const bayLabel = (id: BayId) => BAYS.find(b => b.id === id)?.title ?? id;
  const ext = EXTERIOR[outside];
  const int = INTERIOR[inside];
  const c = CLARITY[clarity];
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  // Base image tone: average the two curves' brightness contributions.
  const brightness = 1.15 + ext.brightnessAdd * 0.5 + int.brightnessAdd * 0.6;
  const contrast = Math.max(0.9, 1.08 + c.contrastAdd);
  const saturate = Math.max(0.9, 1.14 + c.satAdd);
  const imgFilter = `brightness(${brightness.toFixed(3)}) contrast(${contrast}) saturate(${saturate})`;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#05070a]">
      {/* Full-bleed rotunda environment */}
      <img
        src={rotundaAsset.url}
        alt="Nexus rotunda — command environment overlooking the Gateway Arch"
        className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500"
        style={{ filter: imgFilter, imageRendering: "auto" }}
        draggable={false}
      />

      {/* EXTERIOR CURVE — dim outside the glass */}
      <div
        className="absolute inset-x-0 top-0 h-[60%] pointer-events-none transition-opacity duration-500 bg-[linear-gradient(180deg,rgba(3,6,12,0.82)_0%,rgba(3,6,12,0.50)_55%,transparent_100%)]"
        style={{ opacity: ext.dim }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[45%] pointer-events-none transition-opacity duration-500 bg-[radial-gradient(ellipse_at_50%_0%,rgba(2,4,10,0.65)_0%,transparent_70%)]"
        style={{ opacity: ext.halo }}
      />

      {/* INTERIOR CURVE — accent lights, console spill, rim */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_14%_38%,rgba(110,200,255,0.38)_0%,transparent_45%)] transition-opacity duration-500"
        style={{ opacity: clamp(int.key) }} />
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_86%_88%,rgba(255,180,100,0.34)_0%,transparent_52%)] transition-opacity duration-500"
        style={{ opacity: clamp(int.warm) }} />
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_92%_55%,rgba(210,130,255,0.22)_0%,transparent_42%)] transition-opacity duration-500"
        style={{ opacity: clamp(int.rim) }} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,170,255,0.42)_0%,transparent_65%)] transition-opacity duration-500"
        style={{ opacity: clamp(int.floor) }} />
      <div className="absolute -inset-x-10 top-0 h-full pointer-events-none anim-drift transition-opacity duration-500"
        style={{
          opacity: clamp(int.shaft),
          background: "linear-gradient(115deg, transparent 40%, rgba(140,210,255,0.11) 50%, transparent 60%)",
        }}
      />

      {/* Depth vignette + edge fades */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(5,7,10,1)_100%)]"
        style={{ opacity: int.vignette }}
      />
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background/90 to-transparent" />

      {/* HUD top strip */}
      <div className={`absolute inset-x-0 top-12 z-20 ${ready ? "anim-fade-up" : "opacity-0"}`}>
        <div className="container flex items-center justify-between text-[0.68rem] mono tracking-[0.28em] uppercase text-foreground/80">
          <div className="flex items-center gap-3">
            <span className="text-primary">NEXUS</span>
            <span className="text-muted-foreground">|</span>
            <span>{BRAND.company}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-primary/25 bg-background/50 backdrop-blur-sm px-1 py-1">
              <span className="mono text-[0.55rem] tracking-[0.24em] text-muted-foreground px-2">OUTSIDE</span>
              {(["dim", "default", "bright"] as Level[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setOutside(k)}
                  className={`mono text-[0.55rem] tracking-[0.24em] uppercase px-2 py-1 transition-colors ${
                    outside === k
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-muted-foreground hover:text-primary/80 border border-transparent"
                  }`}
                >
                  {EXTERIOR[k].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 border border-primary/25 bg-background/50 backdrop-blur-sm px-1 py-1">
              <span className="mono text-[0.55rem] tracking-[0.24em] text-muted-foreground px-2">INSIDE</span>
              {(["dim", "default", "bright"] as Level[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setInside(k)}
                  className={`mono text-[0.55rem] tracking-[0.24em] uppercase px-2 py-1 transition-colors ${
                    inside === k
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-muted-foreground hover:text-primary/80 border border-transparent"
                  }`}
                >
                  {INTERIOR[k].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 border border-primary/25 bg-background/50 backdrop-blur-sm px-1 py-1">
              <span className="mono text-[0.55rem] tracking-[0.24em] text-muted-foreground px-2">CLARITY</span>
              {(["soft", "standard", "sharp"] as Clarity[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setClarity(k)}
                  className={`mono text-[0.55rem] tracking-[0.24em] uppercase px-2 py-1 transition-colors ${
                    clarity === k
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-muted-foreground hover:text-primary/80 border border-transparent"
                  }`}
                  title={`Tone mapping · ${CLARITY[k].label}`}
                >
                  {CLARITY[k].label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="status-dot status-live" />
              <span>SHELL ONLINE</span>
              <span className="text-muted-foreground">·</span>
              <span className="status-dot status-research" />
              <span>SINE~WAIV / RESEARCH</span>
            </div>
          </div>
        </div>
      </div>

      {/* HUD bottom brand line */}
      <div className={`absolute inset-x-0 bottom-6 z-20 ${ready ? "anim-fade-up" : "opacity-0"}`} style={{ animationDelay: "300ms" }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="mono text-[0.68rem] tracking-[0.28em] uppercase text-foreground/70">
            {BRAND.line}
          </div>
          <button
            onClick={onOpenVault}
            className="mono text-[0.65rem] tracking-[0.28em] uppercase text-primary/80 hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1.5 transition-colors bg-background/40 backdrop-blur-sm"
          >
            OPEN EVIDENCE VAULT →
          </button>
        </div>
      </div>

      {/* Bay door hotspots — minimal, image-first */}
      {BAY_HOTSPOTS.map((h, i) => (
        <button
          key={`bay-${h.id}`}
          onClick={() => onSelect(h.id)}
          aria-label={`Enter ${bayLabel(h.id)}`}
          className="hotspot group absolute rounded-md border border-primary/15 bg-primary/[0.02] hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_40px_rgba(70,150,255,0.28)] transition-all duration-200 z-10"
          style={{ left: h.left, top: h.top, width: h.w, height: h.h }}
        >
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/0 group-hover:text-primary/90 transition-colors">
            0{i + 1} · {bayLabel(h.id)} →
          </span>
        </button>
      ))}

      {/* Console-button hotspots — tiny glowing dots aligned to physical console */}
      <div className="absolute inset-x-0 bottom-[14%] z-10 pointer-events-none">
        {CONSOLE_HOTSPOTS.map((h, i) => (
          <button
            key={`console-${h.id}`}
            onClick={() => onSelect(h.id)}
            aria-label={`Console · ${bayLabel(h.id)}`}
            className="hotspot-dot pointer-events-auto absolute -translate-x-1/2 group"
            style={{ left: h.left, bottom: 0 }}
          >
            <span className="block w-2 h-2 rounded-full bg-primary/70 shadow-[0_0_10px_rgba(70,150,255,0.9)] group-hover:bg-primary group-hover:scale-125 transition-transform anim-flicker" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap mono text-[0.55rem] tracking-[0.24em] uppercase text-primary/0 group-hover:text-primary/90 transition-colors">
              0{i + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
