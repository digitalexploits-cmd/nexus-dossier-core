/**
 * Local-asset viewer — Layer 3 of the bay disclosure.
 * Only used for assets we serve ourselves. Drive-only assets are opened
 * in a new tab by the BayShell rather than proxied through here.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/data/bayCategories";

interface Props {
  asset: Asset | null;
  onClose: () => void;
  resolveHref: (a: Asset) => string;
}

export const AssetViewer = ({ asset, onClose, resolveHref }: Props) => {
  const open = Boolean(asset);
  const href = asset ? resolveHref(asset) : "";
  const filename = href.split("/").pop() ?? "asset";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 border-[rgba(130,205,255,0.42)] bg-[rgba(18,30,48,0.96)] backdrop-blur-md">
        {asset && (
          <>
            <DialogHeader className="p-4 border-b border-[rgba(130,205,255,0.28)]">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.45)] text-[#4db7ff]">
                  {asset.kind.toUpperCase()}
                </Badge>
                {asset.meta && (
                  <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">{asset.meta}</span>
                )}
              </div>
              <DialogTitle className="text-left text-[#eef6ff] text-base md:text-lg font-semibold mt-1">
                {asset.title}
              </DialogTitle>
            </DialogHeader>

            <div className="bg-[#0b1220]">
              {(asset.kind === "pdf" || asset.kind === "html" || asset.kind === "text" || asset.kind === "markdown") && (
                <iframe src={href} title={asset.title} className="w-full min-h-[75vh] bg-[#0b1220] border-0" />
              )}
              {asset.kind === "image" && (
                <div className="w-full max-h-[75vh] overflow-auto flex items-center justify-center bg-[#0b1220] p-4">
                  <img src={href} alt={asset.title} className="max-w-full max-h-[75vh] object-contain" />
                </div>
              )}
              {asset.kind === "video" && (
                <div className="w-full bg-black flex items-center justify-center">
                  <video
                    src={href}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="max-h-[75vh] w-full"
                  />
                </div>
              )}
              {asset.kind === "audio" && (
                <div className="w-full bg-[#0b1220] flex items-center justify-center p-6">
                  <audio src={href} controls autoPlay loop className="w-full" />
                </div>
              )}

            </div>

            <div className="p-3 border-t border-[rgba(130,205,255,0.28)] flex flex-wrap items-center justify-end gap-2">
              <Button asChild variant="outline" className="mono tracking-widest text-[0.6rem] h-8">
                <a href={href} target="_blank" rel="noopener noreferrer">OPEN IN NEW TAB</a>
              </Button>
              <Button asChild className="mono tracking-widest text-[0.6rem] h-8">
                <a href={href} download={filename}>DOWNLOAD</a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
