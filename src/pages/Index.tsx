import { useCallback, useEffect, useMemo, useState } from "react";
import { Rotunda } from "@/components/nexus/Rotunda";
import { BayShell } from "@/components/nexus/BayShell";
import { EvidenceVault } from "@/components/nexus/EvidenceVault";
import { Contact } from "@/components/nexus/Contact";
import { TopBar, BottomBar } from "@/components/nexus/Chrome";
import { IntroOverlay } from "@/components/nexus/IntroOverlay";
import { BayTransition, type TransitionKind } from "@/components/nexus/BayTransition";

import { BAYS, type BayId } from "@/data/content";
import { pickTransition, transitionDuration, transitionSwapMs } from "@/data/transitions";

import { prefersReducedMotion } from "@/lib/audio";

// Hero image per bay — the stable landing state after transition.
const HERO_IMAGES: Record<BayId, string> = {
  mission:    "/founder-office.jpg",
  technical:  "/media/technical-landing.jpg",
  capability: "/media/capability-landing.jpg",
  operations: "/media/operations-landing.jpg",
};

// Gold family accent per bay — unified brand theme, subtle warmth variation.
const BAY_ACCENTS: Record<BayId, string> = {
  mission:    "#d4a84a", // signature gold
  technical:  "#e8c46b", // light gold
  capability: "#b8892d", // deep gold
  operations: "#f0d78c", // pale gold
};

const BAY_AMBIENT: Record<BayId, string> = {
  mission:    "ON RECORD",
  technical:  "CALIBRATED",
  capability: "ON DISPLAY",
  operations: "MONITORED · LIVE",
};

// Per-bay window rectangle (percent inset) — where the exterior glass sits
// in each hero image. Sky animation is clipped to this box so clouds and
// distant lightning read as "life outside" instead of overlaying the room.
const BAY_WINDOW_RECT: Record<BayId, { top: number; right: number; bottom: number; left: number; branchLeft?: boolean; branchRight?: boolean }> = {
  mission:    { top: 3,  right: 0,  bottom: 22, left: 36, branchRight: true },
  technical:  { top: 8,  right: 0,  bottom: 45, left: 28, branchRight: true },
  capability: { top: 4,  right: 0,  bottom: 48, left: 30, branchLeft: true, branchRight: true },
  operations: { top: 3,  right: 55, bottom: 22, left: 2,  branchLeft: true },
};

const BAY_TAGLINE: Record<BayId, [string, string]> = {
  mission:    ["", ""],
  technical:  ["Inspect the signal.", ""],
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

// Cinematic transition stills — hidden-in-plain-sight approaches per destination.
const TRANSITION_BG: Record<View | "vault", string> = {
  home:       "/media/transitions/transition-rotunda.jpg",
  mission:    "/media/transitions/transition-mission.jpg",
  technical:  "/media/transitions/transition-technical.jpg",
  capability: "/media/transitions/transition-capability.jpg",
  operations: "/media/transitions/transition-operations.jpg",
  vault:      "/media/transitions/transition-vault.jpg",
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
  const [introDone, setIntroDone] = useState(false);
  const [transition, setTransition] = useState<{ label: string; kind: TransitionKind; bgImage?: string; bgVideo?: string; code?: string; tag?: string; durationMs?: number } | null>(null);


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

  // Curtain covers the underlying swap; swap time is derived per-piece from its runtime.
  const runTransition = useCallback((label: string, kind: TransitionKind, next: View, code?: string) => {
    if (prefersReducedMotion()) { commitView(next); return; }
    const piece = pickTransition();
    setTransition({ label, kind, bgImage: piece.image, bgVideo: piece.video, code, tag: piece.tag, durationMs: transitionDuration(piece) });
    window.setTimeout(() => { commitView(next); }, transitionSwapMs(piece));
  }, [commitView]);

  const goHome = useCallback(() => {
    if (view === "home") return;
    runTransition("ROTUNDA", "retreat", "home", "ATRIUM · 00");
  }, [view, runTransition]);

  const goBay = useCallback((id: BayId) => {
    if (view === id) return;
    const bay = BAYS.find((b) => b.id === id);
    runTransition(bayLabel(id), "advance", id, bay?.code);
  }, [view, runTransition]);

  const openVault = useCallback(() => {
    if (prefersReducedMotion()) { setVaultOpen(true); return; }
    const piece = pickTransition();
    setTransition({ label: "EVIDENCE VAULT", kind: "advance", bgImage: piece.image, bgVideo: piece.video, code: "SUB-LEVEL · V", tag: piece.tag, durationMs: transitionDuration(piece) });
    window.setTimeout(() => { setVaultOpen(true); }, transitionSwapMs(piece));
  }, []);

  const closeVault = useCallback((open: boolean) => {
    if (open) { setVaultOpen(true); return; }
    if (prefersReducedMotion()) { setVaultOpen(false); return; }
    const label = view === "home" ? "ROTUNDA" : bayLabel(view as BayId);
    const bay = view !== "home" ? BAYS.find((b) => b.id === view) : undefined;
    const code = view === "home" ? "ATRIUM · 00" : bay?.code;
    const piece = pickTransition();
    setTransition({ label, kind: "retreat", bgImage: piece.image, bgVideo: piece.video, code, tag: piece.tag, durationMs: transitionDuration(piece) });
    window.setTimeout(() => { setVaultOpen(false); }, transitionSwapMs(piece));
  }, [view]);


  const goContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const viewLabel = useMemo(
    () => (view === "home" ? "ROTUNDA" : bayLabel(view as BayId).toUpperCase()),
    [view],
  );

  const handleIntroComplete = useCallback(() => {
    try { sessionStorage.setItem("nexus:intro", "done"); } catch { /* ignore */ }
    commitView("home");
    setIntroDone(true);
  }, [commitView]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        view={viewLabel}
        currentBay={view}
        onHome={goHome}
        onBay={goBay}
        onOpenVault={openVault}
      />

      <main>

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
              windowRect={BAY_WINDOW_RECT[view]}
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
        onOpenChange={closeVault}
        onReturnToRotunda={goHome}
      />

      {transition && (
        <BayTransition
          label={transition.label}
          kind={transition.kind}
          bgImage={transition.bgImage}
          bgVideo={transition.bgVideo}
          code={transition.code}
          tag={transition.tag}
          durationMs={transition.durationMs}
          onDone={() => setTransition(null)}
        />
      )}


      {!introDone && <IntroOverlay onComplete={handleIntroComplete} />}
    </div>
  );
};

export default Index;
