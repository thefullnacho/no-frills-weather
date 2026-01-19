import React, { useState, useEffect } from 'react';
import { Pin, Trash2, ExternalLink } from 'lucide-react';

const PinnedTicker = ({ currentGeo, loadLocation, currentTemp, unit }) => {
  const [pins, setPins] = useState([]);
  const [pinnedWeather, setPinnedWeather] = useState({});

  // Load pins on mount
  useEffect(() => {
    const saved = localStorage.getItem('nfw_pins');
    if (saved) {
        setPins(JSON.parse(saved));
    }
  }, []);

  // Fetch weather for pins when they change
  useEffect(() => {
    if (pins.length === 0) return;

    const fetchPinnedData = async () => {
        const newData = {};
        
        for (const pin of pins) {
             try {
                // We just need current temp.
                const params = new URLSearchParams({
                    latitude: pin.lat,
                    longitude: pin.lon,
                    current: "temperature_2m",
                    temperature_unit: unit === 'imperial' ? 'fahrenheit' : 'celsius'
                });
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
                const data = await res.json();
                newData[pin.id] = data.current.temperature_2m;
             } catch (e) {
                 console.warn("Failed to fetch pin", pin.name);
             }
        }
        setPinnedWeather(newData);
    };

    fetchPinnedData();
    
    // Refresh every 5 mins
    const interval = setInterval(fetchPinnedData, 300000);
    return () => clearInterval(interval);

  }, [pins, unit]);

  const addPin = () => {
      if (!currentGeo || pins.length >= 3) return;
      
      const newPin = {
          id: `${currentGeo.latitude}-${currentGeo.longitude}`,
          name: currentGeo.name,
          lat: currentGeo.latitude,
          lon: currentGeo.longitude
      };

      // Avoid duplicates
      if (pins.some(p => p.id === newPin.id)) return;

      const newPins = [...pins, newPin];
      setPins(newPins);
      localStorage.setItem('nfw_pins', JSON.stringify(newPins));
  };

  const removePin = (id, e) => {
      e.stopPropagation(); // Don't trigger load
      const newPins = pins.filter(p => p.id !== id);
      setPins(newPins);
      localStorage.setItem('nfw_pins', JSON.stringify(newPins));
  };

  const isCurrentPinned = currentGeo && pins.some(p => p.id === `${currentGeo.latitude}-${currentGeo.longitude}`);

  return (
    <div className="w-full bg-black text-white border-b-2 border-black flex flex-col md:flex-row justify-between items-center px-4 py-2 gap-4">
        
        {/* Ticker List */}
        <div className="flex-1 flex gap-4 overflow-x-auto w-full md:w-auto items-center scrollbar-hide">
            <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap hidden md:inline">PINNED:</span>
            {pins.length === 0 && <span className="text-xs text-gray-600 font-mono">NO_LOCATIONS_SAVED</span>}
            
            {pins.map(pin => (
                <div 
                    key={pin.id} 
                    onClick={() => loadLocation(pin.lat, pin.lon)}
                    className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap border border-gray-700 hover:border-white"
                >
                    <span className="text-sm font-bold uppercase">{pin.name}</span>
                    <span className="text-sm font-mono text-yellow-400">
                        {pinnedWeather[pin.id] !== undefined ? `${pinnedWeather[pin.id].toFixed(0)}°` : '--'}
                    </span>
                    <button onClick={(e) => removePin(pin.id, e)} className="text-gray-500 hover:text-red-500 ml-1">
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
        </div>

        {/* Action Button */}
        {currentGeo && (
             <div className="flex-shrink-0">
                 {isCurrentPinned ? (
                     <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1 opacity-50 cursor-not-allowed">
                         <Pin size={14} className="fill-current" /> LOCATION_PINNED
                     </span>
                 ) : (
                    <button 
                        onClick={addPin} 
                        disabled={pins.length >= 3}
                        className={`
                            text-xs font-bold uppercase flex items-center gap-2 px-3 py-1 border border-white
                            ${pins.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black transition-colors'}
                        `}
                    >
                        <Pin size={14} /> 
                        {pins.length >= 3 ? 'MAX_PINS_REACHED' : 'PIN_THIS_LOCATION'}
                    </button>
                 )}
             </div>
        )}
    </div>
  );
};

export default PinnedTicker;
