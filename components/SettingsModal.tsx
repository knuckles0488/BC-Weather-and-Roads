import React, { useState } from 'react';
import { UserSettings, City, Highway } from '../types.ts';
import { BC_CITIES, BC_HIGHWAYS } from '../constants.ts';
import { Settings, Trash2, Plus, Moon, Sun, CloudSun } from './Icons.tsx';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  const [selectedCityName, setSelectedCityName] = useState(BC_CITIES[0].name);
  const [selectedHighwayId, setSelectedHighwayId] = useState(BC_HIGHWAYS[0].id);

  const addCity = () => {
    const city = BC_CITIES.find(c => c.name === selectedCityName);
    if (city && !settings.cities.find(c => c.name === city.name)) {
      onUpdate({ ...settings, cities: [...settings.cities, city] });
    }
  };

  const removeCity = (name: string) => {
    onUpdate({ ...settings, cities: settings.cities.filter(c => c.name !== name) });
  };

  const addHighway = () => {
    if (!settings.highways.includes(selectedHighwayId)) {
      onUpdate({ ...settings, highways: [...settings.highways, selectedHighwayId] });
    }
  };

  const removeHighway = (id: string) => {
    onUpdate({ ...settings, highways: settings.highways.filter(h => h !== id) });
  };

  const toggleDarkMode = () => {
    onUpdate({ ...settings, isDarkMode: !settings.isDarkMode });
  };

  const updateHour = (key: keyof UserSettings['forecastHours'], val: string) => {
    onUpdate({
      ...settings,
      forecastHours: { ...settings.forecastHours, [key]: parseInt(val) }
    });
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    val: i,
    label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors ${settings.isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" /> Settings
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors font-bold ${settings.isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${settings.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Appearance</h3>
            <button 
              onClick={toggleDarkMode}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                {settings.isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <span className="font-bold">Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </div>
            </button>
          </section>

          <section>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${settings.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Forecast Slots</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['morning', 'afternoon', 'evening'] as const).map(time => (
                <div key={time} className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 text-center">{time}</label>
                  <select
                    className={`border rounded-xl px-2 py-2 text-xs font-bold outline-none ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    value={settings.forecastHours[time]}
                    onChange={(e) => updateHour(time, e.target.value)}
                  >
                    {hourOptions.map(h => <option key={h.val} value={h.val}>{h.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${settings.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cities</h3>
            <div className="flex gap-2 mb-4">
              <select 
                className={`flex-1 border rounded-xl px-4 py-2 outline-none ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
              >
                {BC_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <button 
                onClick={addCity}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {settings.cities.map(city => (
                <div key={city.name} className={`flex items-center justify-between p-3 rounded-xl border ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="font-medium">{city.name}</span>
                  <button onClick={() => removeCity(city.name)} className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${settings.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Highways</h3>
            <div className="flex gap-2 mb-4">
              <select 
                className={`flex-1 border rounded-xl px-4 py-2 outline-none ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                value={selectedHighwayId}
                onChange={(e) => setSelectedHighwayId(e.target.value)}
              >
                {BC_HIGHWAYS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <button 
                onClick={addHighway}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {settings.highways.map(id => {
                const hInfo = BC_HIGHWAYS.find(h => h.id === id);
                return (
                  <div key={id} className={`flex items-center justify-between p-3 rounded-xl border ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="font-medium text-sm">{hInfo?.name || id}</span>
                    <button onClick={() => removeHighway(id)} className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className={`p-4 border-t ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <button 
            onClick={onClose}
            className={`w-full font-bold py-3 rounded-2xl transition-colors ${settings.isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;