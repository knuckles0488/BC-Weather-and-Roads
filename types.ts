
export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface Highway {
  id: string;
  name: string;
}

export interface UserSettings {
  cities: City[];
  highways: string[];
  isDarkMode: boolean;
  forecastHours: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    wind_kph: number;
    precip: number;
    snowfall: number;
    weather_code: number;
    time: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temp_max: number[];
    temp_min: number[];
    snowfall_sum: number[];
  };
  hourly: {
    time: string[];
    temp: number[];
    weather_code: number[];
    apparent_temp: number[];
    precip: number[];
    snowfall: number[];
  };
}

export interface RoadEvent {
  id: string;
  description: string;
  event_type: string;
  event_subtype?: string;
  road_name: string;
  road_names: string[];
  severity: string;
  status: string;
}

export type ViewType = 'current' | 'day1' | 'day2' | 'day3';
