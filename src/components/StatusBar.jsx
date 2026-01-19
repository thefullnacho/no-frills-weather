import React from 'react';

const StatusBar = ({ loading, error }) => {
  return (
    <div className="border-b-2 border-black bg-yellow-300 p-2 text-sm font-bold flex justify-between uppercase">
      <span>STATUS: {loading ? 'FETCHING STREAM...' : error ? 'ERROR' : 'ONLINE'}</span>
      <span>SRC: OPEN-METEO / NWS / WINDY</span>
    </div>
  );
};

export default StatusBar;
