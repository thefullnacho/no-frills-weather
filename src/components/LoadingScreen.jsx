import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="border-t-2 border-black p-12 flex flex-col items-center justify-center bg-white min-h-[400px]">
        <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"></div>
        </div>
        <h2 className="text-2xl font-black blink">FETCHING_DATA...</h2>
        <p className="text-xs text-gray-500 mt-2">ESTABLISHING CONNECTION TO SATELLITE</p>
    </div>
  );
};

export default LoadingScreen;
