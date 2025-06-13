// components/WeatherPage.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchLocationData } from "../../lib/ECLocation";
import { FetchWeather } from "../../lib/FetchOpenWeather";
import type { WeatherData } from "../../types/WeatherType";
import type { Location } from "../../types/EcLocation";

const WeatherWidget = () => {
  const [ecCode, setEcCode] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = async () => {
    if (!ecCode.trim()) {
      setError("Please enter an EC Code");
      return;
    }

    setError("");
    setWeather(null);
    setIsLoading(true);

    try {
      const locations = await fetchLocationData();
      const inputCode = ecCode.trim().toUpperCase(); // Normalize to uppercase

      const location = locations.find(
        (loc) => loc.EC_CODE.toUpperCase() === inputCode
      );

      if (!location) {
        throw new Error("Location not found");
      }

      setLocation(location);
      const weatherData = await FetchWeather(
        location.LOC_LAT,
        location.LOC_LONG
      );
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || "Could not find location or fetch weather data.");
      setLocation(null);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter EC Code"
          value={ecCode}
          onChange={(e) => setEcCode(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full bg-white"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`ml-3 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {weather && location && !isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-lg text-gray-800 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setWeather(null);
              setLocation(null);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="bg-blue flex items-center space-x-4">
            <img src={weather.icon} alt="weather icon" className="w-16 h-16" />
            <div>
              <div className="text-4xl font-bold text-blue-800">
                {weather.temperature}°C
              </div>
              <div className="text-lg text-gray-700 font-semibold">
                {location.EC_CODE}
              </div>
              <div className="text-sm text-gray-500">{weather.description}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-4">
            <div>Feels like: {weather.feels_like}°C</div>
            <div className="text-gray-500">
              {new Date().toLocaleDateString()}{" "}
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex mt-4 space-x-2">
            <div className="flex flex-col items-center p-2 bg-blue-100 rounded-lg w-1/3">
              <span className="text-blue-800 font-semibold text-xs">
                UV Index
              </span>
              <span className="text-gray-700 text-xs">Low</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-blue-100 rounded-lg w-1/3">
              <span className="text-blue-800 font-semibold text-xs">
                Humidity
              </span>
              <span className="text-gray-700 text-xs">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-blue-100 rounded-lg w-1/3">
              <span className="text-blue-800 font-semibold text-xs">Wind</span>
              <span className="text-gray-700 text-xs">
                {weather.wind_speed} m/s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
