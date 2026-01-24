import React from 'react';
import { AlertTriangle, ArrowDown, Zap } from 'lucide-react';

const Alerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const hasPowerRisk = alerts.some(a => 
    /(power (outage|failure|lines|loss)|outages)/i.test(a.properties.description || '') ||
    /(power (outage|failure|lines|loss)|outages)/i.test(a.properties.instruction || '') ||
    /(power (outage|failure|lines|loss)|outages)/i.test(a.properties.event || '')
  );

  const scrollToDetails = () => {
    const el = document.getElementById('alert-details');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
        onClick={scrollToDetails}
        className="bg-red-600 text-white border-b-2 border-black cursor-pointer hover:bg-red-700 transition-colors group"
    >
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse group-hover:animate-none">
            <div className="flex items-center gap-4">
                <AlertTriangle size={32} className="flex-shrink-0" strokeWidth={3} />
                <div className="flex flex-col">
                    <h3 className="text-xl font-black uppercase tracking-wider">
                        SEVERE WEATHER ALERT {alerts.length > 1 ? `(${alerts.length})` : ''}
                    </h3>
                    {hasPowerRisk && (
                        <span className="flex items-center gap-1 text-yellow-300 font-bold text-sm uppercase">
                            <Zap size={16} fill="currentColor" />
                            Power Outage Risk Detected
                        </span>
                    )}
                </div>
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
