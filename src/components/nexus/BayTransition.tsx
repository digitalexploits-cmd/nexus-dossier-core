import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/audio";

export type TransitionKind = "advance" | "retreat";

interface Props {
  label: string;
  kind: TransitionKind;
  /** Optional cinematic still shown behind the scanline wipe. */
  bgImage?: string;
  onDone: () => void;
}

/**
 * Cinematic scanline wipe with optional atmospheric still and bay label.
 * Advance = pushing forward, retreat = pulling back to the rotunda.
 * CSS-only, GPU-friendly. Duration = 1400ms; peak at ~490ms.
 */
export const BayTransition = ({ label, kind, bgImage, onDone }: Props) => {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 320 : 1400);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
      style={{ animation: reduced ? "intro-fade-in 300ms ease-out forwards" : undefined }}
    >
      {/* Dark curtain */}
      <div
        className="absolute inset-0 bg-[#04060a]"
        style={{
          animation: reduced
            ? "intro-fade-in 300ms ease-out forwards"
            : "bay-curtain 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      />

      {/* Cinematic still: ken-burns behind scanline, sits above curtain */}
      {bgImage && !reduced && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.85) contrast(1.05)",
              animation: "bay-still-kenburns 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          />
          {/* Vignette + navy tint */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(4,6,10,0) 0%, rgba(4,6,10,0.55) 65%, rgba(4,6,10,0.95) 100%)",
              animation: "bay-still-kenburns 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          />
          {/* Subtle scanline texture */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(212,175,55,0.06) 0 1px, transparent 1px 3px)",
              animation: "bay-still-kenburns 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          />
        </>
      )}

      {/* Scanline wipe */}
      {!reduced && (
        <div
          className="absolute inset-x-0 h-[3px]"
          style={{
            top: kind === "advance" ? "-3px" : "100%",
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.95), transparent)",
            boxShadow: "0 0 32px hsl(var(--primary) / 0.7)",
            animation: `${kind === "advance" ? "bay-scan-down" : "bay-scan-up"} 1200ms cubic-bezier(0.22,1,0.36,1) forwards`,
          }}
        />
      )}

      {/* Corner ticks for instrument feel */}
      {!reduced && (
        <div
          className="absolute inset-6 pointer-events-none"
          style={{ animation: "bay-label 1400ms cubic-bezier(0.22,1,0.36,1) forwards" }}
        >
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <span
              key={c}
              className="absolute w-4 h-4 border-primary/70"
              style={{
                top: c.startsWith("t") ? 0 : undefined,
                bottom: c.startsWith("b") ? 0 : undefined,
                left: c.endsWith("l") ? 0 : undefined,
                right: c.endsWith("r") ? 0 : undefined,
                borderTopWidth: c.startsWith("t") ? 1 : 0,
                borderBottomWidth: c.startsWith("b") ? 1 : 0,
                borderLeftWidth: c.endsWith("l") ? 1 : 0,
                borderRightWidth: c.endsWith("r") ? 1 : 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="mono text-primary text-center px-6"
          style={{
            textShadow: "0 0 24px hsl(var(--primary) / 0.6), 0 2px 12px rgba(0,0,0,0.9)",
            animation: reduced
              ? "intro-fade-in 260ms ease-out forwards"
              : "bay-label 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        >
          <div className="text-[0.62rem] tracking-[0.42em] text-primary/80 mb-2">
            {kind === "advance" ? "ENTERING //" : "RETURNING //"}
          </div>
          <div className="text-lg md:text-2xl tracking-[0.32em] uppercase">{label}</div>
        </div>
      </div>
    </div>
  );
};
