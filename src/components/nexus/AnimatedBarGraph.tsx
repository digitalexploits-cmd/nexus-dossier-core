import { useEffect, useRef, useState } from "react";

export interface BarItem {
  label: string;
  value: number; // 0-100
  status: "Active" | "Planned";
  detail: string;
}

interface Props {
  items: BarItem[];
  className?: string;
}

export const AnimatedBarGraph = ({ items, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`space-y-3 ${className}`}>
      {items.map((it, i) => {
        const isActive = it.status === "Active";
        const gold = isActive ? "#c9a24a" : "#c9a24a80";
        const w = visible ? it.value : 0;
        const isOpen = expanded === i;
        return (
          <div key={it.label}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full text-left group interactive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a24a] rounded-sm"
              aria-expanded={isOpen}
              aria-label={`${it.label} — ${it.status} at ${it.value}%. ${isOpen ? "Collapse" : "Expand"} details.`}
            >
              <div className="flex items-baseline justify-between mb-1.5 gap-3 flex-wrap">
                <span className="mono text-[0.7rem] tracking-[0.16em] uppercase text-[#eef6ff] flex items-center gap-2">
                  <span
                    className="mono text-[0.55rem] text-[#8fa3b8] tabular-nums"
                    aria-hidden
                  >{String(i + 1).padStart(2, "0")}</span>
                  {it.label}
                </span>
                <span className="mono text-[0.55rem] tracking-[0.24em] uppercase flex items-center gap-2" style={{ color: gold }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold, boxShadow: isActive ? `0 0 6px ${gold}` : undefined }} />
                  {it.status}
                  <span className="tabular-nums text-[#eef6ff] w-10 text-right">{it.value}%</span>
                  <span aria-hidden className="text-[#8fa3b8] transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                </span>
              </div>
              <div
                className="relative h-2.5 rounded-sm overflow-hidden border"
                style={{ borderColor: "rgba(201,162,74,0.35)", background: "rgba(11,18,32,0.7)" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${w}%`,
                    background: isActive
                      ? `linear-gradient(90deg, #8f6f2b, #c9a24a, #eed99a)`
                      : `repeating-linear-gradient(45deg, ${gold}, ${gold} 4px, transparent 4px, transparent 8px)`,
                    boxShadow: isActive ? `0 0 12px #c9a24a55` : undefined,
                    transition: reduced ? "none" : `width 1200ms cubic-bezier(.22,.61,.36,1) ${i * 120}ms`,
                  }}
                />
              </div>
            </button>
            {isOpen && (
              <div className="mt-2 p-3 rounded-sm border text-xs leading-relaxed text-[#c8d4e2] animate-in fade-in duration-200"
                   style={{ borderColor: "rgba(201,162,74,0.35)", background: "rgba(16,30,52,0.82)" }}>
                {it.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
