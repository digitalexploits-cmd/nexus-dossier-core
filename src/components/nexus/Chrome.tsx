import { BRAND } from "@/data/content";

export const TopBar = ({ view }: { view: string }) => (
  <header className="fixed top-0 inset-x-0 z-40 border-b border-primary/25 bg-background/80 backdrop-blur-md">
    <div className="container flex h-12 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border border-primary/80 rotate-45" />
          <div className="absolute inset-1 bg-primary/40" />
        </div>
        <div className="mono text-[0.72rem] tracking-[0.28em] text-foreground/90">
          AI BASE<sup className="text-primary">3</sup>
        </div>
        <div className="hidden sm:block h-4 w-px bg-primary/30" />
        <div className="hidden sm:block font-display text-lg leading-none text-primary tracking-wide">
          SINE<span className="text-primary/70">~</span>WaiV
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 tick">
          <span className="status-dot status-live" /> SHELL ONLINE
        </div>
        <div className="tick text-primary/80">VIEW / {view}</div>
      </div>
    </div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
  </header>
);

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
