import React from 'react';

const PressureGraph = ({ hourly, unit }) => {
    if (!hourly || !hourly.pressure_msl) return null;
    const rawData = hourly.pressure_msl.slice(0, 24);
    const times = hourly.time.slice(0, 24);
    const data = unit === 'imperial' ? rawData.map(v => v * 0.02953) : rawData;
    const unitLabel = unit === 'imperial' ? "inHg" : "hPa";
    const decimals = unit === 'imperial' ? 2 : 0;
    
    // Calculate min/max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; 

    // SVG Layout
    const width = 1000;
    const height = 200;
    const paddingX = 40;
    const paddingY = 40;
    const graphHeight = height - (paddingY * 2);
    const graphWidth = width - (paddingX * 2);

    const points = data.map((val, i) => {
        const x = (i / 23) * graphWidth + paddingX;
        const normalizedY = (val - min) / range;
        const y = height - paddingY - (normalizedY * graphHeight);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="border-b-2 border-black p-6 bg-white">
            <div className="flex justify-between items-end mb-4">
                 <h3 className="text-sm font-bold uppercase bg-black text-white inline-block px-2 py-1">
                    ATMOSPHERIC_PRESSURE (24H)
                </h3>
                <div className="text-right">
                    <span className="block text-xs font-bold text-gray-500 uppercase">CURRENT</span>
                    <span className="text-xl font-black">{data[0].toFixed(decimals)} {unitLabel}</span>
                </div>
            </div>
            <div className="relative border-2 border-black border-dashed bg-gray-50 h-48 w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
                    <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="10,10" />
                    <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="10,10" />
                    <polyline fill="none" stroke="black" strokeWidth="6" strokeLinejoin="round" points={points} />
                    {data.map((val, i) => {
                        // Sparse labels
                        if (i % 4 !== 0 && i !== 0 && i !== 23) return null;
                        const x = (i / 23) * graphWidth + paddingX;
                        const normalizedY = (val - min) / range;
                        const y = height - paddingY - (normalizedY * graphHeight);
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="8" fill="white" stroke="black" strokeWidth="3" />
                                <text x={x} y={height - 10} textAnchor="middle" className="text-[24px] font-bold fill-gray-500 font-mono">
                                    {new Date(times[i]).getHours()}:00
                                </text>
                                {/* Only show val for start, end, max, min to avoid clutter */}
                                {(i === 0 || i === 23 || val === max || val === min) && (
                                     <text x={x} y={y - 20} textAnchor="middle" className="text-[24px] font-black fill-black">
                                     {val.toFixed(decimals)}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
                <div className="absolute top-2 left-2 text-xs font-bold bg-white px-1 border border-black">MAX: {max.toFixed(decimals)}</div>
                <div className="absolute bottom-2 left-2 text-xs font-bold bg-white px-1 border border-black">MIN: {min.toFixed(decimals)}</div>
            </div>
        </div>
    );
  };

export default PressureGraph;
