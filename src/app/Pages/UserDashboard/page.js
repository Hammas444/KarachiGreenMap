// "use client";
// import Image from "next/image";
// import React, { useState, useMemo } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import {
//   IconArrowLeft,
//   IconBrandTabler,
//   IconSettings,
//   IconUserBolt,
// } from "@tabler/icons-react";
// import { motion } from "motion/react";
// import { cn } from "@/lib/utils";
// import LeafletMap from "@/components/LeafletMap";
// import MapTilerMap from "@/components/MapTilerMap";
// import AddTreeDialog from "@/components/AddTreeForm";

// export default function UserDashboardPage() {
//   const links = [
//     {
//       label: "Add Tree",
//       href: "#",
//       icon: (
//         <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
//       ),
//       onClick: () => setTreeDialogOpen(true)
//     },
//     {
//       label: "Profile",
//       href: "#",
//       icon: (
//         <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
//       ),
//     },
    
//     {
//       label: "Logout",
//       href: "#",
//       icon: (
//         <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
//       ),
//     },
//   ];
//   const [open, setOpen] = useState(false);
// const [treeDialogOpen, setTreeDialogOpen] = useState(false);

//   // Dummy user data - in a real app, this would come from a context or props
//   const user = useMemo(
//     () => ({
//       name: "Manu Arora",
//       avatar: "https://assets.aceternity.com/manu.png",
//     }),
//     []
//   );

//   // In a real app, you'd have a logout function
//   const handleLogout = () => console.log("Logging out...");

//   return (
//     <div
//       className={cn(
//         "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
//         "h-screen"
//       )}>
//       <Sidebar open={open} setOpen={setOpen}>
//         <SidebarBody className="justify-between gap-10">
//           <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
//             {open ? <Logo/> : <LogoIcon />}
//             <div className="mt-8 flex flex-col gap-2">
//               {links.map((link) => (
//                 <SidebarLink key={link.label} link={link} onClick={link.onClick} />
//               ))}
//             </div>
//           </div>
//           <div>
//             <SidebarLink
//               link={{
//                 href: "#",
//                 icon: (
//                   <img
//                     src={user.avatar}
//                     className="h-7 w-7 shrink-0 rounded-full"
//                     width={50}
//                     height={50}
//                     alt="Avatar" />
//                 ),
//               }} />
//           </div>
//         </SidebarBody>
//       </Sidebar>
//       <Dashboard />
//       <AddTreeDialog open={treeDialogOpen} setOpen={setTreeDialogOpen} />
//     </div>
//   );
// }
// export const Logo = () => {
//   return (
//     <a
//       href="#"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    
//       <Image
//         src="/tree.png"
//         className=""
//         width={50}
//         height={50}
//         alt="Logo" />
      
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-medium whitespace-pre text-black text-[23px] dark:text-white">
//         Eco Karachi
//       </motion.span>
//     </a>
//   );
// };
// export const LogoIcon = () => {
//   return (
//     <a
//       href="#"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
//       <Image
//         src="/tree.png"
//         className=""
//         width={50}
//         height={50}
//         alt="Logo" />
//     </a>
//   );
// };

// // Dummy dashboard component with content
// export const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
        
//       <div
//         className="flex h-full w-full flex-2 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
//        <MapTilerMap center={[67.0011, 24.8607]} zoom={14} />
//         {/* <div className="flex gap-2">
//           {[...new Array(4)].map((i, idx) => (
//             <div
//               key={"first-array-demo-1" + idx}
//               className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
//           ))}
//         </div> */}
//         {/* <div className="flex flex-1 gap-2">
//           {[...new Array(2)].map((i, idx) => (
//             <div
//               key={"second-array-demo-1" + idx}
//               className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
//           ))}
//         </div> */}
//       </div>
//     </div>
//   );
// };



"use client";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
  IconPlant
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import MapTilerMap from "@/components/MapTilerMap";
import AddTreeDialog from "@/components/AddTreeForm";
import { LampContainer } from "@/components/ui/lamp";
import { Info } from "lucide-react";


export default function UserDashboardPage() {


  const [open, setOpen] = useState(false);
  const [treeDialogOpen, setTreeDialogOpen] = useState(false);

  const links = [
    {
      label: "Add Tree",
      href: "#",
      icon: (
        <IconPlant className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => {
      
      setTreeDialogOpen(true),
      setOpen(false)
      
      }
         // 👈 CLOSE SIDEBAR
    },
    {
      label: "Profile",
      href: "/Pages/Profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
     {
      label: "Info",
      href: "/Pages/Info",
      icon: (
        <Info className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  // Dummy user data
  const user = useMemo(
    () => ({
      name: "Manu Arora",
      avatar: "https://assets.aceternity.com/manu.png",
    }),
    []
  );

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
           <div className="flex flex-1 flex-col items-center justify-center gap-6">
  {links.map((link) => (
    <SidebarLink
      key={link.label}
      link={{
        ...link,
        label: (
          <span className="text-2xl font-semibold block text-center">
            {link.label}
          </span>
        ),
        icon: React.cloneElement(link.icon, {
          className: "h-7 w-7 text-neutral-800 dark:text-neutral-200",
        }),
      }}
      onClick={link.onClick}
      className="py-5 px-8"
    />
  ))}
</div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Memoized Dashboard so Map loads only once */}
      <Dashboard />


  

      <AddTreeDialog open={treeDialogOpen} setOpen={setTreeDialogOpen} />
    </div>
  );
}

export const Logo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center justify-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <Image src="/tree.png" width={50} height={50} alt="Logo" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black text-[23px] dark:text-white"
    >
      Eco Karachi
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <Image src="/tree.png" width={50} height={50} alt="Logo" />
  </a>
);

// Memoized MapTilerMap Dashboard
export const Dashboard = React.memo(() => {
  return (
    <>
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-2 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <MapTilerMap center={[24.8607, 67.0011]} zoom={14} />
      
      </div>
    </div>
     
     </>

  );
});




