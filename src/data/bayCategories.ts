/**
 * BAY CONTENT MAP — declarative, adjustable, public-safe.
 * ---------------------------------------------------------
 * Each bay = an ordered list of categories. Each category = an ordered
 * list of real assets. Adding/renaming/hiding a category or promoting
 * an asset is a single-file edit.
 *
 * PUBLIC SAFETY RULE (per user directive 2026-07-08):
 *   Only public-safe, site-ready assets are exposed. Private / internal
 *   / IP-sensitive items (from Drive `09_PRIVATE_IP_AND_INTERNALS` etc.)
 *   are excluded — never linked, never listed. If a doc cannot safely
 *   be public, it does not appear here.
 *
 * ASSET RESOLUTION:
 *   - `localHref` present → served from our own /public tree via the
 *     in-app viewer.
 *   - `driveId` only     → opens on Google Drive in a new tab. Drive
 *     enforces its own share permissions; we do not proxy contents.
 *
 * NO DEAD LINKS: every entry here resolves to a real, reachable asset.
 */

import type { BayId } from "./content";
import { OFFICIAL_CERTIFICATIONS, driveViewUrl } from "./officialCertifications";

export type AssetKind =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "html"
  | "doc"
  | "text"
  | "markdown"
  | "link";

export type CategoryAction =
  | "open-vault"
  | "request-briefing"
  | "open-credentials-gallery";

export interface Asset {
  id: string;
  title: string;
  kind: AssetKind;
  /** Served locally by our site — takes precedence over driveId. */
  localHref?: string;
  /** Google Drive file id. Used when no localHref is present. */
  driveId?: string;
  meta?: string;
  description?: string;
  featured?: boolean;
  /** Optional thumbnail — small preview image path or url. */
  thumb?: string;
}

export interface Category {
  id: string;
  label: string;
  /** Icon key — see CategoryIcons.tsx. */
  icon: string;
  blurb?: string;
  /**
   * Direct action, if this category is a control rather than a
   * collection (e.g. Request Briefing → opens the contact form).
   */
  action?: CategoryAction;
  assets?: Asset[];
}

export interface BayContent {
  bay: BayId;
  categories: Category[];
}

// Resolve the URL that the asset viewer / new-tab opener should use.
export const resolveAssetHref = (a: Asset): string => {
  if (a.localHref) return a.localHref;
  if (a.driveId) return driveViewUrl(a.driveId);
  return "#";
};

export const isLocal = (a: Asset) => Boolean(a.localHref);

