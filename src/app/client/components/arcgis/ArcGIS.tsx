"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchLocationData } from "../../lib/ECLocation";
import { Location } from "../../types/EcLocation";
import { useECCode } from "./hooks/useECCode";

interface ArcGISProps {
  center?: [number, number];
  zoom?: number;
  basemap?: string;
  className?: string;
}

const ArcGIS: React.FC<ArcGISProps> = ({
  center = [121.774, 12.8797],
  zoom = 7,
  basemap = "satellite",
  className = "",
}) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedECCode, setSelectedECCode } = useECCode();

  // Fetch location data
  useEffect(() => {
    const getLocations = async () => {
      try {
        setLoading(true);
        const data = await fetchLocationData();
        setLocations(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch location data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      if (!mapDiv.current) return;

      try {
        // Import ArcGIS modules
        const [
          Map,
          MapView,
          Graphic,
          SimpleMarkerSymbol,
          TextSymbol,
          GraphicsLayer,
          Point,
        ] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/Graphic"),
          import("@arcgis/core/symbols/SimpleMarkerSymbol"),
          import("@arcgis/core/symbols/TextSymbol"),
          import("@arcgis/core/layers/GraphicsLayer"),
          import("@arcgis/core/geometry/Point"),
        ]);

        // Create map instance
        const map = new Map.default({
          basemap: basemap,
        });

        // Create view instance with UI disabled
        const view = new MapView.default({
          container: mapDiv.current,
          map: map,
          center: center,
          zoom: zoom,
          ui: {
            components: [], // Remove all UI components
          },
        });

        // Create a graphics layer for the locations
        const graphicsLayer = new GraphicsLayer.default();
        map.add(graphicsLayer);

        // Add locations to the map
        locations.forEach((location) => {
          // Create a point geometry
          const point = new Point.default({
            longitude: location.LOC_LONG,
            latitude: location.LOC_LAT,
          });

          // Create a simple marker symbol
          const markerSymbol = new SimpleMarkerSymbol.default({
            color:
              location.EC_CODE === selectedECCode ? [0, 255, 0] : [255, 0, 0], // Green if selected, red otherwise
            size: 20,
            outline: {
              color: [255, 255, 255], // White outline
              width: 2,
            },
          });

          // Create a graphic with the point and marker symbol
          const graphic = new Graphic.default({
            geometry: point,
            symbol: markerSymbol,
            attributes: {
              EC_CODE: location.EC_CODE,
            },
            popupTemplate: {
              title: "Location",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "EC_CODE",
                      label: "EC Code",
                    },
                  ],
                },
              ],
            },
          });

          // Add the graphic to the graphics layer
          graphicsLayer.add(graphic);

          // Create a text symbol for the EC_CODE
          const textSymbol = new TextSymbol.default({
            color: [255, 255, 255], // White color
            text: location.EC_CODE,
            font: {
              size: 10,
              weight: "bold",
            },
            haloSize: 2,
            haloColor: [0, 0, 0], // Black halo
          });

          // Create a graphic for the text
          const textGraphic = new Graphic.default({
            geometry: point,
            symbol: textSymbol,
          });

          // Offset the text slightly above the marker
          textGraphic.geometry = new Point.default({
            longitude: location.LOC_LONG,
            latitude: location.LOC_LAT + 0.01, // Offset to the north
          });

          // Add the text graphic to the graphics layer
          graphicsLayer.add(textGraphic);
        });

        // Add click event handler to the view
        view.on("click", (event: any) => {
          // Check if the click was on a graphic
          view.hitTest(event).then((response: any) => {
            if (response.results.length > 0) {
              const graphic = response.results[0].graphic;
              if (graphic && graphic.attributes && graphic.attributes.EC_CODE) {
                setSelectedECCode(graphic.attributes.EC_CODE);

                // Zoom in on the clicked graphic
                view.goTo({
                  target: graphic.geometry,
                  zoom: view.zoom + 1, // Adjust zoom level as needed
                });
              }
            }
          });
        });

        if (isMounted) {
          viewRef.current = view;
        }

        // Cleanup function
        return () => {
          if (view) {
            view.destroy();
          }
        };
      } catch (error) {
        console.error("Error loading ArcGIS map:", error);
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [center, zoom, basemap, locations, selectedECCode]);

  return (
    <div className="relative">
      <div
        ref={mapDiv}
        className={`w-full h-[700px] ${className}`}
        style={{ position: "relative" }}
      />
      {loading && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          Loading locations...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 text-red-800 p-2 rounded shadow">
          {error}
        </div>
      )}
      {selectedECCode && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
          Selected: {selectedECCode}
        </div>
      )}
    </div>
  );
};

export default ArcGIS;
