import { useCallback, useEffect, useRef, useState } from "react";

export interface Slide {
  eyebrow: string;
  heading: string;
  body: string;
  stat?: { label: string; value: string };
}

interface Props {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
}

export const NarratedSlideshow = ({ slides, intervalMs = 6000, className = "" }: Props) => {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const next = useCallback(() => setI((v) => (v + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setI((v) => (v - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduced || slides.length <= 1) return;
    const t = setTimeout(next, intervalMs);
    return () => clearTimeout(t);
  }, [i, paused, reduced, intervalMs, next, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!rootRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const s = slides[i];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className={`relative rounded-sm border p-6 md:p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] ${className}`}
      style={{
        borderColor: "rgba(201,162,74,0.42)",
        background: "rgba(16,30,52,0.82)",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 56px #c9a24a22",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* progress */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-[rgba(201,162,74,0.15)] overflow-hidden">
        <div
          key={i + (paused ? "-p" : "-r")}
          className="h-full"
          style={{
            width: "100%",
            background: "linear-gradient(90deg,#8f6f2b,#c9a24a,#eed99a)",
            transformOrigin: "left",
            animation: paused || reduced ? "none" : `slideshow-progress ${intervalMs}ms linear forwards`,
          }}
        />
      </div>

      <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[180px]">
        <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#c9a24a]">{s.eyebrow}</div>
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#eef6ff] mt-2">{s.heading}</h3>
        <p className="text-sm text-[#c8d4e2] leading-relaxed mt-3 max-w-3xl">{s.body}</p>
        {s.stat && (
          <div className="mt-4 inline-flex items-center gap-2 mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 rounded-sm border"
               style={{ borderColor: "rgba(201,162,74,0.55)", background: "rgba(11,18,32,0.6)", color: "#c9a24a" }}>
            <span>{s.stat.label}</span>
            <span className="text-[#eed99a]">{s.stat.value}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={prev} className="mono text-[0.6rem] tracking-[0.24em] uppercase text-[#8fa3b8] hover:text-[#c9a24a]">← PREV</button>
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: idx === i ? "#c9a24a" : "rgba(201,162,74,0.35)",
                boxShadow: idx === i ? "0 0 8px #c9a24a" : undefined,
                transform: idx === i ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
        <button type="button" onClick={next} className="mono text-[0.6rem] tracking-[0.24em] uppercase text-[#8fa3b8] hover:text-[#c9a24a]">NEXT →</button>
      </div>

      <style>{`@keyframes slideshow-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
};
