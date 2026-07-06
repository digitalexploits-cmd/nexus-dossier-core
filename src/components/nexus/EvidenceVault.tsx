import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVIDENCE, EVIDENCE_STATUSES, type EvidenceStatus } from "@/data/content";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

const BAYS = ["01", "02", "03", "04"] as const;

const statusTone: Record<EvidenceStatus, string> = {
  "Observed": "status-live",
  "Prototype": "status-warn",
  "Hypothesis": "status-idle",
  "Validation Needed": "status-warn",
  "Commercial Candidate": "status-research",
  "Research Stage": "status-research",
};

export const EvidenceVault = ({ open, onOpenChange }: Props) => {
  const [status, setStatus] = useState<EvidenceStatus | "ALL">("ALL");
  const [bay, setBay] = useState<string>("ALL");

  const filtered = useMemo(() => EVIDENCE.filter((e) =>
    (status === "ALL" || e.status === status) && (bay === "ALL" || e.bay === bay)
  ), [status, bay]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background border-border">
        <DialogHeader>
          <div className="tick">EVIDENCE VAULT</div>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Filterable evidence objects
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Every card carries a claim boundary and evidence status. Placeholder records; edit in <span className="mono">src/data/content.ts</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="tick self-center mr-2">STATUS:</span>
            {(["ALL", ...EVIDENCE_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s as any)}
                className={`mono text-[0.65rem] tracking-widest px-3 py-1 border transition-colors ${
                  status === s ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >{s.toUpperCase()}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="tick self-center mr-2">BAY:</span>
            {(["ALL", ...BAYS] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBay(b)}
                className={`mono text-[0.65rem] tracking-widest px-3 py-1 border transition-colors ${
                  bay === b ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >{b}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {filtered.map((e) => (
              <div key={e.id} className="panel p-4 relative">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="mono text-[0.65rem] tracking-widest border-border">
                    BAY {e.bay} · {e.type.toUpperCase()}
                  </Badge>
                  <span className="tick flex items-center gap-2">
                    <span className={`status-dot ${statusTone[e.status]}`} /> {e.status}
                  </span>
                </div>
                <div className="mt-3 text-base font-semibold">{e.title}</div>
                <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="tick mr-2">CLAIM:</span>{e.claim}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="tick">AUDIENCE · {e.audience.toUpperCase()}</span>
                  <Button asChild size="sm" variant="outline" className="mono text-[0.65rem] tracking-widest">
                    <a href={e.href ?? "#contact"}>{e.cta.toUpperCase()} →</a>
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10 tick">NO EVIDENCE MATCHES CURRENT FILTERS</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
