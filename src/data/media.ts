// Registry of all installed media the Rotunda Viewing Console can browse.
// Add new items here and they appear in the console automatically.

export type MediaKind = "document" | "image" | "video" | "audio";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  title: string;
  category: string;      // Grouping label within a kind (e.g. "Credentials", "Evidence")
  url: string;           // Public URL (served from /public or CDN)
  filename?: string;     // Download filename override
  description?: string;
}

const pdf = (id: string, title: string, category: string, url: string): MediaItem => ({
  id, kind: "document", title, category, url, filename: url.split("/").pop(),
});
const img = (id: string, title: string, category: string, url: string): MediaItem => ({
  id, kind: "image", title, category, url, filename: url.split("/").pop(),
});
const vid = (id: string, title: string, category: string, url: string): MediaItem => ({
  id, kind: "video", title, category, url, filename: url.split("/").pop(),
});

const cert = (slug: string, label: string) =>
  img(`cert-${slug}`, label, "Certifications", `/media/certifications/${slug}.jpg`);

export const MEDIA_LIBRARY: MediaItem[] = [
  // ─── Documents ──────────────────────────────────────────────────────────
  pdf("prop-nsf-sbir-p1", "NSF SBIR Phase I — Canonical", "Proposals", "/proposals/nsf-sbir-phase1-canonical.pdf"),
  pdf("prop-sbir-2026",   "SBIR Proposal · 2026-07-01",   "Proposals", "/proposals/sbir-proposal-2026-07-01.pdf"),

  pdf("ev-ieee-phm",      "IEEE PHM · Femto Bearing Results", "Evidence", "/evidence/ieee-phm-femto-bearing-results.pdf"),
  pdf("ev-paderborn",     "Paderborn Validation Results",     "Evidence", "/evidence/paderborn-validation-results.pdf"),

  pdf("cr-anthropic-collab",  "Anthropic Claude — Collaboration", "Credentials", "/credentials/anthropic-claude-collaboration.pdf"),
  pdf("cr-anthropic-master",  "Anthropic Claude — Master",         "Credentials", "/credentials/anthropic-claude-master.pdf"),
  pdf("cr-coursera-3bwz",     "Coursera 3BWZ2J6K2JH7",             "Credentials", "/credentials/coursera-3bwz2j6k2jh7.pdf"),
  pdf("cr-coursiv-cgpt-deep", "Coursiv — ChatGPT Deep Dive",       "Credentials", "/credentials/coursiv-chatgpt-deep-dive.pdf"),
  pdf("cr-coursiv-cgpt",      "Coursiv — ChatGPT",                 "Credentials", "/credentials/coursiv-chatgpt.pdf"),
  pdf("cr-coursiv-claude",    "Coursiv — Claude",                  "Credentials", "/credentials/coursiv-claude.pdf"),
  pdf("cr-coursiv-gemini",    "Coursiv — Gemini",                  "Credentials", "/credentials/coursiv-gemini.pdf"),
  pdf("cr-coursiv-jasper",    "Coursiv — Jasper",                  "Credentials", "/credentials/coursiv-jasper.pdf"),
  pdf("cr-coursiv-lovable",   "Coursiv — Lovable",                 "Credentials", "/credentials/coursiv-lovable.pdf"),
  pdf("cr-coursiv-mj",        "Coursiv — Midjourney",              "Credentials", "/credentials/coursiv-midjourney.pdf"),
  pdf("cr-coursiv-pplx",      "Coursiv — Perplexity",              "Credentials", "/credentials/coursiv-perplexity.pdf"),
  pdf("cr-coursiv-sd",        "Coursiv — Stable Diffusion",        "Credentials", "/credentials/coursiv-stable-diffusion.pdf"),
  pdf("cr-genai-path",        "Gen-AI Learning Path",              "Credentials", "/credentials/gen-ai-learning-path.pdf"),
  pdf("cr-g-app-building",    "Google AI · App Building",          "Credentials", "/credentials/google-ai-app-building.pdf"),
  pdf("cr-g-brainstorm",      "Google AI · Brainstorming & Planning", "Credentials", "/credentials/google-ai-brainstorming-planning.pdf"),
  pdf("cr-g-comms",           "Google AI · Communication & Writing",  "Credentials", "/credentials/google-ai-communication-writing.pdf"),
  pdf("cr-g-creative",        "Google AI · Creative Expert",       "Credentials", "/credentials/google-ai-creative-expert.pdf"),
  pdf("cr-g-essentials",      "Google AI · Essentials",            "Credentials", "/credentials/google-ai-essentials.pdf"),
  pdf("cr-g-everyday",        "Google AI · Everyday Work Tasks",   "Credentials", "/credentials/google-ai-everyday-work-tasks.pdf"),
  pdf("cr-g-fundamentals",    "Google AI · Fundamentals",          "Credentials", "/credentials/google-ai-fundamentals.pdf"),
  pdf("cr-g-pro",             "Google AI · Pro",                   "Credentials", "/credentials/google-ai-pro.pdf"),
  pdf("cr-g-research",        "Google AI · Research",              "Credentials", "/credentials/google-ai-research.pdf"),
  pdf("cr-g-beyond",          "Google · Beyond Chatbots",          "Credentials", "/credentials/google-beyond-chatbots.pdf"),
  pdf("cr-g-content",         "Google · Content Creation",         "Credentials", "/credentials/google-content-creation.pdf"),
  pdf("cr-g-dap",             "Google · Data Analysis & Presentation Building", "Credentials", "/credentials/google-data-analysis-presentation-building.pdf"),
  pdf("cr-g-data",            "Google · Data Analysis",            "Credentials", "/credentials/google-data-analysis.pdf"),
  pdf("cr-g-agents",          "Google Gen-AI · Agents for Orgs",   "Credentials", "/credentials/google-gen-ai-agents-organization.pdf"),
  pdf("cr-g-apps4work",       "Google Gen-AI · Apps for Work",     "Credentials", "/credentials/google-gen-ai-apps-for-work.pdf"),
  pdf("cr-g-nav",             "Google Gen-AI · Navigating",        "Credentials", "/credentials/google-gen-ai-navigating.pdf"),
  pdf("cr-g-genai",           "Google · Gen-AI",                   "Credentials", "/credentials/google-gen-ai.pdf"),
  pdf("cr-g-llms",            "Google · Intro to LLMs",            "Credentials", "/credentials/google-intro-llms.pdf"),
  pdf("cr-g-prompt-m",        "Google · Prompt Master",            "Credentials", "/credentials/google-prompt-master.pdf"),
  pdf("cr-g-prompting-m",     "Google · Prompting Master",         "Credentials", "/credentials/google-prompting-master.pdf"),
  pdf("cr-g-resp-1",          "Google · Responsible AI I",         "Credentials", "/credentials/google-responsible-ai-1.pdf"),
  pdf("cr-g-resp-2",          "Google · Responsible AI II",        "Credentials", "/credentials/google-responsible-ai-2.pdf"),
  pdf("cr-g-transfer",        "Google · Transferable Skills",      "Credentials", "/credentials/google-transferable-skills.pdf"),
  pdf("cr-g-unlock",          "Google · Foundational Concepts",    "Credentials", "/credentials/google-unlock-foundational-concepts.pdf"),
  pdf("cr-g-ux",              "Google · UX Design",                "Credentials", "/credentials/google-ux-design.pdf"),

  // ─── Videos ─────────────────────────────────────────────────────────────
  vid("vid-intro-load", "Nexus Intro · Load Sequence", "Sequences", "/media/intro-load.mp4"),

  // ─── Images ─────────────────────────────────────────────────────────────
  img("hero-rotunda",      "Rotunda · Panoramic Hero",         "Bay Heroes", "/__l5e/assets-v1/681bea02-2f61-49a6-be5c-26fa9e58d577/rotunda-hero.png"),
  img("hero-mission",      "Mission Bay · N/NE Sightline",     "Bay Heroes", "/founder-office.jpg"),
  img("hero-technical",    "Technical Bay · E Sightline",      "Bay Heroes", "/media/technical-landing.jpg"),
  img("hero-capability",   "Capability Bay · SE Sightline",    "Bay Heroes", "/media/capability-landing.jpg"),
  img("hero-operations",   "Operations Bay · SW Sightline",    "Bay Heroes", "/media/operations-landing.jpg"),
  img("hero-vault",        "Evidence Vault · Landing",         "Bay Heroes", "/media/vault-landing.jpg"),

  // Certifications (jpg)
  cert("Anthropic_Claude_Collaboration",       "Anthropic Claude · Collaboration"),
  cert("Anthropic_Claude_Master",              "Anthropic Claude · Master"),
  cert("ChatGTP_Deepdive_Master",              "ChatGPT · Deep Dive Master"),
  cert("ChatGTP_Master",                       "ChatGPT · Master"),
  cert("Claude_Master",                        "Claude · Master"),
  cert("Coursera_3BWZ2J6K2JH7",                "Coursera · 3BWZ2J6K2JH7"),
  cert("Gemini_Master",                        "Gemini · Master"),
  cert("Gen_AI_Learning_Path",                 "Gen-AI Learning Path"),
  cert("Google_AI_App_Building",               "Google AI · App Building"),
  cert("Google_AI_Brainstorming_&_Planning",   "Google AI · Brainstorming & Planning"),
  cert("Google_AI_Communication_&_Writing",    "Google AI · Communication & Writing"),
  cert("Google_AI_Creative_Expert_",           "Google AI · Creative Expert"),
  cert("Google_AI_Essentials",                 "Google AI · Essentials"),
  cert("Google_AI_Everyday_Work_Tasks",        "Google AI · Everyday Work Tasks"),
  cert("Google_AI_Fundamentals",               "Google AI · Fundamentals"),
  cert("Google_AI_Pro",                        "Google AI · Pro"),
  cert("Google_AI_Research",                   "Google AI · Research"),
  cert("Google_Beyond_Chatbots",               "Google · Beyond Chatbots"),
  cert("Google_Content_Creation",              "Google · Content Creation"),
  cert("Google_Data_Analysis",                 "Google · Data Analysis"),
  cert("Google_Data_Analysis_Presentation_Building", "Google · Data Analysis & Presentation Building"),
  cert("Google_Gen_AI",                        "Google · Gen-AI"),
  cert("Google_Gen_AI_Agents_Organization",    "Google Gen-AI · Agents for Orgs"),
  cert("Google_Gen_AI_Apps_4Work",             "Google Gen-AI · Apps for Work"),
  cert("Google_Gen_AI_Navigating",             "Google Gen-AI · Navigating"),
  cert("Google_LLMs",                          "Google · LLMs"),
  cert("Google_Prompt_Master",                 "Google · Prompt Master"),
  cert("Google_Prompting_Master",              "Google · Prompting Master"),
  cert("Google_Responsible_AI_1",              "Google · Responsible AI I"),
  cert("Google_Responsible_AI_II",             "Google · Responsible AI II"),
  cert("Google_Transfer_Skills",               "Google · Transferable Skills"),
  cert("Google_UX_Design",                     "Google · UX Design"),
  cert("Google_Unlocking_Concepts",            "Google · Foundational Concepts"),
  cert("Jasper_Master",                        "Jasper · Master"),
  cert("Lovable_Master",                       "Lovable · Master"),
  cert("Midjourney_Master",                    "Midjourney · Master"),
  cert("Perplexity_Master",                    "Perplexity · Master"),
  cert("StableDiffusion_Master",               "Stable Diffusion · Master"),
];

export const MEDIA_KIND_LABEL: Record<MediaKind, string> = {
  document: "Documents",
  image:    "Images",
  video:    "Videos",
  audio:    "Audio",
};

export const MEDIA_KIND_ORDER: MediaKind[] = ["document", "image", "video", "audio"];
