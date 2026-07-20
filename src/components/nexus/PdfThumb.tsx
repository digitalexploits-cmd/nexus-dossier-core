/**
 * PdfThumb — renders page 1 of a PDF as a low-res thumbnail using pdf.js.
 * Results are cached in-memory (per URL) to avoid re-rendering.
 */
import { useEffect, useRef, useState } from "react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

 

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const CACHE = new Map<string, string>();
const INFLIGHT = new Map<string, Promise<string>>();

async function renderThumb(url: string): Promise<string> {
  if (CACHE.has(url)) return CACHE.get(url)!;
  if (INFLIGHT.has(url)) return INFLIGHT.get(url)!;

  const p = (async () => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = 400;
    const scale = Math.min(0.7, targetWidth / baseViewport.width);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvas, canvasContext: ctx, viewport } as never).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
    CACHE.set(url, dataUrl);
    INFLIGHT.delete(url);
    return dataUrl;
  })();
  INFLIGHT.set(url, p);
  return p;
}

interface Props {
  url: string;
  alt?: string;
  className?: string;
  fallbackGlyph?: string;
}

export const PdfThumb = ({ url, alt = "PDF thumbnail", className, fallbackGlyph = "▤" }: Props) => {
  const [src, setSrc] = useState<string | null>(() => CACHE.get(url) ?? null);
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (CACHE.has(url)) { setSrc(CACHE.get(url)!); return; }
    setSrc(null);
    setFailed(false);
    renderThumb(url)
      .then((d) => { if (mounted.current) setSrc(d); })
      .catch(() => { if (mounted.current) setFailed(true); });
    return () => { mounted.current = false; };
  }, [url]);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-[linear-gradient(160deg,#101e34,#1a2c48)] text-[#c9a24a] ${className ?? ""}`}>
        <span className="text-5xl opacity-70">{fallbackGlyph}</span>
      </div>
    );
  }
  if (!src) {
    return (
      <div className={`relative overflow-hidden bg-[#101e34] ${className ?? ""}`}>
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.02)_0%,rgba(201,162,74,0.10)_50%,rgba(255,255,255,0.02)_100%)]" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" />;
};
