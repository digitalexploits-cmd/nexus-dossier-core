/**
 * Nexus content data
 * ---------------------------------------------
 * All copy, credentials, and evidence records live here so they can be
 * edited without touching component code.
 *
 * TO REPLACE ASSETS:
 *  - Resume PDF: drop file at /public/resume/anthony-mcgee-resume.pdf
 *    then leave RESUME_URL as "/resume/anthony-mcgee-resume.pdf".
 *  - Founder headshot: replace /src/assets/founder.jpg (import used in code).
 *  - Credential files: place PDFs/images under /public/credentials/ and set
 *    each credential's `href` below to the matching path.
 *  - Evidence docs: same idea under /public/evidence/.
 */

export const BRAND = {
  company: "AI Base³ Solutions LLC",
  platform: "Nexus",
  founder: "Anthony \u201CTony\u201D McGee",
  tech: "SINE~WaiV State Inspector",
  line: "We divide the wave without losing the machine.",
  contactEmail: "briefing@aibase3.solutions",
};

export const RESUME_URL = "/resume/anthony-mcgee-resume.pdf"; // placeholder path

export type BayId = "mission" | "technical" | "capability" | "operations";

export const BAYS: Array<{
  id: BayId;
  index: string;
  code: string;
  title: string;
  subtitle: string;
  status: "LIVE" | "STANDBY" | "RESEARCH" | "ONLINE";
  statusClass: "status-live" | "status-warn" | "status-idle" | "status-research";
  blurb: string;
}> = [
  {
    id: "mission",
    index: "01",
    code: "BAY 01",
    title: "Mission Brief",
    subtitle: "Founder Office",
    status: "LIVE",
    statusClass: "status-live",
    blurb: "Executive dossier, founder record, credentials.",
  },
  {
    id: "technical",
    index: "02",
    code: "BAY 02",
    title: "Technical Brief",
    subtitle: "Research Lab",
    status: "RESEARCH",
    statusClass: "status-research",
    blurb: "SINE~WaiV signal-path notes and validation staging.",
  },
  {
    id: "capability",
    index: "03",
    code: "BAY 03",
    title: "Capability Brief",
    subtitle: "Capability Gallery",
    status: "STANDBY",
    statusClass: "status-warn",
    blurb: "Reliability workflows, pilot framing, commercialization.",
  },
  {
    id: "operations",
    index: "04",
    code: "BAY 04",
    title: "Operations Center",
    subtitle: "Command & Control",
    status: "ONLINE",
    statusClass: "status-idle",
    blurb: "Project state, evidence vault, deployment status.",
  },
];

export const FOUNDER_BIO = `Anthony \u201CTony\u201D McGee is the founder of AI Base\u00B3 Solutions LLC and the creator of Nexus, the operating shell for organizing the company\u2019s technical, commercial, and founder evidence. His work centers on SINE~WaiV State Inspector, a research-stage, physics-informed motor-current inspection system being developed to turn machine signal behavior into structured diagnostic evidence. Tony\u2019s background is rooted in industrial systems, electrical troubleshooting, machine behavior, maintenance reality, and high-pressure problem solving. AI Base\u00B3 is being built around one principle: divide the wave without losing the machine.`;

export const FOUNDER_SUMMARY = {
  title: "Founder / Industrial Systems Problem Solver / SINE~WaiV Creator",
  summary:
    "Builder of AI Base\u00B3 Solutions LLC and Nexus. Focused on industrial signal interpretation, machine-state inspection, technical documentation, commercialization readiness, and practical AI-assisted execution.",
};

export const CORE_STRENGTHS = [
  "Industrial electrical systems",
  "Motor-current reasoning",
  "Signal-path thinking",
  "Maintenance and reliability context",
  "AI-assisted technical execution",
  "Systems troubleshooting",
  "Founder-led product development",
  "Technical writing and proposal development",
  "Commercialization strategy",
  "Rapid prototype orchestration",
];

export const CURRENT_WORK = [
  {
    org: "AI Base\u00B3 Solutions LLC",
    role: "Founder",
    detail: "Company formation, doctrine, evidence discipline, commercialization path.",
  },
  {
    org: "Nexus",
    role: "Operating Shell",
    detail: "Company, evidence, technical demos, and commercialization material.",
  },
  {
    org: "SINE~WaiV State Inspector",
    role: "Research Lead",
    detail: "Research-stage, physics-informed motor-current inspection system.",
  },
];

