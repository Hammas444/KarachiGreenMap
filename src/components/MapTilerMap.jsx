// "use client";

// import { useRef, useEffect } from "react";
// import { Map, MapStyle, config,Marker,Popup   } from "@maptiler/sdk";

// export default function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13 }) {
//   const mapContainer = useRef(null);
//   const api = "U61Q3cnFHasU5kc4OEcv";

//   useEffect(() => {
//     config.apiKey = api;

//     const map = new Map({
//       container: mapContainer.current,
//       style: MapStyle.STREETS,   // or MapStyle.SATELLITE, MapStyle.OUTDOOR, etc.
//       center: center,
//       zoom: zoom,
//       // optional controls:
//       navigationControl: true,
//       fullscreenControl: true,
//       geolocateControl: false,
//       terrainControl: false,
//       scaleControl: true,
//     });

//   map.on("load", () => {
//       // Optional: popup for marker
//       const popup = new Popup({ text: "Karachi" });

//       // Add marker
//       new Marker()
//         .setLngLat(center)
//         .setPopup(popup)
//         .addTo(map);
//     });



//     return () => map.remove();
//   }, [center, zoom]);

//   return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
// }

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

export default function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13 }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [markerInstance, setMarkerInstance] = useState(null);
  const api = "U61Q3cnFHasU5kc4OEcv";

  useEffect(() => {
    config.apiKey = api;

    const initializeMap = (initialCenter) => {
      if (mapInstance.current) return; // Map already initialized

      const map = new Map({
        container: mapContainer.current,
        style: MapStyle.STREETS,
        center: initialCenter,
        zoom: zoom,
        navigationControl: true,
        fullscreenControl: true,
        geolocateControl: false,
        terrainControl: false,
        scaleControl: true,
      });

      mapInstance.current = map;

      // Add draggable marker
      const marker = new Marker({ draggable: true })
        .setLngLat(initialCenter)
        .setPopup(new Popup({ text: "Your Location" }))
        .addTo(map);

      setMarkerInstance(marker);

      // Update popup/coordinates on drag
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        console.log("Marker moved to:", lngLat);
        marker.setPopup(
          new Popup({ text: `Lng: ${lngLat.lng.toFixed(6)}, Lat: ${lngLat.lat.toFixed(6)}` })
        );
      });
    };

    // Try getting user location
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCenter = [pos.coords.longitude, pos.coords.latitude];
          initializeMap(userCenter);
        },
        () => {
          // If geolocation fails, use default
          initializeMap(center);
        }
      );
    } else {
      initializeMap(center);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}





// "use client";

// import { useRef, useEffect } from "react";
// import {
//   Map,
//   MapStyle,
//   config,
//   Marker,
//   Popup,
// } from "@maptiler/sdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";

// // ⭐ Import the correct geocoding control package
// import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
// import "@maptiler/geocoding-control/style.css";

// export default function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13 }) {
//   const mapContainer = useRef(null);
//   const api = "U61Q3cnFHasU5kc4OEcv";

//   useEffect(() => {
//     config.apiKey = api;

//     const map = new Map({
//       container: mapContainer.current,
//       style: MapStyle.STREETS,
//       center: center,
//       zoom: zoom,
//       navigationControl: true,
//       fullscreenControl: true,
//       scaleControl: true,
//     });

//     // ⭐ Add working search bar
//     const search = new GeocodingControl({
//       apiKey: api,
//       marker: true,
//       popup: true,
//       position: "top-right",
//     });

//     map.addControl(search);

//     // Default marker
//     map.on("load", () => {
//       const popup = new Popup({ text: "Karachi" });

//       new Marker()
//         .setLngLat(center)
//         .setPopup(popup)
//         .addTo(map);
//     });

//     return () => map.remove();
//   }, [center, zoom]);

//   return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
// }









// "use client";

// import { useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
//  // replace with your image path

// // Fix default marker icon issues in Next.js
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Fly map to searched location
// function FlyToMarker({ position }) {
//   const map = useMap();
//   if (position) {
//     map.flyTo(position, 17);
//   }
//   return null;
// }

// export default function OSMMapWithSearch({ defaultCenter = [24.8607, 67.0011], defaultZoom = 13 }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [markers, setMarkers] = useState([]);
//   const [mapCenter, setMapCenter] = useState(defaultCenter);



// const customMarker = new L.Icon({
//   iconUrl: "/tree.png", // If using Next.js Image import, use .src
//   iconSize: [40, 40], // size of the icon [width, height]
//   iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
//   shadowUrl: "", // optional if you have a shadow image
// });

//   // Function to search location using Nominatim API
//   const searchLocation = async () => {
//     if (!searchQuery) return;

//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
//       );
//       const data = await res.json();

//       if (data.length === 0) {
//         alert("Location not found!");
//         return;
//       }

//       const newMarkers = data.map((place) => ({
//         lat: parseFloat(place.lat),
//         lon: parseFloat(place.lon),
//         name: place.display_name,
//       }));

//       setMarkers(newMarkers);
//       setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full">
//       {/* Search bar */}
//       <div className="p-2 bg-white z-50">
//         <input
//           type="text"
//           placeholder="Search for zoo, office, park..."
//           className="w-full p-2 border rounded"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && searchLocation()}
//         />
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={mapCenter}
//         zoom={defaultZoom}
//         style={{ flex: 1, width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {markers.map((marker, idx) => (
//           <Marker key={idx} position={[marker.lat, marker.lon]} icon={customMarker}>
//             <Popup>{marker.name}</Popup>
//           </Marker>
//         ))}