// ----------------------------------------------------------------------
// BAY 01 — MISSION BRIEF · THE FOUNDER / BOSS
// ----------------------------------------------------------------------
const missionBrief: BayContent = {
  bay: "mission",
  categories: [
    {
      id: "founder-bio",
      label: "Founder Bio",
      icon: "user",
      blurb: "Executive bio, doctrine, and posture.",
      assets: [
        {
          id: "bio-master-directive",
          title: "AI Base³ Master Directive",
          kind: "pdf",
          driveId: "1u_YMO85Gn3R3aNWCL2KtOmBkZLgKNlOb",
          meta: "Doctrine · v0.1",
          featured: true,
        },
        {
          id: "bio-operating-brief",
          title: "AI Base³ Operating Brief",
          kind: "pdf",
          driveId: "1NQIgzAUvwl7w-K0KrH6Ck3Tryn-lpDBw",
          meta: "Founder Brief",
        },
        {
          id: "bio-brand-philosophy",
          title: "AI Base³ Brand Philosophy",
          kind: "pdf",
          driveId: "1PQ-3WrRdP5otpgT0uVzXd0I5WP0vnTNC",
          meta: "Doctrine",
        },
      ],
    },
    {
      id: "mission-doctrine",
      label: "Mission & Doctrine",
      icon: "flag",
      blurb: "How the company operates and what it will not do.",
      assets: [
        {
          id: "doctrine-success-orthodoxy",
          title: "Operating Doctrine — Success Over Orthodoxy",
          kind: "doc",
          driveId: "1ob4BXD-BDtPfekkuZtyWVe3eKrgDgc4qwWpr1v8GFj0",
          meta: "Google Doc",
          featured: true,
        },
        {
          id: "doctrine-ip-boundaries",
          title: "Intellectual Property Boundaries",
          kind: "pdf",
          driveId: "1If3YdqoL4zshdtAU9fdZ3fMYYn83acBh",
        },
        {
          id: "doctrine-strategic-flex",
          title: "Strategic Flex and Earned Showmanship",
          kind: "pdf",
          driveId: "133GC3UhXH-LHZ5NFSl8Hq0NX-RAU1GfA",
        },
      ],
    },
    {
      id: "dossier",
      label: "Dossier Files",
      icon: "folder",
      blurb: "Executive dossier, cover letters, résumés.",
      assets: [
        {
          id: "dossier-resume-v6",
          title: "Chronological AI Technical Solutions Résumé (v6)",
          kind: "pdf",
          driveId: "1UoFleF2XfsubLeoGt2Cgby1w9HL4Aw6u",
          meta: "Résumé · 2026",
          featured: true,
        },
        {
          id: "dossier-cover-v6",
          title: "AI Implementation Cover Letter (v6)",
          kind: "pdf",
          driveId: "1mdcnmQjvKPpcZR-fseZ3SQ8a6eXstNYl",
          meta: "Cover Letter · 2026",
        },
        {
          id: "dossier-executive-dossier",
          title: "Executive Dossier",
          kind: "html",
          driveId: "1ZrOK0iEDrS6mYOs-L0ziua8SmTCGuC9I",
          meta: "HTML",
        },
        {
          id: "dossier-founder-video",
          title: "Founder — Introduction Video",
          kind: "video",
          driveId: "1A0D7_0vNSWj-dZ-EJcwKVxmBFBy1Cl1Q",
          meta: "MP4 · Category asset",
        },
      ],
    },
    {
      id: "credentials",
      label: "Credentials",
      icon: "certificate",
      blurb: `${OFFICIAL_CERTIFICATIONS.length} verified certificates on file — Google, Google Cloud, Anthropic, OpenAI, and more.`,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: "portfolio",
      blurb: "Master executive portfolio, decks, WWT packet.",
      assets: [
        {
          id: "portfolio-master",
          title: "Master Executive Portfolio",
          kind: "html",
          driveId: "1iF5A5O4PT6r_QcYw5rsB3IkglXlHo0ev",
          meta: "HTML Portfolio",
          featured: true,
        },
        {
          id: "portfolio-presentation",
          title: "AI Base³ Presentation",
          kind: "pdf",
          driveId: "1l7MHF_HAJBJPveNcwus9hPm2Or6--eml",
          meta: "Deck · Secondary",
        },
        {
          id: "portfolio-wwt-brief",
          title: "WWT Executive Brief",
          kind: "pdf",
          driveId: "1tuoY2hdNZ5NauJNw0paJ15QRZrSaZAiK",
          meta: "Customer-facing proof",
        },
        {
          id: "portfolio-wwt-resume",
          title: "WWT Technical Solution Architect — Résumé",
          kind: "pdf",
          driveId: "1UHzPQ2wOGIyUUQIaBu8RWsx6KLY04sTg",
        },
        {
          id: "portfolio-wwt-cover",
          title: "WWT Technical Solution Architect — Cover Letter",
          kind: "pdf",
          driveId: "1qi7H7vb9Slyp--2ip55OvMtxu8gF1qHS",
        },
      ],
    },
    {
      id: "correspondence",
      label: "Correspondence",
      icon: "mail",
      blurb: "Official record correspondence and formation documents.",
      assets: [
        {
          id: "corr-llc-cert",
          title: "State of Missouri — Certificate of Organization",
          kind: "image",
          localHref:
            "/__l5e/assets-v1/placeholder-llc", // resolved by BayShell fallback to imported asset
          meta: "AI Base³ LLC · LC014726944 · April 21, 2026",
          featured: true,
        },
        {
          id: "corr-white-house",
          title: "The White House — Correspondence",
          kind: "image",
          localHref:
            "/__l5e/assets-v1/placeholder-wh", // resolved by BayShell fallback to imported asset
          meta: "Washington · June 13, 2025",
          featured: true,
        },
      ],
    },
    {
      id: "request-briefing",
      label: "Request Briefing",
      icon: "signal",
      blurb: "Open a direct channel to the founder.",
      action: "request-briefing",
    },
  ],
};

