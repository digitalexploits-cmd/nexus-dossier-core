import { AnimatedBarGraph, type BarItem } from "./AnimatedBarGraph";
import { NarratedSlideshow, type Slide } from "./NarratedSlideshow";
import { DecisionTimeline, type TimelineItem } from "./DecisionTimeline";
import { ProposalWalkthrough, type ProposalSection, type ProposalStat } from "./ProposalWalkthrough";
import { CanonReference, type CanonTerm } from "./CanonReference";
import { PatchDiagram, type PatchRule } from "./PatchDiagram";
import { HeroImage, HoverVideo, InstrumentFrame } from "./MediaPanel";
import { TechnicalCanonHeader } from "./TechnicalCanonHeader";
import type { BayId } from "@/data/content";

const MEDIA = {
  spectral:      "/nexus-media/spectral_structure_from_noise.png",
  detection:     "/nexus-media/detection_horizon.png",
  claimRelease:  "/nexus-media/claim_release_boundaries.png",
  doctrinePill:  "/nexus-media/operating_doctrine_pillars.png",
  knowledgeCore: "/nexus-media/knowledge_lifecycle_core.png",
  signalLock:    "/nexus-media/SignalLockGlitch.mp4",
  faultInject:   "/nexus-media/fault_signature_injector.html",
  signalExtr:    "/nexus-media/signal_extraction_instrument.html",
  claimStr:      "/nexus-media/claim_strength_instrument.html",
  reproGate:     "/nexus-media/reproducibility_gate.html",
  boundedTerm:   "/nexus-media/bounded_thesis_terminal.html",
  phaseBound:    "/nexus-media/phase_boundary_terminal.html",
  evidenceProm:  "/nexus-media/evidence_promotion_gate.html",
  changeCtrl:    "/nexus-media/change_control_board.html",
  doctrineTerm:  "/nexus-media/operating_doctrine_terminal.html",
  humanLoop:     "/nexus-media/human_in_the_loop.html",
  multiAgent:    "/nexus-media/multi_agent_roles.html",
};

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
  <>
    <section className="container py-10 space-y-4">
      <SectionEyebrow>07 / VALIDATION STATUS — LIVE EVIDENCE GRAPH</SectionEyebrow>
      <p className="text-xs md:text-sm text-[#c8d4e2] leading-relaxed max-w-3xl">
        Validation controls credibility — the goal is a technically defensible bounded claim, not an
        impressive-sounding one.
      </p>

      <HeroImage
        src={MEDIA.detection}
        alt="Detection horizon — projected lead-time surface"
        eyebrow="FIG · 07A"
        label="DETECTION HORIZON — LEAD-TIME FIELD"
        meta="ATMOSPHERIC · REFERENCE"
      />

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

      <div className="grid md:grid-cols-2 gap-4 pt-2">
        <InstrumentFrame
          src={MEDIA.claimStr}
          eyebrow="INSTR · 07B"
          label="CLAIM STRENGTH INSTRUMENT"
          height={480}
        />
        <InstrumentFrame
          src={MEDIA.reproGate}
          eyebrow="INSTR · 07C"
          label="REPRODUCIBILITY GATE"
          height={480}
        />
        <InstrumentFrame
          src={MEDIA.phaseBound}
          eyebrow="INSTR · 07D"
          label="PHASE BOUNDARY TERMINAL"
          meta="PHASE FRAMING · REVIEW-SAFE"
          height={420}
        />
        <InstrumentFrame
          src={MEDIA.evidenceProm}
          eyebrow="INSTR · 07E"
          label="EVIDENCE PROMOTION GATE"
          meta="CLAIM DISCIPLINE · CATEGORY MATCH"
          height={420}
        />
      </div>
    </section>

    <section className="container py-10 space-y-4">
      <SectionEyebrow>08 / LIVING TECHNICAL CANON — SIGNAL PIPELINE</SectionEyebrow>

      <HeroImage
        src={MEDIA.spectral}
        alt="Spectral structure extracted from broadband noise"
        eyebrow="FIG · 08A"
        label="SPECTRAL STRUCTURE FROM NOISE"
        meta="MIXED-RADIX SUB-WINDOW · REFERENCE"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <HoverVideo
          src={MEDIA.signalLock}
          eyebrow="MOTION · 08B"
          label="SIGNAL LOCK — GLITCH-TO-LOCK"
          meta="HERO MOTION"
        />
        <InstrumentFrame
          src={MEDIA.boundedTerm}
          eyebrow="INSTR · 08C"
          label="BOUNDED THESIS TERMINAL"
          height={360}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InstrumentFrame
          src={MEDIA.faultInject}
          eyebrow="INSTR · 08D"
          label="FAULT SIGNATURE INJECTOR"
          height={520}
        />
        <InstrumentFrame
          src={MEDIA.signalExtr}
          eyebrow="INSTR · 08E"
          label="SIGNAL EXTRACTION INSTRUMENT"
          height={520}
        />
      </div>
    </section>

    <section className="container py-10">
      <SectionEyebrow>09 / LIVING TECHNICAL CANON — REFERENCE</SectionEyebrow>
      <CanonReference terms={CANON_TERMS} />
    </section>
  </>
);


