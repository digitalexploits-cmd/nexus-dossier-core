import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiCardData } from "@/types/observability";
import { HealthBadge } from "./HealthBadge";

interface KpiCardProps {
  data: KpiCardData;
  className?: string;
  index?: number;
}

export function KpiCard({ data, className, index = 0 }: KpiCardProps) {
  const TrendIcon =
    data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10",
        "bg-gradient-to-br from-[#0c1a2e]/90 to-[#08101c]/95",
        "p-5 shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      {/* subtle gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {data.label}
        </p>
        {data.status && <HealthBadge state={data.status} size="sm" showLabel={false} />}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-white tabular-nums">
          {data.value}
        </span>
        {data.unit && (
          <span className="text-sm text-slate-400 font-medium">{data.unit}</span>
        )}
      </div>

      {(data.trend || data.trendValue !== undefined) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <TrendIcon
            className={cn(
              "h-3.5 w-3.5",
              data.trend === "up" && "text-emerald-400",
              data.trend === "down" && "text-rose-400",
              data.trend === "flat" && "text-slate-500",
            )}
          />
          {data.trendValue !== undefined && (
            <span
              className={cn(
                "font-medium tabular-nums",
                data.trend === "up" && "text-emerald-400",
                data.trend === "down" && "text-rose-400",
                data.trend === "flat" && "text-slate-400",
              )}
            >
              {data.trendValue > 0 ? "+" : ""}
              {data.trendValue}
              {typeof data.value === "number" && data.unit === "%" ? "pp" : ""}
            </span>
          )}
          {data.trendLabel && (
            <span className="text-slate-500">{data.trendLabel}</span>
          )}
        </div>
      )}

      {/* mini sparkline if provided */}
      {data.sparkline && data.sparkline.length > 1 && (
        <div className="mt-4 h-8 w-full">
          <svg viewBox={`0 0 ${data.sparkline.length - 1} 32`} className="h-full w-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="rgba(251,191,36,0.55)"
              strokeWidth="1.5"
              points={data.sparkline
                .map((v, i) => {
                  const min = Math.min(...data.sparkline!);
                  const max = Math.max(...data.sparkline!);
                  const y = 30 - ((v - min) / (max - min || 1)) * 28;
                  return `${i},${y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

interface KpiGridProps {
  items: KpiCardData[];
  className?: string;
}

export function KpiGrid({ items, className }: KpiGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", className)}>
      {items.map((item, i) => (
        <KpiCard key={item.id} data={item} index={i} />
      ))}
    </div>
  );
}
