
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  City, 
  UserSettings, 
  WeatherData, 
  RoadEvent, 
  ViewType 
} from './types';
import { 
  BC_CITIES, 
  BC_HIGHWAYS, 
  STORAGE_KEY 
} from './constants';
import { 
  fetchWeather, 
  fetchRoadEvents 
} from './services/api';
import SettingsModal from './components/SettingsModal';
import NotificationToast from './components/NotificationToast';
import { 
  Settings, 
  ChevronDown, 
  WeatherIcon, 
  getWeatherDescription,
  Thermometer, 
  Wind, 
  Droplets, 
  AlertTriangle,
  Navigation,
  CloudSnow
} from './components/Icons';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { 
      cities: [BC_CITIES[0]], 
      highways: ["Highway 5", "Highway 97D"],
      isDarkMode: false,
      forecastHours: {
        morning: 9,
        afternoon: 15,
        evening: 21
      }
    };
  });

  const [viewType, setViewType] = useState<ViewType>('current');
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [roadEvents, setRoadEvents] = useState<RoadEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<{id: string, msg: string}[]>([]);
  const seenEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (settings.isDarkMode) {
      document.body.classList.add('bg-slate-950');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.body.classList.add('bg-slate-50');
      document.body.classList.remove('bg-slate-950');
    }
  }, [settings]);

  const isSnowCode = (code: number) => {
    return (code >= 71 && code <= 77) || code === 85 || code === 86;
  };

  const getWeatherGradient = (code: number) => {
    if (code === 0) return 'from-amber-400 via-orange-500 to-rose-500'; // Sunny
    if (code >= 1 && code <= 3) return 'from-sky-400 via-blue-500 to-indigo-600'; // Partly Cloudy/Overcast
    if (code >= 45 && code <= 48) return 'from-slate-400 via-slate-500 to-slate-700'; // Fog
    if (code >= 51 && code <= 65) return 'from-blue-600 via-indigo-700 to-slate-900'; // Rain
    if (code >= 71 && code <= 86) return 'from-teal-400 via-cyan-600 to-blue-800'; // Snow
    if (code >= 95) return 'from-purple-800 via-slate-900 to-black'; // Thunder
    return 'from-blue-500 to-indigo-600';
  };

  const refreshData = useCallback(async () => {
    if (settings.cities.length === 0) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const weatherMap: Record<string, WeatherData> = {};
      for (const city of settings.cities) {
        weatherMap[city.name] = await fetchWeather(city.lat, city.lon);
      }
      setWeatherData(weatherMap);

      const events = await fetchRoadEvents(settings.highways);
      setRoadEvents(events);

      events.forEach(event => {
        const desc = event.description.toLowerCase();
        const isClosed = desc.includes('closed') || desc.includes('closure') || desc.includes('road closed');
        
        if (isClosed && !seenEventIds.current.has(event.id)) {
          setNotifications(prev => [...prev, { id: event.id, msg: `${event.road_name}: ${event.description}` }]);
          seenEventIds.current.add(event.id);
        }
      });
    } catch (err) {
      console.error("Background data refresh failed", err);
    } finally {
      setLoading(false);
    }
  }, [settings.cities, settings.highways]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 300000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const activeCity = settings.cities[activeCityIndex] || settings.cities[0];
  const currentCityWeather = activeCity ? weatherData[activeCity.name] : null;

  const formatDateLabel = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return new Intl.DateTimeFormat('en-CA', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(d);
  };

  const renderForecastDetails = (dayIdx: number) => {
    if (!currentCityWeather) return null;
    const dayStartIdx = dayIdx * 24;
    const { morning, afternoon, evening } = settings.forecastHours;
    
    const periods = [
      { name: 'Morning', idx: dayStartIdx + morning },
      { name: 'Afternoon', idx: dayStartIdx + afternoon },
      { name: 'Evening', idx: dayStartIdx + evening }
    ];

    return (
      <div className="grid grid-cols-3 gap-2 mt-8">
        {periods.map(p => {
          const temp = currentCityWeather.hourly.temp[p.idx];
          const code = currentCityWeather.hourly.weather_code[p.idx];
          const precip = currentCityWeather.hourly.precip[p.idx] ?? 0;
          const snowfall = currentCityWeather.hourly.snowfall[p.idx] ?? 0;
          
          return (
            <div key={p.name} className="bg-white/10 py-3 px-1 rounded-2xl flex flex-col items-center border border-white/10 backdrop-blur-xl">
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2">{p.name}</span>
              <div className="mb-1.5">
                <WeatherIcon code={code} className="w-8 h-8 drop-shadow-md" />
              </div>
              <span className="text-sm font-black tracking-tight">{Math.round(temp)}°</span>
              <span className="text-[8px] text-white/70 font-black uppercase mt-0.5 truncate w-full text-center">
                {isSnowCode(code) ? `${snowfall.toFixed(1)}cm` : `${precip.toFixed(1)}mm`}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderHighwayConditions = () => {
    if (viewType !== 'current') return null;

    return (
      <div className="mt-8 px-2">
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h2 className={`text-xl font-black tracking-tight ${settings.isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Road Conditions
            </h2>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-400' : 'bg-white border-slate-100 text-blue-600 shadow-sm'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-widest">Live 511</span>
          </div>
        </div>
        <div className="space-y-4">
          {settings.highways.map(hId => {
            const hInfo = BC_HIGHWAYS.find(h => h.id === hId);
            const rawEvents = roadEvents.filter(e => {
                return e.road_names.some(rn => rn === hId || rn.includes(hId)) || e.road_name.includes(hId);
            });
            
            // Sort events: Alerts (Incidents/Closures) first, then Notices (Conditions/Construction)
            const events = [...rawEvents].sort((a, b) => {
              const aIsAlert = a.event_type === 'INCIDENT' || a.description.toLowerCase().includes('closed');
              const bIsAlert = b.event_type === 'INCIDENT' || b.description.toLowerCase().includes('closed');
              if (aIsAlert && !bIsAlert) return -1;
              if (!aIsAlert && bIsAlert) return 1;
              return 0;
            });

            const hasAlert = events.some(e => e.event_type === 'INCIDENT' || e.description.toLowerCase().includes('closed'));
            const hasNotice = events.some(e => e.event_type === 'ROAD_CONDITION' || e.event_type === 'CONSTRUCTION');

            return (
              <div key={hId} className={`rounded-[2rem] p-6 border transition-all active:scale-[0.98] ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <span className={`font-black text-base tracking-tight ${settings.isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{hInfo?.name || hId}</span>
                  </div>
                  {hasAlert ? (
                    <div className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/20">
                      Alert
                    </div>
                  ) : hasNotice ? (
                    <div className="bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-blue-500/20">
                      Notice
                    </div>
                  ) : (
                    <div className="text-emerald-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                      Clear
                    </div>
                  )}
                </div>
                {events.length > 0 ? (
                  <div className="space-y-2">
                    {events.map(e => {
                      const isAlert = e.event_type === 'INCIDENT' || e.description.toLowerCase().includes('closed');
                      
                      return (
                        <div key={e.id} className={`flex gap-3 items-start p-4 rounded-2xl border ${isAlert ? (settings.isDarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100/50') : (settings.isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-100')}`}>
                          {isAlert && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                          <p className={`text-xs font-bold leading-relaxed ${settings.isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{e.description}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pl-1">
                    <Navigation className="w-3 h-3 text-emerald-500 opacity-50" />
                    <p className="text-xs text-slate-400 font-bold italic">Normal driving conditions.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const currentCode = currentCityWeather 
    ? (viewType === 'current' 
        ? currentCityWeather.current.weather_code 
        : currentCityWeather.daily.weather_code[viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3])
    : 0;

  const currentMax = currentCityWeather?.daily.temp_max[viewType === 'current' ? 0 : (viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3)];
  const currentMin = currentCityWeather?.daily.temp_min[viewType === 'current' ? 0 : (viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3)];

  const currentSnowValue = currentCityWeather
    ? (viewType === 'current' 
        ? currentCityWeather.current.snowfall 
        : currentCityWeather.daily.snowfall_sum[viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3])
    : 0;

  const currentPrecipValue = currentCityWeather
    ? (viewType === 'current' 
        ? currentCityWeather.current.precip 
        : currentCityWeather.daily.snowfall_sum[viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3] > 0 ? 0 : currentCityWeather.daily.temp_max[0]) 
    : 0;

  const optionClasses = `font-black ${settings.isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`;

  return (
    <div className={`max-w-md mx-auto min-h-screen pb-24 relative font-sans transition-all duration-500 ${settings.isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-2xl px-6 py-4 flex items-center justify-between border-b transition-all duration-500 ${settings.isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200/50'}`}>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`p-3.5 shadow-sm border rounded-2xl active:scale-90 transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-700'}`}
        >
          <Settings className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center flex-1">
            <div className="relative flex items-center gap-1">
                <select 
                    className={`appearance-none bg-transparent pl-4 pr-10 py-1.5 rounded-xl font-black text-sm tracking-tight outline-none cursor-pointer text-center ${settings.isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value as ViewType)}
                >
                    <option className={optionClasses} value="current">Current Weather</option>
                    <option className={optionClasses} value="day1">{formatDateLabel(1)}</option>
                    <option className={optionClasses} value="day2">{formatDateLabel(2)}</option>
                    <option className={optionClasses} value="day3">{formatDateLabel(3)}</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 text-blue-500 pointer-events-none" />
            </div>
        </div>

        <div className="w-[52px]"></div> {/* Spacer for symmetry */}
      </header>

      <main className="px-5 py-4">
        {settings.cities.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-6 no-scrollbar snap-x px-1">
            {settings.cities.map((city, idx) => (
              <button
                key={city.name}
                onClick={() => setActiveCityIndex(idx)}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 active:scale-95 ${
                  activeCityIndex === idx 
                  ? (settings.isDarkMode ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'bg-slate-900 text-white shadow-xl shadow-slate-200')
                  : (settings.isDarkMode ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-white text-slate-400 border border-slate-100')
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black tracking-[0.3em] text-[9px] uppercase mt-4">Syncing...</p>
          </div>
        ) : !currentCityWeather ? (
          <div className="text-center py-20 px-10">
             <p className="text-slate-400 font-bold mb-8 italic">No active cities.</p>
             <button onClick={() => setIsSettingsOpen(true)} className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl">Setup Now</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Weather Card */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl transition-all duration-1000 bg-gradient-to-br ${getWeatherGradient(currentCode)}`}>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                        {viewType === 'current' ? 'Now' : formatDateLabel(viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3)}
                    </p>
                    <div className="bg-black/10 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[9px] font-black uppercase tracking-widest">BC</span>
                    </div>
                </div>
                <h1 className="text-4xl font-black mb-10 tracking-tighter truncate leading-tight">{activeCity.name}</h1>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-start">
                        <span className="text-8xl font-black tracking-tighter leading-none">
                        {Math.round(
                            viewType === 'current' 
                            ? currentCityWeather.current.temp 
                            : currentCityWeather.daily.temp_max[viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3]
                        )}
                        </span>
                        <span className="text-4xl font-black mt-2">°</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-white/90 font-black text-xs flex items-center gap-1.5 whitespace-nowrap">
                            <Thermometer className="w-3.5 h-3.5 shrink-0" /> 
                            Feels {Math.round(currentCityWeather.current.feels_like)}°
                        </p>
                        <p className="text-white/70 font-black text-[10px] uppercase tracking-widest pl-5 whitespace-nowrap">
                            H:{Math.round(currentMax || 0)}°  L:{Math.round(currentMin || 0)}°
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="bg-white/15 p-5 rounded-[2rem] border border-white/20 backdrop-blur-xl">
                        <WeatherIcon code={currentCode} className="w-14 h-14" />
                    </div>
                    <span className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-white leading-tight max-w-[100px]">
                        {getWeatherDescription(currentCode)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-10">
                  <div className="bg-white/10 p-4 rounded-3xl flex items-center gap-3 border border-white/5 overflow-hidden">
                    <div className="bg-white/20 p-2 rounded-xl shrink-0">
                        <Wind className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase font-black text-white/50 tracking-widest truncate">Wind</p>
                      <p className="font-black text-sm tracking-tight truncate">{currentCityWeather.current.wind_kph}<span className="text-[10px] ml-1 opacity-60">km/h</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-3xl flex items-center gap-3 border border-white/5 overflow-hidden">
                    <div className="bg-white/20 p-2 rounded-xl shrink-0">
                        {isSnowCode(currentCode) ? <CloudSnow className="w-4 h-4 text-white" /> : <Droplets className="w-4 h-4 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase font-black text-white/50 tracking-widest truncate">
                        {isSnowCode(currentCode) ? 'Snow' : 'Precip'}
                      </p>
                      <p className="font-black text-sm tracking-tight truncate">
                        {isSnowCode(currentCode) 
                          ? `${currentSnowValue.toFixed(1)}cm` 
                          : `${currentPrecipValue.toFixed(1)}mm`}
                      </p>
                    </div>
                  </div>
                </div>

                {viewType !== 'current' && renderForecastDetails(
                  viewType === 'day1' ? 1 : viewType === 'day2' ? 2 : 3
                )}
              </div>
            </div>

            {renderHighwayConditions()}
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          onUpdate={(newS) => {
            setSettings(newS);
            refreshData(); 
          }} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      <div className="fixed bottom-6 left-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
          {notifications.map((notif) => (
            <div key={notif.id} className="pointer-events-auto">
                <NotificationToast 
                message={notif.msg} 
                onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} 
                />
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
