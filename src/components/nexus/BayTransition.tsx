import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/audio";

export type TransitionKind = "advance" | "retreat";

interface Props {
  label: string;
  kind: TransitionKind;
  onDone: () => void;
}

/**
 * Cinematic scanline wipe with a bay label. Advance = pushing forward,
 * retreat = pulling back to the rotunda. CSS-only, GPU-friendly.
 */
export const BayTransition = ({ label, kind, onDone }: Props) => {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 320 : 1400);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none"
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

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="mono text-primary text-center px-6"
          style={{
            textShadow: "0 0 24px hsl(var(--primary) / 0.6)",
            animation: reduced
              ? "intro-fade-in 260ms ease-out forwards"
              : "bay-label 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        >
          <div className="text-[0.62rem] tracking-[0.42em] text-primary/70 mb-2">
            {kind === "advance" ? "ENTERING //" : "RETURNING //"}
          </div>
          <div className="text-lg md:text-2xl tracking-[0.32em] uppercase">{label}</div>
        </div>
      </div>
    </div>
  );
};
