import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rotunda } from "@/components/nexus/Rotunda";
import { MissionBrief } from "@/components/nexus/MissionBrief";
import { BayDetail } from "@/components/nexus/BayDetail";
import { EvidenceVault } from "@/components/nexus/EvidenceVault";
import { Contact } from "@/components/nexus/Contact";
import { TopBar, BottomBar } from "@/components/nexus/Chrome";
import { IntroOverlay } from "@/components/nexus/IntroOverlay";
import { BayTransition, type TransitionKind } from "@/components/nexus/BayTransition";
import { VideoTransition } from "@/components/nexus/VideoTransition";
import { Button } from "@/components/ui/button";
import { BAYS, type BayId } from "@/data/content";
import { audio, prefersReducedMotion } from "@/lib/audio";

// Add a file to /public/media/ and flip the entry from null to its path
// to give a bay a cinematic video transition. Null → CSS wipe fallback.
const TRANSITION_VIDEOS: Record<BayId, string | null> = {
  mission: "/media/transition-mission.mp4",
  technical: "/media/transition-technical.mp4",
  capability: "/media/transition-capability.mp4",
  operations: "/media/transition-operations.mp4",
};

type View = "home" | BayId;

const VIEW_HASH: Record<View, string> = {
  home: "",
  mission: "#mission",
  technical: "#technical",
  capability: "#capability",
  operations: "#operations",
};

const hashToView = (h: string): View => {
  const clean = h.replace("#", "");
  if (["mission", "technical", "capability", "operations"].includes(clean)) return clean as View;
  return "home";
};

const bayLabel = (id: BayId) => BAYS.find((b) => b.id === id)?.title ?? id.toUpperCase();

