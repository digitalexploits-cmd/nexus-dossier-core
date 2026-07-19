import { useEffect, useState } from "react";

export interface WeatherState {
  temp: number;
  condition: string;
  code: number;
  windMph: number;
  windDir: number;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear", 1: "Clear", 2: "Partly Cloudy", 3: "Cloudy",
  45: "Fog", 48: "Fog",
  51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
  61: "Rain", 63: "Rain", 65: "Rain",
  71: "Snow", 73: "Snow", 75: "Snow",
  80: "Showers", 81: "Showers", 82: "Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

export function useWeather(): WeatherState | null {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = () => {
      fetch("https://api.open-meteo.com/v1/forecast?latitude=38.6270&longitude=-90.1994&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph")
        .then((r) => r.json())
        .then((data) => {
          if (!mounted || !data?.current_weather) return;
          const cw = data.current_weather;
          setWeather({
            temp: Math.round(cw.temperature),
            condition: WEATHER_CODES[cw.weathercode ?? 0] ?? "Clear",
            code: cw.weathercode ?? 0,
            windMph: Math.round(cw.windspeed ?? 0),
            windDir: cw.winddirection ?? 0,
          });
        })
        .catch(() => { /* decorative */ });
    };
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => { mounted = false; clearInterval(t); };
  }, []);
  return weather;
}
