import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TelemetryChannel } from "@/types/observability";
import { HealthBadge } from "./HealthBadge";

interface TelemetryWidgetProps {
  channel: TelemetryChannel;
  className?: string;
  index?: number;
}

export function TelemetryWidget({ channel, className, index = 0 }: TelemetryWidgetProps) {
  const pct =
    channel.min !== undefined && channel.max !== undefined
      ? Math.min(100, Math.max(0, ((channel.current - channel.min) / (channel.max - channel.min)) * 100))
      : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 280, damping: 26 }}
      className={cn(
        "rounded-xl border border-white/8 bg-[#0a1424]/80 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {channel.label}
        </span>
        {channel.status && <HealthBadge state={channel.status} size="sm" showLabel={false} />}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-white">
          {channel.current.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <span className="text-xs text-slate-500">{channel.unit}</span>
      </div>

      {/* range bar */}
      {pct !== undefined && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      {/* sparkline */}
      {channel.sparkline && channel.sparkline.length > 1 && (
        <div className="mt-3 h-10 w-full opacity-80">
          <svg
            viewBox={`0 0 ${channel.sparkline.length - 1} 40`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`spark-${channel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251,191,36,0.35)" />
                <stop offset="100%" stopColor="rgba(251,191,36,0)" />
              </linearGradient>
            </defs>
            <polyline
              fill={`url(#spark-${channel.id})`}
              stroke="rgba(251,191,36,0.7)"
              strokeWidth="1.25"
              points={(() => {
                const vals = channel.sparkline!.map((p) => p.value);
                const min = Math.min(...vals);
                const max = Math.max(...vals);
                return channel
                  .sparkline!.map((p, i) => {
                    const y = 38 - ((p.value - min) / (max - min || 1)) * 36;
                    return `${i},${y}`;
                  })
                  .join(" ");
              })()}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

interface TelemetryGridProps {
  channels: TelemetryChannel[];
  className?: string;
}

export function TelemetryGrid({ channels, className }: TelemetryGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", className)}>
      {channels.map((ch, i) => (
        <TelemetryWidget key={ch.id} channel={ch} index={i} />
      ))}
    </div>
  );
}
