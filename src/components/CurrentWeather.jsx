import React from 'react';

const CurrentWeather = ({ weatherData, WeatherCodeMap }) => {
  if (!weatherData) return null;
  
  return (
    <div className="p-6 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-10 text-9xl font-black select-none pointer-events-none transform translate-x-1/3 -translate-y-1/3">
        {weatherData.weather.current.temperature_2m.toFixed(0)}
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-500 mb-2">CURRENT_LOCATION</h2>
        <p className="text-4xl md:text-5xl font-black uppercase break-words leading-none mb-2">
          {weatherData.geo.name}
        </p>
        <p className="text-lg text-gray-600">{weatherData.geo.country}</p>
        <p className="text-xs text-gray-400 mt-1">LAT: {weatherData.geo.latitude.toFixed(2)} / LON: {weatherData.geo.longitude.toFixed(2)}</p>
      </div>
      
      <div className="mt-12">
         <div className="flex items-baseline">
            <span className="text-7xl md:text-9xl font-black tracking-tighter">
              {weatherData.weather.current.temperature_2m.toFixed(0)}°
            </span>
         </div>
         <p className="text-xl md:text-2xl font-bold bg-black text-white inline-block px-2 py-1 uppercase mt-4">
           {WeatherCodeMap[weatherData.weather.current.weather_code] || "UNKNOWN"}
         </p>
      </div>
    </div>
  );
};

export default CurrentWeather;
