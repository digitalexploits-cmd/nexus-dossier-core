import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DocViewer } from "./DocViewer";
import { PdfThumb } from "./PdfThumb";
import { VideoThumb } from "./VideoThumb";
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

const CardThumb = ({ d }: { d: DocItem }) => {
  const cls = "w-full h-full object-cover";
  if (d.thumb) {
    return <img src={d.thumb} alt={d.title} className={cls} loading="lazy" />;
  }
  if (d.kind === "pdf") return <PdfThumb url={d.href} className={cls} alt={d.title} />;
  if (d.kind === "video") return <VideoThumb url={d.href} className={cls} alt={d.title} />;
  if (d.kind === "image") return <img src={d.href} alt={d.title} className={cls} loading="lazy" />;
  return (
    <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(160deg,#101e34,#1a2c48)] text-[#c9a24a] text-5xl opacity-70">
      {kindIcon[d.kind]}
    </div>
  );
};

export const DocumentShelf = ({ bay, eyebrow = "FILES ON RECORD", title = "Documents", extras }: Props) => {
  const items = documentsForBay(bay);
  const [active, setActive] = useState<DocItem | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff]">{eyebrow}</div>
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
          {String(items.length).padStart(2, "0")} {title.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActive(d)}
            className="group relative text-left rounded-sm border border-[rgba(130,205,255,0.42)] bg-[linear-gradient(180deg,rgba(38,64,100,0.80),rgba(22,40,66,0.88))] backdrop-blur-md hover:border-[rgba(201,162,74,0.75)] hover:shadow-[0_0_24px_rgba(201,162,74,0.25)] transition-all flex flex-col overflow-hidden min-h-[280px]"
          >
            {/* Thumbnail — top ~65% */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0b1220]">
              <CardThumb d={d} />
              {/* Category / featured badge overlay top-left */}
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(201,162,74,0.65)] bg-[rgba(11,18,32,0.75)] text-[#c9a24a] backdrop-blur-sm">
                  {(d.featured ? "FEATURED" : (d.category ?? d.kind)).toUpperCase()}
                </Badge>
              </div>
              {/* Kind icon chip top-right */}
              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(11,18,32,0.85)] border border-[rgba(201,162,74,0.55)] backdrop-blur-sm flex items-center justify-center text-[#c9a24a] text-sm">
                {kindIcon[d.kind]}
              </div>
              {/* Bottom gradient scrim */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(11,18,32,0.85),transparent)] pointer-events-none" />
            </div>

            {/* Meta strip */}
            <div className="p-3 flex-1 flex flex-col">
              <div className="text-sm font-medium leading-snug text-[#eef6ff]">{d.title}</div>
              {d.description && (
                <div className="text-xs text-[#8fa3b8] mt-1 line-clamp-2">{d.description}</div>
              )}
              {d.stats && d.stats.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.stats.map((s) => (
                    <span
                      key={s.label}
                      className="mono text-[0.55rem] tracking-[0.16em] uppercase px-2 py-0.5 rounded-sm border border-[rgba(201,162,74,0.45)] bg-[rgba(11,18,32,0.6)] text-[#c9a24a]"
                    >
                      {s.label} <span className="text-[#eed99a]">{s.value}</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                  {d.date ?? d.kind.toUpperCase()}
                </span>
                <span className="mono text-[0.6rem] text-[#4db7ff] group-hover:text-[#c9a24a]">OPEN →</span>
              </div>
            </div>
          </button>
        ))}
        {extras}
      </div>

      <DocViewer doc={active} onOpenChange={(o) => { if (!o) setActive(null); }} />
    </section>
  );
};
