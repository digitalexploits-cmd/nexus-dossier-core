import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./Chrome";
import founder from "@/assets/founder.jpg";
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

export const MissionBrief = ({ onOpenVault, onContact }: Props) => {
  return (
    <div className="pt-16 pb-24">
      {/* Hero panel */}
      <section className="container">
        <div className="tick mb-3">BAY 01 / MISSION BRIEF / FOUNDER OFFICE</div>
        <div className="panel brushed p-6 md:p-10 grid md:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden border border-border">
              <img
                src={founder}
                alt="Founder portrait placeholder"
                width={1024}
                height={1280}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-3 right-3 panel px-3 py-2 flex items-center gap-2">
              <span className="status-dot status-live" />
              <span className="tick">FOUNDER · ON RECORD</span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="tick">EXECUTIVE DOSSIER</div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-2">
                {BRAND.founder}
              </h1>
              <div className="text-primary/80 mono text-sm tracking-widest mt-2">
                {FOUNDER_SUMMARY.title.toUpperCase()}
              </div>
            </div>
            <p className="text-foreground/85 leading-relaxed">{FOUNDER_BIO}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={onContact} className="mono tracking-widest text-xs">
                REQUEST BRIEFING
              </Button>
              <Button asChild variant="outline" className="mono tracking-widest text-xs">
                <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
              </Button>
              <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-xs">
                OPEN EVIDENCE VAULT →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder summary */}
      <section className="container mt-16 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <SectionHeader eyebrow="01 / FOUNDER SUMMARY" title="Builder posture" />
          <p className="text-foreground/85 leading-relaxed">{FOUNDER_SUMMARY.summary}</p>
        </div>
        <div className="panel p-5 space-y-3 h-fit">
          <div className="tick">DOCTRINE</div>
          <ul className="text-sm space-y-2 text-foreground/85">
            <li>· Success over orthodoxy</li>
            <li>· Physics first</li>
            <li>· Evidence before adjectives</li>
            <li>· Every deliverable increases implementation readiness</li>
          </ul>
        </div>
      </section>

      {/* Strengths */}
      <section className="container mt-16">
        <SectionHeader eyebrow="02 / CORE STRENGTHS" title="Operating capabilities" />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CORE_STRENGTHS.map((s, i) => (
            <div key={s} className="panel p-4 hover:border-primary/50 transition-colors">
              <div className="mono text-[0.65rem] tracking-widest text-primary/70">S{String(i + 1).padStart(2, "0")}</div>
              <div className="text-sm mt-2 text-foreground/90">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Current work */}
      <section className="container mt-16">
        <SectionHeader eyebrow="03 / CURRENT WORK" title="Active programs" />
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {CURRENT_WORK.map((w, i) => (
            <div key={w.org} className="panel p-5 relative corner-frame">
              <div className="mono text-xs tracking-widest text-primary/70">PROG-{i + 1}</div>
              <div className="text-lg font-semibold mt-2">{w.org}</div>
              <div className="text-sm text-muted-foreground">{w.role}</div>
              <div className="rule my-3" />
              <p className="text-sm text-foreground/80">{w.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical focus */}
      <section className="container mt-16">
        <SectionHeader eyebrow="04 / TECHNICAL FOCUS" title="Signal-path domain" />
        <div className="mt-6 panel p-6 grid md:grid-cols-2 gap-x-8 gap-y-2">
          {TECHNICAL_FOCUS.map((t) => (
            <div key={t} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
              <span className="status-dot status-research" />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section className="container mt-16">
        <SectionHeader
          eyebrow="05 / CREDENTIALS / PROOF MATERIAL"
          title="Credential cards"
          note="Placeholder records. Replace each card's href with the actual document under /public/credentials/."
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CREDENTIALS.map((c) => (
            <a
              key={c.id}
              href={c.href ?? "#"}
              className="group panel p-5 relative flex flex-col justify-between min-h-[160px] hover:border-primary/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="mono text-[0.65rem] tracking-widest border-primary/40 text-primary/80">
                    {c.category.toUpperCase()}
                  </Badge>
                  {c.year && <span className="tick">{c.year}</span>}
                </div>
                <div className="mt-3 text-base font-medium leading-snug">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.issuer}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="tick">{c.href ? "FILE ATTACHED" : "PLACEHOLDER"}</span>
                <span className="mono text-xs text-primary/70 group-hover:text-primary">OPEN →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA block */}
      <section className="container mt-20">
        <div className="panel brushed p-8 md:p-12 relative overflow-hidden">
          <div className="rim-sweep opacity-60" />
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
            <div className="space-y-3">
              <div className="tick">06 / ENGAGE</div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Bring the machine into the room.
              </h3>
              <p className="text-muted-foreground max-w-xl">
                Briefings are scheduled directly through the founder. Every artifact
                shared is labeled by claim boundary and evidence status.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={onContact} className="mono tracking-widest text-xs">REQUEST BRIEFING</Button>
              <Button asChild variant="outline" className="mono tracking-widest text-xs">
                <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
              </Button>
              <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-xs">
                OPEN EVIDENCE VAULT
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
