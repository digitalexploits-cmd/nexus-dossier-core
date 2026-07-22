import { useEffect, useMemo, useState } from "react";
import { prefersReducedMotion } from "@/lib/audio";

export type TransitionKind = "advance" | "retreat";

type Phase = "camera" | "seal" | "view" | "reveal";

interface Props {
  label: string;
  kind: TransitionKind;
  bgImage?: string;
  bgVideo?: string;
  code?: string;
  tag?: string;
  durationMs?: number;
  onDone: () => void;
}

const DEFAULT_DURATION = 6500;

/**
 * Controlled three-part transition:
 * 0.0–1.2s camera motion
 * 1.2–2.0s mechanical shutter/iris closes and reopens over the page swap
 * 2.0–5.0s clean clip viewing
 * 5.0–6.5s soft reveal into the live destination
 */
export const BayTransition = ({
  label,
  kind,
  bgImage,
  bgVideo,
  code,
  tag,
  durationMs,
  onDone,
}: Props) => {
  const reduced = prefersReducedMotion();
  const duration = Math.max(3200, Math.min(12000, durationMs ?? DEFAULT_DURATION));
  const [phase, setPhase] = useState<Phase>("camera");
  const [cameraMoved, setCameraMoved] = useState(false);

  const timing = useMemo(() => ({
    seal: Math.round(duration * (1.2 / 6.5)),
    view: Math.round(duration * (2.0 / 6.5)),
    reveal: Math.round(duration * (5.0 / 6.5)),
  }), [duration]);

  // Alternate between a horizontal mechanical shutter and a circular aperture.
  // The selection is stable for a destination, not random on every render.
  const useIris = useMemo(
    () => [...label].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0,
    [label],
  );

  useEffect(() => {
    if (reduced) {
      const done = window.setTimeout(onDone, 320);
      return () => window.clearTimeout(done);
    }

    const motion = window.requestAnimationFrame(() => setCameraMoved(true));
    const seal = window.setTimeout(() => setPhase("seal"), timing.seal);
    const view = window.setTimeout(() => setPhase("view"), timing.view);
    const reveal = window.setTimeout(() => setPhase("reveal"), timing.reveal);
    const done = window.setTimeout(onDone, duration);

    return () => {
      window.cancelAnimationFrame(motion);
      window.clearTimeout(seal);
      window.clearTimeout(view);
      window.clearTimeout(reveal);
      window.clearTimeout(done);
    };
  }, [duration, onDone, reduced, timing]);

  const isSealed = phase === "seal";
  const isRevealing = phase === "reveal";
  const cameraStart = kind === "advance"
    ? "scale(1.01) translate3d(-0.6%, 0, 0)"
    : "scale(1.075) translate3d(0.6%, 0, 0)";
  const cameraEnd = kind === "advance"
    ? "scale(1.075) translate3d(0.6%, -0.25%, 0)"
    : "scale(1.01) translate3d(-0.6%, 0.25%, 0)";

  if (reduced) {
    return <div className="fixed inset-0 z-[90] bg-[#04060a] animate-out fade-out duration-300" />;
  }

  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none overflow-hidden bg-[#04060a]"
      style={{
        opacity: isRevealing ? 0 : 1,
        transition: isRevealing
          ? `opacity ${Math.max(800, duration - timing.reveal)}ms cubic-bezier(0.22,1,0.36,1)`
          : "none",
      }}
    >
      {/* Destination clip/still. No shake, flash, scanline, flare, or club-light effects. */}
      <div
        className="absolute inset-0"
        style={{
          transform: cameraMoved ? cameraEnd : cameraStart,
          transition: `transform ${timing.seal}ms cubic-bezier(0.22,1,0.36,1)`,
          willChange: "transform",
        }}
      >
        {bgVideo ? (
          <video
            src={bgVideo}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(1.04) contrast(1.06) brightness(0.96)" }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              filter: "saturate(1.04) contrast(1.06) brightness(0.96)",
            }}
          />
        )}
      </div>

      {/* Restrained vignette for legibility; deliberately static. */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 58%, rgba(4,6,10,0.52) 100%)",
        }}
      />

      {useIris ? (
        <div
          className="absolute inset-0 bg-[#04060a]"
          style={{
            clipPath: isSealed
              ? "circle(0% at 50% 50%)"
              : "circle(76% at 50% 50%)",
            transition: "clip-path 700ms cubic-bezier(0.7,0,0.2,1)",
          }}
        />
      ) : (
        <>
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#04060a] border-r border-primary/25"
            style={{
              transform: isSealed ? "translateX(0)" : "translateX(-101%)",
              transition: "transform 700ms cubic-bezier(0.7,0,0.2,1)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#04060a] border-l border-primary/25"
            style={{
              transform: isSealed ? "translateX(0)" : "translateX(101%)",
              transition: "transform 700ms cubic-bezier(0.7,0,0.2,1)",
            }}
          />
        </>
      )}

      {/* Minimal identification only—no telemetry wall or pulsing light rig. */}
      <div
        className="absolute inset-x-0 bottom-8 flex flex-col items-center text-center px-6"
        style={{
          opacity: phase === "camera" || phase === "seal" ? 0.9 : 0.58,
          transition: "opacity 500ms ease",
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        <div className="mono text-[0.55rem] tracking-[0.38em] text-primary/70">
          {kind === "advance" ? "ENTERING" : "RETURNING"} · {code ?? "NEXUS"}
        </div>
        <div className="mono mt-2 text-sm md:text-lg tracking-[0.3em] text-foreground/90 uppercase">
          {label}
        </div>
        {tag && (
          <div className="mono mt-2 text-[0.5rem] tracking-[0.3em] text-muted-foreground/70">
            {tag}
          </div>
        )}
      </div>
    </div>
  );
};
