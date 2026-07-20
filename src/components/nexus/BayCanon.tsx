import { AnimatedBarGraph, type BarItem } from "./AnimatedBarGraph";
import { NarratedSlideshow, type Slide } from "./NarratedSlideshow";
import { DecisionTimeline, type TimelineItem } from "./DecisionTimeline";
import { ProposalWalkthrough, type ProposalSection, type ProposalStat } from "./ProposalWalkthrough";
import { CanonReference, type CanonTerm } from "./CanonReference";
import type { BayId } from "@/data/content";

// ============================================================
// TECHNICAL BAY — Validation Status graph
// ============================================================
const VALIDATION_BARS: BarItem[] = [
  {
    label: "Current-Domain Signal Validation",
    value: 45,
    status: "Active",
    detail:
      "Demonstrate that fault-relevant mechanical information can be extracted from motor current data. Needs: clear dataset references, baseline comparison, statistical analysis, reproducible processing notes.",
  },
  {
    label: "Baseline Comparison",
    value: 40,
    status: "Active",
    detail:
      "Compare SINE~WaiV against conventional fixed-window spectral methods. Needs: defined baseline, equal observation conditions, reproducible metrics, documented analysis protocol.",
  },
  {
    label: "VFD Robustness",
    value: 15,
    status: "Planned",
    detail:
      "Evaluate performance under VFD-related noise, switching artifacts, and industrial electrical interference. Needs: controlled artifact injection, stress testing, degradation measurements.",
  },
  {
    label: "Statistical Separation",
    value: 35,
    status: "Active",
    detail:
      "Quantify whether SINE~WaiV produces meaningful separation between fault-relevant and baseline/noise conditions. Needs: SNR, distributional tests, confidence intervals, repeatability checks.",
  },
  {
    label: "Edge Feasibility",
    value: 5,
    status: "Planned",
    detail:
      "Evaluate whether the architecture can run within practical edge-compute constraints. Needs: compute benchmark, memory estimate, power estimate, hardware target definition.",
  },
];

type ChipTone = "ok" | "warn" | "off";
const DATASET_CHIPS: Array<{ label: string; note: string; tone: ChipTone }> = [
  { label: "Paderborn University", note: "Primary current-domain validation target", tone: "ok" },
  { label: "NASA IMS", note: "Accelerometer-domain reference only — not current-domain proof", tone: "warn" },
  { label: "XJTU-SY", note: "Inactive unless formally reintroduced via Decision Log", tone: "off" },
];

const chipStyle = (tone: ChipTone) => {
  if (tone === "ok") return { border: "rgba(90,200,140,0.55)", color: "#7de3a8", dot: "#7de3a8" };
  if (tone === "warn") return { border: "rgba(201,162,74,0.65)", color: "#eed99a", dot: "#c9a24a" };
  return { border: "rgba(220,90,90,0.55)", color: "#e79b9b", dot: "#d15a5a" };
};

// ============================================================
// OPERATIONS BAY — Decision Log
// ============================================================
const DECISIONS: TimelineItem[] = [
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 001",
    title: "Repository as Source of Truth",
    reason: "Important ideas and decisions were being lost across disconnected AI conversations.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 002",
    title: "Google Drive as Knowledge Repository",
    reason: "Google Drive already contains the majority of company memory and project artifacts.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 003",
    title: "GitHub as Engineering Repository",
    reason: "GitHub contains website deployment, portfolio materials, and core software repositories.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 006",
    title: "Protect IP Through Layered Disclosure",
    reason: "The company needs to share enough for funding and review without exposing proprietary implementation.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 007",
    title: "Validation Before Expansion",
    reason: "The primary risk is that the idea expands faster than the proof system. A narrow validated claim is stronger than a broad unproven claim.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 010",
    title: "Dataset Boundary Control",
    reason: "Misrepresenting dataset signal domains creates technical credibility risk, reviewer risk, and proposal risk. NASA IMS may only be used as vibration-domain reference; Paderborn is the primary current-domain validation target; XJTU-SY is excluded unless formally reintroduced.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 011",
    title: "NSF Proposal Editable Source Promotion",
    reason: "The latest NSF proposal draft was previously trapped in DOCX format, creating source-control risk.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 012",
    title: "Specific Aims / Objective Reviewer-Safe Patch Applied",
    reason: "The Objective, Disruptive Premise, and Aims 1-3 contained language too absolute or premature for reviewer-safe Phase I framing.",
  },
  {
    date: "June 29, 2026",
    decisionNumber: "Decision 013",
    title: "Innovation & Significance Reviewer-Safe Patch Applied",
    reason: "Contained language too absolute for NSF Phase I feasibility framing, including full-state observability and preliminary SNR overclaims.",
  },
];

