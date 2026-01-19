import React from 'react';
import { Radar as RadarIcon, Eye, EyeOff } from 'lucide-react';

const Radar = ({ geo, interactive, setInteractive }) => {
  if (!geo) return null;

  return (
    <div className="border-b-2 border-black p-0 bg-gray-200">
        <div className="bg-black text-white px-4 py-1 text-xs font-bold uppercase flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span>LIVE_RADAR_FEED</span>
                <RadarIcon size={16} />
            </div>
            <button 
                onClick={() => setInteractive(!interactive)}
                className="flex items-center gap-2 hover:text-yellow-400"
                title={interactive ? "Disable Interaction" : "Enable Interaction"}
            >
                {interactive ? <Eye size={16}/> : <EyeOff size={16}/>}
                <span className="hidden sm:inline">{interactive ? "INTERACTIVE_MODE" : "PASSIVE_MODE"}</span>
            </button>
        </div>
        <div className="w-full h-[400px] relative bg-gray-300 overflow-hidden">
             <iframe 
                width="100%" 
                height="400" 
                src={`https://embed.windy.com/embed2.html?lat=${geo.latitude}&lon=${geo.longitude}&detailLat=${geo.latitude}&detailLon=${geo.longitude}&width=650&height=450&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
                frameBorder="0"
                title="Weather Radar"
                className={`
                    transition-all duration-500 w-full h-full
                    ${interactive ? 'grayscale-0 pointer-events-auto' : 'grayscale-[100%] contrast-125 pointer-events-none hover:grayscale-0'}
                `}
             ></iframe>
        </div>
    </div>
  );
};

export default Radar;
