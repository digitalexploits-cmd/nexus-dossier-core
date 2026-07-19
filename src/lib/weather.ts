import { useEffect, useState } from "react";

/**
 * Live weather for St. Louis via Open-Meteo (no API key required).
 * Returns a normalized profile the Rotunda scene can react to:
 * sky color/brightness, cloud density, precipitation, wind, night flag.
 */
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "overcast"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export type WeatherProfile = {
  condition: WeatherCondition;
  cloudCover: number;       // 0..1
  windMps: number;          // meters/second
  windScale: number;        // 0..2.5 — direct multiplier for foliage
  precipitation: number;    // mm/h current
  isNight: boolean;
  temperatureC: number | null;
  weatherCode: number | null;
  fetchedAt: number | null;
  ok: boolean;              // false = fallback profile
};

const mapCode = (code: number): WeatherCondition => {
  if (code === 0) return "clear";
  if (code <= 2) return "partly-cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "storm";
  return "partly-cloudy";
};

const fallbackProfile = (): WeatherProfile => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 20;
  return {
    condition: "partly-cloudy",
    cloudCover: 0.35,
    windMps: 3,
    windScale: 1,
    precipitation: 0,
    isNight,
    temperatureC: null,
    weatherCode: null,
    fetchedAt: null,
    ok: false,
  };
};

const buildProfile = (data: any): WeatherProfile => {
  const c = data?.current ?? {};
  const code = typeof c.weather_code === "number" ? c.weather_code : 1;
  const cloud = typeof c.cloud_cover === "number" ? c.cloud_cover / 100 : 0.3;
  const wind = typeof c.wind_speed_10m === "number" ? c.wind_speed_10m : 3;
  const precip = typeof c.precipitation === "number" ? c.precipitation : 0;
  const isDay = c.is_day === 1;
  // Map wind (m/s): 0 → ~0.2, 5 → ~1, 12+ → 2.5
  const windScale = Math.min(2.5, 0.2 + wind * 0.18);
  return {
    condition: mapCode(code),
    cloudCover: Math.max(0, Math.min(1, cloud)),
    windMps: wind,
    windScale,
    precipitation: precip,
    isNight: !isDay,
    temperatureC: typeof c.temperature_2m === "number" ? c.temperature_2m : null,
    weatherCode: code,
    fetchedAt: Date.now(),
    ok: true,
  };
};

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=38.625&longitude=-90.185" +
  "&current=temperature_2m,is_day,weather_code,cloud_cover,wind_speed_10m,precipitation" +
  "&wind_speed_unit=ms&timezone=America%2FChicago";

export const useStLouisWeather = (): WeatherProfile => {
  const [profile, setProfile] = useState<WeatherProfile>(() => fallbackProfile());

  useEffect(() => {
    let cancelled = false;
    const fetchIt = async () => {
      try {
        const res = await fetch(URL, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!cancelled) setProfile(buildProfile(data));
      } catch {
        if (!cancelled) setProfile((p) => (p.ok ? p : fallbackProfile()));
      }
    };
    fetchIt();
    const iv = window.setInterval(fetchIt, 12 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(iv); };
  }, []);

  return profile;
};
