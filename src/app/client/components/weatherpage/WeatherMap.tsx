import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import WeatherWidget from "./WeatherWidget";
import { initWindyMap } from "../../lib/GetWindyMap";

const WeatherMap = () => {
  const weatherRef = useRef<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    const leaflet = document.createElement("script");
    leaflet.src = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.js";
    leaflet.async = true;

    const windy = document.createElement("script");
    windy.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
    windy.async = true;

    Promise.all([
      new Promise((res, rej) => {
        leaflet.onload = res;
        leaflet.onerror = rej;
      }),
      new Promise((res, rej) => {
        windy.onload = res;
        windy.onerror = rej;
      }),
    ])
      .then(() => {
        setScriptsLoaded(true);
      })
      .catch(console.error);

    document.head.appendChild(leaflet);
    document.head.appendChild(windy);

    return () => {
      document.head.removeChild(leaflet);
      document.head.removeChild(windy);
    };
  }, []);

  useEffect(() => {
    if (scriptsLoaded) {
      initWindyMap("windy", weatherRef, isFetching, setIsFetching);
    }
  }, [scriptsLoaded]);

  return (
    <div className="w-full h-screen grid grid-cols-12 grid-rows-13 gap-2 bg-gray-100 dark:bg-[#252522]">
      <div className="col-start-1 col-end-13 row-start-1 row-end-12 relative">
        <div id="windy" className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-4 left-4 w-80 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(WeatherMap), {
  ssr: false,
});
