// 'use client';

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DataTable } from "@/components/ui/data-table";
// import dynamic from "next/dynamic";

// // MapTiler (Leaflet) dynamic import to avoid SSR issues
// const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });

// export default function AdminDashboard() {
//   const columns = [
//     { accessorKey: "user", header: "User" },
//     { accessorKey: "tree", header: "Tree Name" },
//     { accessorKey: "location", header: "Location" },
//     { accessorKey: "status", header: "Status" },
//   ];

//   const data = [
//     { user: "Ali", tree: "Neem", location: "Clifton", status: "Pending" },
//     { user: "Sara", tree: "Banyan", location: "Defence", status: "Pending" },
//   ];

//   return (
//     <div className="p-6 space-y-6 w-full">
//       <h1 className="text-2xl font-bold">Admin Dashboard</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Customers</CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-bold">120</CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Total Trees Planted</CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-bold">345</CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Pending Approvals</CardTitle>
//           </CardHeader>
//           <CardContent className="text-3xl font-bold">24</CardContent>
//         </Card>
//       </div>

//       {/* Approval Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Tree Approvals</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <DataTable columns={columns} data={data} />
//         </CardContent>
//       </Card>

//       {/* Map Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Tree Locations Map</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-96 w-full rounded-xl overflow-hidden">
//             <MapContainer center={[24.8607, 67.0011]} zoom={12} style={{ height: "100%", width: "100%" }}>
//               <TileLayer url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=U61Q3cnFHasU5kc4OEcv`} />
//             </MapContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Trees, Check, X , Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Image from "next/image";
// ✅ Dynamic import to avoid "window is not defined"
const MapTilerMap = dynamic(() => import("@/components/MapTilerMap"), {
  ssr: false,
});

export default function AdminDashboard() {
  const pendingTrees = [
    {
      id: 1,
      user: "Hammas Sheikh",
      treeName: "Neem",
      location: "Karachi, Pakistan",
      date: "2025-12-02",
      pic : "/tree.png"
    },
    {
      id: 2,
      user: "Ali Raza",
      treeName: "Apple",
      location: "Lahore, Pakistan",
      date: "2025-12-01",
      pic : "/tree.png"
    },
  ];


const [pendingTrees1, setPendingTrees1] = useState(
  pendingTrees.map(t => ({ ...t, status: "Pending" })) // default status
);

const [editingStatus, setEditingStatus] = useState(null);
const [selectedStatus, setSelectedStatus] = useState("Pending");

const handleSaveStatus = (id) => {
  setPendingTrees1(prev =>
    prev.map(tree =>
      tree.id === id ? { ...tree, status: selectedStatus } : tree
    )
  );
  setEditingStatus(null);
};



  
  return (
    <div className="p-6 space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm bg-linear-to-br from-[#2193b0] to-[#6dd5ed] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Users className="w-5 h-5" /> Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">152</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm bg-linear-to-br from-[#2E7D32] to-[#AED581] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trees className="w-5 h-5" /> Trees Planted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">438</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm bg-linear-to-br from-[#fc4a1a] to-[#f7b733] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Check className="w-5 h-5" /> Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingTrees.length}</p>
          </CardContent>
        </Card>
      </div>

     {/* Pending Approvals Table */}
<Card className="rounded-2xl shadow-sm">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Tree Records</CardTitle>
  </CardHeader>

  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Tree Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>

     <TableBody>
  {pendingTrees1.map((tree) => (
    <TableRow key={tree.id}>
      <TableCell>{tree.id}</TableCell>
      <TableCell>{tree.user}</TableCell>
      <TableCell>{tree.treeName}</TableCell>
      <TableCell>
        <Image
          src={tree.pic}
          alt={tree.treeName}
          width={50}
          height={50}
          className="w-10 h-10 object-cover rounded-md"
        />
      </TableCell>
      <TableCell>{tree.location}</TableCell>
      <TableCell>{tree.date}</TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">

          {/* Pencil Icon → Opens Popover */}
          <Popover open={editingStatus === tree.id} onOpenChange={() => setEditingStatus(tree.id)}>
            <PopoverTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-56">
              <h4 className="font-medium mb-2">Edit Status</h4>

              {/* Status Dropdown */}
              <Select
                value={selectedStatus}
                onValueChange={(val) => setSelectedStatus(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Save Button */}
              <Button
                onClick={() => handleSaveStatus(tree.id)}
                className="w-full mt-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </Button>
            </PopoverContent>
          </Popover>

          {/* Status Badge */}
          <span
            className={`
              px-3 py-1 rounded-xl text-sm font-medium
              ${
                tree.status === "Verified"
                  ? "bg-green-100 text-green-700"
                  : tree.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700" // Pending
              }
            `}
          >
            {tree.status}
          </span>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

    </Table>
  </CardContent>
</Card>


      {/* MapTiler Map Section (same as UserDashboard) */}
      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Karachi Tree Map
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[450px] w-full p-0">
          <MapTilerMap center={[24.8607, 67.0011]} zoom={13} />
        </CardContent>
      </Card>
    </div>
  );
}