export const TECHNICAL_FOCUS = [
  "Motor current i(t)",
  "Signal inspection and structured evidence",
  "FFT / frequency-domain reasoning",
  "Artifact-aware inspection framing",
  "Industrial reliability workflows",
  "Evidence labeling and claim discipline",
  "Technical briefing systems",
];

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  category: "Learning" | "Certificate" | "Founder Document" | "Resume" | "White Paper" | "Validation" | "Project";
  year?: string;
  href?: string;
};

export const CREDENTIALS: Credential[] = [
  { id: "c1", title: "Google / Cloud / AI Learning Track", issuer: "Google", category: "Learning", year: "2024\u20132026" },
  { id: "c2", title: "Industrial Technical Certificate", issuer: "Placeholder Institution", category: "Certificate" },
  { id: "c3", title: "AI Base\u00B3 Solutions LLC Formation", issuer: "State Filing", category: "Founder Document" },
  { id: "c4", title: "Founder Resume (PDF)", issuer: "Anthony McGee", category: "Resume", href: RESUME_URL },
  { id: "c5", title: "SINE~WaiV Concept White Paper", issuer: "AI Base\u00B3", category: "White Paper" },
  { id: "c6", title: "Signal Validation Graphics", issuer: "Research Notes", category: "Validation" },
  { id: "c7", title: "Nexus Platform Screenshots", issuer: "AI Base\u00B3", category: "Project" },
];

export type EvidenceStatus =
  | "Observed"
  | "Prototype"
  | "Hypothesis"
  | "Validation Needed"
  | "Commercial Candidate"
  | "Research Stage";

export type EvidenceCard = {
  id: string;
  title: string;
  type: string;
  bay: "01" | "02" | "03" | "04";
  status: EvidenceStatus;
  claim: string;
  audience: "Investor" | "Partner" | "Customer" | "Technical" | "Public";
  cta: string;
  href?: string;
};

export const EVIDENCE: EvidenceCard[] = [
  {
    id: "e1",
    title: "Founder Dossier",
    type: "Document",
    bay: "01",
    status: "Observed",
    claim: "Founder record and credential set as presented.",
    audience: "Investor",
    cta: "Open Dossier",
  },
  {
    id: "e2",
    title: "SINE~WaiV Concept Note",
    type: "White Paper",
    bay: "02",
    status: "Research Stage",
    claim: "Physics-informed motor-current inspection framing. No field validation claimed.",
    audience: "Technical",
    cta: "Open Note",
  },
  {
    id: "e3",
    title: "Signal-Path Diagram",
    type: "Diagram",
    bay: "02",
    status: "Prototype",
    claim: "Illustrative signal path. Illustrative only \u2014 not a validated system diagram.",
    audience: "Technical",
    cta: "View Diagram",
  },
  {
    id: "e4",
    title: "FFT Reasoning Sketch",
    type: "Analysis",
    bay: "02",
    status: "Hypothesis",
    claim: "Frequency-domain reasoning sketch. Requires validation before use as evidence.",
    audience: "Technical",
    cta: "View Sketch",
  },
  {
    id: "e5",
    title: "Reliability Workflow Map",
    type: "Workflow",
    bay: "03",
    status: "Validation Needed",
    claim: "Candidate workflow for maintenance decision support. Not yet piloted.",
    audience: "Customer",
    cta: "Open Map",
  },
  {
    id: "e6",
    title: "Pilot Candidate Brief",
    type: "Brief",
    bay: "03",
    status: "Commercial Candidate",
    claim: "Framing document for prospective pilot engagements.",
    audience: "Partner",
    cta: "Request Brief",
  },
  {
    id: "e7",
    title: "Nexus Platform Status",
    type: "Status",
    bay: "04",
    status: "Observed",
    claim: "Current deployment state of the Nexus operating shell.",
    audience: "Public",
    cta: "View Status",
  },
  {
    id: "e8",
    title: "Commercialization Pathway",
    type: "Strategy",
    bay: "04",
    status: "Prototype",
    claim: "Draft commercialization pathway document.",
    audience: "Investor",
    cta: "Open Draft",
  },
];

export const EVIDENCE_STATUSES: EvidenceStatus[] = [
  "Observed",
  "Prototype",
  "Hypothesis",
  "Validation Needed",
  "Commercial Candidate",
  "Research Stage",
];
