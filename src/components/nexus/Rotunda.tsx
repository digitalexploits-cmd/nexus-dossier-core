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

export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const bayLabel = (id: BayId) => BAYS.find(b => b.id === id)?.title ?? id;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#05070a]">
      {/* Full-bleed rotunda environment */}
      <img
        src={rotundaAsset.url}
        alt="Nexus rotunda — command environment overlooking the Gateway Arch"
        className="absolute inset-0 w-full h-full object-cover brightness-[1.25] contrast-[1.06] saturate-[1.12]"
        draggable={false}
      />

      {/* Dim the exterior (upper window band) — dusk outside the glass */}
      <div className="absolute inset-x-0 top-0 h-[55%] pointer-events-none bg-[linear-gradient(180deg,rgba(4,8,16,0.62)_0%,rgba(4,8,16,0.35)_55%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[45%] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(3,6,12,0.55)_0%,transparent_70%)]" />

      {/* Interior accent lighting — brighter room, cinematic color */}
      {/* Cyan key beam from upper-left ceiling */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_14%_38%,rgba(110,200,255,0.38)_0%,transparent_45%)]" />
      {/* Warm amber console fill lower-right */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_86%_88%,rgba(255,180,100,0.34)_0%,transparent_52%)]" />
      {/* Magenta rim mid-right */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_92%_55%,rgba(210,130,255,0.22)_0%,transparent_42%)]" />
      {/* Signature blue floor / console spill */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,170,255,0.42)_0%,transparent_65%)]" />
      {/* Slow-drifting light shaft */}
      <div className="absolute -inset-x-10 top-0 h-full pointer-events-none opacity-80 anim-drift"
        style={{ background: "linear-gradient(115deg, transparent 40%, rgba(140,210,255,0.11) 50%, transparent 60%)" }}
      />

      {/* Softer vignette + edge fades */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(5,7,10,0.55)_100%)]" />
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
          <div className="hidden md:flex items-center gap-3">
            <span className="status-dot status-live" />
            <span>SHELL ONLINE</span>
            <span className="text-muted-foreground">·</span>
            <span className="status-dot status-research" />
            <span>SINE~WAIV / RESEARCH</span>
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
