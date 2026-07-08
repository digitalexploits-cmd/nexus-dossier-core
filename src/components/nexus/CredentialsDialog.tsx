import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CREDENTIALS, CREDENTIAL_ISSUER_ORDER } from "@/data/content";
import { OFFICIAL_CERTIFICATIONS, driveViewUrl, type OfficialCertification } from "@/data/officialCertifications";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CredentialsDialog = ({ open, onOpenChange }: Props) => {
  const [activeCert, setActiveCert] = useState<OfficialCertification | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 border-[rgba(130,205,255,0.42)] bg-[rgba(18,30,48,0.96)] backdrop-blur-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b border-[rgba(130,205,255,0.28)]">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.45)] text-[#4db7ff]">
              BUNDLE
            </Badge>
            <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
              CERTIFICATES
            </span>
          </div>
          <DialogTitle className="text-left text-[#eef6ff] text-base md:text-lg font-semibold mt-1">
            Credentials & Certifications
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 md:p-6">
          {/* Credentials */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-[#4db7ff]">CREDENTIALS</div>
              <div className="h-px flex-1 bg-[rgba(130,205,255,0.22)]" />
              <div className="mono text-[0.55rem] tracking-[0.24em] text-[#8fa3b8]">{String(CREDENTIALS.length).padStart(2, "0")}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CREDENTIAL_ISSUER_ORDER.map((issuer) => {
                const items = CREDENTIALS.filter((c) => c.issuer === issuer);
                if (items.length === 0) return null;
                return items.map((c) => (
                  <a
                    key={c.id}
                    href={c.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-sm border border-[rgba(130,205,255,0.42)] bg-[linear-gradient(180deg,rgba(38,64,100,0.80),rgba(22,40,66,0.88))] backdrop-blur-md p-4 hover:border-[rgba(130,205,255,0.65)] transition-colors flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.35)] text-[#4db7ff]">
                          {c.category.toUpperCase()}
                        </Badge>
                        {c.year && <span className="mono text-[0.6rem] tracking-[0.24em] text-[#8fa3b8]">{c.year}</span>}
                      </div>
                      <div className="mt-2 text-sm font-medium leading-snug text-[#eef6ff]">{c.title}</div>
                      <div className="text-xs text-[#8fa3b8] mt-0.5">{c.issuer}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">FILE ATTACHED</span>
                      <span className="mono text-[0.6rem] text-[#4db7ff] group-hover:text-[#7dd3ff]">OPEN →</span>
                    </div>
                  </a>
                ));
              })}
            </div>
          </div>

          {/* Certifications gallery */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-[#4db7ff]">OFFICIAL CERTIFICATIONS</div>
              <div className="h-px flex-1 bg-[rgba(130,205,255,0.22)]" />
              <div className="mono text-[0.55rem] tracking-[0.24em] text-[#8fa3b8]">{String(OFFICIAL_CERTIFICATIONS.length).padStart(2, "0")}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {OFFICIAL_CERTIFICATIONS.map((c) => (
                <button
                  key={c.file}
                  type="button"
                  onClick={() => setActiveCert(c)}
                  className="group relative flex flex-col rounded-sm border border-[rgba(130,205,255,0.42)] bg-[rgba(22,40,66,0.85)] backdrop-blur-md overflow-hidden text-left transition-all duration-300 hover:border-[hsl(var(--interactive))] hover:shadow-[0_0_0_1px_hsl(var(--interactive)/0.6),0_10px_30px_-10px_hsl(var(--interactive)/0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--interactive))]"
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
                    <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-[hsl(var(--interactive))]">{c.issuer}</div>
                    <div className="text-sm text-[#eef6ff] mt-1 leading-snug">{c.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inline lightbox for certifications */}
        {activeCert && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(3,6,12,0.92)] backdrop-blur-lg p-4 md:p-8"
            onClick={() => setActiveCert(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeCert.title}
          >
            <div
              className="relative w-full max-w-5xl bg-[#0b1220] border border-[rgba(130,205,255,0.35)] shadow-[0_0_0_1px_hsl(var(--interactive)/0.3),0_40px_120px_-40px_rgba(0,0,0,0.9)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-end px-3 py-2 border-b border-[rgba(130,205,255,0.18)]">
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="interactive mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 border border-[rgba(130,205,255,0.42)] text-[#c8d4e2] hover:border-[hsl(var(--interactive))] hover:text-[hsl(var(--interactive))] transition-colors"
                >
                  CLOSE ✕
                </button>
              </div>
              <div className="bg-[#050810] flex items-center justify-center px-4 py-4 md:px-8 md:py-6">
                <img
                  src={`/media/certifications/${activeCert.file}`}
                  alt={`${activeCert.title} — ${activeCert.issuer} certificate`}
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
              <div className="px-4 py-4 md:px-6 md:py-5 border-t border-[rgba(130,205,255,0.22)] bg-[rgba(6,14,26,0.6)]">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mono text-[0.55rem] tracking-[0.3em] uppercase text-[hsl(var(--interactive))]">{activeCert.issuer}</div>
                    <h2 className="mt-1 text-base md:text-lg text-[#eef6ff] leading-snug font-medium">{activeCert.title}</h2>
                    {activeCert.date && (
                      <div className="mt-1.5 mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8fa3b8]">ISSUED {activeCert.date}</div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-wrap gap-2">
                    <a
                      href={driveViewUrl(activeCert.driveId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive inline-flex items-center gap-2 mono text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2.5 border border-[rgba(130,205,255,0.42)] text-[#c8d4e2] hover:border-[hsl(var(--interactive))] hover:text-[hsl(var(--interactive))] transition-colors"
                    >
                      OPEN IN GOOGLE DRIVE →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
