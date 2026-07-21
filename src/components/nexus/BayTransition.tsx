import { useEffect, useMemo, useState } from "react";
import { prefersReducedMotion } from "@/lib/audio";

export type TransitionKind = "advance" | "retreat";

interface Props {
  label: string;
  kind: TransitionKind;
  bgImage?: string;
  /** Short destination code, e.g. "BAY 02" or "VAULT" */
  code?: string;
  onDone: () => void;
}

// Full cinematic run. Curtain (bay-curtain keyframes: peak at 35%) covers
// the underlying view swap. Consumers should swap at ~35% of DURATION.
const DURATION = 5000;
export const TRANSITION_SWAP_MS = Math.round(DURATION * 0.35); // 1750ms

const TELEMETRY_LINES = [
  "AUTH · REVIEW-SAFE",
  "LINK · SECURE",
  "CANON · SYNCED",
  "MANIFEST · SIGNED",
  "TELEMETRY · NOMINAL",
  "PAYLOAD · VERIFIED",
];

// Cinematic camera flavors — one is chosen at random per transit so no two
// feel the same. Each flavor is a CSS keyframe defined in index.css.
const FLAVORS = [
  { name: "flavor-fall",         phase: "FREEFALL VECTOR" },
  { name: "flavor-dolly-in",     phase: "DOLLY ADVANCE" },
  { name: "flavor-reverse-out",  phase: "REVERSE PULL" },
  { name: "flavor-warp",         phase: "WARP ALIGNMENT" },
  { name: "flavor-spin-in",      phase: "ORBITAL LOCK" },
  { name: "flavor-tilt-pan",     phase: "LATERAL SWEEP" },
  { name: "flavor-rise",         phase: "ASCENT VECTOR" },
  { name: "flavor-glitch-slice", phase: "SIGNAL RECONSTRUCT" },
] as const;

