import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./Chrome";

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
  onOpenVault: () => void;
  onContact: () => void;
}

export const BayPlaceholder = ({
  code, title, subtitle, intro, labels, blocks, disclaimer, onOpenVault, onContact,
}: Props) => (
  <div className="pt-16 pb-24">
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

    <section className="container mt-12 grid md:grid-cols-2 gap-4">
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

    <section className="container mt-12">
      <SectionHeader eyebrow="BAY STATE" title="Coming online" note="This bay is in a polished placeholder state. Content will populate as evidence is prepared." />
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onOpenVault} className="mono tracking-widest text-xs">OPEN EVIDENCE VAULT</Button>
        <Button variant="outline" onClick={onContact} className="mono tracking-widest text-xs">REQUEST BRIEFING</Button>
      </div>
    </section>
  </div>
);
