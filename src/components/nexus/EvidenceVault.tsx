import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EVIDENCE, EVIDENCE_STATUSES, type EvidenceStatus } from "@/data/content";
import { downloadEvidenceCard } from "@/lib/downloads";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onReturnToRotunda?: () => void;
}

const BAYS = ["01", "02", "03", "04"] as const;
const BAY_LABEL: Record<(typeof BAYS)[number], string> = {
  "01": "Mission Brief",
  "02": "Sine Wave",
  "03": "Capability Brief",
  "04": "Operations Center",
};

const statusTone: Record<EvidenceStatus, string> = {
  "Observed": "status-live",
  "Prototype": "status-warn",
  "Hypothesis": "status-idle",
  "Validation Needed": "status-warn",
  "Commercial Candidate": "status-research",
  "Research Stage": "status-research",
};

export const EvidenceVault = ({ open, onOpenChange, onReturnToRotunda }: Props) => {
  const [status, setStatus] = useState<EvidenceStatus | "ALL">("ALL");
  const [bay, setBay] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  // Reset filters whenever the vault closes so a fresh open feels clean.
  useEffect(() => {
    if (!open) {
      setStatus("ALL");
      setBay("ALL");
      setQuery("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVIDENCE.filter((e) => {
      if (status !== "ALL" && e.status !== status) return false;
      if (bay !== "ALL" && e.bay !== bay) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.claim.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.audience.toLowerCase().includes(q)
      );
    });
  }, [status, bay, query]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = { ALL: EVIDENCE.length };
    const byBay: Record<string, number> = { ALL: EVIDENCE.length };
    for (const e of EVIDENCE) {
      byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
      byBay[e.bay] = (byBay[e.bay] ?? 0) + 1;
    }
    return { byStatus, byBay };
  }, []);

  const handleReturn = () => {
    onOpenChange(false);
    if (onReturnToRotunda) {
      // Give the dialog close animation a beat before triggering navigation.
      window.setTimeout(() => onReturnToRotunda(), 120);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] p-0 bg-background border-[rgba(80,160,255,0.28)] shadow-[0_40px_120px_rgba(0,0,0,0.55),0_0_60px_rgba(70,150,255,0.18)] overflow-hidden">
        {/* ============ HEADER BAND ============ */}
        <DialogHeader className="relative p-6 md:p-8 border-b border-[rgba(80,160,255,0.2)] bg-[linear-gradient(180deg,rgba(20,38,62,0.9),rgba(8,14,24,0.9))]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mono text-[0.6rem] tracking-[0.32em] uppercase text-[hsl(var(--interactive))]">
                05 · EVIDENCE VAULT · SECURED ARCHIVE
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-[#eef6ff] mt-2">
                Evidence Cards Gallery
              </DialogTitle>
              <DialogDescription className="text-[#8fa3b8] mt-1 text-sm max-w-2xl">
                Every card carries a{" "}
                <span className="text-[#c8d4e2]">claim boundary</span>,{" "}
                <span className="text-[#c8d4e2]">audience label</span>, and{" "}
                <span className="text-[#c8d4e2]">evidence status</span>. Filter by
                bay or status, or search the whole vault.
              </DialogDescription>
            </div>
            <Button
              onClick={handleReturn}
              className="bay-hover-glow shrink-0 mono tracking-widest text-[0.65rem] h-9 px-3 whitespace-nowrap"
            >
              ← RETURN TO ROTUNDA
            </Button>
          </div>
        </DialogHeader>

        {/* ============ FILTER BAR ============ */}
        <div className="px-6 md:px-8 py-4 border-b border-[rgba(80,160,255,0.15)] bg-[rgba(10,18,30,0.55)] space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tick self-center mr-1">STATUS</span>
            {(["ALL", ...EVIDENCE_STATUSES] as const).map((s) => {
              const active = status === s;
              const n = counts.byStatus[s] ?? 0;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s as EvidenceStatus | "ALL")}
                  className={`bay-hover-glow mono text-[0.6rem] tracking-widest px-2.5 py-1 border ${
                    active
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {s.toUpperCase()} <span className="opacity-60">· {n}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="tick self-center mr-1">BAY</span>
            <button
              onClick={() => setBay("ALL")}
              className={`bay-hover-glow mono text-[0.6rem] tracking-widest px-2.5 py-1 border ${
                bay === "ALL"
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              ALL <span className="opacity-60">· {counts.byBay.ALL}</span>
            </button>
            {BAYS.map((b) => {
              const active = bay === b;
              const n = counts.byBay[b] ?? 0;
              return (
                <button
                  key={b}
                  onClick={() => setBay(b)}
                  className={`bay-hover-glow mono text-[0.6rem] tracking-widest px-2.5 py-1 border ${
                    active
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {b} · {BAY_LABEL[b].toUpperCase()} <span className="opacity-60">· {n}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="tick shrink-0">SEARCH</span>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, claim, type, audience…"
              className="h-9 bg-[rgba(12,24,40,0.55)] border-[rgba(80,160,255,0.18)] text-[#eef6ff] placeholder:text-[#8fa3b8]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mono text-[0.6rem] tracking-widest text-[#8fa3b8] hover:text-[hsl(var(--interactive))] shrink-0"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* ============ CARDS GRID ============ */}
        <div className="px-6 md:px-8 py-5 max-h-[58vh] overflow-y-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
              SHOWING <span className="text-[hsl(var(--interactive))]">{filtered.length}</span>{" "}
              OF {EVIDENCE.length} EVIDENCE CARDS
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {filtered.map((e, i) => (
                <article
                  key={e.id}
                  className="anim-swap-in bay-hover-glow group relative p-4 rounded-sm border border-[rgba(80,160,255,0.22)] bg-[linear-gradient(180deg,rgba(22,40,66,0.72),rgba(12,22,38,0.82))] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]"
                  style={{ animationDelay: `${Math.min(i * 30, 240)}ms` }}
                >
                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className="mono text-[0.55rem] tracking-widest border-[rgba(80,160,255,0.4)] text-[#c8d4e2]"
                      >
                        BAY {e.bay} · {BAY_LABEL[e.bay].toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="mono text-[0.55rem] tracking-widest border-border/60 text-[#8fa3b8]"
                      >
                        {e.type.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="tick flex items-center gap-1.5 shrink-0">
                      <span className={`status-dot ${statusTone[e.status]}`} />
                      {e.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="mt-3 text-base font-semibold text-[#eef6ff] leading-tight">
                    {e.title}
                  </h4>

                  {/* Claim */}
                  <p className="mt-2 text-xs text-[#c8d4e2] leading-relaxed">
                    <span className="tick mr-2">CLAIM</span>
                    {e.claim}
                  </p>

                  {/* Footer meta */}
                  <div className="mt-4 pt-3 border-t border-[rgba(80,160,255,0.15)] flex items-center justify-between gap-2">
                    <div className="mono text-[0.55rem] tracking-widest text-[#8fa3b8] uppercase">
                      <span className="text-[hsl(var(--interactive))]">◆</span>{" "}
                      AUDIENCE · {e.audience}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadEvidenceCard(e)}
                        className="mono text-[0.6rem] tracking-widest h-7 px-2"
                        aria-label={`Download ${e.title} as PDF`}
                        title="Download PDF with embedded metadata"
                      >
                        ↓ PDF
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mono text-[0.6rem] tracking-widest h-7"
                      >
                        <a href={e.href ?? "#contact"} onClick={() => onOpenChange(false)}>
                          {e.cta.toUpperCase()} →
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Card index chip */}
                  <div className="absolute top-3 right-3 mono text-[0.5rem] tracking-widest text-[#8fa3b8]/70 pointer-events-none">
                    /{e.id.toUpperCase()}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 border border-dashed border-[rgba(80,160,255,0.25)] rounded-sm">
              <div className="mono text-[0.6rem] tracking-[0.32em] uppercase text-[#8fa3b8]">
                NO EVIDENCE MATCHES CURRENT FILTERS
              </div>
              <button
                onClick={() => {
                  setStatus("ALL");
                  setBay("ALL");
                  setQuery("");
                }}
                className="mt-3 mono text-[0.65rem] tracking-widest text-[hsl(var(--interactive))] hover:underline"
              >
                RESET FILTERS →
              </button>
            </div>
          )}
        </div>

        {/* ============ FOOTER ============ */}
        <div className="px-6 md:px-8 py-3 border-t border-[rgba(80,160,255,0.2)] bg-[rgba(10,18,30,0.7)] flex items-center justify-between gap-3">
          <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
            ◆ SECURED ARCHIVE · CLAIM-BOUNDED · AUDIENCE-LABELED
          </div>
          <Button
            onClick={handleReturn}
            variant="outline"
            className="bay-hover-glow mono tracking-widest text-[0.6rem] h-8"
          >
            ← RETURN TO ROTUNDA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