const PATCH_RULES: PatchRule[] = [
  {
    dataset: "Paderborn University",
    rule: "Primary current-domain validation target for review-safe SINE~WaiV framing.",
  },
  {
    dataset: "NASA IMS",
    rule: "Must not be described as direct current-domain, MCSA, or ESA validation. Vibration-domain reference only, when clearly labeled.",
  },
  {
    dataset: "XJTU-SY",
    rule: "Inactive for NSF review-safe framing unless formally reintroduced by founder decision and recorded in the Decision Log.",
  },
];

const OperationsCanon = () => (
  <>
    <section className="container py-10 space-y-4">
      <SectionEyebrow>10 / OS PATCH 001 — DATASET BOUNDARY CONTROL</SectionEyebrow>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
        <PatchDiagram
          status="OPERATIONAL PATCH · June 29, 2026"
          purpose="Standing dataset-boundary rules governing how each source may be described in reviewer-facing material."
          rules={PATCH_RULES}
        />
        <HeroImage
          src={MEDIA.claimRelease}
          alt="Claim release boundary diagram"
          eyebrow="FIG · 10A"
          label="CLAIM RELEASE BOUNDARIES"
          meta="INTERNAL ↔ PROPOSAL-SAFE ↔ PUBLIC"
          aspect="aspect-[4/3]"
        />
      </div>
    </section>
    <section className="container py-10 space-y-4">
      <SectionEyebrow>06 / DECISION LOG — STANDING DECISIONS</SectionEyebrow>
      <DecisionTimeline items={DECISIONS} />
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        <InstrumentFrame
          src={MEDIA.changeCtrl}
          eyebrow="INSTR · 06A"
          label="CHANGE CONTROL BOARD"
          meta="CHANGE DISCIPLINE · LIVE"
          height={440}
        />
        <InstrumentFrame
          src={MEDIA.evidenceProm}
          eyebrow="INSTR · 06B"
          label="EVIDENCE PROMOTION GATE"
          meta="MANIFEST GATE · LIVE"
          height={440}
        />
      </div>
    </section>
    <section className="container py-10">
      <SectionEyebrow>04 / EVIDENCE MANIFEST — WALKTHROUGH</SectionEyebrow>
      <NarratedSlideshow slides={EVIDENCE_SLIDES} />
    </section>
  </>
);

// ============================================================
// MISSION BAY — Operating Doctrine, Human-in-the-Loop, Multi-Agent
// ============================================================
const MissionCanon = () => (
  <>
    <section className="container py-10 space-y-4">
      <SectionEyebrow>M1 / OPERATING DOCTRINE — PILLARS</SectionEyebrow>
      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-4 items-start">
        <HeroImage
          src={MEDIA.doctrinePill}
          alt="Operating doctrine pillars"
          eyebrow="FIG · M1A"
          label="OPERATING DOCTRINE PILLARS"
          meta="BRAND PHILOSOPHY · REFERENCE"
          aspect="aspect-[4/3]"
        />
        <InstrumentFrame
          src={MEDIA.doctrineTerm}
          eyebrow="INSTR · M1B"
          label="OPERATING DOCTRINE TERMINAL"
          meta="DOCTRINE · READ-ONLY"
          height={420}
        />
      </div>
    </section>
    <section className="container py-10 space-y-4">
      <SectionEyebrow>M2 / HUMAN-IN-THE-LOOP · ACCOUNTABILITY</SectionEyebrow>
      <div className="grid md:grid-cols-2 gap-4">
        <InstrumentFrame
          src={MEDIA.humanLoop}
          eyebrow="INSTR · M2A"
          label="HUMAN-IN-THE-LOOP REQUIREMENT"
          height={380}
        />
        <InstrumentFrame
          src={MEDIA.multiAgent}
          eyebrow="INSTR · M2B"
          label="MULTI-AGENT ROLES"
          meta="NEXUS PLATFORM ARCHITECTURE"
          height={380}
        />
      </div>
    </section>
    <section className="container py-10">
      <SectionEyebrow>M3 / KNOWLEDGE LIFECYCLE — CORE</SectionEyebrow>
      <HeroImage
        src={MEDIA.knowledgeCore}
        alt="Knowledge lifecycle core diagram"
        eyebrow="FIG · M3A"
        label="KNOWLEDGE LIFECYCLE CORE"
        meta="CAPTURE → PROMOTE → GOVERN"
        aspect="aspect-[21/9]"
      />
    </section>
  </>
);

