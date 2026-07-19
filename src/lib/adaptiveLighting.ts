import { useEffect, useState } from "react";

/**
 * Adaptive lighting profile derived from local time-of-day and viewport width.
 * Goal: keep the Arch and console readable regardless of ambient hour or screen size.
 *
 * - `foliageOpacity`   — multiplier applied to branch overlay (dimmer at night / on small screens)
 * - `foliageBrightness`— CSS filter brightness for leaf clusters
 * - `sceneBrightness`  — panorama brightness multiplier (lifts shadows at night)
 * - `sceneContrast`    — contrast tweak that pairs with brightness
 * - `consoleGlow`      — 0..1 emphasis for HUD/console borders and glows
 * - `phase`            — coarse label for debugging / future theming
 */
export type LightingProfile = {
  foliageOpacity: number;
  foliageBrightness: number;
  sceneBrightness: number;
  sceneContrast: number;
  consoleGlow: number;
  phase: "dawn" | "day" | "dusk" | "night";
};

const hourPhase = (h: number): LightingProfile["phase"] => {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 17) return "day";
  if (h >= 17 && h < 20) return "dusk";
  return "night";
};

const computeProfile = (hour: number, width: number): LightingProfile => {
  const phase = hourPhase(hour);
  const narrow = width < 768;
  const wide = width >= 1280;

  // Base by phase
  const base: Record<LightingProfile["phase"], Omit<LightingProfile, "phase">> = {
    dawn:  { foliageOpacity: 0.82, foliageBrightness: 0.92, sceneBrightness: 1.06, sceneContrast: 1.06, consoleGlow: 0.75 },
    day:   { foliageOpacity: 0.95, foliageBrightness: 1.05, sceneBrightness: 1.08, sceneContrast: 1.06, consoleGlow: 0.55 },
    dusk:  { foliageOpacity: 0.80, foliageBrightness: 0.90, sceneBrightness: 1.04, sceneContrast: 1.08, consoleGlow: 0.85 },
    night: { foliageOpacity: 0.60, foliageBrightness: 0.72, sceneBrightness: 1.14, sceneContrast: 1.10, consoleGlow: 1.00 },
  };
  const p = { ...base[phase] };

  // Narrow viewports: pull foliage back so the Arch/console never fights it.
  if (narrow) {
    p.foliageOpacity *= 0.65;
    p.foliageBrightness *= 0.95;
    p.consoleGlow = Math.min(1, p.consoleGlow + 0.1);
  } else if (wide) {
    p.foliageOpacity = Math.min(1, p.foliageOpacity * 1.05);
  }

  return { ...p, phase };
};

export const useAdaptiveLighting = (): LightingProfile => {
  const [profile, setProfile] = useState<LightingProfile>(() =>
    computeProfile(
      typeof Date !== "undefined" ? new Date().getHours() : 12,
      typeof window !== "undefined" ? window.innerWidth : 1280
    )
  );

  useEffect(() => {
    const update = () =>
      setProfile(computeProfile(new Date().getHours(), window.innerWidth));
    update();
    window.addEventListener("resize", update);
    // Re-check hour every 5 minutes for long sessions
    const t = window.setInterval(update, 5 * 60 * 1000);
    return () => {
      window.removeEventListener("resize", update);
      window.clearInterval(t);
    };
  }, []);

  return profile;
};
