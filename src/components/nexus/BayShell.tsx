/**
 * BAY SHELL — shared shell used by all four bays.
 * ------------------------------------------------
 *   Layer 0  hero image (stable landing state, cinematic)
 *   Layer 1  category rail (icon + label tiles, restrained)
 *   Layer 2  category content panel (real thumbnails / cards)
 *   Layer 3  asset viewer (in-app for local; opens Drive tab otherwise)
 *
 * Interaction honesty: nothing rendered here is decorative-only.
 * Every tile has a real action; every asset has a real target.
 */

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BAY_CONTENT, resolveAssetHref, isLocal, type Asset, type Category, type CategoryAction } from "@/data/bayCategories";
import { CategoryIcon } from "./CategoryIcons";
import { BAYS, type BayId } from "@/data/content";
import { OfficialCertificationsGallery } from "./OfficialCertificationsGallery";
import { AssetViewer } from "./AssetViewer";
import { MediaConsole } from "./MediaConsole";
import { BayCanon } from "./BayCanon";
import { DocumentShelf } from "./DocumentShelf";
import llcCert from "@/assets/ai-base3-llc-certificate.jpg.asset.json";
import whiteHouseLetter from "@/assets/white-house-letter.jpg.asset.json";

// Special-case correspondence images: resolve placeholder localHref to real
// CDN pointers, so we never expose a broken link.
const resolveHref = (a: Asset): string => {
  if (a.id === "corr-llc-cert") return llcCert.url;
  if (a.id === "corr-white-house") return whiteHouseLetter.url;
  return resolveAssetHref(a);
};
const resolvedLocal = (a: Asset) => {
  if (a.id === "corr-llc-cert" || a.id === "corr-white-house") return true;
  return isLocal(a);
};

interface Props {
  bayId: BayId;
  heroImage: string;
  /** One or two-line HUD tagline shown on the hero. */
  tagline: [string, string];
  /** Ambient status text shown top-right (e.g. "ON RECORD"). */
  ambient?: string;
  /** Accent color (CSS color) for this bay's chrome accents. Default cyan. */
  accent?: string;
  /** Show the premium accent + ambient lighting console on the hero. */
  lightingControls?: boolean;
  onOpenVault: () => void;
  onContact: () => void;
}

const DEFAULT_ACCENT = "#4db7ff";