/** Cinematic multi-stage transit sequence with HUD, telemetry, and dual scans. */
export const BayTransition = ({ label, kind, bgImage, code, onDone }: Props) => {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 320 : DURATION);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  // Typewriter effect on destination label
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (reduced) { setTyped(label.length); return; }
    const step = Math.max(28, Math.floor(600 / Math.max(1, label.length)));
    const id = window.setInterval(() => {
      setTyped((n) => (n >= label.length ? n : n + 1));
    }, step);
    return () => window.clearInterval(id);
  }, [label, reduced]);

  // Progress bar tick
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (reduced) { setPct(100); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / (DURATION - 200)) * 100);
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Random-looking coordinate line, stable per mount
  const coord = useMemo(() => {
    const r = () => Math.floor(Math.random() * 9000 + 1000);
    return `${r()} · ${r()} · ${r()}`;
  }, []);

  const dur = `${DURATION}ms`;
  const ease = "cubic-bezier(0.22,1,0.36,1)";

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
            : `bay-curtain ${dur} ${ease} forwards`,
        }}
      />

      {/* Cinematic still with slow parallax push */}
      {bgImage && !reduced && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.85) contrast(1.08)",
              animation: `bay-still-kenburns ${dur} ${ease} forwards`,
            }}
          />
          {/* Deep vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(4,6,10,0) 0%, rgba(4,6,10,0.55) 60%, rgba(4,6,10,0.96) 100%)",
              animation: `bay-still-kenburns ${dur} ${ease} forwards`,
            }}
          />
          {/* Horizontal atmospheric haze band */}
          <div
            className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--primary)/0.09) 40%, hsl(var(--primary)/0.14) 50%, hsl(var(--primary)/0.09) 60%, transparent)",
              animation: `bay-haze ${dur} ${ease} forwards`,
              filter: "blur(24px)",
            }}
          />
          {/* Scanline texture */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(212,175,55,0.07) 0 1px, transparent 1px 3px)",
              animation: `bay-still-kenburns ${dur} ${ease} forwards`,
            }}
          />
        </>
      )}

      {/* Dual scan beams */}
      {!reduced && (
        <>
          <div
            className="absolute inset-x-0 h-[2px]"
            style={{
              top: kind === "advance" ? "-3px" : "100%",
              background:
                "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.95), transparent)",
              boxShadow: "0 0 32px hsl(var(--primary) / 0.7)",
              animation: `${kind === "advance" ? "bay-scan-down" : "bay-scan-up"} 1600ms ${ease} forwards`,
            }}
          />
          <div
            className="absolute inset-x-0 h-[1px] opacity-70"
            style={{
              top: kind === "advance" ? "100%" : "-3px",
              background:
                "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)",
              animation: `${kind === "advance" ? "bay-scan-up" : "bay-scan-down"} 1800ms ${ease} 400ms forwards`,
            }}
          />
        </>
      )}

      {/* Corner ticks */}
      {!reduced && (
        <div
          className="absolute inset-6 pointer-events-none"
          style={{ animation: `bay-label ${dur} ${ease} forwards` }}
        >
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <span
              key={c}
              className="absolute w-5 h-5 border-primary/70"
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

      {/* Top-left HUD: destination code */}
      {!reduced && (
        <div
          className="absolute top-6 left-6 mono text-primary/85 text-[0.62rem] tracking-[0.36em]"
          style={{ animation: `bay-label ${dur} ${ease} forwards` }}
        >
          <div className="opacity-70">// NEXUS TRANSIT · {kind === "advance" ? "OUTBOUND" : "INBOUND"}</div>
          <div className="mt-1 text-primary">DEST · {code ?? label.toUpperCase()}</div>
          <div className="mt-0.5 opacity-60">{coord}</div>
        </div>
      )}

      {/* Top-right HUD: telemetry lines */}
      {!reduced && (
        <div
          className="absolute top-6 right-6 mono text-primary/85 text-[0.6rem] tracking-[0.3em] text-right space-y-1"
          style={{ animation: `bay-label ${dur} ${ease} forwards` }}
        >
          {TELEMETRY_LINES.map((line, i) => (
            <div
              key={line}
              style={{
                animation: `intro-fade-in 400ms ease-out ${300 + i * 160}ms both`,
              }}
            >
              <span className="opacity-60">▸</span> {line}
            </div>
          ))}
        </div>
      )}

      {/* Center: title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="mono text-primary text-center px-6"
          style={{
            textShadow: "0 0 24px hsl(var(--primary) / 0.65), 0 2px 12px rgba(0,0,0,0.9)",
            animation: reduced
              ? "intro-fade-in 260ms ease-out forwards"
              : `bay-label ${dur} ${ease} forwards`,
          }}
        >
          <div className="text-[0.62rem] tracking-[0.42em] text-primary/75 mb-3">
            {kind === "advance" ? "ENTERING //" : "RETURNING //"}
          </div>
          <div className="text-2xl md:text-4xl tracking-[0.32em] uppercase">
            {label.slice(0, typed)}
            {!reduced && typed < label.length && (
              <span className="inline-block w-[0.6ch] -mb-0.5 animate-pulse">▍</span>
            )}
          </div>
          {code && (
            <div className="mt-3 text-[0.6rem] tracking-[0.5em] text-primary/60">{code}</div>
          )}
        </div>
      </div>

      {/* Bottom HUD: progress + status */}
      {!reduced && (
        <div
          className="absolute bottom-8 inset-x-6 mono text-primary/85"
          style={{ animation: `bay-label ${dur} ${ease} forwards` }}
        >
          <div className="flex items-end justify-between text-[0.58rem] tracking-[0.3em] mb-2">
            <span className="opacity-70">TRANSIT · {Math.floor(pct)}%</span>
            <span className="opacity-70">
              {pct < 45 ? "SEALING PERIMETER" : pct < 80 ? "ROUTING CHANNEL" : "HANDSHAKE"}
            </span>
          </div>
          <div className="relative h-[3px] w-full bg-primary/15 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary"
              style={{
                width: `${pct}%`,
                boxShadow: "0 0 12px hsl(var(--primary) / 0.75)",
              }}
            />
            {/* Tick marks */}
            {[0.25, 0.5, 0.75].map((p) => (
              <span
                key={p}
                className="absolute top-0 bottom-0 w-px bg-[#04060a]/70"
                style={{ left: `${p * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[0.56rem] tracking-[0.32em] opacity-60">
            <span>◇ AI BASE³ · NEXUS</span>
            <span>·</span>
            <span>REVIEWER-SAFE CHANNEL</span>
            <span className="ml-auto">SIG {(pct * 12.4).toFixed(0).padStart(4, "0")}Hz</span>
          </div>
        </div>
      )}
    </div>
  );
};
