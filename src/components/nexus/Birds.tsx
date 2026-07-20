import { useEffect, useState } from "react";

/**
 * Occasional birds flying across the sky area of the rotunda hero.
 * Spawns a small flock every 12-28s, each bird glides with flapping wings.
 */
type Bird = {
  id: number;
  top: number;      // vertical position in % of overlay
  scale: number;    // size multiplier
  dur: number;      // seconds to cross the sky
  delay: number;    // seconds before start
  reverse: boolean; // right-to-left flight
  flap: number;     // flap cycle seconds
};

let idSeq = 0;
const spawnFlock = (): Bird[] => {
  const size = 1 + Math.floor(Math.random() * 3); // 1-3 birds
  const reverse = Math.random() < 0.5;
  const baseTop = 8 + Math.random() * 40;
  return Array.from({ length: size }).map((_, i) => ({
    id: ++idSeq,
    top: baseTop + i * (2 + Math.random() * 3),
    scale: 0.55 + Math.random() * 0.6,
    dur: 16 + Math.random() * 12,
    delay: i * (0.6 + Math.random() * 0.8),
    reverse,
    flap: 0.35 + Math.random() * 0.35,
  }));
};

export const Birds = ({ reduced }: { reduced?: boolean }) => {
  const [flock, setFlock] = useState<Bird[]>(() => (reduced ? [] : spawnFlock()));

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const wait = 12000 + Math.random() * 16000;
      timer = setTimeout(() => {
        const next = spawnFlock();
        setFlock(next);
        // clear after longest bird finishes so DOM stays light
        const maxLife = Math.max(...next.map((b) => (b.dur + b.delay) * 1000)) + 500;
        setTimeout(() => setFlock([]), maxLife);
        schedule();
      }, wait);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduced]);

  if (reduced || flock.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {flock.map((b) => (
        <div
          key={b.id}
          className="absolute left-0"
          style={{
            top: `${b.top}%`,
            width: 22,
            height: 12,
            ["--bs" as string]: b.scale.toString(),
            animation: `${b.reverse ? "bird-fly-rev" : "bird-fly"} ${b.dur}s linear ${b.delay}s 1 both`,
            willChange: "transform, opacity",
          }}
        >
          {/* Wing wrapper flaps independently of the flight translate */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center",
              animation: `bird-flap ${b.flap}s ease-in-out infinite`,
            }}
          >
            <svg viewBox="0 0 22 12" width="22" height="12">
              <path
                d="M1 8 Q6 1 11 6 Q16 1 21 8"
                fill="none"
                stroke="rgba(20,25,35,0.85)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
