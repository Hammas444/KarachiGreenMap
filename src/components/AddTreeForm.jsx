// "use client";
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useId } from "react";
// import { useCharacterLimit } from "@/hooks/use-character-limit";
// import { useFileUpload } from "@/hooks/use-file-upload";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";
// import CameraCapture from "@/components/CameraCapture";
// export default function AddTreeDialog({ open, setOpen }) {
//   const id = useId();
//   const maxLength = 180;

//   const {
//     value,
//     characterCount,
//     handleChange,
//     maxLength: limit,
//   } = useCharacterLimit({
//     initialValue: "",
//     maxLength,
//   });

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="border-b px-6 py-4 text-base">
//             Add a New Tree
//           </DialogTitle>
//         </DialogHeader>

//         <div className="overflow-y-auto">
//           {/* You can include ProfileBg or Avatar here if needed */}
          
//           <div className="px-6 pt-4 pb-6">
//             <form className="space-y-4">
//                      <div className="space-y-2">
//                 <Label>User Name</Label>
//                 <Input placeholder="your name" required />
//               </div>
//               <div className="space-y-2">
//                 <Label>Tree Name</Label>
//                 <Input placeholder="Neem, Banyan, etc." required />
//               </div>

//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Textarea
//                   maxLength={180}
//                   onChange={handleChange}
//                   placeholder="Details about the tree..."
//                 />
//                 <p className="text-right text-xs text-muted-foreground">
//                   {limit - characterCount} characters left
//                 </p>
//               </div>
//               <div className="space-y-2">
//   <Label>Tree Photo (Camera)</Label>

//   <CameraCapture 
//     onCapture={(img) => console.log("Captured Image:", img)}
//   />
// </div>
//             </form>
//           </div>
//         </div>

//         <DialogFooter className="border-t px-6 py-4">
//           <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={() => setOpen(false)}>Save</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


// "use client";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useId, useState } from "react";
// import { useCharacterLimit } from "@/hooks/use-character-limit";
// import CameraCapture from "@/components/CameraCapture";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default Leaflet icon issues
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Component to handle marker and reverse geocoding
// function LocationPicker({ location, setLocation, setAddress }) {
//   useMapEvents({
//     click: async (e) => {
//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;
//       setLocation([lat, lon]);

//       // Reverse geocode using Nominatim
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
//         );
//         const data = await res.json();
//         setAddress(data.display_name || "Address not found");
//       } catch (err) {
//         console.error(err);
//         setAddress("Error fetching address");
//       }
//     },
//   });

//   return location ? <Marker position={location} /> : null;
// }

// export default function AddTreeDialog({ open, setOpen }) {
//   const id = useId();
//   const maxLength = 180;

//   const { value, characterCount, handleChange, maxLength: limit } =
//     useCharacterLimit({
//       initialValue: "",
//       maxLength,
//     });

//   const [treeLocation, setTreeLocation] = useState([24.8607, 67.0011]); // Default location
//   const [treeAddress, setTreeAddress] = useState(""); // Selected address
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

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
//     setTreeLocation([s.lat, s.lon]);
//     setTreeAddress(s.label);
//     setSearchQuery(s.label);
//     setSuggestions([]);
//   };

//   const handleSave = () => {
//     console.log("Tree Data:", {
//       treeName: document.getElementById("treeName").value,
//       userName: document.getElementById("userName").value,
//       description: value,
//       location: treeLocation,
//       address: treeAddress,
//     });
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="border-b px-6 py-4 text-base">
//             Add a New Tree
//           </DialogTitle>
//         </DialogHeader>

//         <div className="overflow-y-auto">
//           <div className="px-6 pt-4 pb-6">
//             <form className="space-y-4">
//               <div className="space-y-2">
//                 <Label>User Name</Label>
//                 <Input id="userName" placeholder="Your name" required />
//               </div>

//               <div className="space-y-2">
//                 <Label>Tree Name</Label>
//                 <Input id="treeName" placeholder="Neem, Banyan, etc." required />
//               </div>

//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Textarea
//                   maxLength={maxLength}
//                   onChange={handleChange}
//                   placeholder="Details about the tree..."
//                 />
//                 <p className="text-right text-xs text-muted-foreground">
//                   {limit - characterCount} characters left
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label>Tree Photo (Camera)</Label>
//                 <CameraCapture onCapture={(img) => console.log("Captured Image:", img)} />
//               </div>

