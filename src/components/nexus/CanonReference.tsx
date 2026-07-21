import { useMemo, useState } from "react";

export interface CanonTerm {
  term: string;
  category: string;
  short: string;
  long?: string;
}

interface Props {
  terms: CanonTerm[];
}

export const CanonReference = ({ terms }: Props) => {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of terms) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
  }, [terms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      if (activeCat && t.category !== activeCat) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q) ||
        (t.long?.toLowerCase().includes(q) ?? false) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [terms, query, activeCat]);

  return (
    <div
      className="rounded-sm border p-5 md:p-6"
      style={{
        borderColor: "rgba(201,162,74,0.42)",
        background: "rgba(16,30,52,0.82)",
        boxShadow:
          "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 56px #c9a24a22",
      }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter terms…"
          className="flex-1 min-w-[180px] bg-[rgba(11,18,32,0.7)] border rounded-sm px-3 py-2 text-sm text-[#eef6ff] placeholder:text-[#8fa3b8] outline-none focus:border-[#c9a24a]"
          style={{ borderColor: "rgba(201,162,74,0.35)" }}
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" count={terms.length} active={activeCat === null} onClick={() => setActiveCat(null)} />
          {categories.map((c) => (
            <FilterChip
              key={c.label}
              label={c.label}
              count={c.count}
              active={activeCat === c.label}
              onClick={() => setActiveCat(activeCat === c.label ? null : c.label)}
            />
          ))}
        </div>
      </div>

      <div className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8] mb-2">
        {String(filtered.length).padStart(2, "0")} TERMS
      </div>

      <ul className="divide-y" style={{ borderColor: "rgba(201,162,74,0.2)" }}>
        {filtered.map((t) => {
          const isOpen = open === t.term;
          return (
            <li key={t.term} className="border-t first:border-t-0" style={{ borderColor: "rgba(201,162,74,0.2)" }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : t.term)}
                className="w-full text-left py-3 px-1 flex items-baseline justify-between gap-3 flex-wrap"
                aria-expanded={isOpen}
              >
                <span className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-[#eef6ff]">{t.term}</span>
                  <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#c9a24a]">
                    {t.category}
                  </span>
                </span>
                <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                  {isOpen ? "▲" : "▾"}
                </span>
              </button>
              <p className="text-xs md:text-sm text-[#c8d4e2] leading-relaxed pb-3 max-w-3xl">
                {t.short}
              </p>
              {isOpen && t.long && (
                <p className="text-xs text-[#8fa3b8] leading-relaxed pb-4 pl-3 border-l-2 max-w-3xl animate-in fade-in duration-200"
                   style={{ borderColor: "#c9a24a" }}>
                  {t.long}
                </p>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-6 text-center mono text-[0.6rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
            No matches
          </li>
        )}
      </ul>
    </div>
  );
};

const FilterChip = ({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mono text-[0.55rem] tracking-[0.24em] uppercase px-2.5 py-1 rounded-sm border transition-all inline-flex items-center gap-1.5"
    style={{
      borderColor: active ? "#c9a24a" : "rgba(201,162,74,0.35)",
      background: active ? "rgba(201,162,74,0.15)" : "rgba(11,18,32,0.5)",
      color: active ? "#eed99a" : "#c8d4e2",
    }}
  >
    <span>{label}</span>
    {typeof count === "number" && (
      <span className="tabular-nums text-[0.5rem] text-[#8fa3b8]">{String(count).padStart(2, "0")}</span>
    )}
  </button>
);
