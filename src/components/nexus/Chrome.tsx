import { BRAND } from "@/data/content";

export const TopBar = ({ view }: { view: string }) => (
  <header className="fixed top-0 inset-x-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
    <div className="container flex h-12 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border border-primary/70 rotate-45" />
          <div className="absolute inset-1 bg-primary/30" />
        </div>
        <div className="mono text-[0.72rem] tracking-[0.28em] text-foreground/90">NEXUS</div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <div className="hidden sm:block tick">{BRAND.company}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 tick">
          <span className="status-dot status-live" /> SHELL ONLINE
        </div>
        <div className="tick">VIEW / {view}</div>
      </div>
    </div>
  </header>
);

export const BottomBar = () => (
  <footer className="border-t border-border/60 bg-surface/60">
    <div className="container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="mono text-sm tracking-widest">{BRAND.company}</div>
        <div className="tick">{BRAND.line}</div>
      </div>
      <div className="tick">© {new Date().getFullYear()} · Nexus operating shell</div>
    </div>
  </footer>
);

export const SectionHeader = ({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) => (
  <div className="space-y-3">
    <div className="tick">{eyebrow}</div>
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
    {note && <p className="text-muted-foreground max-w-2xl">{note}</p>}
    <div className="rule" />
  </div>
);
