import React from 'react';
import { Sun, Moon, Wind, Droplets } from 'lucide-react';
import { formatTime } from '../utils/weatherUtils';

const SurvivalGuide = ({ weatherData, airQuality }) => {
  if (!weatherData) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const aqi = airQuality?.current;

  // Calculate Moon Phase locally since API support is spotty
  const calculateMoonPhase = (date) => {
      const d = new Date(date);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
  
      if (month < 3) {
          year--;
          month += 12;
      }
  
      ++month;
  
      let c = 365.25 * year;
      let e = 30.6 * month;
      let total = c + e + day - 694039.09; // jd
      total /= 29.5305882; // divide by moon cycle
      let phase = total - parseInt(total); // 0-1
      
      return phase;
  };

  const getMoonPhaseLabel = () => {
      const phase = calculateMoonPhase(new Date());
      
      if (phase < 0.03) return "NEW MOON";
      if (phase < 0.25) return `WAXING CRESCENT (${(phase * 100).toFixed(0)}%)`;
      if (phase < 0.28) return "FIRST QUARTER";
      if (phase < 0.5) return `WAXING GIBBOUS (${(phase * 100).toFixed(0)}%)`;
      if (phase < 0.53) return "FULL MOON";
      if (phase < 0.75) return `WANING GIBBOUS (${(100 - (phase-0.5)*200).toFixed(0)}%)`;
      if (phase < 0.78) return "LAST QUARTER";
      return `WANING CRESCENT (${(100 - phase*100).toFixed(0)}%)`;
  };

  // AQI Color
  const getAqiColor = (val) => {
      if (val <= 50) return "bg-green-500 text-white";
      if (val <= 100) return "bg-yellow-400 text-black";
      if (val <= 150) return "bg-orange-500 text-white";
      if (val <= 200) return "bg-red-600 text-white";
      if (val <= 300) return "bg-purple-600 text-white";
      return "bg-amber-900 text-white";
  };
  
  return (
    <div className="border-b-2 border-black bg-white grid grid-cols-1 md:grid-cols-3">
        {/* SOLAR / LUNAR */}
        <div className="p-4 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Sun size={16} /> CYCLE_DATA
            </h3>
            <div className="text-sm font-bold flex justify-between mb-1">
                <span>SUNRISE:</span>
                <span>{formatTime(daily.sunrise[0])}</span>
            </div>
            <div className="text-sm font-bold flex justify-between mb-2">
                <span>SUNSET:</span>
                <span>{formatTime(daily.sunset[0])}</span>
            </div>
            <div className="text-xs font-mono uppercase bg-gray-100 p-1 border border-gray-300 text-center">
                MOON: {getMoonPhaseLabel()}
            </div>
        </div>

        {/* ATMOSPHERE (Dew Point) */}
        <div className="p-4 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Droplets size={16} /> SURVIVAL_INDEX
            </h3>
            <div className="flex items-end justify-between mb-2">
                <div>
                    <span className="block text-xs font-bold text-gray-400">DEW POINT</span>
                    <span className="text-2xl font-black">
                        {current.dew_point_2m?.toFixed(1)}°
                    </span>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-bold text-gray-400">APPARENT</span>
                    <span className="text-xl font-bold">
                        {current.apparent_temperature?.toFixed(1)}°
                    </span>
                </div>
            </div>
             <div className="flex justify-between items-center mt-1">
                 <span className="text-xs font-bold uppercase">UV INDEX (MAX)</span>
                 <span className={`px-2 py-0.5 text-xs font-bold border border-black ${
                     daily.uv_index_max?.[0] > 7 ? "bg-red-500 text-white" : "bg-green-300"
                 }`}>
                     {daily.uv_index_max?.[0]?.toFixed(1) || "0.0"}
                 </span>
             </div>
        </div>

        {/* AIR QUALITY */}
        <div className="p-4 flex flex-col justify-center">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Wind size={16} /> AIR_QUALITY
            </h3>
            {aqi ? (
                <>
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`flex-1 p-2 text-center border-2 border-black font-black text-xl ${getAqiColor(aqi.us_aqi)}`}>
                            {aqi.us_aqi} <span className="text-xs font-normal block">US AQI</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                        <span>PM2.5: {aqi.pm2_5?.toFixed(1)}</span>
                        <span>O3: {aqi.ozone?.toFixed(1)}</span>
                    </div>
                </>
            ) : (
                <div className="text-sm font-bold text-gray-400 italic">OFFLINE / NO DATA</div>
            )}
        </div>
    </div>
  );
};

export default SurvivalGuide;