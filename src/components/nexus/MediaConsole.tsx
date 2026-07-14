import { useMemo, useState, useEffect } from "react";
import {
  MEDIA_LIBRARY,
  MEDIA_KIND_LABEL,
  MEDIA_KIND_ORDER,
  type MediaItem,
  type MediaKind,
} from "@/data/media";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const MediaConsole = ({ open, onClose }: Props) => {
  const [kind, setKind] = useState<MediaKind>("document");
  const [category, setCategory] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Items filtered by kind
  const kindItems = useMemo(
    () => MEDIA_LIBRARY.filter((m) => m.kind === kind),
    [kind]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    kindItems.forEach((m) => set.add(m.category));
    return ["All", ...Array.from(set).sort()];
  }, [kindItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kindItems.filter((m) => {
      if (category !== "All" && m.category !== category) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [kindItems, category, query]);

  // Auto-select first item when the filter/kind changes
  useEffect(() => {
    if (!open) return;
    if (filtered.length === 0) { setSelectedId(null); return; }
    if (!filtered.some((m) => m.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, open, selectedId]);

  // Reset category when kind changes
  useEffect(() => { setCategory("All"); }, [kind]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const selected = filtered.find((m) => m.id === selectedId) ?? null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
         onClick={onClose}>
      <div
        className="relative w-full max-w-6xl h-full max-h-[90vh] border border-primary/40 bg-background/95 flex flex-col shadow-[0_0_80px_rgba(212,168,74,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/25 px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="mono text-[0.6rem] tracking-[0.32em] text-primary">◆ VIEWING CONSOLE</span>
            <span className="font-display text-lg md:text-xl text-foreground">Rotunda Media Library</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close media console"
            className="mono text-xs text-muted-foreground hover:text-primary border border-primary/30 hover:border-primary/70 px-3 py-1"
          >
            ESC · CLOSE
          </button>
        </div>

        {/* Kind tabs */}
        <div className="flex items-center gap-2 border-b border-primary/20 px-4 md:px-6 py-2 overflow-x-auto">
          {MEDIA_KIND_ORDER.map((k) => {
            const count = MEDIA_LIBRARY.filter((m) => m.kind === k).length;
            const active = k === kind;
            return (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`mono text-[0.62rem] tracking-[0.28em] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${
                  active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-primary/25 text-muted-foreground hover:text-primary hover:border-primary/60"
                }`}
              >
                {MEDIA_KIND_LABEL[k]} <span className="opacity-60">· {count}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles…"
            className="mono text-xs bg-background/60 border border-primary/25 focus:border-primary/70 outline-none px-3 py-1.5 w-44 md:w-64 placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Body: sidebar + list + preview */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[180px_280px_1fr]">
          {/* Categories */}
          <div className="hidden md:block border-r border-primary/20 overflow-y-auto py-2">
            {categories.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`w-full text-left mono text-[0.62rem] tracking-[0.22em] uppercase px-4 py-2 border-l-2 transition-colors ${
                    active
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="border-r border-primary/20 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-6 mono text-xs text-muted-foreground">No items match.</div>
            )}
            {filtered.map((m) => {
              const active = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left px-4 py-3 border-b border-primary/10 transition-colors ${
                    active
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-primary/5 border-l-2 border-l-transparent"
                  }`}
                >
                  <div className={`text-sm truncate ${active ? "text-primary" : "text-foreground"}`}>
                    {m.title}
                  </div>
                  <div className="mono text-[0.55rem] tracking-[0.22em] uppercase text-muted-foreground mt-1">
                    {m.category} · {m.kind}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="min-w-0 flex flex-col">
            {selected ? (
              <MediaPreview item={selected} />
            ) : (
              <div className="flex-1 flex items-center justify-center mono text-xs text-muted-foreground">
                Select an item to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaPreview = ({ item }: { item: MediaItem }) => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-primary/15 px-4 py-2">
        <div className="min-w-0">
          <div className="font-display text-lg text-foreground truncate">{item.title}</div>
          <div className="mono text-[0.55rem] tracking-[0.28em] uppercase text-muted-foreground truncate">
            {item.category} · {item.filename ?? item.url}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary border border-primary/50 hover:border-primary hover:bg-primary/10 px-3 py-1.5"
          >
            OPEN ↗
          </a>
          <a
            href={item.url}
            download={item.filename}
            className="mono text-[0.6rem] tracking-[0.28em] uppercase text-primary border border-primary/50 hover:border-primary hover:bg-primary/10 px-3 py-1.5"
          >
            ↓ SAVE
          </a>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-background/70 flex items-center justify-center overflow-hidden">
        {item.kind === "image" && (
          <img src={item.url} alt={item.title} className="max-w-full max-h-full object-contain" />
        )}
        {item.kind === "video" && (
          <video src={item.url} controls className="max-w-full max-h-full" />
        )}
        {item.kind === "audio" && (
          <audio src={item.url} controls className="w-4/5" />
        )}
        {item.kind === "document" && (
          <iframe
            src={item.url}
            title={item.title}
            className="w-full h-full bg-white"
          />
        )}
      </div>
    </>
  );
};
