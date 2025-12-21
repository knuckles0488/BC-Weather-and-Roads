import { WeatherData, RoadEvent } from '../types.ts';

let cachedRoadEvents: RoadEvent[] = [];
let lastFetchTime = 0;
let lastHighwaysKey = '';
const CACHE_DURATION = 3 * 60 * 1000; 

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,snowfall,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum&timezone=auto&precipitation_unit=mm`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather fetch failed');
  const data = await response.json();

  return {
    current: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      wind_kph: data.current.wind_speed_10m,
      precip: data.current.precipitation ?? 0,
      snowfall: data.current.snowfall ?? 0,
      weather_code: data.current.weather_code,
      time: data.current.time,
    },
    daily: {
      time: data.daily.time,
      weather_code: data.daily.weather_code,
      temp_max: data.daily.temperature_2m_max,
      temp_min: data.daily.temperature_2m_min,
      snowfall_sum: data.daily.snowfall_sum ?? [],
    },
    hourly: {
      time: data.hourly.time,
      temp: data.hourly.temperature_2m,
      weather_code: data.hourly.weather_code,
      apparent_temp: data.hourly.apparent_temperature,
      precip: data.hourly.precipitation ?? [],
      snowfall: data.hourly.snowfall ?? [],
    }
  };
};

export const fetchRoadEvents = async (highwayIds: string[]): Promise<RoadEvent[]> => {
  const now = Date.now();
  const highwayKey = highwayIds.sort().join(',');

  if (cachedRoadEvents.length > 0 && (now - lastFetchTime) < CACHE_DURATION && lastHighwaysKey === highwayKey) {
    return cachedRoadEvents;
  }

  try {
    const mergedEvents: RoadEvent[] = [];
    for (const hId of highwayIds) {
      const url = `https://api.open511.gov.bc.ca/events?format=json&road_name=${encodeURIComponent(hId)}`;
      try {
        const response = await fetch(url);
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) continue;
        const data = await response.json();
        const events = (data.events || []).map((e: any) => ({
          id: e.id,
          description: e.description,
          event_type: e.event_type,
          event_subtype: e.event_subtype,
          road_names: e.roads?.map((r: any) => r.name) || [],
          road_name: e.roads?.[0]?.name || "Unknown",
          severity: e.severity,
          status: e.status
        }));
        mergedEvents.push(...events);
      } catch (e) {
        console.error(`Individual fetch failed for ${hId}`, e);
      }
    }
    const uniqueEvents = Array.from(new Map(mergedEvents.map(item => [item.id, item])).values());
    cachedRoadEvents = uniqueEvents;
    lastFetchTime = now;
    lastHighwaysKey = highwayKey;
    return uniqueEvents;
  } catch (err) {
    console.error(`Failed to fetch highway events`, err);
    return cachedRoadEvents;
  }
};