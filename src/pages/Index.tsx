import { useCallback, useEffect, useMemo, useState } from "react";
import { Rotunda } from "@/components/nexus/Rotunda";
import { BayShell } from "@/components/nexus/BayShell";
import { EvidenceVault } from "@/components/nexus/EvidenceVault";
import { Contact } from "@/components/nexus/Contact";
import { TopBar, BottomBar } from "@/components/nexus/Chrome";
import { IntroOverlay } from "@/components/nexus/IntroOverlay";
import { BayTransition, type TransitionKind } from "@/components/nexus/BayTransition";
import { Button } from "@/components/ui/button";
import { BAYS, type BayId } from "@/data/content";
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

  // Curtain (see BayTransition + @keyframes bay-curtain) peaks at ~35% of 1400ms ≈ 490ms.
  // Swap the underlying view at peak so the curtain covers the change, then let the
  // overlay play its reveal-out half and self-clear via onDone.
  const runTransition = useCallback((label: string, kind: TransitionKind, next: View) => {
    if (prefersReducedMotion()) { commitView(next); return; }
    setTransition({ label, kind });
    window.setTimeout(() => { commitView(next); }, 490);
  }, [commitView]);

  const goHome = useCallback(() => {
    if (view === "home") return;
    runTransition("ROTUNDA", "retreat", "home");
  }, [view, runTransition]);

  const goBay = useCallback((id: BayId) => {
    if (view === id) return;
    runTransition(bayLabel(id), "advance", id);
  }, [view, runTransition]);

  const openVault = useCallback(() => {
    setVaultOpen(true);
  }, []);

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

      {!introDone && <IntroOverlay onComplete={handleIntroComplete} />}
    </div>
  );
};

export default Index;
