import React from 'react';
import { formatTime } from '../utils/weatherUtils';

const HourlyForecast = ({ hourlyData, unit, currentTime }) => {
  if (!hourlyData) return null;

  // Find start index based on current location time
  let startIndex = 0;
  if (currentTime) {
      // Open-Meteo time is "YYYY-MM-DDTHH:mm"
      // hourlyData.time has "YYYY-MM-DDTHH:00"
      // We match the hour.
      const currentHourStr = currentTime.slice(0, 13); // Match YYYY-MM-DDTHH
      const foundIndex = hourlyData.time.findIndex(t => t.startsWith(currentHourStr));
      if (foundIndex !== -1) startIndex = foundIndex;
  }

  const displayCount = 24;
  const visibleIndices = [];
  for(let i=0; i < displayCount; i++) {
      if(startIndex + i < hourlyData.time.length) {
          visibleIndices.push(startIndex + i);
      }
  }

  return (
    <div className="border-b-2 border-black overflow-hidden bg-gray-50">
        <div className="bg-black text-white px-4 py-1 text-xs font-bold uppercase inline-block">
            HOURLY_TEMP (24H)
        </div>
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide flex">
           {visibleIndices.map((idx) => {
               const time = hourlyData.time[idx];
               const temp = hourlyData.temperature_2m[idx];
               const precipProb = hourlyData.precipitation_probability[idx];
               const snow = hourlyData.snowfall ? hourlyData.snowfall[idx] : 0;
               const isSnow = snow > 0;

               return (
               <div key={idx} className="inline-flex flex-col items-center justify-between border-r-2 border-black p-4 min-w-[100px] hover:bg-white transition-colors">
                  <span className="text-xs font-bold mb-2">{formatTime(time)}</span>
                  <span className="text-2xl font-black mb-2">{temp.toFixed(0)}°</span>
                  <div className="h-12 w-full flex items-end justify-center gap-1">
                     <div 
                        className={`w-4 ${isSnow ? 'bg-cyan-300' : 'bg-blue-600'}`}
                        style={{ height: `${precipProb}%` }}
                     ></div>
                  </div>
                  <span className={`text-[10px] font-bold mt-1 ${isSnow ? 'text-cyan-600' : 'text-blue-600'}`}>
                     {precipProb}%
                  </span>
                  {isSnow && (
                      <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-1 rounded mt-1">
                        {snow} {unit === 'imperial' ? 'in' : 'cm'}
                      </span>
                  )}
               </div>
           )})}
        </div>
    </div>
  );
};

export default HourlyForecast;