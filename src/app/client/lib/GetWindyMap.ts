// lib/windyMap.ts
import { FetchWeather } from "./FetchOpenWeather";
import type { Location } from '../types/EcLocation';
declare const L: any;
declare const windyInit: any;


export const initWindyMap = async (
  containerId: string,
  weatherRef: React.MutableRefObject<any>,
  isFetching: boolean,
  setIsFetching: (val: boolean) => void
) => {
  const options = {
    key: process.env.NEXT_PUBLIC_WINDY_API_KEY,
    verbose: true,
    lat: 12.8797,
    lon: 121.774,
    zoom: 5,
    container: containerId,
  };

  windyInit(options, (windyAPI: any) => {
    const { map } = windyAPI;

    fetch(`${process.env.NEXT_PUBLIC_NEA_DEV_CENTRAL}/api/dashboard/location-detail/`)
      .then((res) => res.json())
      .then((data) => {
        data.ecCode.forEach((location: Location) => {
          const { LOC_LAT, LOC_LONG, EC_CODE } = location;

          const marker = L.marker([LOC_LAT, LOC_LONG], {
            icon: L.divIcon({
              className: 'circle-marker',
              html: ` <div class="relative flex items-center justify-center w-8 h-8 bg-white border-2 border-blue-600 rounded-full shadow-md">
        <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-800 bg-white px-1 rounded shadow">
          ${EC_CODE}
        </span>
      </div>`,
              iconSize: [10, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(map);

          marker.on('click', async () => {
            if (!isFetching) {
              setIsFetching(true);
              try {
                weatherRef.current = await FetchWeather(LOC_LAT, LOC_LONG);
              } catch (error) {
                console.error('Weather fetch failed:', error);
              } finally {
                setIsFetching(false);
              }
            }

            const w = weatherRef.current;

            const content = `
              <div class="bg-white p-4 rounded shadow text-sm">
                <div class="font-bold text-blue-800 text-lg">${w.main?.temp ?? '--'}°C</div>
                <div>${w.weather?.[0].description ?? 'Loading'}</div>
                <div>Humidity: ${w.main?.humidity ?? '--'}%</div>
                <div>Wind: ${w.wind?.speed ?? '--'} m/s</div>
              </div>
            `;
            marker.bindTooltip(content).openTooltip();
          });

          marker.on('dblclick', () => marker.closeTooltip());
        });
      })
      .catch(console.error);
  });
};
