
import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, 
  CloudDrizzle, Wind, Thermometer, Droplets, Navigation,
  AlertTriangle, Info, Settings, Trash2, Plus, ChevronDown, Bell,
  Moon, CloudSun, MoonStar, Clock
} from 'lucide-react';

export const getWeatherDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow Fall",
    73: "Moderate Snow Fall",
    75: "Heavy Snow Fall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail"
  };
  return descriptions[code] || "Cloudy";
};

export const WeatherIcon = ({ code, className = "w-8 h-8" }: { code: number; className?: string }) => {
  if (code === 0) return <Sun className={`${className} text-yellow-400`} />;
  if (code >= 1 && code <= 2) return <CloudSun className={`${className} text-blue-300`} />;
  if (code === 3) return <Cloud className={`${className} text-slate-400`} />;
  if (code >= 45 && code <= 48) return <Wind className={`${className} text-slate-300`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-blue-300`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${className} text-blue-500`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-slate-100`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${className} text-purple-500`} />;
  return <Cloud className={className} />;
};

// Fixed: Added Clock to the exported members
export { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, 
  CloudDrizzle, Wind, Thermometer, Droplets, Navigation,
  AlertTriangle, Info, Settings, Trash2, Plus, ChevronDown, Bell,
  Moon, CloudSun, MoonStar, Clock
};
