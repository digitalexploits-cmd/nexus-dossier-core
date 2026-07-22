import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Clock, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResultItem } from "@/types/observability";

interface ValidationResultsPanelProps {
  results: ValidationResultItem[];
  className?: string;
}

const statusConfig = {
  pass: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  fail: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
  partial: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
  pending: { icon: Clock, color: "text-sky-400", bg: "bg-sky-400/10" },
  not_run: { icon: CircleDashed, color: "text-slate-500", bg: "bg-slate-500/10" },
};

export function ValidationResultsPanel({ results, className }: ValidationResultsPanelProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {results.map((item, i) => {
        const cfg = statusConfig[item.status] ?? statusConfig.not_run;
        const Icon = cfg.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-3 rounded-lg border border-white/8 bg-[#0c1829]/70 px-3.5 py-3"
          >
            <div className={cn("mt-0.5 rounded-md p-1.5", cfg.bg)}>
              <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-100">{item.name}</p>
                <span className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-500 bg-white/5">
                  {item.category}
                </span>
              </div>
              {item.message && (
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{item.message}</p>
              )}
              {item.score !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 max-w-[120px] overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        item.score >= 80 ? "bg-emerald-400" : item.score >= 50 ? "bg-amber-400" : "bg-rose-400",
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] tabular-nums text-slate-400">{item.score}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
