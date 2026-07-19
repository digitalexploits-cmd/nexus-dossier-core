import { useMemo } from "react";
import type { WeatherProfile } from "@/lib/weather";

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
  if (w.isNight) return "rgba(8,14,32,0.55)";
  switch (w.condition) {
    case "clear":         return "rgba(120,190,255,0.18)";
    case "partly-cloudy": return "rgba(150,190,225,0.22)";
    case "overcast":      return "rgba(120,135,155,0.42)";
    case "fog":           return "rgba(180,190,200,0.45)";
    case "rain":          return "rgba(90,110,135,0.50)";
    case "snow":          return "rgba(210,220,235,0.40)";
    case "storm":         return "rgba(50,60,80,0.65)";
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

  // Cloud pass opacity scales with cover.
  const cloudOpacity = 0.15 + weather.cloudCover * 0.55;
  const cloudDur = reduced ? 0 : 120 - Math.min(60, weather.windMps * 4);

  return (
    <div
      className="absolute inset-x-0 top-0 h-[62%] pointer-events-none overflow-hidden mix-blend-screen z-[4]"
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
                "radial-gradient(ellipse 260px 90px at 20% 30%, rgba(255,255,255,0.55), transparent 60%)," +
                "radial-gradient(ellipse 340px 110px at 60% 20%, rgba(255,255,255,0.45), transparent 65%)," +
                "radial-gradient(ellipse 220px 70px at 85% 45%, rgba(255,255,255,0.5), transparent 65%)",
              backgroundSize: "1600px 100%",
              backgroundRepeat: "repeat-x",
              animation: `sky-drift ${cloudDur}s linear infinite`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: cloudOpacity * 0.7,
              backgroundImage:
                "radial-gradient(ellipse 380px 120px at 35% 55%, rgba(255,255,255,0.42), transparent 65%)," +
                "radial-gradient(ellipse 260px 80px at 75% 65%, rgba(255,255,255,0.38), transparent 65%)",
              backgroundSize: "1800px 100%",
              backgroundRepeat: "repeat-x",
              animation: `sky-drift-rev ${cloudDur * 1.4}s linear infinite`,
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
