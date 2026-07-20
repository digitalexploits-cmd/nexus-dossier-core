import { useState } from "react";

export interface ProposalSection {
  id: string;
  part: string; // e.g. "PART I"
  title: string;
  summary: string;
}

export interface ProposalStat {
  label: string;
  value: string;
}

interface Props {
  stats: ProposalStat[];
  sections: ProposalSection[];
}

export const ProposalWalkthrough = ({ stats, sections }: Props) => {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null);

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
      {/* stat strip */}
      <div className="flex flex-wrap gap-2 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 rounded-sm border flex items-center gap-2"
            style={{
              borderColor: "rgba(201,162,74,0.55)",
              background: "rgba(11,18,32,0.7)",
              color: "#c9a24a",
            }}
          >
            <span className="text-[#8fa3b8] normal-case tracking-normal font-normal">{s.label}</span>
            <span className="text-[#eed99a]">{s.value}</span>
          </div>
        ))}
      </div>

      {/* accordion */}
      <div className="space-y-2">
        {sections.map((sec) => {
          const isOpen = open === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-sm border overflow-hidden transition-all"
              style={{
                borderColor: isOpen ? "rgba(201,162,74,0.65)" : "rgba(201,162,74,0.32)",
                background: "rgba(11,18,32,0.55)",
                boxShadow: isOpen ? "0 0 32px -10px #c9a24a55" : undefined,
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : sec.id)}
                className="w-full text-left px-4 py-3 flex items-baseline justify-between gap-3 flex-wrap"
                aria-expanded={isOpen}
              >
                <span className="flex items-baseline gap-3 flex-wrap">
                  <span className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#c9a24a]">
                    {sec.part}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-[#eef6ff]">
                    {sec.title}
                  </span>
                </span>
                <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                  {isOpen ? "COLLAPSE ▲" : "EXPAND ▾"}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm text-[#c8d4e2] leading-relaxed max-w-3xl">
                    {sec.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
