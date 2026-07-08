import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rotunda } from "@/components/nexus/Rotunda";
import { BayShell } from "@/components/nexus/BayShell";
import { EvidenceVault } from "@/components/nexus/EvidenceVault";
import { Contact } from "@/components/nexus/Contact";
import { TopBar, BottomBar } from "@/components/nexus/Chrome";
import { IntroOverlay } from "@/components/nexus/IntroOverlay";
import { BayTransition, type TransitionKind } from "@/components/nexus/BayTransition";
import { VideoTransition } from "@/components/nexus/VideoTransition";
import { Button } from "@/components/ui/button";
import { BAYS, type BayId } from "@/data/content";
import { audio, prefersReducedMotion } from "@/lib/audio";

// Bay-specific transition videos preserved as-is. Content-driven motion:
// each is a domain-tailored asset (dossier intake / waveform convergence /
// architecture reveal / control-grid activation). Missing → CSS wipe.
const TRANSITION_VIDEOS: Record<BayId, string | null> = {
  mission:    "/media/transition-mission.mp4",
  technical:  "/media/transition-technical.mp4",
  capability: "/media/transition-capability.mp4",
  operations: "/media/transition-operations.mp4",
};

// Hero image per bay — the stable landing state after transition.
const HERO_IMAGES: Record<BayId, string> = {
  mission:    "/founder-office.jpg",
  technical:  "/media/technical-landing.jpg",
  capability: "/media/capability-landing.jpg",
  operations: "/media/operations-landing.jpg",
};

// Restrained cyan accent per bay. Same architectural language across all.
const BAY_ACCENTS: Record<BayId, string> = {
  mission:    "#4db7ff",
  technical:  "#5fe1d6",
  capability: "#e8b96b",
  operations: "#ff8f5c",
};

const BAY_AMBIENT: Record<BayId, string> = {
  mission:    "ON RECORD",
  technical:  "CALIBRATED",
  capability: "ON DISPLAY",
  operations: "MONITORED · LIVE",
};

const BAY_TAGLINE: Record<BayId, [string, string]> = {
  mission:    ["Divide the wave.", "Preserve the machine."],
  technical:  ["Inspect the signal.", "Preserve the machine."],
  capability: ["Frame the capability.", "Not the hype."],
  operations: ["Command the shell.", "Route the evidence."],
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
    setView(next);
    if (window.location.hash !== targetHash) {
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
      // Commit destination first — video overlay is cinematic dressing;
      // when it ends we reveal the already-mounted hero image landing.
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
              {BAYS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => goBay(b.id)}
                  className={`bay-hover-glow mono text-[0.65rem] tracking-widest px-2 py-1 border ${
                    view === b.id ? "border-primary text-primary bg-primary/10" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {b.index} · {b.title.toUpperCase()}
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
            <BayShell
              bayId={view}
              heroImage={HERO_IMAGES[view]}
              tagline={BAY_TAGLINE[view]}
              ambient={BAY_AMBIENT[view]}
              accent={BAY_ACCENTS[view]}
              lightingControls={view === "mission"}
              onOpenVault={openVault}
              onContact={goContact}
            />
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
