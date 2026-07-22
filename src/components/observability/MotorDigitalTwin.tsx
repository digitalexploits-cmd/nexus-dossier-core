import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MotorTwinState, HealthState } from "@/types/observability";
import { HealthBadge } from "./HealthBadge";

interface MotorDigitalTwinProps {
  state: MotorTwinState;
  className?: string;
  /** Allow user to rotate the twin with pointer */
  interactive?: boolean;
}

const healthGlow: Record<HealthState, string> = {
  healthy: "rgba(52,211,153,0.35)",
  degraded: "rgba(251,191,36,0.35)",
  warning: "rgba(251,146,60,0.45)",
  critical: "rgba(251,113,133,0.55)",
  offline: "rgba(100,116,139,0.2)",
  unknown: "rgba(100,116,139,0.15)",
};

const healthAccent: Record<HealthState, string> = {
  healthy: "#34d399",
  degraded: "#fbbf24",
  warning: "#fb923c",
  critical: "#fb7185",
  offline: "#64748b",
  unknown: "#64748b",
};

/**
 * High-fidelity CSS/SVG industrial motor digital twin.
 * Completely presentational. Health colors, glow intensity, and indicator
 * bars are driven solely by the MotorTwinState prop.
 *
 * Future: swap this component for a React Three Fiber version that consumes
 * the exact same MotorTwinState interface – zero changes to parents.
 */
export function MotorDigitalTwin({ state, className, interactive = true }: MotorDigitalTwinProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rotateY = useMotionValue(0);
  const springRotate = useSpring(rotateY, { stiffness: 120, damping: 18 });

  const handlePointer = (e: React.PointerEvent) => {
    if (!interactive || !isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    rotateY.set(x * 50);
  };

  const heat = state.indicators?.heat ?? 0;
  const vib = state.indicators?.vibration ?? 0;
  const mag = state.indicators?.magnetic ?? 0;
  const accent = healthAccent[state.health] ?? healthAccent.unknown;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border border-white/8",
        "bg-gradient-to-b from-[#0c1a2e] to-[#060d18] overflow-hidden select-none",
        className,
      )}
      onPointerDown={() => interactive && setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onPointerMove={handlePointer}
      style={{ touchAction: "none" }}
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 55%, ${healthGlow[state.health]}, transparent 70%)`,
        }}
      />

      {/* header */}
      <div className="relative z-10 w-full flex items-center justify-between px-5 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">{state.equipmentId}</p>
          <p className="text-sm font-medium text-slate-100">{state.name}</p>
        </div>
        <HealthBadge state={state.health} pulse />
      </div>

      {/* 3D-ish motor body */}
      <motion.div
        className="relative z-10 my-6"
        style={{ rotateY: springRotate, transformStyle: "preserve-3d" }}
      >
        <svg width="220" height="160" viewBox="0 0 220 160" fill="none" className="drop-shadow-2xl">
          {/* shaft left */}
          <rect x="8" y="68" width="28" height="16" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* main body */}
          <rect x="36" y="40" width="120" height="72" rx="10" fill="#0f172a" stroke={accent} strokeWidth="1.5" opacity="0.95" />
          {/* cooling fins */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={48 + i * 16}
              y="46"
              width="8"
              height="60"
              rx="2"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="0.75"
            />
          ))}
          {/* end bell right */}
          <rect x="156" y="48" width="24" height="56" rx="6" fill="#0f172a" stroke={accent} strokeWidth="1.25" />
          {/* shaft right */}
          <rect x="180" y="68" width="32" height="16" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* bearing highlights */}
          <circle cx="48" cy="76" r="6" fill={accent} opacity={0.35 + vib * 0.5} />
          <circle cx="156" cy="76" r="6" fill={accent} opacity={0.35 + vib * 0.5} />
          {/* heat shimmer overlay */}
          <rect
            x="36"
            y="40"
            width="120"
            height="72"
            rx="10"
            fill={accent}
            opacity={heat * 0.18}
          />
        </svg>

        {/* subtle vibration animation when elevated */}
        {vib > 0.25 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: [0, 0.8, -0.6, 0.4, 0], y: [0, -0.5, 0.7, -0.3, 0] }}
            transition={{ duration: 0.18 + (1 - vib) * 0.3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* indicator bars */}
      <div className="relative z-10 w-full px-5 pb-5 grid grid-cols-3 gap-3">
        <Indicator label="Heat" value={heat} color={accent} />
        <Indicator label="Vibration" value={vib} color={accent} />
        <Indicator label="Magnetic" value={mag} color={accent} />
      </div>

      {/* live readouts */}
      <div className="relative z-10 w-full border-t border-white/5 px-5 py-3 grid grid-cols-3 gap-2 text-center">
        <Readout label="RPM" value={state.rpm?.toLocaleString() ?? "—"} />
        <Readout label="Load" value={state.loadPercent !== undefined ? `${state.loadPercent}%` : "—"} />
        <Readout label="Temp" value={state.temperatureC !== undefined ? `${state.temperatureC}°C` : "—"} />
      </div>
    </div>
  );
}

function Indicator({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value * 100)}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-slate-100">{value}</p>
    </div>
  );
}
