import React from 'react';
import { Zap } from 'lucide-react';

const AlertDetails = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div id="alert-details" className="mt-8 border-2 border-red-600 bg-red-50 p-6">
      <div className="bg-red-600 text-white px-4 py-2 text-xl font-black uppercase inline-block mb-4">
        ACTIVE ALERTS ({alerts.length})
      </div>
      <div className="space-y-6">
        {alerts.map((alert, i) => {
            const isPowerRisk = /(power (outage|failure|lines|loss)|outages)/i.test(alert.properties.description || '') ||
                                /(power (outage|failure|lines|loss)|outages)/i.test(alert.properties.instruction || '') ||
                                /(power (outage|failure|lines|loss)|outages)/i.test(alert.properties.event || '');
            
            return (
              <div key={i} className="border-l-4 border-red-600 pl-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-black uppercase">{alert.properties.event}</h3>
                    {isPowerRisk && (
                        <span className="flex items-center gap-1 bg-yellow-400 text-red-900 text-xs font-bold px-2 py-0.5 uppercase">
                            <Zap size={12} fill="currentColor" />
                            Power Risk
                        </span>
                    )}
                </div>
                <p className="font-bold text-sm mb-2 text-gray-700">{alert.properties.headline}</p>
                <p className="text-xs font-mono whitespace-pre-wrap bg-white p-2 border border-red-200 mt-2 max-h-40 overflow-auto">
                    {alert.properties.description}
                </p>
              </div>
        )})}
      </div>
    </div>
  );
};

export default AlertDetails;