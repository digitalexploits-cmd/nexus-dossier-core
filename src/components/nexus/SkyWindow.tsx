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
}

export const SkyWindow = ({
  top = 4,
  right = 0,
  bottom = 45,
  left = 35,
  branchLeft = false,
  branchRight = true,
  glassTint,
}: SkyWindowProps) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${top}%`,
    right: `${right}%`,
    bottom: `${bottom}%`,
    left: `${left}%`,
    overflow: "hidden",
    pointerEvents: "none",
    // Feather the edges so animation blends with the baked window frame
    WebkitMaskImage:
      "radial-gradient(ellipse at center, #000 62%, transparent 100%)",
    maskImage:
      "radial-gradient(ellipse at center, #000 62%, transparent 100%)",
    zIndex: 2,
  };

  return (
    <div aria-hidden style={style}>
      {/* Drifting clouds (two layers, different speeds) */}
      <div className="bay-hero-clouds layer-b" />
      <div className="bay-hero-clouds" />
      {/* Rare distant lightning */}
      <div className="bay-hero-lightning" />
      <div className="bay-hero-lightning layer-b" />
      {/* Cloud shadow drift */}
      <div className="bay-hero-shadow" />
      {/* Optional swaying branches */}
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
    </div>
  );
};
