/**
 * TECHNICAL CANON HEADER
 * ----------------------
 * Bay-open overview strip for the Sine Wave (Technical) bay.
 * Presents the canonical framing, the live validation aggregate, and
 * an in-page anchor rail so reviewers can jump straight to the section
 * they care about (Validation, Signal Pipeline, or Reference).
 */

import { useMemo } from "react";
import type { BarItem } from "./AnimatedBarGraph";

interface Anchor {
  id: string;
  code: string;
  label: string;
}

interface Props {
  bars: BarItem[];
  anchors: Anchor[];
}

export const TechnicalCanonHeader = ({ bars, anchors }: Props) => {
  const stats = useMemo(() => {
    const active = bars.filter((b) => b.status === "Active");
    const planned = bars.filter((b) => b.status === "Planned");
    const avg = bars.length
      ? Math.round(bars.reduce((s, b) => s + b.value, 0) / bars.length)
      : 0;
    const activeAvg = active.length
      ? Math.round(active.reduce((s, b) => s + b.value, 0) / active.length)
      : 0;
    return { active: active.length, planned: planned.length, avg, activeAvg, total: bars.length };
  }, [bars]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="container pt-10 pb-2">
      <div
        className="relative rounded-sm border p-5 md:p-6 overflow-hidden"
        style={{
          borderColor: "rgba(201,162,74,0.42)",
          background:
            "linear-gradient(180deg, rgba(18,32,56,0.86), rgba(10,18,32,0.92))",
          boxShadow:
            "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 56px #c9a24a1c",
        }}
      >
        {/* gold hairline cap */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, #c9a24a, transparent)" }}
        />

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mono text-[0.6rem] tracking-[0.32em] uppercase text-[#c9a24a] mb-2">
              BAY 02 / SINE WAVE — LIVING TECHNICAL CANON
            </div>
            <h2 className="text-xl md:text-2xl leading-tight text-[#eef6ff] font-semibold mb-2">
              Bounded, current-domain evidence — reviewer-safe by construction.
            </h2>
            <p className="text-xs md:text-sm text-[#c8d4e2] leading-relaxed">
              Every claim below is scoped to what the evidence actually supports today.
              Bars advance when independent validation lands; nothing here overstates.
            </p>
          </div>

          {/* Aggregate readout */}
          <div
            className="grid grid-cols-3 gap-3 min-w-[260px]"
            role="group"
            aria-label="Validation aggregate"
          >
            <ReadoutCell label="Overall" value={`${stats.avg}%`} tone="gold" />
            <ReadoutCell label="Active" value={`${stats.active}/${stats.total}`} tone="cyan" />
            <ReadoutCell label="Active Avg" value={`${stats.activeAvg}%`} tone="gold" />
          </div>
        </div>

        {/* anchor rail */}
        <div className="mt-5 pt-4 border-t flex flex-wrap gap-2" style={{ borderColor: "rgba(201,162,74,0.24)" }}>
          {anchors.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => scrollTo(a.id)}
              className="interactive mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 rounded-sm border transition-all hover:-translate-y-[1px]"
              style={{
                borderColor: "rgba(130,205,255,0.32)",
                background: "rgba(11,18,32,0.7)",
                color: "#c8d4e2",
              }}
            >
              <span className="text-[#c9a24a] mr-2">{a.code}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReadoutCell = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gold" | "cyan";
}) => {
  const color = tone === "gold" ? "#eed99a" : "#7dd3ff";
  const border = tone === "gold" ? "rgba(201,162,74,0.45)" : "rgba(130,205,255,0.35)";
  return (
    <div
      className="rounded-sm border px-3 py-2"
      style={{ borderColor: border, background: "rgba(11,18,32,0.7)" }}
    >
      <div className="mono text-[0.5rem] tracking-[0.28em] uppercase text-[#8fa3b8]">{label}</div>
      <div className="mono text-lg tabular-nums leading-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
};
