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
    title: "Sine Wave",
    subtitle: "Algorithm Data Bank",
    status: "RESEARCH",
    statusClass: "status-research",
    blurb: "The algorithm data bank — equations, signal reasoning, validation, and evidence.",
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

export const RESUME_AVAILABLE = false; // flip to true once /public/resume/ has the file

const cert = (id: string, title: string, issuer: string, file: string): Credential => ({
  id,
  title,
  issuer,
  category: "Certificate",
  year: "2026",
  href: `/credentials/${file}`,
});

export const CREDENTIALS: Credential[] = [
  // Google
  cert("g01", "Google AI Essentials", "Google", "google-ai-essentials.pdf"),
  cert("g02", "Google AI Professional Certificate", "Google", "google-ai-pro.pdf"),
  cert("g03", "Google Prompting Essentials", "Google", "google-prompting-master.pdf"),
  cert("g04", "Start Writing Prompts like a Pro", "Google", "google-prompt-master.pdf"),
  cert("g05", "AI for App Building", "Google", "google-ai-app-building.pdf"),
  cert("g06", "AI for Brainstorming and Planning", "Google", "google-ai-brainstorming-planning.pdf"),
  cert("g07", "AI for Writing and Communicating", "Google", "google-ai-communication-writing.pdf"),
  cert("g08", "Use AI as a Creative or Expert Partner", "Google", "google-ai-creative-expert.pdf"),
  cert("g09", "Design Prompts for Everyday Work Tasks", "Google", "google-ai-everyday-work-tasks.pdf"),
  cert("g10", "AI Fundamentals", "Google", "google-ai-fundamentals.pdf"),
  cert("g11", "AI for Research and Insights", "Google", "google-ai-research.pdf"),
  cert("g12", "AI for Content Creation", "Google", "google-content-creation.pdf"),
  cert("g13", "AI for Data Analysis", "Google", "google-data-analysis.pdf"),
  cert("g14", "Speed Up Data Analysis and Presentation Building", "Google", "google-data-analysis-presentation-building.pdf"),
  cert("g15", "Uncover Your Transferable Skills with AI", "Google", "google-transferable-skills.pdf"),
  cert("g16", "Foundations of User Experience (UX) Design", "Google", "google-ux-design.pdf"),

  // Google Cloud
  cert("gc01", "Introduction to Generative AI Learning Path", "Google Cloud", "gen-ai-learning-path.pdf"),
  cert("gc02", "Introduction to Generative AI", "Google Cloud", "google-gen-ai.pdf"),
  cert("gc03", "Gen AI: Beyond the Chatbot", "Google Cloud", "google-beyond-chatbots.pdf"),
  cert("gc04", "Gen AI: Navigate the Landscape", "Google Cloud", "google-gen-ai-navigating.pdf"),
  cert("gc05", "Gen AI: Unlock Foundational Concepts", "Google Cloud", "google-unlock-foundational-concepts.pdf"),
  cert("gc06", "Gen AI Agents: Transform Your Organization", "Google Cloud", "google-gen-ai-agents-organization.pdf"),
  cert("gc07", "Gen AI Apps: Transform Your Work", "Google Cloud", "google-gen-ai-apps-for-work.pdf"),
  cert("gc08", "Introduction to Large Language Models", "Google Cloud", "google-intro-llms.pdf"),
  cert("gc09", "Introduction to Responsible AI", "Google Cloud", "google-responsible-ai-1.pdf"),
  cert("gc10", "Responsible AI: Applying AI Principles with Google Cloud", "Google Cloud", "google-responsible-ai-2.pdf"),

  // Anthropic
  cert("a01", "AI Fundamentals with Claude \u2014 Collaboration", "Anthropic", "anthropic-claude-collaboration.pdf"),
  cert("a02", "AI Fundamentals with Claude \u2014 Mastery", "Anthropic", "anthropic-claude-master.pdf"),

  // Coursera
  cert("cs01", "Coursera Verified Certificate", "Coursera", "coursera-3bwz2j6k2jh7.pdf"),

  // Coursiv
  cert("cv01", "Claude", "Coursiv", "coursiv-claude.pdf"),
  cert("cv02", "ChatGPT", "Coursiv", "coursiv-chatgpt.pdf"),
  cert("cv03", "ChatGPT: Deep Dive", "Coursiv", "coursiv-chatgpt-deep-dive.pdf"),
  cert("cv04", "Gemini", "Coursiv", "coursiv-gemini.pdf"),
  cert("cv05", "Perplexity", "Coursiv", "coursiv-perplexity.pdf"),
  cert("cv06", "Midjourney", "Coursiv", "coursiv-midjourney.pdf"),
  cert("cv07", "Stable Diffusion", "Coursiv", "coursiv-stable-diffusion.pdf"),
  cert("cv08", "Jasper AI", "Coursiv", "coursiv-jasper.pdf"),
  cert("cv09", "Lovable", "Coursiv", "coursiv-lovable.pdf"),
];

