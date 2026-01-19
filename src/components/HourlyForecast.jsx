import React from 'react';
import { formatTime } from '../utils/weatherUtils';

const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData) return null;

  return (
    <div className="border-b-2 border-black overflow-hidden bg-gray-50">
        <div className="bg-black text-white px-4 py-1 text-xs font-bold uppercase inline-block">
            HOURLY_TEMP (24H)
        </div>
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide flex">
           {hourlyData.time.slice(0, 24).map((time, i) => (
               <div key={i} className="inline-flex flex-col items-center justify-between border-r-2 border-black p-4 min-w-[100px] hover:bg-white transition-colors">
                  <span className="text-xs font-bold mb-2">{formatTime(time)}</span>
                  <span className="text-2xl font-black mb-2">{hourlyData.temperature_2m[i].toFixed(0)}°</span>
                  <div className="h-12 w-full flex items-end justify-center gap-1">
                     <div 
                        className="w-4 bg-blue-600" 
                        style={{ height: `${hourlyData.precipitation_probability[i]}%` }}
                     ></div>
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-blue-600">
                     {hourlyData.precipitation_probability[i]}%
                  </span>
               </div>
           ))}
        </div>
    </div>
  );
};

export default HourlyForecast;
