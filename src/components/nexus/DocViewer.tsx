import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DocItem } from "@/data/content";

interface Props {
  doc: DocItem | null;
  onOpenChange: (open: boolean) => void;
}

const kindLabel: Record<DocItem["kind"], string> = {
  pdf: "PDF",
  image: "IMAGE",
  video: "VIDEO",
  html: "HTML",
  text: "TEXT",
};

const filenameFromHref = (href: string) => href.split("/").pop() || "document";

const TextBody = ({ href }: { href: string }) => {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancel = false;
    setText(null);
    setError(false);
    fetch(href)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => { if (!cancel) setText(t); })
      .catch(() => { if (!cancel) setError(true); });
    return () => { cancel = true; };
  }, [href]);

  if (error) return <NotAvailable />;
  if (text === null) return <div className="p-6 mono text-xs text-[#8fa3b8]">Loading…</div>;
  return (
    <pre className="p-4 text-xs leading-relaxed text-[#c8d4e2] font-mono overflow-auto max-h-[75vh] whitespace-pre-wrap">
      {text}
    </pre>
  );
};

const NotAvailable = () => (
  <div className="p-10 text-center mono text-xs tracking-widest text-[#8fa3b8]">
    DOCUMENT NOT AVAILABLE YET
  </div>
);

const Frame = ({ src, sandboxed = false }: { src: string; sandboxed?: boolean }) => {
  const [error, setError] = useState(false);
  if (error) return <NotAvailable />;
  return (
    <iframe
      src={src}
      title="document"
      className="w-full min-h-[75vh] bg-[#0b1220] border-0"
      sandbox={sandboxed ? "allow-same-origin allow-popups allow-forms allow-scripts" : undefined}
      onError={() => setError(true)}
    />
  );
};

const ImageBody = ({ src }: { src: string }) => {
  const [error, setError] = useState(false);
  if (error) return <NotAvailable />;
  return (
    <div className="w-full max-h-[75vh] overflow-auto flex items-center justify-center bg-[#0b1220] p-4">
      <img src={src} alt="document" className="max-w-full max-h-[75vh] object-contain" onError={() => setError(true)} />
    </div>
  );
};

const VideoBody = ({ src }: { src: string }) => (
  <div className="w-full bg-black flex items-center justify-center">
    <video src={src} controls className="max-h-[75vh] w-full" />
  </div>
);

export const DocViewer = ({ doc, onOpenChange }: Props) => {
  const open = !!doc;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 border-[rgba(130,205,255,0.42)] bg-[rgba(18,30,48,0.96)] backdrop-blur-md">
        {doc && (
          <>
            <DialogHeader className="p-4 border-b border-[rgba(130,205,255,0.28)]">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="mono text-[0.55rem] tracking-[0.24em] border-[rgba(80,160,255,0.45)] text-[#4db7ff]">
                  {kindLabel[doc.kind]}
                </Badge>
                {doc.category && (
                  <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
                    {doc.category}
                  </span>
                )}
                {doc.date && (
                  <span className="mono text-[0.55rem] tracking-[0.24em] text-[#8fa3b8]">{doc.date}</span>
                )}
              </div>
              <DialogTitle className="text-left text-[#eef6ff] text-base md:text-lg font-semibold mt-1">
                {doc.title}
              </DialogTitle>
            </DialogHeader>

            <div className="bg-[#0b1220]">
              {doc.kind === "pdf" && <Frame src={doc.href} />}
              {doc.kind === "html" && <Frame src={doc.href} sandboxed />}
              {doc.kind === "image" && <ImageBody src={doc.href} />}
              {doc.kind === "video" && <VideoBody src={doc.href} />}
              {doc.kind === "text" && <TextBody href={doc.href} />}
            </div>

            <div className="p-3 border-t border-[rgba(130,205,255,0.28)] flex flex-wrap items-center justify-end gap-2">
              <Button asChild variant="outline" className="mono tracking-widest text-[0.6rem] h-8">
                <a href={doc.href} target="_blank" rel="noopener noreferrer">OPEN IN NEW TAB</a>
              </Button>
              <Button asChild className="mono tracking-widest text-[0.6rem] h-8">
                <a href={doc.href} download={filenameFromHref(doc.href)}>DOWNLOAD</a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
