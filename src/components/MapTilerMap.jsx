"use client";

import { useRef, useEffect } from "react";
import { Map, MapStyle, config,Marker,Popup   } from "@maptiler/sdk";

export default function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13 }) {
  const mapContainer = useRef(null);
  const api = "U61Q3cnFHasU5kc4OEcv";

  useEffect(() => {
    config.apiKey = api;

    const map = new Map({
      container: mapContainer.current,
      style: MapStyle.STREETS,   // or MapStyle.SATELLITE, MapStyle.OUTDOOR, etc.
      center: center,
      zoom: zoom,
      // optional controls:
      navigationControl: true,
      fullscreenControl: true,
      geolocateControl: false,
      terrainControl: false,
      scaleControl: true,
    });

  map.on("load", () => {
      // Optional: popup for marker
      const popup = new Popup({ text: "Karachi" });

      // Add marker
      new Marker()
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map);
    });



    return () => map.remove();
  }, [center, zoom]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