// ============================================================
// CAPABILITY BAY — NSF SBIR Proposal walkthrough
// ============================================================
const PROPOSAL_STATS: ProposalStat[] = [
  { label: "Solicitation", value: "NSF 26-510" },
  { label: "Proposal #", value: "00113162" },
  { label: "Ask", value: "$305,000" },
  { label: "Period", value: "12 months" },
  { label: "Deadline", value: "Jul 27, 2026" },
];

const PROPOSAL_SECTIONS: ProposalSection[] = [
  {
    id: "objective",
    part: "PART I · SPECIFIC AIMS",
    title: "Objective",
    patched: true,
    summary:
      "Evaluates the technical feasibility of SINE~WaiV as a candidate software-defined diagnostic architecture for current-domain spectral-state estimation. Tests whether motor stator current can support fault-relevant degradation observability under controlled validation conditions, addressing the cost and scalability barriers of vibration-sensor networks.",
  },
  {
    id: "premise",
    part: "PART I · SPECIFIC AIMS",
    title: "Disruptive Premise",
    patched: true,
    summary:
      "Existing electrical measurement infrastructure may support a software-defined diagnostic architecture that reduces dependence on added asset-mounted sensing hardware for selected motor-health monitoring tasks.",
  },
  {
    id: "aim1",
    part: "PART I · SPECIFIC AIMS",
    title: "Aim 1 — Spectral Separation vs. Fixed-Window Baseline",
    patched: true,
    summary:
      "Evaluate the mixed-radix spectral-estimation framework on Paderborn University KAt current-channel data against a fixed-window spectral baseline. Measures statistically documented improvement in fault-relevant spectral separation (SNR, distributional metrics), with uncertainty and limitations reported.",
  },
  {
    id: "aim2",
    part: "PART I · SPECIFIC AIMS",
    title: "Aim 2 — Robustness Under VFD Artifacts",
    patched: true,
    summary:
      "Evaluate robustness under controlled, synthetic VFD artifact injection based on documented industrial PWM switching-frequency ranges. Measures whether fault-relevant feature stability is preserved under non-sinusoidal switching noise.",
  },
  {
    id: "aim3",
    part: "PART I · SPECIFIC AIMS",
    title: "Aim 3 — Edge Computational Feasibility",
    patched: true,
    summary:
      "Quantify computational feasibility by benchmarking execution latency, memory overhead, and estimated power feasibility on ARM Cortex-M7 class microprocessors against a ≤40 mW target.",
  },
  {
    id: "innovation",
    part: "PART II",
    title: "Innovation & Significance",
    patched: true,
    summary:
      "Stator current is evaluated as an electromagnetically coupled observation channel for selected fault-relevant mechanical state variables. The proposal tests whether a mixed-radix spectral-estimation approach improves separation of weak current-domain fault features from VFD-related electrical artifacts.",
  },
  {
    id: "commercialization",
    part: "PART II-B",
    title: "Commercialization Plan",
    summary:
      "Two-mode deployment: Mode A is a pure software layer for facilities with existing current-data capture, delivered as SaaS via Nexus. Mode II covers Phase II Spectral Guardian Dot autonomous sensing nodes for facilities lacking data infrastructure — notably hazardous / ATEX-rated environments. Three-phase path: Phase I algorithm validation, Phase II field validation and beta deployment, Phase III fleet-scale licensing.",
  },
  {
    id: "methodology",
    part: "PART III",
    title: "Technical Methodology",
    summary:
      "Three sequential Specific Aims, each gating entry to the next, anchored to native electrical-domain data. Central hypothesis: a 1,728-point mixed-radix (2^6 × 3^3) sub-window spectral estimator, adaptively steered, achieves better fault-sideband isolation than conventional global FFT at edge-compatible computational cost.",
  },
  {
    id: "stats",
    part: "PART IV",
    title: "Statistical Grounding",
    summary:
      "Dual-stage statistical verification: an RLS-filter-based dynamic confidence interval on each state estimate, plus a distributional benchmark (Kolmogorov–Smirnov test, KL divergence) comparing SINE~WaiV output against the FFT baseline. Characterizes a defensible performance envelope rather than a single-figure claim.",
  },
];

