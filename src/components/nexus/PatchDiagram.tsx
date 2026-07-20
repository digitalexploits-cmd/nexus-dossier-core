export interface PatchRule {
  dataset: string;
  rule: string;
}

interface Props {
  status: string;
  purpose: string;
  rules: PatchRule[];
}

const ShieldIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const PatchDiagram = ({ status, purpose, rules }: Props) => (
  <div
    className="rounded-sm border p-5 md:p-6"
    style={{
      borderColor: "rgba(201,162,74,0.42)",
      background: "rgba(16,30,52,0.82)",
      boxShadow:
        "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 56px #c9a24a22",
    }}
  >
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <span
        className="mono text-[0.6rem] tracking-[0.28em] uppercase px-3 py-1.5 rounded-sm border flex items-center gap-2"
        style={{
          borderColor: "rgba(201,162,74,0.65)",
          background: "rgba(11,18,32,0.7)",
          color: "#eed99a",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#c9a24a", boxShadow: "0 0 6px #c9a24a" }}
        />
        {status}
      </span>
    </div>
    <p className="text-xs md:text-sm text-[#c8d4e2] leading-relaxed max-w-3xl mb-5">
      {purpose}
    </p>

    <div className="grid gap-3 md:grid-cols-3">
      {rules.map((r) => (
        <div
          key={r.dataset}
          className="rounded-sm border p-4 flex flex-col gap-2"
          style={{
            borderColor: "rgba(201,162,74,0.55)",
            background: "rgba(11,18,32,0.7)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-2 text-[#c9a24a]">
            <ShieldIcon />
            <span className="mono text-[0.6rem] tracking-[0.24em] uppercase">
              Enforced Rule
            </span>
          </div>
          <div className="text-sm font-semibold text-[#eed99a]">{r.dataset}</div>
          <p className="text-xs text-[#c8d4e2] leading-relaxed">{r.rule}</p>
        </div>
      ))}
    </div>
  </div>
);
