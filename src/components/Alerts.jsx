import React from 'react';
import { AlertTriangle, ArrowDown } from 'lucide-react';

const Alerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const scrollToDetails = () => {
    const el = document.getElementById('alert-details');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
        onClick={scrollToDetails}
        className="bg-red-600 text-white border-b-2 border-black cursor-pointer hover:bg-red-700 transition-colors group"
    >
        <div className="p-4 flex items-center justify-between gap-4 animate-pulse group-hover:animate-none">
            <div className="flex items-center gap-4">
                <AlertTriangle size={32} className="flex-shrink-0" strokeWidth={3} />
                <h3 className="text-xl font-black uppercase tracking-wider">
                    SEVERE WEATHER ALERT {alerts.length > 1 ? `(${alerts.length})` : ''}
                </h3>
            </div>
            <div className="flex items-center gap-2 border-2 border-white px-3 py-1 font-bold text-xs uppercase bg-transparent group-hover:bg-white group-hover:text-red-600 transition-colors">
                <span>VIEW DETAILS</span>
                <ArrowDown size={16} />
            </div>
        </div>
    </div>
  );
};

export default Alerts;