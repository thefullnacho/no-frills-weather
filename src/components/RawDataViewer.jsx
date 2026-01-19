import React from 'react';

const RawDataViewer = ({ data }) => {
  if (!data) return null;
  return (
    <div className="border-t-2 border-black p-4 bg-gray-900 text-green-400 text-xs overflow-auto h-64 font-mono">
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default RawDataViewer;
