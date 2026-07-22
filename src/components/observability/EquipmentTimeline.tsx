import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EquipmentEvent } from "@/types/observability";
import { HealthBadge } from "./HealthBadge";
import { formatDistanceToNow } from "date-fns";

interface EquipmentTimelineProps {
  events: EquipmentEvent[];
  className?: string;
  maxItems?: number;
}

const typeColor: Record<string, string> = {
  status_change: "bg-amber-400",
  alert: "bg-orange-400",
  maintenance: "bg-sky-400",
  upload: "bg-violet-400",
  validation: "bg-emerald-400",
  note: "bg-slate-400",
};

export function EquipmentTimeline({ events, className, maxItems = 8 }: EquipmentTimelineProps) {
  const items = events.slice(0, maxItems);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/30 via-slate-600/40 to-transparent" />

      <ul className="space-y-4">
        {items.map((evt, i) => (
          <motion.li
            key={evt.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative flex gap-4 pl-1"
          >
            <div
              className={cn(
                "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-[#0a1424]",
                typeColor[evt.type] ?? "bg-slate-400",
              )}
            />
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-100">{evt.title}</p>
                {evt.healthState && (
                  <HealthBadge state={evt.healthState} size="sm" />
                )}
              </div>
              {evt.description && (
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{evt.description}</p>
              )}
              <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                {formatDistanceToNow(new Date(evt.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