const Index = () => {
  // Hash is the single source of truth for `view`. Any state change goes
  // through commitView() → writes hash → hashchange listener syncs React state.
  const [view, setView] = useState<View>(() => hashToView(window.location.hash));
  const [vaultOpen, setVaultOpen] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem("nexus:intro") === "done"; } catch { return false; }
  });
  const [transition, setTransition] = useState<{ label: string; kind: TransitionKind } | null>(null);
  const [videoTransition, setVideoTransition] = useState<{ src: string; next: View } | null>(null);
  const pendingRef = useRef<View | null>(null);

  const syncFromHash = useCallback(() => {
    const h = window.location.hash;
    if (h === "#vault") { setVaultOpen(true); return; }
    const next = hashToView(h);
    setView((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    const onHash = () => {
      syncFromHash();
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    if (window.location.hash === "#vault") setVaultOpen(true);
    return () => window.removeEventListener("hashchange", onHash);
  }, [syncFromHash]);

  const commitView = useCallback((next: View) => {
    const targetHash = VIEW_HASH[next];
    // Update React state first so the destination is rendered even before
    // the hashchange event fires. hashchange will noop-sync afterward.
    setView(next);
    if (window.location.hash !== targetHash) {
      // Empty hash for home — avoid a literal "#" trailing char.
      if (targetHash === "") {
        const url = window.location.pathname + window.location.search;
        window.history.pushState(null, "", url);
      } else {
        window.location.hash = targetHash;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const runTransition = useCallback((label: string, kind: TransitionKind, next: View) => {
    if (prefersReducedMotion()) { commitView(next); return; }
    pendingRef.current = next;
    setTransition({ label, kind });
    // Swap views mid-transition so the reveal lands on the new view
    setTimeout(() => {
      if (pendingRef.current !== null) {
        commitView(pendingRef.current);
        pendingRef.current = null;
      }
    }, 600);
  }, [commitView]);

  const goHome = useCallback(() => {
    if (view === "home") return;
    audio.blip(520);
    runTransition("ROTUNDA", "retreat", "home");
  }, [view, runTransition]);

  const goBay = useCallback((id: BayId) => {
    if (view === id) return;
    audio.blip(880);
    const videoSrc = TRANSITION_VIDEOS[id];
    if (videoSrc && !prefersReducedMotion()) {
      // Commit the destination view immediately — the video overlay is
      // cosmetic. When it finishes (or errors/stalls/times out), unmounting
      // it reveals the already-rendered destination.
      commitView(id);
      setVideoTransition({ src: videoSrc, next: id });
      return;
    }
    runTransition(bayLabel(id), "advance", id);
  }, [view, runTransition, commitView]);


  const openVault = useCallback(() => { audio.blip(740); setVaultOpen(true); }, []);
  const goContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const viewLabel = useMemo(() => (view === "home" ? "ROTUNDA" : view.toUpperCase()), [view]);

  const handleIntroComplete = useCallback(() => {
    try { sessionStorage.setItem("nexus:intro", "done"); } catch { /* ignore */ }
    setIntroDone(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar view={viewLabel} />

      {view !== "home" && (
        <div className="fixed top-12 inset-x-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
          <div className="container h-10 flex items-center justify-between">
            <button onClick={goHome} className="mono text-xs tracking-widest text-muted-foreground hover:text-foreground">
              ← RETURN TO ROTUNDA
            </button>
            <div className="hidden md:flex gap-2">
              {(["mission", "technical", "capability", "operations"] as BayId[]).map((b, i) => (
                <button
                  key={b}
                  onClick={() => goBay(b)}
                  className={`bay-hover-glow mono text-[0.65rem] tracking-widest px-2 py-1 border ${
                    view === b ? "border-primary text-primary bg-primary/10" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {`0${i + 1}`} · {b.toUpperCase()}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={openVault} className="mono text-[0.65rem] tracking-widest">
              EVIDENCE VAULT
            </Button>
          </div>
        </div>
      )}

      <main className={view !== "home" ? "pt-10" : ""}>
        {view === "home" && <Rotunda onSelect={goBay} onOpenVault={openVault} />}
        {view !== "home" && (
          <div key={view} className="anim-bay-enter">
            {view === "mission" && <MissionBrief onOpenVault={openVault} onContact={goContact} />}
            {view === "technical" && (
              <BayDetail
                bayId="technical"
                theme="lab"
                code="BAY 02"
                title="Technical Brief"
                subtitle="Research Lab"
                tagline={["Inspect the signal.", "Preserve the machine."]}
                intro="SINE~WaiV State Inspector is a research-stage, physics-informed motor-current inspection system. This bay organizes signal-path diagrams, frequency-domain reasoning, artifact-aware framing, and the validation path from bench to structured runs."
                labels={["Research Stage", "Prototype", "Validation Needed"]}
                disclaimer="No field validation is claimed. No digital twin claim is made. Every artifact is labeled by evidence status."
                blocks={[
                  { title: "Signal-Path Notes",             body: "Motor current i(t) reasoning, sampling considerations, and structured inspection framing.",       status: "RESEARCH" },
                  { title: "FFT / Frequency-Domain",        body: "Illustrative frequency-domain reasoning artifacts. Not validation output.",                        status: "HYPOTHESIS" },
                  { title: "Artifact-Aware Framing",        body: "How measurement artifacts are separated from candidate machine-state signals.",                    status: "RESEARCH" },
                  { title: "Validation Path",               body: "Planned progression from bench observation to structured validation runs.",                        status: "VALIDATION NEEDED" },
                ]}
                sections={[
                  {
                    index: "03",
                    eyebrow: "Method Stack",
                    title: "Physics-first inspection",
                    body: "The stack starts at physics (current signature, mechanical coupling) and only then reaches for statistics. Every step is labeled by what it can and cannot claim.",
                    items: [
                      "Motor current signature reasoning",
                      "Frequency-domain artifact separation",
                      "Envelope + demodulation sketches",
                      "Structured inspection framing",
                    ],
                  },
                  {
                    index: "03B",
                    eyebrow: "Evidence Ladder",
                    title: "From hypothesis to validated claim",
                    body: "Each artifact sits on an explicit rung. Nothing is promoted between rungs without the evidence that rung requires.",
                    items: [
                      "L0 · Hypothesis — reasoning only",
                      "L1 · Research — structured investigation",
                      "L2 · Prototype — bench observation",
                      "L3 · Validation — repeatable structured runs",
                    ],
                  },
                ]}
                onOpenVault={openVault}
                onContact={goContact}
              />
            )}
            {view === "capability" && (
              <BayDetail
                bayId="capability"
                theme="gallery"
                code="BAY 03"
                title="Capability Brief"
                subtitle="Capability Gallery"
                tagline={["Frame the capability.", "Not the hype."]}
                intro="A curated gallery of the platform's capabilities — expressed per audience, scoped to the decisions each audience is trying to make. Reliability, maintenance, pilot, and commercialization framing all live here."
                labels={["Reliability", "Pilot Candidate", "Commercial Candidate"]}
                blocks={[
                  { title: "Industrial Reliability",         body: "How signal-derived evidence integrates into reliability decision cycles.",                        status: "COMMERCIAL CANDIDATE" },
                  { title: "Maintenance Decision Support",   body: "Structured evidence at the point of maintenance judgment, without overclaiming.",                 status: "PROTOTYPE" },
                  { title: "Pilot Candidate Framing",        body: "Framing document for prospective pilot engagements and their success criteria.",                  status: "VALIDATION NEEDED" },
                  { title: "Customer Problem Cards",         body: "Discrete problem statements the platform is designed to address.",                                status: "RESEARCH" },
                ]}
                sections={[
                  {
                    index: "03",
                    eyebrow: "Target Audiences",
                    title: "Who each capability is for",
                    body: "Capability is expressed differently per audience. Every conversation is scoped to the decision that audience is trying to make.",
                    items: [
                      "Reliability engineering leads",
                      "Maintenance decision owners",
                      "Pilot sponsors + operations",
                      "Commercial + partnership scouts",
                    ],
                  },
                  {
                    index: "03B",
                    eyebrow: "Commercial Posture",
                    title: "What we're ready to offer today",
                    body: "The gallery labels each capability by commercial readiness so partners know exactly which conversation they're entering.",
                    items: [
                      "Framing briefs — available now",
                      "Structured pilots — candidate scoping",
                      "Reference workflows — under construction",
                      "Long-term partnerships — by conversation",
                    ],
                  },
                ]}
                onOpenVault={openVault}
                onContact={goContact}
              />
            )}
            {view === "operations" && (
              <BayDetail
                bayId="operations"
                theme="command"
                heroImage="/media/operations-landing.jpg"
                code="BAY 04"
                title="Operations Center"
                subtitle="Command & Control"
                tagline={["Command the shell.", "Route the evidence."]}
                intro="Command surface for Nexus itself. Live project status, evidence routing, document access, deployment posture, and the direct-to-founder contact channel — all in one console."
                labels={["Online", "Monitored", "Evidence Routed"]}
                blocks={[
                  { title: "Project Status",         body: "Current program state across founder, technical, and commercial tracks.",                         status: "ONLINE" },
                  { title: "Evidence Vault Access",  body: "Open the vault to browse evidence objects with claim boundaries and audience labels.",           status: "ONLINE" },
                  { title: "Document Access",        body: "Resume, credentials, and briefing documents route through the founder office.",                   status: "ONLINE" },
                  { title: "Deployment Status",      body: "Nexus operating shell is live. Static deployment. No user data collected.",                        status: "LIVE" },
                ]}
                sections={[
                  {
                    index: "03",
                    eyebrow: "Operating Posture",
                    title: "How the shell runs",
                    body: "Nexus runs as a static operating shell. Deterministic, auditable, and cheap to serve — with an explicit stance on tracking and data collection.",
                    items: [
                      "Static deployment · no server state",
                      "No visitor tracking or analytics beacons",
                      "Evidence routed through claim-boundaried cards",
                      "Direct-to-founder contact channel",
                    ],
                  },
                  {
                    index: "03B",
                    eyebrow: "Control Surface",
                    title: "What you can do from here",
                    body: "Every action a visitor might want is one click from this bay — open the vault, request a briefing, download the resume, or return to the rotunda.",
                    items: [
                      "Open Evidence Vault — full cards gallery",
                      "Request Briefing — direct founder channel",
                      "Return to Rotunda — anywhere, one click",
                      "Deep-link any bay via URL hash",
                    ],
                  },
                ]}
                onOpenVault={openVault}
                onContact={goContact}
              />
            )}
          </div>
        )}

        <Contact />
      </main>

      <BottomBar />
      <EvidenceVault
        open={vaultOpen}
        onOpenChange={setVaultOpen}
        onReturnToRotunda={goHome}
      />

      {transition && (
        <BayTransition
          label={transition.label}
          kind={transition.kind}
          onDone={() => setTransition(null)}
        />
      )}

      {videoTransition && (
        <VideoTransition
          src={videoTransition.src}
          onDone={() => setVideoTransition(null)}
        />
      )}


      {!introDone && <IntroOverlay onComplete={handleIntroComplete} />}
    </div>
  );
};

export default Index;