// ============================================================
// TECHNICAL BAY — Living Technical Canon reference terms
// ============================================================
const CANON_TERMS: CanonTerm[] = [
  {
    term: "SINE~WaiV",
    category: "Core System",
    short:
      "Software-only Motor Current Signature Analysis engine using mixed-radix spectral resolution to separate fault signatures from VFD switching noise, with no added sensor hardware.",
  },
  {
    term: "Mixed-radix 1,728-point FFT",
    category: "Core System",
    short:
      "A 2^6 × 3^3 factorization producing 28 valid integer sub-window sizes, giving flexibility to steer analysis away from VFD kill zones that fixed binary FFTs cannot avoid.",
  },
  {
    term: "VFD kill zones",
    category: "Core System",
    short:
      "Empirically mapped frequency bands (170–185 Hz, 258–260 Hz) where VFD switching artifacts dominate the current spectrum and mask fault signatures.",
  },
  {
    term: "K(f,t) adaptive filter",
    category: "Core System",
    short:
      "The frequency-and-time adaptive weighting function that repositions the spectral sub-window toward fault-relevant bands and de-emphasizes VFD carrier harmonics.",
  },
  {
    term: "BPFI / BPFO / BSF / FTF",
    category: "Fault Physics",
    short:
      "Ball Pass Frequency Inner / Outer, Ball Spin Frequency, and Fundamental Train Frequency — bearing fault frequencies computed directly from bearing geometry constants, first-principles rather than machine-learned.",
  },
  {
    term: "Spectral Baseline Note (100 Hz artifact)",
    category: "Fault Physics",
    short:
      "The dominant 100 Hz peak observed in Paderborn N15_M07 phase-current data is expected 2× line-frequency behavior from full-wave rectification in a 50 Hz AC system — a known MCSA artifact, not a fault indicator, and not a data-quality anomaly.",
  },
  {
    term: "Current-domain validation",
    category: "Evidence Discipline",
    short:
      "Validation performed on real motor current data (e.g. Paderborn KAt), as distinct from vibration/accelerometer-domain data — the only validation type that directly supports SINE~WaiV's current-domain claims.",
  },
  {
    term: "Vibration-domain reference",
    category: "Evidence Discipline",
    short:
      "Data such as NASA IMS that measures mechanical vibration, not electrical current. Useful only as a qualified proxy/reference — never as direct proof of current-domain performance.",
  },
  {
    term: "Preliminary internal benchmark",
    category: "Evidence Discipline",
    short:
      "A result observed internally that has not yet been independently validated or reproduced under controlled baseline conditions. Reported with that qualifier, not as settled fact.",
  },
  {
    term: "Independent validator",
    category: "Evidence Discipline",
    short:
      "A domain-credentialed third party (DSP/MCSA specialist) engaged to independently review methodology and results — distinct from internal preliminary findings.",
  },
];

const CapabilityCanon = () => (
  <section className="container py-10">
    <SectionEyebrow>01 / PROPOSAL WALKTHROUGH — INTERACTIVE</SectionEyebrow>
    <ProposalWalkthrough stats={PROPOSAL_STATS} sections={PROPOSAL_SECTIONS} />
  </section>
);

export const BayCanon = ({ bayId }: { bayId: BayId }) => {
  if (bayId === "technical") return <TechnicalCanon />;
  if (bayId === "operations") return <OperationsCanon />;
  if (bayId === "capability") return <CapabilityCanon />;
  if (bayId === "mission") return <MissionCanon />;
  return null;
};
