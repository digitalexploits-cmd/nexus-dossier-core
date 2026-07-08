import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BRAND,
  CORE_STRENGTHS,
  CURRENT_WORK,
  FOUNDER_BIO,
  FOUNDER_SUMMARY,
  RESUME_AVAILABLE,
  RESUME_URL,
  TECHNICAL_FOCUS,
} from "@/data/content";
import { DocumentShelf } from "./DocumentShelf";
import { CredentialsDialog } from "./CredentialsDialog";
import { OfficialCertificationsGallery } from "./OfficialCertificationsGallery";
import llcCert from "@/assets/ai-base3-llc-certificate.jpg.asset.json";
import whiteHouseLetter from "@/assets/white-house-letter.jpg.asset.json";

interface Props {
  onOpenVault: () => void;
  onContact: () => void;
}

// Reusable dark-glass panel — reads like a wall display inside the office
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative rounded-sm border border-[rgba(130,205,255,0.42)] bg-[rgba(30,55,88,0.78)] backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.60),inset_0_1px_0_rgba(255,255,255,0.12),0_0_56px_rgba(90,180,255,0.22)] ${className}`}
  >
    {children}
  </div>
);

// Minimal glass badge / compact card
const CompactCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative rounded-sm border border-[rgba(130,205,255,0.48)] bg-[rgba(34,58,92,0.85)] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-500 ease-out ${className}`}
  >
    {children}
  </div>
);

