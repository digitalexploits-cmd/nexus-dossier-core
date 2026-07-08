import { useEffect, useRef, useState } from "react";
import rotundaAsset from "@/assets/nexus-rotunda.jpg.asset.json";
import { BRAND } from "@/data/content";
import { audio, prefersReducedMotion } from "@/lib/audio";

interface Props {
  onComplete: () => void;
}

type Phase = "standby" | "pushing" | "done";

/**
 * Cold-open cinematic. Standby card → user click → first-person push-in
 * over the rotunda image with HUD boot-lines → hand off to <Rotunda />.
 */
export const IntroOverlay = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("standby");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const reduced = useRef(prefersReducedMotion());

  const finish = () => {
    setPhase("done");
    // brief fade-out beat, then unmount
    setTimeout(onComplete, 350);
  };

  const skip = () => {
    audio.start(); // still start audio on skip click gesture
    finish();
  };

  const enter = async () => {
    await audio.start();
    audio.blip(660);

    if (reduced.current) { finish(); return; }

    setPhase("pushing");

    // Boot-line schedule during the ~3s push-in
    const lines = [
      "BOOT // SHELL ONLINE",
      "LINK // AI BASE³ SOLUTIONS",
      "RENDER // ROTUNDA",
      "HUD // OBJECTIVE CONSOLE READY",
    ];
    lines.forEach((l, i) => {
      setTimeout(() => setBootLines((prev) => [...prev, l]), 250 + i * 480);
    });

    setTimeout(finish, 3100);
  };

  // Escape key to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "done") skip();
      if ((e.key === "Enter" || e.key === " ") && phase === "standby") { e.preventDefault(); enter(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#04060a] overflow-hidden ${
        phase === "pushing" ? "pointer-events-none" : ""
      }`}
      style={{ animation: phase === "done" ? "intro-fade-out 350ms ease-out forwards" : undefined }}
    >
      {/* Rotunda camera layer */}
      <img
        src={rotundaAsset.url}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transformOrigin: "50% 52%",
          transform: phase === "pushing" ? "scale(1.0)" : "scale(1.25)",
          filter: phase === "pushing"
            ? "brightness(1.05) blur(0px) saturate(1.1)"
            : "brightness(0.35) blur(6px) saturate(0.85)",
          transition: phase === "pushing"
            ? "transform 3000ms cubic-bezier(0.22,1,0.36,1), filter 2600ms cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
        draggable={false}
      />

      {/* Vertical settle micro-motion (headset feel) */}
      {phase === "pushing" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ animation: "intro-settle 3000ms cubic-bezier(0.22,1,0.36,1) forwards" }}
        >
          <img
            src={rotundaAsset.url}
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-0"
            draggable={false}
          />
        </div>
      )}

      {/* Heavy vignette that lifts as we push in */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,4,8,1)_100%)]"
        style={{
          opacity: phase === "pushing" ? 0.55 : 1,
          transition: "opacity 2600ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Scanline sweep during boot */}
      {phase === "pushing" && (
        <div
          className="absolute inset-x-0 h-[2px] pointer-events-none"
          style={{
            top: 0,
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.85), transparent)",
            boxShadow: "0 0 24px hsl(var(--primary) / 0.6)",
            animation: "intro-scan 2600ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        />
      )}

      {/* Standby card */}
      {phase === "standby" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="flex flex-col items-center gap-4 anim-fade-up">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border border-primary/70 rotate-45" />
              <div className="absolute inset-2 bg-primary/30" />
              <div className="absolute inset-0 border border-primary/40 rotate-45 animate-ping" />
            </div>
            <div className="mono text-[0.72rem] tracking-[0.42em] text-primary/90">NEXUS</div>
            <div className="mono text-[0.65rem] tracking-[0.32em] text-foreground/80">
              {BRAND.company.toUpperCase()}
            </div>
          </div>

          <button
            onClick={enter}
            className="group relative mt-4 px-8 py-4 border border-primary/60 bg-primary/[0.06] hover:bg-primary/15 hover:border-primary transition-colors mono text-[0.85rem] tracking-[0.36em] text-primary shadow-[0_0_40px_rgba(70,150,255,0.25)] anim-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <span className="absolute -inset-px border border-primary/30 group-hover:border-primary/70 pointer-events-none" />
            ENTER NEXUS
          </button>

          <div
            className="mono text-[0.6rem] tracking-[0.32em] text-muted-foreground anim-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            SHELL STANDBY — CLICK TO INITIALIZE
          </div>

          <button
            onClick={skip}
            className="absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
          >
            SKIP →
          </button>
        </div>
      )}

      {/* HUD boot lines during push-in */}
      {phase === "pushing" && (
        <>
          <div className="absolute top-6 left-6 space-y-1.5">
            {bootLines.map((l) => (
              <div
                key={l}
                className="mono text-[0.62rem] tracking-[0.24em] text-primary/85 anim-fade-up"
                style={{ textShadow: "0 0 12px hsl(var(--primary) / 0.5)" }}
              >
                &gt; {l}
              </div>
            ))}
          </div>
          <button
            onClick={skip}
            className="pointer-events-auto absolute bottom-6 right-6 mono text-[0.6rem] tracking-[0.28em] text-muted-foreground hover:text-primary/80 border border-border/60 hover:border-primary/40 px-3 py-1.5 bg-background/40 backdrop-blur-sm transition-colors"
          >
            SKIP →
          </button>
        </>
      )}
    </div>
  );
};