//         {markers[0] && <FlyToMarker position={[markers[0].lat, markers[0].lon]} />}
//       </MapContainer>
//     </div>
//   );
// }





// "use client";

// import { useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default marker icon issues in Next.js
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Fly map to searched location
// function FlyToMarker({ position }) {
//   const map = useMap();
//   if (position) {
//     map.flyTo(position, 17);
//   }
//   return null;
// }

// export default function OSMMapWithSearch({
//   defaultCenter = [24.8607, 67.0011],
//   defaultZoom = 13,
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [markers, setMarkers] = useState([]);
//   const [mapCenter, setMapCenter] = useState(defaultCenter);
//   const [suggestions, setSuggestions] = useState([]);

//   const customMarker = new L.Icon({
//     iconUrl: "/tree.png", // Replace with your image path
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
//   });

//   // Fetch autocomplete suggestions from Nominatim
//   const fetchSuggestions = async (query) => {
//     if (!query) return [];
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           query
//         )}&addressdetails=1&limit=5`
//       );
//       const data = await res.json();
//       return data.map((place) => ({
//         label: place.display_name,
//         lat: parseFloat(place.lat),
//         lon: parseFloat(place.lon),
//         type: place.type,
//       }));
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   };

//   const handleInputChange = async (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (value.length > 2) {
//       const results = await fetchSuggestions(value);
//       setSuggestions(results);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSelectSuggestion = (suggestion) => {
//     setMarkers([suggestion]);
//     setMapCenter([suggestion.lat, suggestion.lon]);
//     setSearchQuery(suggestion.label);
//     setSuggestions([]);
//   };

//   return (
//     <div className="flex flex-col h-full w-full">
//       {/* Search bar */}
//       <div className="relative  p-2 bg-white z-50">
//         <input
//           type="text"
//           placeholder="Search for zoo, office, park..."
//           className="w-full p-2 border rounded"
//           value={searchQuery}
//           onChange={handleInputChange}
//           onKeyDown={(e) =>
//             e.key === "Enter" && suggestions[0] && handleSelectSuggestion(suggestions[0])
//           }
//         />
//         {/* Suggestions dropdown */}
//         {suggestions.length > 0 && (
//           <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-40 overflow-auto">
//             {suggestions.map((s, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => handleSelectSuggestion(s)}
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//               >
//                 {s.label}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={mapCenter}
//         zoom={defaultZoom}
//         style={{ flex: 1, width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {markers.map((marker, idx) => (
//           <Marker key={idx} position={[marker.lat, marker.lon]} icon={customMarker}>
//             <Popup>{marker.label}</Popup>
//           </Marker>
//         ))}

//         {markers[0] && <FlyToMarker position={[markers[0].lat, markers[0].lon]} />}
//       </MapContainer>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default marker icon issues in Next.js
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Fly map to searched location
// function FlyToMarker({ position }) {
//   const map = useMap();
//   if (position) map.flyTo(position, 17);
//   return null;
// }

// export default function OSMMapWithSearch({
//   defaultCenter = [24.8607, 67.0011],
//   defaultZoom = 13,
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [markers, setMarkers] = useState([]);
//   const [mapCenter, setMapCenter] = useState(defaultCenter);
//   const [suggestions, setSuggestions] = useState([]);

//   const customMarker = new L.Icon({
//     iconUrl: "/tree.png", // Replace with your image path
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
//   });

//   // Fetch suggestions from Nominatim
//   const fetchSuggestions = async (query) => {
//     if (!query) return [];
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           query
//         )}&addressdetails=1&limit=5`
//       );
//       const data = await res.json();
//       return data.map((place) => ({
//         label: place.display_name,
//         lat: parseFloat(place.lat),
//         lon: parseFloat(place.lon),
//         type: place.type,
//       }));
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   };

//   const handleInputChange = async (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (value.length > 2) {
//       const results = await fetchSuggestions(value);
//       setSuggestions(results);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSelectSuggestion = (s) => {
//     setMarkers([s]);
//     setMapCenter([s.lat, s.lon]);
//     setSearchQuery(s.label);
//     setSuggestions([]);
//   };

//   return (
//     <div className="flex flex-col h-full w-full relative">
//       {/* Search bar */}
//       <div className="relative z-50 p-2 bg-white w-full max-w-md mx-auto">
//         <input
//           type="text"
//           placeholder="Search for zoo, office, park..."
//           className="w-full p-2 border rounded"
//           value={searchQuery}
//           onChange={handleInputChange}
//           onKeyDown={(e) =>
//             e.key === "Enter" && suggestions[0] && handleSelectSuggestion(suggestions[0])
//           }
//         />
//         {/* Suggestions dropdown */}
//         {suggestions.length > 0 && (
//           <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-60 overflow-auto shadow-lg">
//             {suggestions.map((s, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => handleSelectSuggestion(s)}
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//               >
//                 {s.label}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={mapCenter}
//         zoom={defaultZoom}
//         style={{ flex: 1, width: "100%", zIndex: 0 }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {markers.map((marker, idx) => (
//           <Marker
//             key={idx}
//             position={[marker.lat, marker.lon]}
//             icon={customMarker}
//           >
//             <Popup>{marker.label}</Popup>
//           </Marker>
//         ))}

//         {markers[0] && <FlyToMarker position={[markers[0].lat, markers[0].lon]} />}
//       </MapContainer>
//     </div>
//   );
// }