export const CREDENTIAL_ISSUER_ORDER: string[] = [
  "Google",
  "Google Cloud",
  "Anthropic",
  "Coursera",
  "Coursiv",
];

// ============================================================
// DOCUMENTS — per-bay document shelves rendered by DocumentShelf
// ============================================================
export type DocKind = "pdf" | "image" | "video" | "html" | "text";
export type DocItem = {
  id: string;
  title: string;
  bay: BayId;
  kind: DocKind;
  href: string;
  description?: string;
  date?: string;
  featured?: boolean;
  category?: string;
};

export const DOCUMENTS: DocItem[] = [
  // MISSION
  { id: "d_resume", title: "Chronological AI Technical Solutions Résumé (v6)", bay: "mission", kind: "pdf", href: "/dossier/anthony-mcgee-resume-v6.pdf", category: "Résumé", date: "2026-07", featured: true },
  { id: "d_dossier", title: "Executive Dossier", bay: "mission", kind: "html", href: "/dossier/executive-dossier.html", category: "Dossier", featured: true },
  { id: "d_portfolio", title: "Master Executive Portfolio", bay: "mission", kind: "html", href: "/dossier/master-executive-portfolio.html", category: "Portfolio" },
  { id: "d_deck", title: "AI Base³ Presentation", bay: "mission", kind: "pdf", href: "/dossier/ai-base3-presentation.pdf", category: "Deck" },
  { id: "d_cover", title: "AI Implementation Cover Letter (v6)", bay: "mission", kind: "pdf", href: "/dossier/cover-letter-v6.pdf", category: "Cover Letter", date: "2026-07" },

  // TECHNICAL
  { id: "t_diag", title: "SINE~WaiV Algorithmic Motor Diagnostics", bay: "technical", kind: "pdf", href: "/technical/sine-waiv-algorithmic-motor-diagnostics.pdf", category: "Technical Paper", featured: true },
  { id: "t_defense", title: "SINE~WaiV Technical Defense Framework", bay: "technical", kind: "pdf", href: "/technical/sine-waiv-technical-defense-framework.pdf", category: "Framework", featured: true },
  { id: "t_infographic", title: "Predictive Maintenance Software Infographic", bay: "technical", kind: "image", href: "/technical/predictive-maintenance-infographic.png", category: "Infographic" },

  // CAPABILITY
  { id: "c_nsf", title: "NSF SBIR Phase I — Full Draft (Canonical)", bay: "capability", kind: "pdf", href: "/proposals/nsf-sbir-phase1-canonical.pdf", category: "Proposal", featured: true },
  { id: "c_sbir2", title: "SBIR Proposal (2026-07-01)", bay: "capability", kind: "pdf", href: "/proposals/sbir-proposal-2026-07-01.pdf", category: "Proposal", date: "2026-07-01" },
  { id: "c_wwt", title: "Executive Brief", bay: "capability", kind: "pdf", href: "/proposals/wwt-executive-brief.pdf", category: "Brief" },

  // OPERATIONS
  { id: "o_paderborn", title: "Official Paderborn Validation Results", bay: "operations", kind: "pdf", href: "/evidence/paderborn-validation-results.pdf", category: "Validation", featured: true },
  { id: "o_femto", title: "IEEE PHM 2012 FEMTO Bearing Diagnostic Results", bay: "operations", kind: "pdf", href: "/evidence/ieee-phm-femto-bearing-results.pdf", category: "Validation" },
  { id: "o_evmanifest", title: "NSF Evidence Manifest", bay: "operations", kind: "text", href: "/evidence/nsf-evidence-manifest.txt", category: "Evidence" },
  { id: "o_console", title: "Validation Console Output", bay: "operations", kind: "text", href: "/evidence/validation-console-output.txt", category: "Evidence" },
];

export const documentsForBay = (bay: BayId): DocItem[] => {
  const items = DOCUMENTS.filter((d) => d.bay === bay);
  return items.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
};

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