//               {/* Search bar for location */}
//               <div className="space-y-2 relative z-50">
//                 <Label>Search Tree Location</Label>
//                 <Input
//                   type="text"
//                   placeholder="Search for zoo, park, office..."
//                   value={searchQuery}
//                   onChange={handleInputChange}
//                 />
//                 {suggestions.length > 0 && (
//                   <ul className="absolute w-full bg-white border rounded mt-1 max-h-40 overflow-auto z-50">
//                     {suggestions.map((s, idx) => (
//                       <li
//                         key={idx}
//                         onClick={() => handleSelectSuggestion(s)}
//                         className="p-2 cursor-pointer hover:bg-gray-100"
//                       >
//                         {s.label}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {/* Address input */}
//               <div className="space-y-2">
//                 <Label>Selected Address</Label>
//                 <Input
//                   value={treeAddress}
//                   readOnly
//                   placeholder="Selected address will appear here"
//                   className="bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Map */}
//               <div className="space-y-2">
//                 <Label>Pick Tree Location on Map</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Click on the map to select location
//                 </p>
//               <MapContainer
//   center={treeLocation}
//   zoom={13}
//   style={{ height: "200px", width: "100%" }}
// >
//   <TileLayer
//     url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=U61Q3cnFHasU5kc4OEcv`}
//     attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> © OpenStreetMap contributors'
//   />
//   <LocationPicker
//     location={treeLocation}
//     setLocation={setTreeLocation}
//     setAddress={setTreeAddress}
//   />
// </MapContainer>

//               </div>
//             </form>
//           </div>
//         </div>

//         <DialogFooter className="border-t px-6 py-4">
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>Save</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useId, useState } from "react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import CameraCapture from "@/components/CameraCapture";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Debounce function (super important!)
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Map click location picker
function LocationPicker({ location, setLocation, setAddress }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      setLocation([lat, lon]);

      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=U61Q3cnFHasU5kc4OEcv`
        );
        const data = await res.json();
        setAddress(data.features?.[0]?.place_name || "Address not found");
      } catch (err) {
        console.error(err);
        setAddress("Error fetching address");
      }
    },
  });

  return location ? <Marker position={location} /> : null;
}

export default function AddTreeDialog({ open, setOpen }) {
  const id = useId();
  const maxLength = 180;

  const { value, characterCount, handleChange, maxLength: limit } =
    useCharacterLimit({
      initialValue: "",
      maxLength,
    });

  const [treeLocation, setTreeLocation] = useState([24.8607, 67.0011]);
  const [treeAddress, setTreeAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // --- FAST MapTiler Geocoding ---
  const fetchSuggestions = async (query) => {
    if (!query) return [];
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=U61Q3cnFHasU5kc4OEcv&limit=5`
      );
      const data = await res.json();

      return data.features.map((place) => ({
        label: place.place_name,
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Debounced search (FAST)
  const debouncedSearch = debounce(async (value) => {
    if (value.length > 2) {
      const results = await fetchSuggestions(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSelectSuggestion = (s) => {
    setTreeLocation([s.lat, s.lon]);
    setTreeAddress(s.label);
    setSearchQuery(s.label);
    setSuggestions([]);
  };

  const handleSave = () => {
    console.log("Tree Data:", {
      treeName: document.getElementById("treeName").value,
      userName: document.getElementById("userName").value,
      description: value,
      location: treeLocation,
      address: treeAddress,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add a New Tree
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input id="userName" placeholder="Your name" required />
              </div>

              <div className="space-y-2">
                <Label>Tree Name</Label>
                <Input id="treeName" placeholder="Neem, Banyan, etc." required />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  maxLength={maxLength}
                  onChange={handleChange}
                  placeholder="Details about the tree..."
                />
                <p className="text-right text-xs text-muted-foreground">
                  {limit - characterCount} characters left
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tree Photo (Camera)</Label>
                <CameraCapture onCapture={(img) => console.log("Captured Image:", img)} />
              </div>

              {/* Search bar for location */}
              <div className="space-y-2 relative z-50">
                <Label>Search Tree Location</Label>
                <Input
                  type="text"
                  placeholder="Search for park, zoo, office..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                {suggestions.length > 0 && (
                  <ul className="absolute w-full bg-white border rounded mt-1 max-h-40 overflow-auto z-50">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectSuggestion(s)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {s.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Address input */}
              <div className="space-y-2">
                <Label>Selected Address</Label>
                <Input
                  value={treeAddress}
                  readOnly
                  placeholder="Selected address will appear here"
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
               <Label>Coordinates (Lat, Lon)</Label>
               <Input
                value={`${treeLocation[0].toFixed(6)}, ${treeLocation[1].toFixed(6)}`}
                readOnly
                placeholder="Latitude, Longitude will appear here"
                className="bg-gray-100 cursor-not-allowed"
               />
             </div>
              {/* Map */}
              <div className="space-y-2">
                <Label>Pick Tree Location on Map</Label>
                <p className="text-xs text-muted-foreground">
                  Click on the map to select location
                </p>

                <MapContainer
                  center={treeLocation}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=U61Q3cnFHasU5kc4OEcv`}
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> © OpenStreetMap contributors'
                  />
                  <LocationPicker
                    location={treeLocation}
                    setLocation={setTreeLocation}
                    setAddress={setTreeAddress}
                  />
                </MapContainer>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
