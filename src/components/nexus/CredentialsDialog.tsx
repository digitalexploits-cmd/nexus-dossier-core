import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CREDENTIALS, CREDENTIAL_ISSUER_ORDER } from "@/data/content";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CredentialsDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 border-[rgba(130,205,255,0.42)] bg-[rgba(18,30,48,0.96)] backdrop-blur-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b border-[rgba(130,205,255,0.28)]">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.45)] text-[#4db7ff]">
              BUNDLE
            </Badge>
            <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
              CREDENTIALS
            </span>
          </div>
          <DialogTitle className="text-left text-[#eef6ff] text-base md:text-lg font-semibold mt-1">
            Credentials Bundle
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 md:p-6">
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
      </DialogContent>
    </Dialog>
  );
};
