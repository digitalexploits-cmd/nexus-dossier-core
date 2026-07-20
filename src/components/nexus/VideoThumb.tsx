/**
 * VideoThumb — captures a poster frame (~1s) from a video URL to canvas.
 * Cached in-memory per URL.
 */
import { useEffect, useRef, useState } from "react";

const CACHE = new Map<string, string>();
const INFLIGHT = new Map<string, Promise<string>>();

function grab(url: string): Promise<string> {
  if (CACHE.has(url)) return Promise.resolve(CACHE.get(url)!);
  if (INFLIGHT.has(url)) return INFLIGHT.get(url)!;
  const p = new Promise<string>((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    let settled = false;
    const done = (fn: () => void) => { if (!settled) { settled = true; fn(); } };
    const onErr = () => done(() => { INFLIGHT.delete(url); reject(new Error("video load")); });
    video.addEventListener("error", onErr);
    video.addEventListener("loadedmetadata", () => {
      try { video.currentTime = Math.min(1, (video.duration || 2) * 0.1); } catch { onErr(); }
    });
    video.addEventListener("seeked", () => {
      try {
        const w = 400;
        const scale = w / (video.videoWidth || w);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = Math.round((video.videoHeight || 225) * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg", 0.7);
        CACHE.set(url, data);
        INFLIGHT.delete(url);
        done(() => resolve(data));
      } catch { onErr(); }
    });
  });
  INFLIGHT.set(url, p);
  return p;
}

interface Props { url: string; alt?: string; className?: string; }

export const VideoThumb = ({ url, alt = "Video poster", className }: Props) => {
  const [src, setSrc] = useState<string | null>(() => CACHE.get(url) ?? null);
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (CACHE.has(url)) { setSrc(CACHE.get(url)!); return; }
    setSrc(null); setFailed(false);
    grab(url)
      .then((d) => { if (mounted.current) setSrc(d); })
      .catch(() => { if (mounted.current) setFailed(true); });
    return () => { mounted.current = false; };
  }, [url]);

  return (
    <div className={`relative overflow-hidden bg-[#0a1424] ${className ?? ""}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      ) : failed ? (
        <div className="w-full h-full flex items-center justify-center text-[#c9a24a] text-5xl opacity-70">▷</div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.02)_0%,rgba(201,162,74,0.10)_50%,rgba(255,255,255,0.02)_100%)]" />
      )}
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
        <div className="w-14 h-14 rounded-full border-2 border-[#c9a24a] bg-black/50 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-[#c9a24a] ml-1" />
        </div>
      </div>
    </div>
  );
};
