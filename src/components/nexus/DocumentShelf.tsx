import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DocViewer } from "./DocViewer";
import { documentsForBay, type BayId, type DocItem } from "@/data/content";

interface Props {
  bay: BayId;
  eyebrow?: string;
  title?: string;
  extras?: React.ReactNode;
}

const kindIcon: Record<DocItem["kind"], string> = {
  pdf: "▤",
  image: "◫",
  video: "▷",
  html: "◈",
  text: "≡",
};

export const DocumentShelf = ({ bay, eyebrow = "FILES ON RECORD", title = "Documents", extras }: Props) => {
  const items = documentsForBay(bay);
  const [active, setActive] = useState<DocItem | null>(null);

  if (items.length === 0) return null;

  const open = (d: DocItem) => {
    setActive(d);
  };

  return (
    <section className="container py-10">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff]">
          {eyebrow}
        </div>
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
          {String(items.length).padStart(2, "0")} {title.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => open(d)}
            className="group relative text-left rounded-sm border border-[rgba(130,205,255,0.42)] bg-[linear-gradient(180deg,rgba(38,64,100,0.80),rgba(22,40,66,0.88))] backdrop-blur-md p-4 hover:border-[rgba(130,205,255,0.65)] transition-colors flex flex-col justify-between min-h-[150px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.35)] text-[#4db7ff]">
                  {(d.category ?? d.kind).toUpperCase()}
                </Badge>
                <span className="mono text-[0.6rem] tracking-[0.24em] text-[#8fa3b8]">
                  {d.featured ? "FEATURED" : d.date ?? ""}
                </span>
              </div>
              <div className="mt-2 text-sm font-medium leading-snug text-[#eef6ff]">{d.title}</div>
              {d.description && (
                <div className="text-xs text-[#8fa3b8] mt-1 line-clamp-2">{d.description}</div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                <span className="mr-2 text-[#4db7ff]">{kindIcon[d.kind]}</span>{d.kind.toUpperCase()}
              </span>
              <span className="mono text-[0.6rem] text-[#4db7ff] group-hover:text-[#7dd3ff]">OPEN →</span>
            </div>
          </button>
        ))}
        {extras}
      </div>

      <DocViewer doc={active} onOpenChange={(o) => { if (!o) setActive(null); }} />
    </section>
  );
};
