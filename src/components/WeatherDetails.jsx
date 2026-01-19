import React from 'react';
import { ArrowUp } from 'lucide-react';

const WeatherDetails = ({ weatherData }) => {
  if (!weatherData) return null;

  return (
    <div className="grid grid-cols-2 grid-rows-2">
      <div className="border-b-2 border-r-2 border-black p-4 md:p-6 hover:bg-blue-50 transition-colors">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">WIND_SPEED</h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl md:text-5xl font-bold">
              {weatherData.weather.current.wind_speed_10m}
          </span>
          <span className="text-sm font-bold">{weatherData.weather.current_units.wind_speed_10m}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm font-bold">
           <div style={{ transform: `rotate(${weatherData.weather.current.wind_direction_10m}deg)` }}>
              <ArrowUp size={20} strokeWidth={3} />
           </div>
           <span>{weatherData.weather.current.wind_direction_10m}°</span>
        </div>
      </div>

      <div className="border-b-2 border-black p-4 md:p-6 hover:bg-blue-50 transition-colors">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">HUMIDITY</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl md:text-5xl font-bold">
              {weatherData.weather.current.relative_humidity_2m}
          </span>
          <span className="text-xl font-bold">%</span>
        </div>
      </div>

      <div className="border-r-2 border-black p-4 md:p-6 hover:bg-blue-50 transition-colors">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">PRESSURE (NOW)</h3>
         <div className="flex items-end gap-2">
          <span className="text-3xl md:text-5xl font-bold">
              {weatherData.weather.current.pressure_msl.toFixed(0)}
          </span>
          <span className="text-sm font-bold">hPa</span>
        </div>
      </div>

       <div className="p-4 md:p-6 hover:bg-blue-50 transition-colors">
         <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">PRECIPITATION</h3>
         <div className="flex items-end gap-2">
          <span className="text-3xl md:text-5xl font-bold">
              {weatherData.weather.current.precipitation}
          </span>
          <span className="text-sm font-bold">{weatherData.weather.current_units.precipitation}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
