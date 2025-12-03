

// "use client";

// import { useRef, useEffect, useState } from "react";
// import { Map, MapStyle, config, Marker, Popup } from "@maptiler/sdk";

// export default function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13 }) {
//   const mapContainer = useRef(null);
//   const mapInstance = useRef(null);
//   const [markerInstance, setMarkerInstance] = useState(null);
//   const api = "U61Q3cnFHasU5kc4OEcv";

//   useEffect(() => {
//     config.apiKey = api;

//     // Get user location if available
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const userCenter = [pos.coords.longitude, pos.coords.latitude];
//         initializeMap(userCenter);
//       },
//       () => {
//         // If geolocation fails, use default
//         initializeMap(center);
//       }
//     );

//     const initializeMap = (initialCenter) => {
//       if (mapInstance.current) return; // Map already initialized

//       const map = new Map({
//         container: mapContainer.current,
//         style: MapStyle.STREETS,
//         center: initialCenter,
//         zoom: zoom,
//         navigationControl: true,
//         fullscreenControl: true,
//         geolocateControl: false,
//         terrainControl: false,
//         scaleControl: true,
//       });

//       mapInstance.current = map;

//       // Add draggable marker
//       const marker = new Marker({ draggable: true })
//         .setLngLat(initialCenter)
//         .setPopup(new Popup({ text: "Your Location" }))
//         .addTo(map);

//       setMarkerInstance(marker);

//       // Update popup/coordinates on drag
//       marker.on("dragend", () => {
//         const lngLat = marker.getLngLat();
//         console.log("Marker moved to:", lngLat);
//         marker.setPopup(new Popup({ text: `Lng: ${lngLat.lng}, Lat: ${lngLat.lat}` }));
//       });
//     };

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//         mapInstance.current = null;
//       }
//     };
//   }, []);

//   return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
// }

"use client";

import { useRef, useEffect, useState } from "react";
import { Map, MapStyle, config, Marker, Popup } from "@maptiler/sdk";

export default function MapTilerMap({
  center = [67.0011, 24.8607],
  zoom = 13,
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [markerInstance, setMarkerInstance] = useState(null);

  const api = "U61Q3cnFHasU5kc4OEcv";

  useEffect(() => {
    config.apiKey = api;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCenter = [pos.coords.longitude, pos.coords.latitude];
        initializeMap(userCenter);
      },
      () => {
        initializeMap(center);
      }
    );

    // Initialize Map
    const initializeMap = (initialCenter) => {
      if (mapInstance.current) return;

      const map = new Map({
        container: mapContainer.current,
        style: MapStyle.STREETS,
        center: initialCenter,
        zoom: zoom,
        navigationControl: true,
        fullscreenControl: true,
        scaleControl: true,
      });

      mapInstance.current = map;

      // ---------------------------
      //   CUSTOM MARKER ELEMENT
      // ---------------------------
      const customMarker = document.createElement("div");
      customMarker.className = "custom-marker";

      // Load custom icon (place marker.png inside public/)
      customMarker.innerHTML = `
        <img 
          src="/TreeMarker.gif"
          alt="Marker"
          style="
            width: 50px; 
            height: 50px; 
            object-fit: contain;
            transform: translate(-50%, -100%);
          "
        />
      `;

      // ---------------------------
      //     CREATE CUSTOM MARKER
      // ---------------------------
      const marker = new Marker({
        draggable: true,
        element: customMarker,
      })
        .setLngLat(initialCenter)
        .setPopup(
          new Popup().setHTML(
            `<b>Your Location</b><br>Lng: ${initialCenter[0]}<br>Lat: ${initialCenter[1]}`
          )
        )
        .addTo(map);

      setMarkerInstance(marker);

      // Update popup when marker is dragged
      marker.on("dragend", () => {
        const ll = marker.getLngLat();
        marker.setPopup(
          new Popup().setHTML(
            `<b>Updated Position</b><br>Lng: ${ll.lng}<br>Lat: ${ll.lat}`
          )
        );
        console.log("Marker moved to:", ll);
      });
    };

    // Cleanup map when component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}
