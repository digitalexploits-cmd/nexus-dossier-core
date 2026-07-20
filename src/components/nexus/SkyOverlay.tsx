import { useMemo } from "react";
import type { WeatherProfile } from "@/lib/weather";
import { Birds } from "./Birds";


/**
 * Animated sky overlay for the rotunda hero.
 * Renders drifting clouds, optional rain streaks, and a night starfield.
 * Positioned in the upper portion of the panorama (behind foliage/UI but
 * above the base image sky) using screen blend so it enhances rather than
 * replaces the underlying artwork.
 *
 * `reduced` suppresses motion for prefers-reduced-motion users.
 */
type Props = {
  weather: WeatherProfile;
  reduced?: boolean;
};

const conditionTint = (w: WeatherProfile) => {
  if (w.isNight) return "rgba(8,14,32,0.28)";
  switch (w.condition) {
    case "clear":         return "rgba(120,190,255,0.06)";
    case "partly-cloudy": return "rgba(150,190,225,0.08)";
    case "overcast":      return "rgba(120,135,155,0.18)";
    case "fog":           return "rgba(180,190,200,0.20)";
    case "rain":          return "rgba(90,110,135,0.22)";
    case "snow":          return "rgba(210,220,235,0.18)";
    case "storm":         return "rgba(50,60,80,0.30)";
  }
};


export const SkyOverlay = ({ weather, reduced }: Props) => {
  const stars = useMemo(() => {
    if (!weather.isNight || weather.cloudCover > 0.55) return [];
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 55, // upper portion only
      size: Math.random() * 1.6 + 0.4,
      delay: (Math.random() * 4).toFixed(2),
    }));
  }, [weather.isNight, weather.cloudCover]);

  const rain = useMemo(() => {
    if (weather.condition !== "rain" && weather.condition !== "storm") return [];
    const count = weather.condition === "storm" ? 80 : 45;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      dur: (0.6 + Math.random() * 0.5).toFixed(2),
      delay: (Math.random() * 1.2).toFixed(2),
    }));
  }, [weather.condition]);

  // Cloud pass opacity scales with cover — boosted for lively outdoor motion.
  const cloudOpacity = Math.min(0.65, 0.28 + weather.cloudCover * 0.4);
  // Faster drift so clouds visibly move across the sky.
  const cloudDur = reduced ? 0 : Math.max(18, 45 - Math.min(30, weather.windMps * 2.5));

  return (
    <div
      className="absolute inset-x-0 top-0 h-[46%] pointer-events-none overflow-hidden mix-blend-screen z-[4]"
      style={{ background: conditionTint(weather) }}
      aria-hidden
    >


      {/* Cloud layers (two, opposing speeds) */}
      {!reduced && (
        <>
          <div
            className="absolute inset-0"
            style={{
              opacity: cloudOpacity,
              backgroundImage:
                "radial-gradient(ellipse 320px 110px at 18% 28%, rgba(255,255,255,0.85), transparent 62%)," +
                "radial-gradient(ellipse 420px 140px at 58% 18%, rgba(255,255,255,0.78), transparent 66%)," +
                "radial-gradient(ellipse 280px 90px at 86% 42%, rgba(255,255,255,0.82), transparent 66%)," +
                "radial-gradient(ellipse 360px 120px at 42% 62%, rgba(255,255,255,0.7), transparent 66%)",
              backgroundSize: "1600px 100%",
              backgroundRepeat: "repeat-x",
              animation: `sky-drift ${cloudDur}s linear infinite`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: cloudOpacity * 0.85,
              backgroundImage:
                "radial-gradient(ellipse 460px 150px at 28% 48%, rgba(255,255,255,0.72), transparent 66%)," +
                "radial-gradient(ellipse 320px 100px at 72% 62%, rgba(255,255,255,0.66), transparent 66%)," +
                "radial-gradient(ellipse 260px 80px at 8% 72%, rgba(255,255,255,0.6), transparent 66%)",
              backgroundSize: "1800px 100%",
              backgroundRepeat: "repeat-x",
              animation: `sky-drift-rev ${cloudDur * 1.5}s linear infinite`,
            }}
          />
        </>
      )}

      {/* Stars (clear night only) */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0.85,
            filter: "blur(0.3px)",
            animation: reduced ? undefined : `star-twinkle 3.4s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Rain streaks */}
      {!reduced && rain.length > 0 && (
        <div className="absolute inset-0">
          {rain.map((r) => (
            <span
              key={r.id}
              className="absolute block bg-gradient-to-b from-transparent via-white/50 to-transparent"
              style={{
                left: `${r.left}%`,
                top: `${r.top}%`,
                width: 1,
                height: 22,
                transform: "rotate(12deg)",
                opacity: 0.55,
                animation: `rain-fall ${r.dur}s linear ${r.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Storm flash */}
      {!reduced && weather.condition === "storm" && (
        <div
          className="absolute inset-0 bg-white"
          style={{ opacity: 0, animation: "storm-flash 9s ease-out infinite" }}
        />
      )}
    </div>
  );
};
