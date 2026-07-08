import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./Chrome";
import { DocumentShelf } from "./DocumentShelf";
import type { BayId } from "@/data/content";

interface PanelBlock {
  title: string;
  body: string;
  status?: string;
}

interface Props {
  code: string;
  title: string;
  subtitle: string;
  intro: string;
  labels: string[];
  blocks: PanelBlock[];
  disclaimer?: string;
  bayId?: BayId;
  heroImage?: string;
  onOpenVault: () => void;
  onContact: () => void;
}

export const BayPlaceholder = ({
  code, title, subtitle, intro, labels, blocks, disclaimer, bayId, heroImage, onOpenVault, onContact,
}: Props) => (
  <div className={heroImage ? "pb-24" : "pt-16 pb-24"}>
    {heroImage ? (
      <section className="relative min-h-screen w-full overflow-hidden bg-[#05070a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#111d2e_0%,#080c14_75%)]" />
        <img
          src={heroImage}
          alt={`${title} — immersive environment`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          loading="eager"
          decoding="async"
        />
        {/* Light legibility overlays — keep the room clearly visible */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(4,8,16,0.35)_0%,rgba(4,8,16,0.10)_40%,rgba(4,8,16,0.55)_100%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,8,16,0.55)_100%)]" />

        {/* HUD label */}
        <div className="absolute inset-x-0 top-14 z-20">
          <div className="container flex items-center justify-between mono text-[0.68rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
            <div className="flex items-center gap-3">
              <span className="text-[#4db7ff]">NEXUS</span>
              <span className="text-[#8fa3b8]">/</span>
              <span>{code} · {title.toUpperCase()} · {subtitle.toUpperCase()}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="status-dot status-live" />
              <span>ON RECORD</span>
            </div>
          </div>
        </div>

        {/* Floating glass panel with intro + labels */}
        <div className="relative container h-screen flex items-end pb-16 pt-24">
          <div className="w-full md:w-[62%] lg:w-[52%] rounded-sm border border-[rgba(130,205,255,0.42)] bg-[rgba(30,55,88,0.78)] backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.60),inset_0_1px_0_rgba(255,255,255,0.12),0_0_56px_rgba(90,180,255,0.22)] p-6 md:p-8 anim-fade-up">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff]">{code}</div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-[#eef6ff] mt-1">{title}</h1>
                <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-[#8fa3b8] mt-1">{subtitle}</div>
              </div>
              <div className="hidden md:flex flex-wrap gap-1.5 justify-end max-w-[45%]">
                {labels.map((l) => (
                  <Badge key={l} variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.35)] text-[#4db7ff]">
                    {l.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="h-px bg-[rgba(130,205,255,0.22)] my-4" />
            <p className="text-sm md:text-base text-[#c8d4e2] leading-relaxed">{intro}</p>
            {disclaimer && (
              <div className="mt-4 border-l-2 border-status-warn/70 pl-4 text-xs text-[#8fa3b8]">
                {disclaimer}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={onOpenVault} className="mono tracking-widest text-[0.65rem] h-9">OPEN EVIDENCE VAULT</Button>
              <Button variant="outline" onClick={onContact} className="mono tracking-widest text-[0.65rem] h-9">REQUEST BRIEFING</Button>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="container">
        <div className="tick mb-3">{code} / {title.toUpperCase()} / {subtitle.toUpperCase()}</div>
        <div className="panel brushed p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
              <div className="text-muted-foreground mt-2">{subtitle}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {labels.map((l) => (
                <Badge key={l} variant="outline" className="mono text-[0.65rem] tracking-widest border-primary/40 text-primary/80">
                  {l.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rule my-6" />
          <p className="text-foreground/85 leading-relaxed max-w-3xl">{intro}</p>
          {disclaimer && (
            <div className="mt-4 border-l-2 border-status-warn/70 pl-4 text-sm text-muted-foreground">
              {disclaimer}
            </div>
          )}
        </div>
      </section>
    )}

    <section className={`container ${heroImage ? "mt-16" : "mt-12"} grid md:grid-cols-2 gap-4`}>
      {blocks.map((b, i) => (
        <div key={b.title} className="panel p-6 corner-frame relative">
          <div className="flex items-center justify-between">
            <div className="mono text-xs tracking-widest text-primary/70">MOD-{String(i + 1).padStart(2, "0")}</div>
            {b.status && (
              <span className="tick flex items-center gap-2">
                <span className="status-dot status-warn" /> {b.status}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold mt-3">{b.title}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.body}</p>
        </div>
      ))}
    </section>

    {bayId && <DocumentShelf bay={bayId} />}


    {!heroImage && (
      <section className="container mt-12">
        <SectionHeader eyebrow="BAY STATE" title="Coming online" note="This bay is in a polished placeholder state. Content will populate as evidence is prepared." />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onOpenVault} className="mono tracking-widest text-xs">OPEN EVIDENCE VAULT</Button>
          <Button variant="outline" onClick={onContact} className="mono tracking-widest text-xs">REQUEST BRIEFING</Button>
        </div>
      </section>
    )}
  </div>
);