export const MissionBrief = ({ onOpenVault, onContact }: Props) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [certsOpen, setCertsOpen] = useState(false);
  const dossierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.src = "/founder-office.jpg";
    const done = () => setBgLoaded(true);
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.onload = done;
      img.onerror = done; // fallback gradient stays visible
    }
  }, []);

  return (
    <div className="relative">
      {/* ============ IMMERSIVE OFFICE STAGE ============ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#05070a]">
        {/* Fallback dark gradient — always painted, visible if image fails/slow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,#111d2e_0%,#080c14_70%)]" />
        <img
          src="/founder-office.jpg"
          alt="Founder office — Mission Brief environment"
          className={`absolute inset-0 w-full h-full object-cover brightness-[1.35] contrast-[1.04] saturate-[1.12] transition-opacity duration-700 ease-out ${bgLoaded ? "opacity-100" : "opacity-0"}`}
          draggable={false}
          loading="eager"
          decoding="async"
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgLoaded(true)}
        />
        {/* Dim the exterior (upper window band) — dusk outside */}
        <div className="absolute inset-x-0 top-0 h-[55%] pointer-events-none bg-[linear-gradient(180deg,rgba(4,8,16,0.55)_0%,rgba(4,8,16,0.28)_60%,transparent_100%)]" />
        {/* Interior accent lighting — warm key + cool rim */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_18%_60%,rgba(255,195,130,0.28)_0%,transparent_48%)]" />
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_82%_82%,rgba(110,190,255,0.24)_0%,transparent_52%)]" />
        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-background/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background/8 to-transparent" />

        {/* HUD */}
        <div className="absolute inset-x-0 top-14 z-20">
          <div className="container flex items-center justify-between mono text-[0.68rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
            <div className="flex items-center gap-3">
              <span className="text-[#4db7ff]">NEXUS</span>
              <span className="text-[#8fa3b8]">/</span>
              <span>BAY 01 · MISSION BRIEF · FOUNDER OFFICE</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="status-dot status-live" />
              <span>ON RECORD</span>
            </div>
          </div>
        </div>

        {/* Wall-display overlay — compact briefing card, expands on demand */}
        <div className="relative container h-screen flex items-end justify-end pt-24 pb-16">
          {!expanded ? (
            // Collapsed: ~1/3 of original size, transparent — reads like an HUD label on the wall.
            <div key="collapsed" className="anim-swap-in bay-hover-glow w-[62%] md:w-[22%] lg:w-[18%] p-3 rounded-sm border border-[hsl(var(--interactive)/0.45)] bg-transparent backdrop-blur-[2px] shadow-[0_0_24px_hsl(var(--interactive)/0.18)]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[hsl(var(--interactive))]">NEXUS</div>
                  <div className="mono text-[0.5rem] tracking-[0.28em] uppercase text-[#8fa3b8] mt-0.5">
                    MISSION BRIEF
                  </div>
                </div>
                <div className="mono text-[0.45rem] tracking-[0.24em] text-[#8fa3b8]">///-HC-0</div>
              </div>
              <div className="space-y-2">
                <h1 className="text-[0.85rem] md:text-[0.9rem] font-semibold tracking-tight leading-tight text-[#eef6ff]">
                  Divide the wave.<br/>Preserve the machine.
                </h1>
                <div className="mono text-[0.5rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                  {BRAND.founder}
                </div>
                <Button
                  onClick={() => {
                    setExpanded(true);
                    setTimeout(() => dossierRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                  }}
                  className="bay-hover-glow mono tracking-widest text-[0.55rem] h-7 w-full px-2"
                >
                  OPEN DOSSIER →
                </Button>
              </div>
            </div>
          ) : (
            <CompactCard key="expanded" className="w-full md:w-[62%] lg:w-[58%] p-5 md:p-6 anim-swap-in">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-[#4db7ff]">NEXUS</div>
                  <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8] mt-0.5">
                    MISSION BRIEF / FOUNDER DOSSIER
                  </div>
                </div>
                <div className="mono text-[0.55rem] tracking-[0.24em] text-[#8fa3b8]">///-HC-0</div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mission cell */}
                  <div className="border border-[rgba(130,205,255,0.38)] bg-[linear-gradient(180deg,rgba(36,62,98,0.78),rgba(22,40,66,0.86))] p-4">
                    <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">OUR MISSION</div>
                    <h1 className="text-2xl font-semibold tracking-tight leading-tight text-[#eef6ff]">
                      Divide the wave.<br/>Preserve the machine.
                    </h1>
                    <p className="text-sm text-[#c8d4e2] mt-3 leading-relaxed">
                      Deliver physics-first, evidence-labeled inspection to industrial reliability teams
                      — without overclaim.
                    </p>
                    <div className="mt-4 mono text-[0.65rem] tracking-[0.24em] uppercase text-[#c8d4e2]">
                      {BRAND.founder}
                    </div>
                    <div className="mono text-[0.6rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                      FOUNDER · {BRAND.company}
                    </div>
                  </div>

                  {/* Founder overview cell */}
                  <div className="border border-[rgba(130,205,255,0.38)] bg-[linear-gradient(180deg,rgba(36,62,98,0.78),rgba(22,40,66,0.86))] p-4">
                    <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">FOUNDER OVERVIEW</div>
                    <div className="text-sm text-[#eef6ff] space-y-1">
                      <div>{BRAND.founder}</div>
                      <div className="text-[#c8d4e2]">{FOUNDER_SUMMARY.title}</div>
                      <div className="text-[#c8d4e2]">{BRAND.company}</div>
                    </div>
                    <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mt-4 mb-2">DOCTRINE</div>
                    <ul className="text-xs text-[#c8d4e2] space-y-1">
                      <li>· Success over orthodoxy</li>
                      <li>· Physics first</li>
                      <li>· Evidence before adjectives</li>
                      <li>· Every deliverable increases implementation readiness</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={onContact} className="mono tracking-widest text-[0.65rem] h-9">
                    REQUEST BRIEFING
                  </Button>
                  {RESUME_AVAILABLE && (
                    <Button asChild variant="outline" className="mono tracking-widest text-[0.65rem] h-9">
                      <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-[0.65rem] h-9">
                    EVIDENCE VAULT →
                  </Button>
                </div>
              </div>
            </CompactCard>
          )}
        </div>
      </section>


      {/* ============ DOSSIER DETAIL (hidden until opened) ============ */}
      {expanded && (
        <div ref={dossierRef} className="relative bg-background animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Bio + summary */}
          <section className="container pt-16 pb-10">
            <div className="grid md:grid-cols-[1fr_320px] gap-8">
              <Glass className="p-6 md:p-8">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">01 / EXECUTIVE BIO</div>
                <p className="text-[#eef6ff] leading-relaxed">{FOUNDER_BIO}</p>
                <div className="rule my-5" />
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">02 / BUILDER POSTURE</div>
                <p className="text-[#c8d4e2] leading-relaxed text-sm">{FOUNDER_SUMMARY.summary}</p>
              </Glass>
              <Glass className="p-5 h-fit">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-3">TECHNICAL FOCUS</div>
                <ul className="space-y-2">
                  {TECHNICAL_FOCUS.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-[#c8d4e2]">
                      <span className="status-dot status-research mt-1.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Glass>
            </div>
          </section>

          {/* Featured official documents — LLC certificate + White House correspondence */}
          <section className="container py-10">
            <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[hsl(var(--interactive))] mb-3">
              02B / OFFICIAL RECORD · FEATURED
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  src: llcCert.url,
                  title: "State of Missouri — Certificate of Organization",
                  meta: "AI Base³ LLC · LC014726944 · Effective April 21, 2026",
                  alt: "State of Missouri Certificate of Organization for AI Base³ LLC",
                },
                {
                  src: whiteHouseLetter.url,
                  title: "The White House — Correspondence",
                  meta: "Washington · June 13, 2025 · Addressed to Mr. McGee",
                  alt: "Letter from The White House addressed to Mr. McGee, dated June 13, 2025",
                },
              ].map((doc) => (
                <a
                  key={doc.title}
                  href={doc.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-interactive
                  className="group relative block rounded-sm border border-[rgba(130,205,255,0.42)] bg-[rgba(11,18,32,0.85)] overflow-hidden transition-all duration-300 hover:border-[hsl(var(--interactive))] hover:shadow-[0_0_0_1px_hsl(var(--interactive)/0.55),0_20px_50px_-20px_hsl(var(--interactive)/0.35)]"
                  aria-label={`Open ${doc.title}`}
                >
                  <div className="relative w-full bg-[#050810] flex items-center justify-center p-4 md:p-6">
                    <img
                      src={doc.src}
                      alt={doc.alt}
                      loading="lazy"
                      decoding="async"
                      className="max-h-[520px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-4 border-t border-[rgba(130,205,255,0.28)]">
                    <div className="text-sm text-[#eef6ff] leading-snug">{doc.title}</div>
                    <div className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8] mt-1">
                      {doc.meta}
                    </div>
                    <div className="mono text-[0.55rem] tracking-[0.24em] uppercase mt-2 text-[#8fa3b8] group-hover:text-[hsl(var(--interactive))]">
                      OPEN FULL SIZE →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>



          {/* Core strengths — compact dossier chips, not big cards */}
          <section className="container py-10">
            <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-3">03 / CORE STRENGTHS</div>
            <Glass className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {CORE_STRENGTHS.map((s, i) => (
                  <div key={s} className="border border-[rgba(130,205,255,0.38)] bg-[linear-gradient(180deg,rgba(36,62,98,0.74),rgba(22,40,66,0.84))] px-3 py-2">
                    <div className="mono text-[0.55rem] tracking-[0.28em] text-[#4db7ff]">S{String(i + 1).padStart(2, "0")}</div>
                    <div className="text-xs text-[#c8d4e2] mt-1">{s}</div>
                  </div>
                ))}
              </div>
            </Glass>
          </section>

          {/* Current work */}
          <section className="container py-10">
            <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-3">04 / ACTIVE PROGRAMS</div>
            <div className="grid md:grid-cols-3 gap-3">
              {CURRENT_WORK.map((w, i) => (
                <Glass key={w.org} className="p-5">
                  <div className="mono text-[0.6rem] tracking-[0.24em] text-[#4db7ff]">PROG-{i + 1}</div>
                  <div className="text-base font-semibold mt-1 text-[#eef6ff]">{w.org}</div>
                  <div className="text-xs text-[#8fa3b8]">{w.role}</div>
                  <div className="rule my-3" />
                  <p className="text-sm text-[#c8d4e2]">{w.detail}</p>
                </Glass>
              ))}
            </div>
          </section>

          <CredentialsDialog open={certsOpen} onOpenChange={setCertsOpen} />
          <DocumentShelf
            bay="mission"
            eyebrow="06 / FILES ON RECORD"
            title="Dossier Files"
            extras={
              <button
                type="button"
                onClick={() => setCertsOpen(true)}
                className="group relative text-left rounded-sm border border-[rgba(130,205,255,0.42)] bg-[linear-gradient(180deg,rgba(38,64,100,0.80),rgba(22,40,66,0.88))] backdrop-blur-md p-4 hover:border-[rgba(130,205,255,0.65)] transition-colors flex flex-col justify-between min-h-[150px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.35)] text-[#4db7ff]">
                      CERTIFICATES
                    </Badge>
                    <span className="mono text-[0.6rem] tracking-[0.24em] text-[#8fa3b8]">BUNDLE</span>
                  </div>
                  <div className="mt-2 text-sm font-medium leading-snug text-[#eef6ff]">Credentials & Certifications</div>
                  <div className="text-xs text-[#8fa3b8] mt-1 line-clamp-2">Verified credentials and official certification gallery.</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                    <span className="mr-2 text-[#4db7ff]">◫</span>BUNDLE
                  </span>
                  <span className="mono text-[0.6rem] text-[#4db7ff] group-hover:text-[#7dd3ff]">OPEN →</span>
                </div>
              </button>
            }
          />



          {/* Engage strip */}
          <section className="container py-16">
            <Glass className="p-8 md:p-10 overflow-hidden">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
                <div className="space-y-2">
                  <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff]">06 / ENGAGE</div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#eef6ff]">
                    Bring the machine into the room.
                  </h3>
                  <p className="text-[#8fa3b8] max-w-xl text-sm">
                    Briefings scheduled directly through the founder. Every artifact shared is labeled by
                    claim boundary and evidence status.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onContact} className="mono tracking-widest text-[0.65rem] h-9">REQUEST BRIEFING</Button>
                  {RESUME_AVAILABLE && (
                    <Button asChild variant="outline" className="mono tracking-widest text-[0.65rem] h-9">
                      <a href={RESUME_URL} download>DOWNLOAD RESUME</a>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={onOpenVault} className="mono tracking-widest text-[0.65rem] h-9">
                    EVIDENCE VAULT
                  </Button>
                </div>
              </div>
            </Glass>
          </section>
        </div>
      )}
    </div>
  );
};
