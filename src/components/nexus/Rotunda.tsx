import { useEffect, useState } from "react";
import rotunda from "@/assets/rotunda.jpg";
import { BAYS, BRAND, type BayId } from "@/data/content";
import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (id: BayId) => void;
  onOpenVault: () => void;
}

export const Rotunda = ({ onSelect, onOpenVault }: Props) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-12">
      {/* Rotunda backdrop */}
      <div className="absolute inset-0">
        <img
          src={rotunda}
          alt=""
          width={1920}
          height={1088}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-vignette" />
        <div className="absolute inset-0 bg-[hsl(218_22%_4%_/_0.55)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative container pt-6 md:pt-10 pb-40">
        {/* Signage */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${ready ? "anim-fade-up" : "opacity-0"}`}>
          <div className="space-y-3">
            <div className="tick">{BRAND.company} / OPERATING SHELL</div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Nexus
              <span className="block text-lg md:text-xl font-normal text-muted-foreground mt-3 max-w-xl">
                {BRAND.line}
              </span>
            </h1>
          </div>
          <div className="panel px-4 py-3 min-w-[220px]">
            <div className="tick mb-1">STATUS</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="status-dot status-live" /> Shell online
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="status-dot status-research" /> SINE~WaiV — research stage
            </div>
          </div>
        </div>

        {/* Bay row */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {BAYS.map((bay, i) => (
            <button
              key={bay.id}
              onClick={() => onSelect(bay.id)}
              style={{ animationDelay: `${120 + i * 90}ms` }}
              className={`group relative text-left panel corner-frame p-5 h-56 flex flex-col justify-between hover:border-primary/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-bay ${ready ? "anim-fade-up" : "opacity-0"}`}
            >
              <div className="rim-sweep opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="tick">{bay.code}</div>
                  <div className="mt-2 text-xl font-semibold tracking-tight">{bay.title}</div>
                  <div className="text-sm text-muted-foreground">{bay.subtitle}</div>
                </div>
                <div className="mono text-3xl text-foreground/30 group-hover:text-primary/70 transition-colors">
                  {bay.index}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">{bay.blurb}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 tick">
                    <span className={`status-dot ${bay.statusClass}`} /> {bay.status}
                  </span>
                  <span className="mono text-xs text-primary/70 group-hover:text-primary transition-colors">
                    ENTER →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Central objective console */}
        <div className={`mt-12 ${ready ? "anim-fade-up" : "opacity-0"}`} style={{ animationDelay: "560ms" }}>
          <div className="panel brushed glow-console p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <div className="tick">OBJECTIVE CONSOLE</div>
                <div className="text-lg font-semibold mt-1">Select a brief</div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={onOpenVault} className="mono tracking-widest text-xs">
                  OPEN EVIDENCE VAULT
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BAYS.map((bay) => (
                <button
                  key={bay.id}
                  onClick={() => onSelect(bay.id)}
                  className="group relative border border-border hover:border-primary/60 bg-surface-raised/60 hover:bg-surface-raised p-4 text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs tracking-widest text-primary/80">{bay.index}</span>
                    <span className={`status-dot ${bay.statusClass}`} />
                  </div>
                  <div className="mt-3 text-sm font-medium">{bay.title}</div>
                  <div className="text-xs text-muted-foreground">{bay.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
