import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SpectrumFrame } from "@/types/observability";

interface SpectrumWaterfallProps {
  frame?: SpectrumFrame;
  className?: string;
  /** Height of the main spectrum plot */
  height?: number;
  showWaterfall?: boolean;
}

/**
 * Pure presentational spectrum + optional waterfall placeholder.
 * Accepts any SpectrumFrame that satisfies the interface.
 * No analysis logic – renders whatever bins are supplied.
 */
export function SpectrumWaterfall({
  frame,
  className,
  height = 160,
  showWaterfall = true,
}: SpectrumWaterfallProps) {
  if (!frame || !frame.bins?.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0a1424]/60 text-sm text-slate-500",
          className,
        )}
        style={{ height }}
      >
        Awaiting spectrum data
      </div>
    );
  }

  const bins = frame.bins;
  const maxMag = Math.max(...bins.map((b) => b.magnitude), 0.001);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("rounded-xl border border-white/8 bg-[#0a1424]/80 overflow-hidden", className)}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Spectrum
        </span>
        <span className="text-[10px] text-slate-500 tabular-nums">
          {frame.sampleRateHz.toLocaleString()} Hz · {bins.length} bins
        </span>
      </div>

      {/* Main spectrum bars */}
      <div className="px-3 pb-2" style={{ height }}>
        <svg viewBox={`0 0 ${bins.length} 100`} className="h-full w-full" preserveAspectRatio="none">
          {bins.map((bin, i) => {
            const h = (bin.magnitude / maxMag) * 92;
            return (
              <rect
                key={i}
                x={i}
                y={100 - h}
                width={0.85}
                height={h}
                fill="url(#specGrad)"
                opacity={0.85}
              />
            );
          })}
          <defs>
            <linearGradient id="specGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(251,191,36,0.15)" />
              <stop offset="60%" stopColor="rgba(251,191,36,0.7)" />
              <stop offset="100%" stopColor="rgba(253,224,71,0.95)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Waterfall history strip */}
      {showWaterfall && frame.history && frame.history.length > 0 && (
        <div className="border-t border-white/5 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Waterfall</div>
          <div className="flex gap-px h-12">
            {frame.history.map((row, ri) => {
              const rowMax = Math.max(...row.map((b) => b.magnitude), 0.001);
              return (
                <div key={ri} className="flex-1 flex flex-col-reverse gap-px">
                  {row.slice(0, 24).map((bin, bi) => {
                    const intensity = bin.magnitude / rowMax;
                    return (
                      <div
                        key={bi}
                        className="w-full flex-1 rounded-[1px]"
                        style={{
                          backgroundColor: `rgba(251, 191, 36, ${0.15 + intensity * 0.75})`,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
