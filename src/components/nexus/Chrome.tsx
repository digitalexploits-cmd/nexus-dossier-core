import { BRAND, BAYS, type BayId } from "@/data/content";
import { Target, Waves, LayoutGrid, Radar, Lock, Compass } from "lucide-react";

interface TopBarProps {
  view: string;
  currentBay?: BayId | "home";
  onHome?: () => void;
  onBay?: (id: BayId) => void;
  onOpenVault?: () => void;
}

const BAY_ICONS: Record<BayId, typeof Target> = {
  mission: Target,
  technical: Waves,
  capability: LayoutGrid,
  operations: Radar,
};

// Short nav labels shown under each icon.
const BAY_LABELS: Record<BayId, string> = {
  mission: "MISSION",
  technical: "SINE WAVE",
  capability: "CAPABILITY",
  operations: "OPS",
};


export const TopBar = ({ view, currentBay = "home", onHome, onBay, onOpenVault }: TopBarProps) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-primary/25 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-2">
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <button
            onClick={onHome}
            disabled={currentBay === "home"}
            className="flex items-center gap-2 min-w-0 disabled:cursor-default group touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm"
            aria-label="Return to Rotunda"
          >
            <div className="relative w-6 h-6 shrink-0">
              <div className="absolute inset-0 border border-primary/80 rotate-45 group-hover:border-primary transition-colors" />
              <div className="absolute inset-1 bg-primary/40 group-hover:bg-primary/60 transition-colors" />
            </div>
            <div className="mono text-[0.72rem] tracking-[0.24em] text-foreground/90 shrink-0">
              AI BASE<sup className="text-primary">3</sup>
            </div>
            <div className="h-4 w-px bg-primary/30" />
            <div className="font-display text-lg leading-none text-primary tracking-wide">
              SINE<span className="text-primary/70">~</span>WaiV
            </div>
          </button>
        </div>

        {/* Icon-only nav: bays + vault, visible on every viewport */}
        {(onBay || onOpenVault) && (
          <nav
            className="flex items-center gap-1 sm:gap-1.5"
            aria-label="Nexus navigation"
          >
            {onHome && (
              <>
                <button
                  onClick={onHome}
                  disabled={currentBay === "home"}
                  aria-label="Return to Rotunda"
                  aria-current={currentBay === "home" ? "page" : undefined}
                  title="Rotunda"
                  className={`bay-hover-glow relative flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 min-w-[3.25rem] border transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                    currentBay === "home"
                      ? "border-primary text-primary bg-primary/15 shadow-[0_0_16px_rgba(70,150,255,0.35)] cursor-default"
                      : "border-border/50 text-muted-foreground hover:text-primary hover:border-primary/60"
                  }`}
                >
                  <Compass size={16} strokeWidth={1.75} />
                  <span className="mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.16em] leading-none">ROTUNDA</span>
                </button>
                <div className="h-8 w-px bg-primary/25 mx-0.5" aria-hidden />
              </>
            )}
            {onBay && BAYS.map((b) => {
              const Icon = BAY_ICONS[b.id];
              const active = currentBay === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => onBay(b.id)}
                  aria-label={`${b.index} · ${b.title}`}
                  aria-current={active ? "page" : undefined}
                  title={`${b.index} · ${b.title}`}
                  className={`bay-hover-glow relative flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 min-w-[3.25rem] border transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                    active
                      ? "border-primary text-primary bg-primary/15 shadow-[0_0_16px_rgba(70,150,255,0.35)]"
                      : "border-border/50 text-muted-foreground hover:text-primary hover:border-primary/60"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  <span className="mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.16em] leading-none">{BAY_LABELS[b.id]}</span>
                </button>
              );
            })}
            {onOpenVault && (
              <>
                <div className="h-8 w-px bg-primary/25 mx-0.5" aria-hidden />
                <button
                  onClick={onOpenVault}
                  aria-label="Open Evidence Vault"
                  title="Evidence Vault"
                  className="bay-hover-glow flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 min-w-[3.25rem] border border-primary/40 text-primary/90 hover:text-primary hover:border-primary/80 hover:bg-primary/10 transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <Lock size={16} strokeWidth={1.75} />
                  <span className="mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.16em] leading-none">VAULT</span>
                </button>
              </>
            )}
          </nav>
        )}


        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden md:flex items-center gap-2 tick">
            <span className="status-dot status-live" /> ONLINE
          </div>
          <div className="tick text-primary/80 pl-2 border-l border-primary/20 ml-1 hidden sm:block truncate max-w-[10rem]">
            {view}
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </header>
  );
};


export const BottomBar = () => (
  <footer className="border-t border-primary/25 bg-surface/60">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="font-display text-xl text-primary leading-none">{BRAND.company}</div>
        <div className="tick">{BRAND.line}</div>
      </div>
      <div className="tick">© {new Date().getFullYear()} · Nexus operating shell</div>
    </div>
  </footer>
);

export const SectionHeader = ({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) => (
  <div className="space-y-3">
    <div className="tick text-primary">{eyebrow}</div>
    <h2 className="font-display text-3xl md:text-5xl tracking-tight text-foreground">{title}</h2>
    {note && <p className="text-muted-foreground max-w-2xl">{note}</p>}
    <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
  </div>
);
