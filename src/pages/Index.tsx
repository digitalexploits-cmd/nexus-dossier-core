import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rotunda } from "@/components/nexus/Rotunda";
import { MissionBrief } from "@/components/nexus/MissionBrief";
import { BayPlaceholder } from "@/components/nexus/BayPlaceholder";
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
  operations: null,
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
  const [view, setView] = useState<View>(() => hashToView(window.location.hash));
  const [vaultOpen, setVaultOpen] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem("nexus:intro") === "done"; } catch { return false; }
  });
  const [transition, setTransition] = useState<{ label: string; kind: TransitionKind } | null>(null);
  const [videoTransition, setVideoTransition] = useState<{ src: string; next: View } | null>(null);
  const pendingRef = useRef<View | null>(null);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#vault") { setVaultOpen(true); return; }
      setView(hashToView(window.location.hash));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHash);
    if (window.location.hash === "#vault") setVaultOpen(true);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const commitView = useCallback((next: View) => {
    window.location.hash = VIEW_HASH[next];
    setView(next);
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
      // Commit the target view immediately so it's already rendered behind
      // the fullscreen video overlay. Clearing the overlay on end reveals it.
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
                  className={`mono text-[0.65rem] tracking-widest px-2 py-1 border transition-colors ${
                    view === b ? "border-primary text-primary bg-primary/10" : "border-border/60 text-muted-foreground hover:text-foreground"
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
        {view === "mission" && <MissionBrief onOpenVault={openVault} onContact={goContact} />}
        {view === "technical" && (
          <BayPlaceholder
            bayId="technical"
            code="BAY 02"
            title="Technical Brief"
            subtitle="Research Lab"
            intro="SINE~WaiV State Inspector is being developed as a research-stage, physics-informed motor-current inspection system. This section will organize signal-path diagrams, validation graphics, research notes, and technical evidence."
            labels={["Research Stage", "Prototype", "Validation Needed"]}
            disclaimer="No field validation is claimed. No digital twin claim is made. All artifacts here are labeled by evidence status."
            blocks={[
              { title: "Signal-Path Notes", body: "Motor current i(t) reasoning, sampling considerations, and structured inspection framing.", status: "RESEARCH" },
              { title: "FFT / Frequency-Domain Sketches", body: "Illustrative frequency-domain reasoning artifacts. Not validation output.", status: "HYPOTHESIS" },
              { title: "Artifact-Aware Framing", body: "How measurement artifacts are separated from candidate machine-state signals.", status: "RESEARCH" },
              { title: "Validation Path", body: "Planned progression from bench observation to structured validation runs.", status: "VALIDATION NEEDED" },
            ]}
            onOpenVault={openVault}
            onContact={goContact}
          />
        )}
        {view === "capability" && (
          <BayPlaceholder
            bayId="capability"
            code="BAY 03"
            title="Capability Brief"
            subtitle="Capability Gallery"
            intro="Capability framing across industrial reliability, maintenance decision support, pilot candidate scoping, and commercialization pathway."
            labels={["Reliability", "Pilot Candidate", "Commercial Candidate"]}
            blocks={[
              { title: "Industrial Reliability", body: "How signal-derived evidence integrates into reliability decision cycles.", status: "COMMERCIAL CANDIDATE" },
              { title: "Maintenance Decision Support", body: "Structured evidence at the point of maintenance judgment, without overclaiming.", status: "PROTOTYPE" },
              { title: "Pilot Candidate Framing", body: "Framing document for prospective pilot engagements and their success criteria.", status: "VALIDATION NEEDED" },
              { title: "Customer Problem Cards", body: "Discrete problem statements the platform is designed to address.", status: "RESEARCH" },
            ]}
            onOpenVault={openVault}
            onContact={goContact}
          />
        )}
        {view === "operations" && (
          <BayPlaceholder
            bayId="operations"
            code="BAY 04"
            title="Operations Center"
            subtitle="Command & Control"
            intro="Command surface for Nexus itself: project status, evidence vault access, document routing, deployment state, and contact path."
            labels={["Online", "Monitored", "Evidence Routed"]}
            blocks={[
              { title: "Project Status", body: "Current program state across founder, technical, and commercial tracks.", status: "ONLINE" },
              { title: "Evidence Vault Access", body: "Open the vault to browse evidence objects with claim boundaries and audience labels.", status: "ONLINE" },
              { title: "Document Access", body: "Resume, credentials, and briefing documents route through the founder office.", status: "ONLINE" },
              { title: "Deployment Status", body: "Nexus operating shell is live. Static deployment. No user data collected.", status: "LIVE" },
            ]}
            onOpenVault={openVault}
            onContact={goContact}
          />
        )}

        <Contact />
      </main>

      <BottomBar />
      <EvidenceVault open={vaultOpen} onOpenChange={setVaultOpen} />

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