// ----------------------------------------------------------------------
// BAY 02 — SINE WAVE · ALGORITHM DATA BANK
// ----------------------------------------------------------------------
const sineWave: BayContent = {
  bay: "technical", // internal BayId preserved
  categories: [
    {
      id: "technical-canon",
      label: "Technical Canon",
      icon: "canon",
      blurb: "The living technical canon — updated as the algorithm evolves.",
      assets: [
        {
          id: "canon-living",
          title: "AI Base³ Living Technical Canon",
          kind: "pdf",
          driveId: "1-GQvu5q0QC3KrelsKcRdYw7wHCjGarab",
          meta: "Canon · v0.1",
          featured: true,
        },
        {
          id: "canon-sinewaiv-2026",
          title: "SINE~WaiV Technical Canon (updated 2026-06-29)",
          kind: "markdown",
          driveId: "1W-Q013f4qa7zX3ypP2kefBT_zqmfuQIV",
          meta: "Latest",
          featured: true,
        },
        {
          id: "canon-claims-register",
          title: "Claims Register",
          kind: "markdown",
          driveId: "1ZipoZ-thWBbqeC6U3v1eOd4xqmxDZl5z",
          meta: "Claim-boundary discipline",
        },
        {
          id: "canon-disclosure-rules",
          title: "Public / Private Disclosure Rules",
          kind: "markdown",
          driveId: "1PF_EBZxCvYpkUYjiTuWNWoX0ceScAAu6",
        },
      ],
    },
    {
      id: "equations-signal",
      label: "Equations & Signal Reasoning",
      icon: "wave",
      blurb: "Algorithmic reasoning, motor-current signal path, FFT sketches.",
      assets: [
        {
          id: "sig-algorithmic",
          title: "SINE~WaiV Algorithmic Motor Diagnostics",
          kind: "pdf",
          driveId: "1-fbpYV2Nt4my1X5SYWTENzYBHolcdxbC",
          meta: "Primary technical paper",
          featured: true,
        },
        {
          id: "sig-defense-framework",
          title: "SINE~WaiV Technical Defense Framework",
          kind: "pdf",
          driveId: "1_Gy1pW2kVtaBPzY2Hp7qIVk--wb8tstO",
          meta: "Framework",
          featured: true,
        },
      ],
    },
    {
      id: "charts-infographics",
      label: "Charts & Infographics",
      icon: "chart",
      blurb: "Visual explainers of the algorithmic pipeline.",
      assets: [
        {
          id: "chart-predictive-infographic",
          title: "Predictive Maintenance Software — Infographic",
          kind: "image",
          driveId: "1ff8Lr6LrhLqFU7PIOqLeZm9GHRi8KM_7",
          meta: "Infographic · Primary",
          featured: true,
        },
      ],
    },
    {
      id: "proposals-grants",
      label: "Proposals & Grants",
      icon: "grant",
      blurb: "NSF SBIR Phase I canonical draft and grant materials.",
      assets: [
        {
          id: "prop-nsf-canonical",
          title: "NSF SBIR Phase I — Full Draft (Canonical)",
          kind: "pdf",
          driveId: "1MuQ-xQ56NmIPXYaj8hYbGb0r7BPek34u",
          meta: "Canonical proposal",
          featured: true,
        },
        {
          id: "prop-sbir-701",
          title: "SBIR Proposal (2026-07-01)",
          kind: "pdf",
          driveId: "1Gfxi-imwF9K3TqI0ON4KxRxDrJqMt_Ph",
          meta: "Working draft",
        },
        {
          id: "prop-support-letter",
          title: "Pilot Support Letter Packet — Steve White",
          kind: "doc",
          driveId: "1cGfGtLPSyZL2l49V1QMNo9LjTQC2u-hXfD24CtM5Mpg",
        },
      ],
    },
    {
      id: "validation",
      label: "Validation Results",
      icon: "check",
      blurb: "Bench and dataset validation artifacts.",
      assets: [
        {
          id: "val-paderborn",
          title: "Official Paderborn Validation Results",
          kind: "pdf",
          driveId: "1zy5MtAdUswIKjqmYCeOYYaKnly6trM5s",
          meta: "Dataset validation",
          featured: true,
        },
        {
          id: "val-femto",
          title: "IEEE PHM 2012 FEMTO Bearing Diagnostic Results",
          kind: "pdf",
          driveId: "1RM55aubaAofzRuboSJu-ohWaC6ARz6Ik",
          meta: "Dataset validation",
        },
        {
          id: "val-evidence-register",
          title: "Evidence Register",
          kind: "markdown",
          driveId: "1mJWVhizUYK6Q4UQjn_-N2Pj8hIQGodRq",
        },
      ],
    },
    {
      id: "demos-media",
      label: "Demos & Media",
      icon: "video",
      blurb: "Algorithmic explainers, walk-throughs, audio brief.",
      assets: [
        {
          id: "demo-134-hours",
          title: "134 Hours of Warning — Deterministic Motor Faults",
          kind: "video",
          driveId: "1GB2Kd0GoYn1roeIGwvvCkCNiecZWbBFu",
          meta: "Video · Featured",
          featured: true,
        },
        {
          id: "demo-decoding",
          title: "Decoding the Invisible Factory",
          kind: "video",
          driveId: "10bU33ubmoJiti04pW_D3tapvxzrQE9RG",
        },
        {
          id: "demo-vfd-noise",
          title: "Extracting Signal from VFD Noise — SINE~WaiV Doctrine",
          kind: "video",
          driveId: "1JumOCFbUAdpjnhxQuiRWqMrZYlMqkTo0",
        },
        {
          id: "demo-predicting-motor",
          title: "Predicting Motor Failure Before It Shakes",
          kind: "audio",
          driveId: "1G9Unz8M69fEQFZRNzNI-ri94yd8JvUY6",
          meta: "Audio brief",
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------
// BAY 03 — CAPABILITY BRIEF · CAPABILITY GALLERY
// ----------------------------------------------------------------------
const capabilityBrief: BayContent = {
  bay: "capability",
  categories: [
    {
      id: "executive-portfolio",
      label: "Executive Portfolio",
      icon: "portfolio",
      blurb: "The polished portfolio system used for outreach.",
      assets: [
        {
          id: "cap-portfolio-system",
          title: "AI Base³ Executive Portfolio System",
          kind: "pdf",
          driveId: "1fsWGnXalCcQzouuTOieEVIpU4ipjcXaH",
          featured: true,
        },
        {
          id: "cap-presentation",
          title: "AI Base³ Presentation",
          kind: "pdf",
          driveId: "1l7MHF_HAJBJPveNcwus9hPm2Or6--eml",
          meta: "Primary deck",
          featured: true,
        },
        {
          id: "cap-10slide-outline",
          title: "SINE~WaiV Nexus v2 — 10-Slide Outline",
          kind: "markdown",
          driveId: "1xLWu5QcV4DRT_I1t6v3tJuhh3T3R_pWy",
        },
      ],
    },
    {
      id: "capability-briefs",
      label: "Capability Briefs",
      icon: "brief",
      blurb: "Customer-facing capability framings.",
      assets: [
        {
          id: "cap-wwt-brief",
          title: "WWT — Executive Brief (Customer-Facing)",
          kind: "pdf",
          driveId: "1tuoY2hdNZ5NauJNw0paJ15QRZrSaZAiK",
          featured: true,
        },
        {
          id: "cap-one-page-brief",
          title: "One-Page Brief Template",
          kind: "markdown",
          driveId: "19t7qnfcZm4X2i1QQTifjqj079o5Tr1sV",
        },
      ],
    },
    {
      id: "systems-architecture",
      label: "Systems & Architecture",
      icon: "grid",
      blurb: "How the Nexus operating shell is put together.",
      assets: [
        {
          id: "arch-nexus-canon",
          title: "Nexus Platform Canon",
          kind: "markdown",
          driveId: "1xOGYdqe7HXnm-tG8I_cQcPzjM_NZUQM_",
          featured: true,
        },
        {
          id: "arch-dashboard-ui",
          title: "Dashboard & UI Language",
          kind: "markdown",
          driveId: "1j3nKdTqph-RyVDhZDgCZyygOL8ru2uCA",
        },
        {
          id: "arch-repository-map",
          title: "AI Base³ Repository Map",
          kind: "pdf",
          driveId: "150i-RluFua-G7jFkSixGyb8AE8rFhpFV",
        },
      ],
    },
    {
      id: "content-factory",
      label: "Content Factory",
      icon: "signal",
      blurb: "Prompt packs and content playbooks for outreach.",
      assets: [
        {
          id: "cf-prompt-pack",
          title: "Content Factory — Prompt Pack",
          kind: "markdown",
          driveId: "1ulAYnu_Bpt82b5oob5iYgYMU86v71RnU",
          featured: true,
        },
        {
          id: "cf-commercial-playbook",
          title: "Commercial Content Playbook",
          kind: "pdf",
          driveId: "10tPMWKsNZytjP421Mz4A_Up0LRNZUxbL",
        },
        {
          id: "cf-content-engine",
          title: "Content Engine",
          kind: "pdf",
          driveId: "1RDyGd0IPhxvtxoLkEh1Dpxpx8p_icif8",
        },
        {
          id: "cf-linkedin-template",
          title: "LinkedIn Post Template",
          kind: "markdown",
          driveId: "1o01gQ-Qbcf3HYdGZhDighoAL6ODtVdyH",
        },
        {
          id: "cf-outreach-email",
          title: "Outreach Email Template",
          kind: "markdown",
          driveId: "1qHEru7tDM_vEuWZulOB9RiG0c0D-jZvs",
        },
      ],
    },
    {
      id: "demonstrations",
      label: "Demonstrations",
      icon: "video",
      blurb: "Selected demonstration videos.",
      assets: [
        {
          id: "demo-mixed-radix",
          title: "SINE~WaiV — Engineering the Mixed-Radix Architecture",
          kind: "video",
          driveId: "1H_geNllo0omV4UpnJhiqLPKgDRaPCCGR",
          featured: true,
        },
        {
          id: "demo-stator-sensor",
          title: "The Stator as a Sensor — One-Shot Diagnostic",
          kind: "video",
          driveId: "1yCeVOV_g7Gknq5myjhTDx_q6lvczpZ3i",
        },
        {
          id: "demo-electrical-signature",
          title: "AI Base³ — Electrical Signature",
          kind: "video",
          driveId: "1Jt7fYmS8LARDHbFgXlCQM--ucZFpZJjs",
        },
      ],
    },
    {
      id: "commercial-pathway",
      label: "Commercial Pathway",
      icon: "flag",
      blurb: "Market and monetization framing.",
      assets: [
        {
          id: "cp-market-monetization",
          title: "Market & Monetization",
          kind: "pdf",
          driveId: "1VjUxqz95JTSqFQLtWLd-NUzFi6LhRE6q",
          featured: true,
        },
        {
          id: "cp-proposal-builder",
          title: "Proposal Builder",
          kind: "pdf",
          driveId: "1laq9cMz55WBQjbPl2wDj3VeW31bmgwdV",
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------
// BAY 04 — OPERATIONS CENTER · COMMAND & CONTROL
// ----------------------------------------------------------------------
const operationsCenter: BayContent = {
  bay: "operations",
  categories: [
    {
      id: "project-status",
      label: "Project Status",
      icon: "signal",
      blurb: "Current program state and active priorities.",
      assets: [
        {
          id: "ops-active-priorities",
          title: "AI Base³ Active Priorities",
          kind: "pdf",
          driveId: "1xEnLYjM5vJMsMgPdBq8ev5WezGiT8IRX",
          featured: true,
        },
        {
          id: "ops-project-status",
          title: "Current Project Status",
          kind: "pdf",
          driveId: "1VG3tqDRTd8A2VuQd5ggggGYTo_zbptj_",
          featured: true,
        },
        {
          id: "ops-time-audit",
          title: "Time Investment — Operational Audit v0.1",
          kind: "pdf",
          driveId: "1LZJ39z2RwhYfeqlxkaX85ZyZyFQAYRqG",
          meta: "Primary here",
        },
      ],
    },
    {
      id: "decision-ledger",
      label: "Decision Ledger",
      icon: "check",
      blurb: "Decisions on record, immutable audit trail.",
      assets: [
        {
          id: "dec-decision-log",
          title: "AI Base³ Decision Log",
          kind: "pdf",
          driveId: "1IiTmNvRwpneOe313WKPLi8URd2HG8_Xw",
          featured: true,
        },
        {
          id: "dec-decision-ledger-editable",
          title: "Decision Log — Editable Source v0.1",
          kind: "doc",
          driveId: "1nrtMTcErPnvcPU0vHy7gWLk8kJc5o1axRP8WgKzeZFY",
        },
        {
          id: "dec-change-management",
          title: "Change Management",
          kind: "pdf",
          driveId: "1tO2xF-Ji6JTa1XG0OXl0vA7PHMxBem2d",
        },
      ],
    },
    {
      id: "evidence-vault",
      label: "Evidence Vault",
      icon: "vault",
      blurb: "Open the full evidence-cards gallery — filtered by claim, bay, audience.",
      action: "open-vault",
    },
    {
      id: "workflow-protocols",
      label: "Workflow & Protocols",
      icon: "grid",
      blurb: "Operating instructions, handoff protocol, analysis pipeline.",
      assets: [
        {
          id: "wf-operating-instructions",
          title: "AI Base³ Operating Instructions",
          kind: "pdf",
          driveId: "10z7npv3QV9biZ1I7XCcGpMMm8siwLqKU",
          featured: true,
        },
        {
          id: "wf-session-init",
          title: "Session Initialization",
          kind: "pdf",
          driveId: "1-nf-9YJCSGKB1PQU9vNUkcf1KOqhxDt_",
        },
        {
          id: "wf-handoff-protocol",
          title: "AI Handoff Protocol",
          kind: "pdf",
          driveId: "1H_96k-wE9C1LvRoR678fSF8F2iWJGpRF",
        },
        {
          id: "wf-analysis-pipeline",
          title: "Analysis Pipeline",
          kind: "pdf",
          driveId: "1B9jbnavYP-vA18SUZMO9OAYPS1agEjyo",
        },
        {
          id: "wf-experiment-protocol",
          title: "Standard Experiment Protocol",
          kind: "pdf",
          driveId: "1NVkZ-QRK0K8j4f_CIcp54IaZHDpluMFy",
        },
      ],
    },
    {
      id: "governance-ip",
      label: "Governance & IP",
      icon: "shield",
      blurb: "IP boundaries, reproducibility standard, knowledge lifecycle.",
      assets: [
        {
          id: "gov-ip-boundaries",
          title: "Intellectual Property Boundaries",
          kind: "pdf",
          driveId: "1If3YdqoL4zshdtAU9fdZ3fMYYn83acBh",
          featured: true,
        },
        {
          id: "gov-reproducibility",
          title: "Reproducibility Standard",
          kind: "pdf",
          driveId: "10P-q_5BDUeT0OMIdVvuUw4zQAAZ8imzD",
        },
        {
          id: "gov-knowledge-lifecycle",
          title: "Knowledge Lifecycle",
          kind: "pdf",
          driveId: "11KUdcSzKZnUZn2oKm6Ox95L7vz0tkCpf",
        },
      ],
    },
    {
      id: "live-control-layer",
      label: "Live Control Layer",
      icon: "canon",
      blurb: "Live control-layer addendum and OS patches.",
      assets: [
        {
          id: "lcl-addendum",
          title: "Nexus Brand OS — v0.1 Live Control Layer Addendum",
          kind: "doc",
          driveId: "1ucQoZBMDO9yCUZo9qyfS0ajWi2kv3CNXju6vTDsRMlA",
          featured: true,
        },
        {
          id: "lcl-os-patch-001",
          title: "OS Patch 001 — Dataset Boundary Control",
          kind: "doc",
          driveId: "13GeB5y4y37m7QXwj-5lsVXEcyczmZgr1MtvKsdrc3oE",
        },
      ],
    },
  ],
};

export const BAY_CONTENT: Record<BayId, BayContent> = {
  mission: missionBrief,
  technical: sineWave,
  capability: capabilityBrief,
  operations: operationsCenter,
};
