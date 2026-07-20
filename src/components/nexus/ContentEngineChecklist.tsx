import { useMemo, useState } from "react";

const CHECKLIST_ITEMS = [
  "Is the claim supported?",
  "Does it reveal protected implementation?",
  "Does it imply AI replaces people?",
  "Does it overstate validation?",
  "Does it align with the Living Technical Canon?",
  "Does it direct attention to the company or website?",
  "Does it build trust?",
  "Would a reviewer, engineer, or investor read it as credible?",
];

const POSITIONING = [
  { label: "PRINCIPLE 01", value: "Human judgment leads." },
  { label: "PRINCIPLE 02", value: "Evidence decides." },
  { label: "PRINCIPLE 03", value: "AI accelerates." },
];

const APPROVED = [
  "Clear",
  "Direct",
  "Industrial",
  "Evidence-based",
  "Founder-led",
  "Ambitious",
  "Trust-building",
  "Technically serious",
];

const AVOID = [
  "Magical",
  "Overhyped",
  "Fully autonomous",
  "Anti-worker",
  "Anti-engineer",
  "Replacement-focused",
  "Unsupported",
  "Secretive without purpose",
];

const CellClass =
  "border border-[rgba(130,205,255,0.38)] bg-[linear-gradient(180deg,rgba(36,62,98,0.78),rgba(22,40,66,0.86))] p-4";

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const ContentEngineChecklist = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const count = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const toggle = (i: number) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-6">
      {/* Part A — Positioning */}
      <div>
        <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">
          PART A · CORE POSITIONING
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {POSITIONING.map((p) => (
            <div key={p.label} className={CellClass}>
              <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#4db7ff]">
                {p.label}
              </div>
              <div className="text-sm text-[#eef6ff] mt-2 leading-snug">{p.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Part B — Checklist */}
      <div>
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
          <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#4db7ff]">
            PART B · CONTENT SAFETY CHECKLIST
          </div>
          <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
            {count} / {CHECKLIST_ITEMS.length} REVIEWED
          </div>
        </div>
        <p className="text-xs text-[#8fa3b8] mb-3">
          Applied before every public post, image, video, or technical brief.
        </p>
        <div className={CellClass}>
          <ul className="space-y-2">
            {CHECKLIST_ITEMS.map((item, i) => {
              const on = !!checked[i];
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    <span
                      className="mt-0.5 w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors"
                      style={{
                        borderColor: on ? "#4db7ff" : "rgba(130,205,255,0.45)",
                        background: on ? "rgba(77,183,255,0.22)" : "rgba(11,18,32,0.6)",
                        color: "#4db7ff",
                        boxShadow: on ? "0 0 10px rgba(77,183,255,0.45)" : undefined,
                      }}
                    >
                      {on && <CheckIcon />}
                    </span>
                    <span
                      className="text-xs md:text-sm leading-relaxed transition-colors"
                      style={{ color: on ? "#eef6ff" : "#c8d4e2" }}
                    >
                      <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8] mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Part C — Tone guide */}
      <div>
        <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-2">
          PART C · TONE GUIDE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={CellClass}>
            <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#4db7ff] mb-3">
              APPROVED
            </div>
            <div className="flex flex-wrap gap-2">
              {APPROVED.map((t) => (
                <span
                  key={t}
                  className="mono text-[0.55rem] tracking-[0.24em] uppercase px-2.5 py-1 rounded-sm border"
                  style={{
                    borderColor: "rgba(130,205,255,0.55)",
                    background: "rgba(11,18,32,0.6)",
                    color: "#c8e6ff",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className={CellClass}>
            <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[#a89696] mb-3">
              AVOID
            </div>
            <div className="flex flex-wrap gap-2">
              {AVOID.map((t) => (
                <span
                  key={t}
                  className="mono text-[0.55rem] tracking-[0.24em] uppercase px-2.5 py-1 rounded-sm border line-through"
                  style={{
                    borderColor: "rgba(160,120,120,0.45)",
                    background: "rgba(24,18,22,0.5)",
                    color: "#b09a9a",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
