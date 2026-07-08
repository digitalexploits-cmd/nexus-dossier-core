import { useState } from "react";
import { OFFICIAL_CERTIFICATIONS, driveViewUrl, type OfficialCertification } from "@/data/officialCertifications";

// Full-width image gallery of the official certification badges/certificates.
// Images are page-1 renders of the source PDFs; clicking opens the original in Drive.
export const OfficialCertificationsGallery = () => {
  const [active, setActive] = useState<OfficialCertification | null>(null);

  return (
    <section className="container py-10">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#4db7ff]">
          05B / OFFICIAL CERTIFICATIONS · GALLERY
        </div>
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8]">
          {OFFICIAL_CERTIFICATIONS.length} CERTIFICATES ON FILE
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {OFFICIAL_CERTIFICATIONS.map((c) => (
          <button
            key={c.file}
            type="button"
            onClick={() => setActive(c)}
            className="interactive group relative flex flex-col rounded-sm border border-[rgba(130,205,255,0.42)] bg-[rgba(22,40,66,0.85)] backdrop-blur-md overflow-hidden text-left transition-all duration-300 hover:border-[hsl(var(--interactive))] hover:shadow-[0_0_0_1px_hsl(var(--interactive)/0.6),0_10px_30px_-10px_hsl(var(--interactive)/0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--interactive))]"
            aria-label={`Open certificate: ${c.title}`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
              <img
                src={`/media/certifications/${c.file}`}
                alt={`${c.title} — ${c.issuer} certificate`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,20,0.85)] via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="p-3">
              <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[hsl(var(--interactive))]">
                {c.issuer}
              </div>
              <div className="text-sm text-[#eef6ff] mt-1 leading-snug">{c.title}</div>
              <div className="mt-2 mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8] group-hover:text-[hsl(var(--interactive))]">
                VIEW CERTIFICATE →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(3,6,12,0.88)] backdrop-blur-md p-4 md:p-10"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0b1220] border border-[rgba(130,205,255,0.42)] shadow-[0_0_0_1px_hsl(var(--interactive)/0.4),0_40px_120px_-40px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(130,205,255,0.28)]">
              <div>
                <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[hsl(var(--interactive))]">
                  {active.issuer}
                </div>
                <div className="text-sm text-[#eef6ff] leading-tight">{active.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={driveViewUrl(active.driveId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 border border-[hsl(var(--interactive))] text-[hsl(var(--interactive))] hover:bg-[hsl(var(--interactive))] hover:text-[#03130a] transition-colors"
                >
                  OPEN IN DRIVE →
                </a>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="interactive mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 border border-[rgba(130,205,255,0.42)] text-[#c8d4e2] hover:border-[hsl(var(--interactive))] hover:text-[hsl(var(--interactive))]"
                  aria-label="Close"
                >
                  CLOSE ✕
                </button>
              </div>
            </div>
            <div className="bg-[#050810] flex items-center justify-center">
              <img
                src={`/media/certifications/${active.file}`}
                alt={`${active.title} — ${active.issuer} certificate`}
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
