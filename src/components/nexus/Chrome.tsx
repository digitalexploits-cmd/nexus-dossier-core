import { BRAND } from "@/data/content";
import { useEffect, useMemo, useState } from "react";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react";

const WEATHER_CODES: Record<number, string> = {
  0: "Clear", 1: "Clear", 2: "Partly Cloudy", 3: "Cloudy",
  45: "Fog", 48: "Fog",
  51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
  61: "Rain", 63: "Rain", 65: "Rain",
  71: "Snow", 73: "Snow", 75: "Snow",
  80: "Showers", 81: "Showers", 82: "Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

function useTimeWeather() {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<{ temp: number; condition: string; code: number } | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=38.6270&longitude=-90.1994&current_weather=true&temperature_unit=fahrenheit")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted || !data?.current_weather) return;
        const code = data.current_weather.weathercode ?? 0;
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          condition: WEATHER_CODES[code] ?? "Clear",
          code,
        });
      })
      .catch(() => { /* silently fail; weather is decorative */ });
    return () => { mounted = false; };
  }, []);

  return { now, weather };
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

export const TopBar = ({ view }: { view: string }) => {
  const { now, weather } = useTimeWeather();
  const timeStr = now ? formatTime(now) : "--:--:--";
  const dateStr = now ? formatDate(now) : "---";

  const weatherIcon = useMemo(() => {
    if (!weather) return "—";
    const code = weather.code;
    if (code >= 51 && code <= 67) return "▒"; // rain
    if (code >= 71 && code <= 77) return "✻"; // snow
    if (code >= 80 && code <= 82) return "≋"; // showers
    if (code >= 95) return "⚡"; // storm
    if (code >= 1 && code <= 3) return "☁"; // cloudy
    return "☀"; // clear
  }, [weather]);

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-primary/25 bg-background/80 backdrop-blur-md">
      <div className="container flex h-12 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border border-primary/80 rotate-45" />
            <div className="absolute inset-1 bg-primary/40" />
          </div>
          <div className="mono text-[0.72rem] tracking-[0.28em] text-foreground/90">
            AI BASE<sup className="text-primary">3</sup>
          </div>
          <div className="hidden sm:block h-4 w-px bg-primary/30" />
          <div className="hidden sm:block font-display text-lg leading-none text-primary tracking-wide">
            SINE<span className="text-primary/70">~</span>WaiV
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1 border border-primary/25 bg-primary/5">
            <span className="mono text-[0.62rem] tracking-widest text-primary/90 tabular-nums">{timeStr}</span>
            <span className="h-3 w-px bg-primary/30" />
            <span className="tick text-[0.58rem] text-muted-foreground">{dateStr}</span>
            {weather && (
              <>
                <span className="h-3 w-px bg-primary/30" />
                <span className="mono text-[0.62rem] tracking-widest text-primary/80" title={weather.condition}>
                  {weatherIcon} {weather.temp}°F
                </span>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 tick">
            <span className="status-dot status-live" /> SHELL ONLINE
          </div>
          <div className="tick text-primary/80">VIEW / {view}</div>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </header>
  );
};

export const BottomBar = () => (
  <footer className="border-t border-primary/25 bg-surface/60">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="font-display text-xl text-primary leading-none">{BRAND.company}</div>
        <div className="tick">{BRAND.line}</div>
      </div>
      <div className="tick">© {new Date().getFullYear()} · Nexus operating shell</div>
    </div>
  </footer>
);

export const SectionHeader = ({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) => (
  <div className="space-y-3">
    <div className="tick text-primary">{eyebrow}</div>
    <h2 className="font-display text-3xl md:text-5xl tracking-tight text-foreground">{title}</h2>
    {note && <p className="text-muted-foreground max-w-2xl">{note}</p>}
    <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
  </div>
);
