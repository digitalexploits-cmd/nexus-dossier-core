import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import officeAsset from "@/assets/founder-office.png.asset.json";
import {
  BRAND,
  CORE_STRENGTHS,
  CREDENTIALS,
  CURRENT_WORK,
  FOUNDER_BIO,
  FOUNDER_SUMMARY,
  RESUME_URL,
  TECHNICAL_FOCUS,
} from "@/data/content";

interface Props {
  onOpenVault: () => void;
  onContact: () => void;
}

// Reusable dark-glass panel — reads like a wall display inside the office
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative border border-primary/20 bg-[rgba(6,10,18,0.72)] backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
  >
    {children}
  </div>
);

export const MissionBrief = ({ onOpenVault, onContact }: Props) => {
  return (
    <div className="relative">
      {/* ============ IMMERSIVE OFFICE STAGE ============ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#05070a]">
        <img
          src={officeAsset.url}
          alt="Founder office — Mission Brief environment"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Dim the room so the overlay reads */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_60%_40%,rgba(5,7,10,0.35)_0%,rgba(5,7,10,0.85)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background to-transparent" />

        {/* HUD */}
        <div className="absolute inset-x-0 top-14 z-20">
          <div className="container flex items-center justify-between mono text-[0.68rem] tracking-[0.28em] uppercase text-foreground/80">
            <div className="flex items-center gap-3">
              <span className="text-primary">NEXUS</span>
              <span className="text-muted-foreground">/</span>
              <span>BAY 01 · MISSION BRIEF · FOUNDER OFFICE</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="status-dot status-live" />
              <span>ON RECORD</span>
            </div>
          </div>
        </div>

        {/* Wall-display overlay — sits over the office wall screen area */}
        <div className="relative container h-screen flex items-center justify-end pt-24 pb-16">
          <Glass className="w-full md:w-[62%] lg:w-[58%] p-6 md:p-8 anim-fade-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-primary/80">NEXUS</div>
                <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-muted-foreground mt-0.5">
                  MISSION BRIEF / FOUNDER DOSSIER
                </div>
              </div>
              <div className="mono text-[0.6rem] tracking-[0.24em] text-muted-foreground">///-HC-0</div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Mission cell */}
              <div className="border border-primary/15 bg-black/40 p-5">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-2">OUR MISSION</div>
                <h1 className="text-2xl font-semibold tracking-tight leading-tight">
                  Divide the wave.<br/>Preserve the machine.
                </h1>
                <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                  Deliver physics-first, evidence-labeled inspection to industrial reliability teams
                  — without overclaim.
                </p>
                <div className="mt-4 mono text-[0.65rem] tracking-[0.24em] uppercase text-foreground/70">
                  {BRAND.founder}
                </div>
                <div className="mono text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">
                  FOUNDER · {BRAND.company}
                </div>
              </div>

              {/* Founder overview cell */}
              <div className="border border-primary/15 bg-black/40 p-5">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-2">FOUNDER OVERVIEW</div>
                <div className="text-sm text-foreground/90 space-y-1">
                  <div>{BRAND.founder}</div>
                  <div className="text-muted-foreground">{FOUNDER_SUMMARY.title}</div>
                  <div className="text-muted-foreground">{BRAND.company}</div>
                </div>
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mt-4 mb-2">DOCTRINE</div>
                <ul className="text-xs text-foreground/85 space-y-1">
                  <li>· Success over orthodoxy</li>
                  <li>· Physics first</li>
                  <li>· Evidence before adjectives</li>
                  <li>· Every deliverable increases implementation readiness</li>
                </ul>
              </div>
            </div>

            {/* Actions strip */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={onContact} className="mono tracking-widest text-[0.65rem] h-9">
                REQUEST BRIEFING
              </Button>
              <Button asChild variant="outline" className="mono tracking-widest text-[0.65rem] h-9">
                <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
              </Button>
              <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-[0.65rem] h-9">
                EVIDENCE VAULT →
              </Button>
            </div>
          </Glass>
        </div>
      </section>

      {/* ============ DOSSIER DETAIL (dark, on-brand, not white cards) ============ */}
      <div className="relative bg-background">
        {/* Bio + summary */}
        <section className="container pt-16 pb-10">
          <div className="grid md:grid-cols-[1fr_320px] gap-8">
            <Glass className="p-6 md:p-8">
              <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-2">01 / EXECUTIVE BIO</div>
              <p className="text-foreground/90 leading-relaxed">{FOUNDER_BIO}</p>
              <div className="rule my-5" />
              <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-2">02 / BUILDER POSTURE</div>
              <p className="text-foreground/85 leading-relaxed text-sm">{FOUNDER_SUMMARY.summary}</p>
            </Glass>
            <Glass className="p-5 h-fit">
              <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-3">TECHNICAL FOCUS</div>
              <ul className="space-y-2">
                {TECHNICAL_FOCUS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="status-dot status-research mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Glass>
          </div>
        </section>

        {/* Core strengths — compact dossier chips, not big cards */}
        <section className="container py-10">
          <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-3">03 / CORE STRENGTHS</div>
          <Glass className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {CORE_STRENGTHS.map((s, i) => (
                <div key={s} className="border border-border/60 bg-black/30 px-3 py-2">
                  <div className="mono text-[0.55rem] tracking-[0.28em] text-primary/70">S{String(i + 1).padStart(2, "0")}</div>
                  <div className="text-xs text-foreground/90 mt-1">{s}</div>
                </div>
              ))}
            </div>
          </Glass>
        </section>

        {/* Current work */}
        <section className="container py-10">
          <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-3">04 / ACTIVE PROGRAMS</div>
          <div className="grid md:grid-cols-3 gap-3">
            {CURRENT_WORK.map((w, i) => (
              <Glass key={w.org} className="p-5">
                <div className="mono text-[0.6rem] tracking-[0.24em] text-primary/70">PROG-{i + 1}</div>
                <div className="text-base font-semibold mt-1">{w.org}</div>
                <div className="text-xs text-muted-foreground">{w.role}</div>
                <div className="rule my-3" />
                <p className="text-sm text-foreground/85">{w.detail}</p>
              </Glass>
            ))}
          </div>
        </section>

        {/* Credentials — evidence cards, compact */}
        <section className="container py-10">
          <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70 mb-3">05 / CREDENTIALS · EVIDENCE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CREDENTIALS.map((c) => (
              <a
                key={c.id}
                href={c.href ?? "#"}
                className="group relative border border-primary/20 bg-[rgba(6,10,18,0.72)] backdrop-blur-md p-4 hover:border-primary/60 transition-colors flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-primary/40 text-primary/80">
                      {c.category.toUpperCase()}
                    </Badge>
                    {c.year && <span className="mono text-[0.6rem] tracking-[0.24em] text-muted-foreground">{c.year}</span>}
                  </div>
                  <div className="mt-2 text-sm font-medium leading-snug">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.issuer}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground">
                    {c.href ? "FILE ATTACHED" : "PLACEHOLDER"}
                  </span>
                  <span className="mono text-[0.6rem] text-primary/70 group-hover:text-primary">OPEN →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Engage strip */}
        <section className="container py-16">
          <Glass className="p-8 md:p-10 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div className="space-y-2">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary/70">06 / ENGAGE</div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Bring the machine into the room.
                </h3>
                <p className="text-muted-foreground max-w-xl text-sm">
                  Briefings scheduled directly through the founder. Every artifact shared is labeled by
                  claim boundary and evidence status.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={onContact} className="mono tracking-widest text-[0.65rem] h-9">REQUEST BRIEFING</Button>
                <Button asChild variant="outline" className="mono tracking-widest text-[0.65rem] h-9">
                  <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
                </Button>
                <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-[0.65rem] h-9">
                  EVIDENCE VAULT
                </Button>
              </div>
            </div>
          </Glass>
        </section>
      </div>
    </div>
  );
};
