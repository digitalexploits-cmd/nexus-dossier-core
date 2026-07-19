/**
 * Decorative animated foliage overlay for the rotunda hero.
 * SVG leaf clusters positioned around the panorama frame that gently
 * sway to suggest the facility is tucked into the trees.
 */
const Leaf = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden>
    <defs>
      <radialGradient id="lg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#5b8a4a" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#2f5a2a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#152b13" stopOpacity="0.95" />
      </radialGradient>
    </defs>
    <path
      d="M32 4C18 10 6 22 6 36c0 10 6 18 14 22 4-8 10-14 18-18 8-4 14-10 18-18C52 12 42 6 32 4z"
      fill="url(#lg)"
    />
  </svg>
);

const Cluster = ({
  className,
  size = 260,
  swayClass = "foliage-sway",
  delay = "0s",
  leaves = 5,
}: {
  className: string;
  size?: number;
  swayClass?: "foliage-sway" | "foliage-sway-slow";
  delay?: string;
  leaves?: number;
}) => {
  const arr = Array.from({ length: leaves });
  return (
    <div className={`absolute pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <div className={swayClass} style={{ animationDelay: delay, width: "100%", height: "100%", position: "relative" }}>
        {arr.map((_, i) => {
          const angle = (i / leaves) * 140 - 70;
          const dist = size * 0.28;
          const x = Math.sin((angle * Math.PI) / 180) * dist;
          const y = -Math.cos((angle * Math.PI) / 180) * dist * 0.6;
          const sz = size * (0.55 + (i % 2) * 0.15);
          return (
            <Leaf
              key={i}
              className="leaf-rustle absolute"
              style={{
                width: sz,
                height: sz,
                left: `calc(50% + ${x}px - ${sz / 2}px)`,
                top: `calc(50% + ${y}px - ${sz / 2}px)`,
                animationDelay: `${(i * 0.4).toFixed(2)}s`,
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))",
                opacity: 0.92,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const FoliageOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
    {/* Top-left canopy */}
    <Cluster className="-top-24 -left-16" size={360} swayClass="foliage-sway" delay="0s" leaves={6} />
    {/* Top-right canopy */}
    <Cluster className="-top-20 -right-24" size={340} swayClass="foliage-sway-slow" delay="1.2s" leaves={6} />
    {/* Mid-left branch */}
    <Cluster className="top-1/3 -left-20" size={240} swayClass="foliage-sway-slow" delay="0.6s" leaves={4} />
    {/* Mid-right branch */}
    <Cluster className="top-1/2 -right-14" size={220} swayClass="foliage-sway" delay="1.8s" leaves={4} />
    {/* Lower right bush */}
    <Cluster className="-bottom-16 right-4" size={280} swayClass="foliage-sway-slow" delay="0.3s" leaves={5} />
    {/* Lower left bush */}
    <Cluster className="-bottom-20 left-6" size={260} swayClass="foliage-sway" delay="2.4s" leaves={5} />
  </div>
);
