

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import { useEffect } from "react";

// // Fix Next.js marker icon issue
// const markerIcon = L.icon({
//   iconUrl: "/tree.png",
//   shadowUrl: "/marker-shadow.png",
//   iconSize: [30, 32],      // width, height (default is 25 × 41)
//   iconAnchor: [10, 32],    // point of the marker which will correspond to marker position
//   popupAnchor: [0, -32],   // popup appears above the marker
// });

// export default function LeafletMap() {
//   const position = [24.8607, 67.0011]; // Karachi
//   const api = "U61Q3cnFHasU5kc4OEcv"; 


//   return (
//     <div className="w-full h-[500px] rounded-xl overflow-hidden">
//       <MapContainer
//         center={position}
//         zoom={17}  
//         scrollWheelZoom={true}
//         className="h-full w-full"
//       >
//         {/* 🌍 MapTiler Tiles */}
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
//            maxZoom={22}     
//         />

//         <Marker position={position} icon={markerIcon} >
//           <Popup>
//             Your Marker (Karachi)
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// }
