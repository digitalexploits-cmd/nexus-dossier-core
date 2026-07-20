import { useEffect, useRef, useState } from "react";

export interface TimelineItem {
  date: string;
  decisionNumber: string;
  title: string;
  reason: string;
  evidence?: string;
  affected?: string;
}

interface Props {
  items: TimelineItem[];
  className?: string;
}

export const DecisionTimeline = ({ items, className = "" }: Props) => {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            if (e.isIntersecting) {
              const idx = Number((e.target as HTMLElement).dataset.idx);
              next.add(idx);
            }
          }
          return next;
        });
      },
      { threshold: 0.15 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items.length]);

  return (
    <ol className={`relative ${className}`}>
      {/* vertical gold rail */}
      <div className="absolute left-3.5 md:left-4 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent, #c9a24a 12%, #c9a24a 88%, transparent)" }} />
      {items.map((it, i) => {
        const isVisible = visible.has(i);
        const isOpen = openIdx === i;
        return (
          <li
            key={it.decisionNumber}
            data-idx={i}
            ref={(el) => (refs.current[i] = el)}
            className="relative pl-10 md:pl-12 pb-6 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${(i % 4) * 80}ms`,
            }}
          >
            {/* node */}
            <span
              className="absolute left-2 md:left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2"
              style={{
                borderColor: "#c9a24a",
                background: isOpen ? "#c9a24a" : "rgba(11,18,32,0.9)",
                boxShadow: "0 0 12px #c9a24a88",
              }}
            />
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full text-left rounded-sm border p-4 transition-all"
              style={{
                borderColor: isOpen ? "rgba(201,162,74,0.65)" : "rgba(201,162,74,0.32)",
                background: "rgba(16,30,52,0.82)",
                boxShadow: isOpen ? "0 0 32px -8px #c9a24a66" : undefined,
              }}
              aria-expanded={isOpen}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#c9a24a]">
                  {it.decisionNumber} · {it.date}
                </div>
                <div className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                  {isOpen ? "COLLAPSE ▲" : "EXPAND ▾"}
                </div>
              </div>
              <div className="text-sm md:text-base font-semibold text-[#eef6ff] mt-1.5">{it.title}</div>
              {isOpen && (
                <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                  <Row label="Reason" value={it.reason} />
                  {it.evidence && <Row label="Evidence" value={it.evidence} />}
                  {it.affected && <Row label="Affected" value={it.affected} />}
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="text-xs">
    <div className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#c9a24a] mb-0.5">{label}</div>
    <div className="text-[#c8d4e2] leading-relaxed">{value}</div>
  </div>
);
