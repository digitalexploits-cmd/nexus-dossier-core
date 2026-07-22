import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HealthState } from "@/types/observability";

const config: Record<
  HealthState,
  { label: string; bg: string; ring: string; text: string; glow: string }
> = {
  healthy: {
    label: "Healthy",
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-400/40",
    text: "text-emerald-300",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
  },
  degraded: {
    label: "Degraded",
    bg: "bg-amber-500/15",
    ring: "ring-amber-400/40",
    text: "text-amber-300",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",
  },
  warning: {
    label: "Warning",
    bg: "bg-orange-500/15",
    ring: "ring-orange-400/50",
    text: "text-orange-300",
    glow: "shadow-[0_0_24px_rgba(251,146,60,0.35)]",
  },
  critical: {
    label: "Critical",
    bg: "bg-rose-500/20",
    ring: "ring-rose-400/60",
    text: "text-rose-300",
    glow: "shadow-[0_0_28px_rgba(251,113,133,0.45)]",
  },
  offline: {
    label: "Offline",
    bg: "bg-slate-500/15",
    ring: "ring-slate-400/30",
    text: "text-slate-400",
    glow: "",
  },
  unknown: {
    label: "Unknown",
    bg: "bg-slate-600/20",
    ring: "ring-slate-500/30",
    text: "text-slate-400",
    glow: "",
  },
};

interface HealthBadgeProps {
  state: HealthState;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

export function HealthBadge({
  state,
  size = "md",
  showLabel = true,
  pulse = false,
  className,
}: HealthBadgeProps) {
  const c = config[state] ?? config.unknown;
  const sizeCls =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1.5"
      : size === "lg"
        ? "text-sm px-3.5 py-1.5 gap-2"
        : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "inline-flex items-center rounded-full ring-1 font-medium tracking-wide uppercase",
        c.bg,
        c.ring,
        c.text,
        c.glow,
        sizeCls,
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {(pulse || state === "warning" || state === "critical") && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
              state === "critical" ? "bg-rose-400" : "bg-orange-400",
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            state === "healthy" && "bg-emerald-400",
            state === "degraded" && "bg-amber-400",
            state === "warning" && "bg-orange-400",
            state === "critical" && "bg-rose-400",
            (state === "offline" || state === "unknown") && "bg-slate-500",
          )}
        />
      </span>
      {showLabel && <span>{c.label}</span>}
    </motion.div>
  );
}
