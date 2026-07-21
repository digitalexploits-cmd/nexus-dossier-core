/**
 * SKY WINDOW — clips the "living outside" animation (drifting clouds,
 * distant lightning, swaying branches) to a rectangle that matches the
 * actual glass in a hero image. Because the layers are masked to the
 * window bounds, the animation reads as "life happening outside" rather
 * than clouds floating through the room.
 */
interface SkyWindowProps {
  /** Inset in % from each side of the parent hero. */
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  /** Enable a soft branch sway on the top-left of the window. */
  branchLeft?: boolean;
  /** Enable a soft branch sway on the top-right of the window. */
  branchRight?: boolean;
  /** Slightly dim/tint like glass tint. */
  glassTint?: string;
  /** Optional label shown when debug overlay is enabled. */
  debugLabel?: string;
}

/** Debug mode: append `?debugSky=1` to the URL to draw the SkyWindow rects. */
const isDebug = () => {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debugSky") === "1";
};

export const SkyWindow = ({
  top = 4,
  right = 0,
  bottom = 45,
  left = 35,
  branchLeft = false,
  branchRight = true,
  glassTint,
  debugLabel,
}: SkyWindowProps) => {
  const debug = isDebug();
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${top}%`,
    right: `${right}%`,
    bottom: `${bottom}%`,
    left: `${left}%`,
    overflow: "hidden",
    pointerEvents: "none",
    WebkitMaskImage: debug
      ? undefined
      : "radial-gradient(ellipse at center, #000 62%, transparent 100%)",
    maskImage: debug
      ? undefined
      : "radial-gradient(ellipse at center, #000 62%, transparent 100%)",
    zIndex: debug ? 60 : 2,
    outline: debug ? "2px dashed #ff2d55" : undefined,
    outlineOffset: debug ? "-2px" : undefined,
    background: debug ? "rgba(255,45,85,0.18)" : undefined,
  };

  return (
    <div aria-hidden style={style} data-sky-window={debugLabel ?? ""}>
      <div className="bay-hero-clouds layer-b" />
      <div className="bay-hero-clouds" />
      <div className="bay-hero-storm" />
      <div className="bay-hero-storm layer-b" />
      <div className="bay-hero-lightning" />
      <div className="bay-hero-lightning layer-b" />
      <div className="bay-hero-shadow" />
      {branchLeft && <div className="bay-hero-branch left" />}
      {branchRight && <div className="bay-hero-branch right" />}
      {glassTint && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: glassTint,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
      )}
      {debug && (
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 6,
            font: "600 10px/1.2 ui-monospace,monospace",
            letterSpacing: "0.14em",
            color: "#fff",
            background: "#ff2d55",
            padding: "2px 6px",
            borderRadius: 2,
            textTransform: "uppercase",
          }}
        >
          SKY · {debugLabel ?? `${top}/${right}/${bottom}/${left}`}
        </div>
      )}
    </div>
  );
};