export const BayShell = ({
  bayId,
  heroImage,
  tagline,
  ambient = "ON RECORD",
  accent = DEFAULT_ACCENT,
  lightingControls = false,
  onOpenVault,
  onContact,
}: Props) => {
  const bayMeta = useMemo(() => BAYS.find((b) => b.id === bayId)!, [bayId]);
  const bayCode = `BAY ${bayMeta.index}`;
  const content = BAY_CONTENT[bayId];

  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [certsOpen, setCertsOpen] = useState(false);
  const [mediaConsoleOpen, setMediaConsoleOpen] = useState(false);


  // Lighting console — accent rim glow (0–100) and ambient exposure (0–100).
  // Persisted per-bay so the room "remembers" how the user lit it.
  const lightingKey = `nexus:lighting:${bayId}`;
  const [accentLevel, setAccentLevel] = useState<number>(() => {
    try { const v = localStorage.getItem(`${lightingKey}:accent`); return v ? Number(v) : 55; } catch { return 55; }
  });
  const [ambientLevel, setAmbientLevel] = useState<number>(() => {
    try { const v = localStorage.getItem(`${lightingKey}:ambient`); return v ? Number(v) : 60; } catch { return 60; }
  });
  const [lightingOpen, setLightingOpen] = useState(false);

  // Persist changes
  const persist = useCallback((k: "accent" | "ambient", v: number) => {
    try { localStorage.setItem(`${lightingKey}:${k}`, String(v)); } catch { /* ignore */ }
  }, [lightingKey]);

  // Derived visual values.
  // Ambient maps 0..100 → brightness 0.55..1.55 (dim room ↔ full exposure).
  const ambientBrightness = 0.55 + (ambientLevel / 100) * 1.0;
  // Accent maps 0..100 → gradient alpha strength.
  const accentA = (v: number) => Math.round((accentLevel / 100) * v).toString(16).padStart(2, "0");


  const activeCategory = useMemo(
    () => content.categories.find((c) => c.id === activeCategoryId) ?? null,
    [content, activeCategoryId],
  );

  const runAction = useCallback((action: CategoryAction) => {
    if (action === "open-vault") return onOpenVault();
    if (action === "request-briefing") return onContact();
    if (action === "open-credentials-gallery") return setCertsOpen(true);
  }, [onOpenVault, onContact]);

  const onCategoryClick = useCallback((c: Category) => {
    if (c.action) return runAction(c.action);
    setActiveCategoryId((prev) => (prev === c.id ? null : c.id));
    setTimeout(() => {
      document.getElementById("bay-category-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [runAction]);

  const openAsset = useCallback((a: Asset) => {
    // Local files → in-app viewer. Drive-only → new tab.
    if (resolvedLocal(a)) {
      setViewingAsset(a);
    } else {
      window.open(resolveHref(a), "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div className="relative">
      {/* ============ HERO — cinematic, stable, uncluttered ============ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#05070a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,#111d2e_0%,#080c14_75%)]" />
        <img
          src={heroImage}
          alt={`${bayMeta.title} — immersive environment`}
          className={`absolute inset-0 w-full h-full object-cover contrast-[1.04] saturate-[1.10] transition-opacity duration-700 ease-out ${heroLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ filter: `brightness(${ambientBrightness.toFixed(3)}) contrast(1.04) saturate(1.10)` }}
          draggable={false}
          loading="eager"
          decoding="async"
          onLoad={() => setHeroLoaded(true)}
          onError={() => setHeroLoaded(true)}
        />
        {/* Legibility overlays — quiet, do not clutter */}
        <div className="absolute inset-x-0 top-0 h-[45%] pointer-events-none bg-[linear-gradient(180deg,rgba(4,8,16,0.55)_0%,rgba(4,8,16,0.15)_60%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background/50 to-transparent" />
        {/* Premium accent lighting — layered rim glows, driven by the accent slider */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse 55% 45% at 12% 88%, ${accent}${accentA(90)} 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 88% 82%, ${accent}${accentA(80)} 0%, transparent 62%),
              radial-gradient(ellipse 40% 30% at 50% 8%, ${accent}${accentA(55)} 0%, transparent 65%)
            `,
          }}
        />
        {/* Fine top edge — cinematic key light */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}${accentA(200)}, transparent)`,
            boxShadow: `0 0 24px ${accent}${accentA(160)}`,
          }}
        />



        {/* Multimedia Viewer launcher — glass panel button */}
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={() => setMediaConsoleOpen(true)}
            className="interactive group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 backdrop-blur-md transition-all duration-300"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: `${accent}66`,
              background: `linear-gradient(180deg, ${accent}18, rgba(10,18,30,0.55))`,
              boxShadow: `0 0 24px -6px ${accent}55, inset 0 1px 0 ${accent}33`,
            }}
            aria-label="Open multimedia viewer"
          >
            <span className="text-base leading-none" style={{ color: accent }}>◫</span>
            <span className="mono text-[0.6rem] tracking-[0.28em] uppercase" style={{ color: "#eef6ff" }}>
              Multimedia Viewer
            </span>
          </button>
        </div>

      </section>



      {/* ============ LAYER 1 — CATEGORY RAIL ============ */}
      <section id="bay-category-rail" className="container pt-14 pb-6">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
          <div className="mono text-[0.6rem] tracking-[0.28em] uppercase" style={{ color: accent }}>
            {bayCode} / CATEGORIES
          </div>
          <div className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
            {content.categories.length.toString().padStart(2, "0")} · SELECT TO REVEAL
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 md:gap-3">
          {content.categories.map((c) => {
            const active = activeCategoryId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategoryClick(c)}
                className="group interactive relative text-left rounded-sm border p-3 md:p-4 backdrop-blur-md transition-all duration-300"
                style={{
                  borderColor: active ? accent : "rgba(130,205,255,0.32)",
                  background: active
                    ? `linear-gradient(180deg, ${accent}22, rgba(22,40,66,0.88))`
                    : "linear-gradient(180deg,rgba(22,40,66,0.72),rgba(12,22,38,0.82))",
                  boxShadow: active
                    ? `0 0 0 1px ${accent}, 0 20px 40px -20px ${accent}55`
                    : undefined,
                }}
                aria-pressed={active}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: active ? accent : "#7dd3ff" }}>
                  <CategoryIcon name={c.icon} />
                  {c.action && (
                    <span className="ml-auto mono text-[0.5rem] tracking-[0.24em] uppercase text-[#8fa3b8]">ACTION</span>
                  )}
                </div>
                <div className="text-sm md:text-base font-medium leading-tight text-[#eef6ff]">{c.label}</div>
                {c.blurb && (
                  <div className="text-[0.7rem] text-[#8fa3b8] mt-1 leading-snug line-clamp-2">{c.blurb}</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ LAYER 2 — CATEGORY CONTENT PANEL ============ */}
      <section id="bay-category-panel" className="container pb-16 min-h-[240px]">
        {activeCategory && !activeCategory.action && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="mono text-[0.6rem] tracking-[0.28em] uppercase" style={{ color: accent }}>
                  {bayCode} / {activeCategory.label.toUpperCase()}
                </span>
                {activeCategory.blurb && (
                  <span className="text-[#8fa3b8] text-xs hidden md:inline">{activeCategory.blurb}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveCategoryId(null)}
                className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#8fa3b8] hover:text-[hsl(var(--interactive))]"
              >
                ✕ CLOSE
              </button>
            </div>

            {activeCategory.id === "credentials" ? (
              <OfficialCertificationsGallery />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(activeCategory.assets ?? []).map((a) => (
                  <AssetCard key={a.id} asset={a} accent={accent} onOpen={openAsset} isLocal={resolvedLocal(a)} />
                ))}
              </div>
            )}
          </div>
        )}

        {!activeCategory && (
          <div className="text-center py-10">
            <div className="mono text-[0.6rem] tracking-[0.32em] uppercase text-[#8fa3b8]">
              SELECT A CATEGORY ABOVE
            </div>
          </div>
        )}
      </section>

      {/* Credentials gallery — modal-like overlay when opened */}
      {certsOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(3,6,12,0.94)] backdrop-blur-lg">
          <div className="min-h-screen">
            <div className="container flex items-center justify-between py-5">
              <div className="mono text-[0.6rem] tracking-[0.32em] uppercase" style={{ color: accent }}>
                {bayCode} / CREDENTIALS · GALLERY
              </div>
              <button
                type="button"
                onClick={() => setCertsOpen(false)}
                className="interactive mono text-[0.6rem] tracking-[0.24em] uppercase px-3 py-1.5 border border-[rgba(130,205,255,0.42)] text-[#c8d4e2] hover:border-[hsl(var(--interactive))] hover:text-[hsl(var(--interactive))]"
              >
                CLOSE ✕
              </button>
            </div>
            <OfficialCertificationsGallery />
          </div>
        </div>
      )}

      {/* Local asset viewer */}
      <AssetViewer asset={viewingAsset} onClose={() => setViewingAsset(null)} resolveHref={resolveHref} />

      {/* Multimedia Console — big glass window for documents/images/videos */}
      <MediaConsole open={mediaConsoleOpen} onClose={() => setMediaConsoleOpen(false)} />
    </div>
  );
};

// ------------------------------ Lighting slider ------------------------------

interface LightingSliderProps {
  label: string;
  value: number;
  accent: string;
  onChange: (v: number) => void;
}

const LightingSlider = ({ label, value, accent, onChange }: LightingSliderProps) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="mono text-[0.6rem] tracking-[0.28em] uppercase text-[#c8d4e2]">{label}</span>
      <span className="mono text-[0.6rem] tracking-[0.2em] text-[#8fa3b8]">
        {value.toString().padStart(3, "0")}
      </span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={`${label} lighting level`}
      className="w-full h-1 appearance-none rounded-full cursor-pointer outline-none"
      style={{
        background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${value}%, rgba(130,205,255,0.18) ${value}%, rgba(130,205,255,0.18) 100%)`,
        // WebKit thumb styling via inline is limited; rely on generic ::-webkit-slider-thumb defaults
        accentColor: accent,
      }}
    />
  </div>
);



const kindGlyph: Record<Asset["kind"], string> = {
  pdf: "▤", image: "◫", video: "▷", audio: "♪", html: "◈", doc: "≡", text: "≡", markdown: "≡", link: "↗",
};

interface AssetCardProps {
  asset: Asset;
  accent: string;
  isLocal: boolean;
  onOpen: (a: Asset) => void;
}

const AssetCard = ({ asset, accent, isLocal, onOpen }: AssetCardProps) => (
  <button
    type="button"
    onClick={() => onOpen(asset)}
    className="group interactive relative text-left rounded-sm border p-4 backdrop-blur-md transition-all duration-300 flex flex-col justify-between min-h-[150px]"
    style={{
      borderColor: "rgba(130,205,255,0.42)",
      background: "linear-gradient(180deg,rgba(38,64,100,0.80),rgba(22,40,66,0.88))",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = accent;
      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${accent}55, 0 20px 40px -20px ${accent}55`;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(130,205,255,0.42)";
      (e.currentTarget as HTMLElement).style.boxShadow = "";
    }}
  >
    <div>
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="mono text-[0.55rem] tracking-[0.24em]"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          {asset.kind.toUpperCase()}
        </Badge>
        {asset.featured && (
          <span className="mono text-[0.55rem] tracking-[0.24em] text-[#8fa3b8]">FEATURED</span>
        )}
      </div>
      <div className="mt-2 text-sm font-medium leading-snug text-[#eef6ff]">{asset.title}</div>
      {asset.meta && (
        <div className="text-xs text-[#8fa3b8] mt-1 line-clamp-2">{asset.meta}</div>
      )}
    </div>
    <div className="mt-3 flex items-center justify-between">
      <span className="mono text-[0.55rem] tracking-[0.24em] uppercase text-[#8fa3b8]">
        <span className="mr-2" style={{ color: accent }}>{kindGlyph[asset.kind]}</span>
        {isLocal ? "IN-APP" : "GOOGLE DRIVE"}
      </span>
      <span className="mono text-[0.6rem] group-hover:brightness-125" style={{ color: accent }}>
        {isLocal ? "OPEN →" : "OPEN IN DRIVE ↗"}
      </span>
    </div>
  </button>
);
