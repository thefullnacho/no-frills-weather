import React, { useState, useEffect, useRef } from 'react';
import Header from './src/components/Header';
import Alerts from './src/components/Alerts';
import StatusBar from './src/components/StatusBar';
import CurrentWeather from './src/components/CurrentWeather';
import WeatherDetails from './src/components/WeatherDetails';
import SurvivalGuide from './src/components/SurvivalGuide';
import PinnedTicker from './src/components/PinnedTicker';
import Radar from './src/components/Radar';
import HourlyForecast from './src/components/HourlyForecast';
import PressureGraph from './src/components/PressureGraph';
import DailyForecast from './src/components/DailyForecast';
import AlertDetails from './src/components/AlertDetails';
import RawDataViewer from './src/components/RawDataViewer';
import LoadingScreen from './src/components/LoadingScreen';
import { WeatherCodeMap } from './src/utils/weatherUtils';

const NoFrillsWeather = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [unit, setUnit] = useState(() => localStorage.getItem('nfw_unit') || "imperial"); 
  const [showRaw, setShowRaw] = useState(false);
  const [radarInteractive, setRadarInteractive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  // Refs
  const abortControllerRef = useRef(null);

  // Persistence for Unit
  useEffect(() => {
    localStorage.setItem('nfw_unit', unit);
    // Reload data if we have it to update units
    if (weatherData) {
        if(weatherData.geo.name !== "COORDINATES") {
            loadData(weatherData.geo.name);
        } else {
            // If GPS, we re-fetch with stored coords
            loadDataByCoords(weatherData.geo.latitude, weatherData.geo.longitude);
        }
    }
  }, [unit]);

  const isZipCode = (str) => /^\d{5}$/.test(str.trim());

  // --- API HELPER ---
  const buildWeatherUrl = (lat, lon, timezone, unitSystem) => {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        timezone: timezone === 'auto' ? 'auto' : timezone,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,dew_point_2m",
        hourly: "temperature_2m,precipitation_probability,weather_code,wind_speed_10m,pressure_msl",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max",
    });

    if (unitSystem === 'imperial') {
        params.append("temperature_unit", "fahrenheit");
        params.append("wind_speed_unit", "mph");
        params.append("precipitation_unit", "inch");
    } else {
        params.append("temperature_unit", "celsius");
        params.append("wind_speed_unit", "kmh");
        params.append("precipitation_unit", "mm");
    }

    return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  };

  const fetchCoordinates = async (query, signal) => {
    if (isZipCode(query)) {
        const response = await fetch(`https://api.zippopotam.us/us/${query}`, { signal });
        if (!response.ok) throw new Error("ZIP CODE NOT FOUND");
        const data = await response.json();
        return {
            name: data.places[0]['place name'],
            latitude: parseFloat(data.places[0].latitude),
            longitude: parseFloat(data.places[0].longitude),
            country: "United States",
            country_code: "US",
            timezone: "auto"
        };
    }

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`,
      { signal }
    );
    const data = await response.json();
    if (!data.results || data.results.length === 0) throw new Error("CITY NOT FOUND");
    return data.results[0];
  };

  const fetchWeather = async (lat, lon, timezone, signal) => {
    const url = buildWeatherUrl(lat, lon, timezone, unit);
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("WEATHER STREAM FAILED");
    return await response.json();
  };

  const fetchAirQuality = async (lat, lon, signal) => {
     try {
         const response = await fetch(
             `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,ozone`,
             { signal }
         );
         if (!response.ok) return null;
         return await response.json();
     } catch (e) {
         console.warn("AQI Fetch Failed", e);
         return null;
     }
  };

  const fetchAlerts = async (lat, lon, signal) => {
      try {
          // Point query to NWS
          const response = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, { signal });
          if (!response.ok) return [];
          const data = await response.json();
          return data.features || [];
      } catch (e) {
          if (e.name !== 'AbortError') console.warn("Alert fetch skipped/failed", e);
          return [];
      }
  };

  // --- CORE LOGIC ---

  const handleSearchOrLoad = async (query, isCoords = false, lat = null, lon = null) => {
      // 1. Cancel previous requests
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);
      setAlerts([]);
      setAirQualityData(null);

      try {
          let geoData;

          if (isCoords) {
              geoData = { 
                  name: "COORDINATES", 
                  latitude: lat, 
                  longitude: lon, 
                  country: "GPS", 
                  country_code: "US", // Assume US for alerts check, API will just return empty if not
                  timezone: "auto" 
              };
          } else {
              geoData = await fetchCoordinates(query, controller.signal);
          }

          // 2. Save last successful location to LocalStorage
          if (!isCoords) localStorage.setItem('nfw_last_query', query);

          // 3. Parallel Fetch
          const weatherPromise = fetchWeather(geoData.latitude, geoData.longitude, geoData.timezone, controller.signal);
          const aqiPromise = fetchAirQuality(geoData.latitude, geoData.longitude, controller.signal);
          
          let alertsPromise = Promise.resolve([]);
          // Only attempt NWS alerts if it looks like US or we are in GPS mode (let API decide)
          if (geoData.country_code === 'US' || geoData.country === 'United States' || isCoords) {
              alertsPromise = fetchAlerts(geoData.latitude, geoData.longitude, controller.signal);
          }

          const [wData, aqiData, alertsData] = await Promise.all([weatherPromise, aqiPromise, alertsPromise]);

          setWeatherData({ geo: geoData, weather: wData });
          setAirQualityData(aqiData);
          setAlerts(alertsData);
          setSearchInput("");

      } catch (err) {
          if (err.name !== 'AbortError') {
              setError(err.message.toUpperCase());
          }
      } finally {
          // Only turn off loading if this is the active request
          if (abortControllerRef.current === controller) {
            setLoading(false);
          }
      }
  };

  const loadData = (query) => handleSearchOrLoad(query, false);
  const loadDataByCoords = (lat, lon) => handleSearchOrLoad(null, true, lat, lon);

  const handleLocate = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("GEOLOCATION NOT SUPPORTED");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadDataByCoords(latitude, longitude);
      },
      () => {
        setError("LOCATION ACCESS DENIED");
        setLoading(false);
      }
    );
  };

  // Initial Load
  useEffect(() => {
    const lastQuery = localStorage.getItem('nfw_last_query');
    if (lastQuery) {
        loadData(lastQuery);
    } else {
        loadData("10001");
    }
  }, []); // Run once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) loadData(searchInput);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-mono p-2 sm:p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <Header 
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSubmit={handleSubmit}
          handleLocate={handleLocate}
          unit={unit}
          setUnit={setUnit}
          showRaw={showRaw}
          setShowRaw={setShowRaw}
        />

        <PinnedTicker 
            currentGeo={weatherData?.geo} 
            loadLocation={loadDataByCoords}
            currentTemp={weatherData?.weather.current.temperature_2m}
            unit={unit}
        />

        <Alerts alerts={alerts} />

        <StatusBar loading={loading} error={error} />

        {error && (
            <div className="bg-red-600 text-white p-6 border-b-2 border-black">
                <h2 className="text-4xl font-bold mb-2">CRITICAL ERROR</h2>
                <p className="text-xl">{error}</p>
            </div>
        )}

        {/* Main Content */}
        {!loading && weatherData && !error && (
          <div className="flex flex-col">
            
            <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-black">
              <CurrentWeather weatherData={weatherData} WeatherCodeMap={WeatherCodeMap} />
              <WeatherDetails weatherData={weatherData} />
            </div>

            <SurvivalGuide weatherData={weatherData.weather} airQuality={airQualityData} />

            <Radar 
              geo={weatherData.geo} 
              interactive={radarInteractive} 
              setInteractive={setRadarInteractive} 
            />

            <HourlyForecast hourlyData={weatherData.weather.hourly} />

            <PressureGraph hourly={weatherData.weather.hourly} unit={unit} />

            <DailyForecast dailyData={weatherData.weather.daily} WeatherCodeMap={WeatherCodeMap} />

            <AlertDetails alerts={alerts} />

          </div>
        )}

        {showRaw && <RawDataViewer data={{weather: weatherData, aqi: airQualityData}} />}
        
        {loading && <LoadingScreen />}

      </div>

      <footer className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
        No Frills Weather Systems © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default NoFrillsWeather;