// ============================================================
// OPERATIONS BAY — Evidence Manifest walkthrough
// ============================================================
const EVIDENCE_SLIDES: Slide[] = [
  {
    eyebrow: "EVIDENCE 01",
    heading: "NASA IMS Benchmark Notes",
    body: "Accelerometer-domain degradation proxy from a public dataset, pending final review. Must not be described as current-domain proof.",
    stat: { label: "Public-safe status", value: "Proposal-safe, if qualified" },
  },
  {
    eyebrow: "EVIDENCE 02",
    heading: "Paderborn Current-Channel Notes",
    body: "Motor current / bearing test rig data, pending final review. Channel, decimation, and processing details require confirmation.",
    stat: { label: "Public-safe status", value: "Proposal-safe" },
  },
  {
    eyebrow: "EVIDENCE 03",
    heading: "Synthetic VFD Artifact Tests",
    body: "Internal controlled stress test. Do not imply field deployment proof — bounded internal/proposal-safe use only.",
    stat: { label: "Public-safe status", value: "Internal / proposal-safe if bounded" },
  },
  {
    eyebrow: "EVIDENCE 04",
    heading: "Steve White Pilot / Reference",
    body: "Direct industrial stakeholder contact. Requires title, company, permission, and an approved letter before use.",
    stat: { label: "Public-safe status", value: "Proposal-safe after approval" },
  },
];

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#c9a24a] mb-3">{children}</div>
);

const TechnicalCanon = () => (
  <section className="container py-10 space-y-4">
    <SectionEyebrow>07 / VALIDATION STATUS — LIVE EVIDENCE GRAPH</SectionEyebrow>
    <p className="text-xs md:text-sm text-[#c8d4e2] leading-relaxed max-w-3xl">
      Validation controls credibility — the goal is a technically defensible bounded claim, not an
      impressive-sounding one.
    </p>
    <div
      className="rounded-sm border p-5 md:p-6"
      style={{
        borderColor: "rgba(201,162,74,0.42)",
        background: "rgba(16,30,52,0.82)",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 56px #c9a24a22",
      }}
    >
      <AnimatedBarGraph items={VALIDATION_BARS} />
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {DATASET_CHIPS.map((c) => {
        const s = chipStyle(c.tone);
        return (
          <div
            key={c.label}
            className="mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 rounded-sm border flex items-center gap-2"
            style={{ borderColor: s.border, background: "rgba(11,18,32,0.7)", color: s.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
            <span>{c.label}</span>
            <span className="text-[#8fa3b8] normal-case tracking-normal font-normal">— {c.note}</span>
          </div>
        );
      })}
    </div>
  </section>
);

const OperationsCanon = () => (
  <>
    <section className="container py-10">
      <SectionEyebrow>06 / DECISION LOG — STANDING DECISIONS</SectionEyebrow>
      <DecisionTimeline items={DECISIONS} />
    </section>
    <section className="container py-10">
      <SectionEyebrow>04 / EVIDENCE MANIFEST — WALKTHROUGH</SectionEyebrow>
      <NarratedSlideshow slides={EVIDENCE_SLIDES} />
    </section>
  </>
);

export const BayCanon = ({ bayId }: { bayId: BayId }) => {
  if (bayId === "technical") return <TechnicalCanon />;
  if (bayId === "operations") return <OperationsCanon />;
  return null;
};
