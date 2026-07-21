import { BRAND, BAYS, type BayId } from "@/data/content";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  view: string;
  currentBay?: BayId | "home";
  onHome?: () => void;
  onBay?: (id: BayId) => void;
  onOpenVault?: () => void;
}

export const TopBar = ({ view, currentBay = "home", onHome, onBay, onOpenVault }: TopBarProps) => {
  const showNav = currentBay !== "home" && !!onBay;
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-primary/25 bg-background/85 backdrop-blur-md">
      <div className="container flex h-12 items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onHome}
            disabled={currentBay === "home"}
            className="flex items-center gap-3 min-w-0 disabled:cursor-default group"
            aria-label="Return to Rotunda"
          >
            <div className="relative w-6 h-6 shrink-0">
              <div className="absolute inset-0 border border-primary/80 rotate-45 group-hover:border-primary transition-colors" />
              <div className="absolute inset-1 bg-primary/40 group-hover:bg-primary/60 transition-colors" />
            </div>
            <div className="mono text-[0.72rem] tracking-[0.28em] text-foreground/90 shrink-0">
              AI BASE<sup className="text-primary">3</sup>
            </div>
            <div className="hidden sm:block h-4 w-px bg-primary/30" />
            <div className="hidden sm:block font-display text-lg leading-none text-primary tracking-wide">
              SINE<span className="text-primary/70">~</span>WaiV
            </div>
          </button>
          {showNav && (
            <>
              <div className="hidden md:block h-4 w-px bg-primary/30 ml-1" />
              <button
                onClick={onHome}
                className="hidden md:inline-block mono text-[0.62rem] tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                ← ROTUNDA
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 min-w-0">
          {showNav && (
            <div className="hidden lg:flex gap-1.5">
              {BAYS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onBay?.(b.id)}
                  className={`bay-hover-glow mono text-[0.6rem] tracking-widest px-2 py-1 border transition-colors ${
                    currentBay === b.id
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {b.index} · {b.title.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          {onOpenVault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenVault}
              className="mono text-[0.6rem] tracking-widest h-8 px-2"
            >
              ◇ VAULT
            </Button>
          )}
          <div className="hidden md:flex items-center gap-2 tick pl-2">
            <span className="status-dot status-live" /> ONLINE
          </div>
          <div className="tick text-primary/80 pl-2 border-l border-primary/20 ml-1 hidden sm:block">
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
