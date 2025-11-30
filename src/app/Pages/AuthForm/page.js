// import { useId } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function page() {
//   const id = useId();
//   return (
//     <Dialog defaultOpen>
//       <DialogTrigger asChild>
//         <Button variant="outline">Sign up</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <div className="flex flex-col items-center gap-2">
//           <div
//             aria-hidden="true"
//             className="flex size-11 shrink-0 items-center justify-center rounded-full border"
//           >
//             <svg
//               aria-hidden="true"
//               className="stroke-zinc-800 dark:stroke-zinc-100"
//               height="20"
//               viewBox="0 0 32 32"
//               width="20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <circle cx="16" cy="16" fill="none" r="12" strokeWidth="8" />
//             </svg>
//           </div>
//           <DialogHeader>
//             <DialogTitle className="sm:text-center">
//               Sign up coss.com
//             </DialogTitle>
//             <DialogDescription className="sm:text-center">
//               We just need a few details to get you started.
//             </DialogDescription>
//           </DialogHeader>
//         </div>

//         <form className="space-y-5">
//           <div className="space-y-4">
//             <div className="*:not-first:mt-2">
//               <Label htmlFor={`${id}-name`}>Full name</Label>
//               <Input
//                 id={`${id}-name`}
//                 placeholder="Matt Welsh"
//                 required
//                 type="text"
//               />
//             </div>
//             <div className="*:not-first:mt-2">
//               <Label htmlFor={`${id}-email`}>Email</Label>
//               <Input
//                 id={`${id}-email`}
//                 placeholder="hi@yourcompany.com"
//                 required
//                 type="email"
//               />
//             </div>
//             <div className="*:not-first:mt-2">
//               <Label htmlFor={`${id}-password`}>Password</Label>
//               <Input
//                 id={`${id}-password`}
//                 placeholder="Enter your password"
//                 required
//                 type="password"
//               />
//             </div>
//           </div>
//           <Button className="w-full" type="button">
//             Sign up
//           </Button>
//         </form>

//         <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
//           <span className="text-muted-foreground text-xs">Or</span>
//         </div>

//         <Button variant="outline">Continue with Google</Button>

//         <p className="text-center text-muted-foreground text-xs">
//           By signing up you agree to our{" "}
//           <a className="underline hover:no-underline" href="#">
//             Terms
//           </a>
//           .
//         </p>
//       </DialogContent>
//     </Dialog>
//   );
// }



// 'use client'

// import { useState, useId } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import WorldMap from "@/components/ui/world-map";
// import { motion } from "motion/react";

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(false); // false = Sign Up, true = Login
//   const id = useId();

//   return (

//     <>
//         <div className=" py-40 dark:bg-black bg-white w-full">
//       <div className="max-w-7xl mx-auto text-center">
//         <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
//           Remote{" "}
//           <span className="text-neutral-400">
//             {"Connectivity".split("").map((word, idx) => (
//               <motion.span
//                 key={idx}
//                 className="inline-block"
//                 initial={{ x: -10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: idx * 0.04 }}
//               >
//                 {word}
//               </motion.span>
//             ))}
//           </span>
//         </p>
//         <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
//           Break free from traditional boundaries. Work from anywhere, at the
//           comfort of your own studio apartment. Perfect for Nomads and
//           Travellers.
//         </p>
//       </div>
//       <WorldMap
//         dots={[
//           {
//             start: {
//               lat: 64.2008,
//               lng: -149.4937,
//             }, // Alaska (Fairbanks)
//             end: {
//               lat: 34.0522,
//               lng: -118.2437,
//             }, // Los Angeles
//           },
//           {
//             start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
//             end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
//           },
//           {
//             start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
//             end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
//           },
//           {
//             start: { lat: 51.5074, lng: -0.1278 }, // London
//             end: { lat: 28.6139, lng: 77.209 }, // New Delhi
//           },
//           {
//             start: { lat: 28.6139, lng: 77.209 }, // New Delhi
//             end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
//           },
//           {
//             start: { lat: 28.6139, lng: 77.209 }, // New Delhi
//             end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
//           },
//         ]}
//       />
//     </div>

//     <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-md">
//         {/* Header */}
//         <div className="mb-6 text-center">
//           <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Sign Up"}</h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             {isLogin
//               ? "Enter your credentials to log in."
//               : "We just need a few details to get you started."}
//           </p>
//         </div>

//         {/* Form */}
//         <form className="space-y-4">
//           {!isLogin && (
//             <div>
//               <Label htmlFor={`${id}-name`}>Full Name</Label>
//               <Input id={`${id}-name`} placeholder="Matt Welsh" required type="text" />
//             </div>
//           )}

//           <div>
//             <Label htmlFor={`${id}-email`}>Email</Label>
//             <Input id={`${id}-email`} placeholder="hi@yourcompany.com" required type="email" />
//           </div>

//           <div>
//             <Label htmlFor={`${id}-password`}>Password</Label>
//             <Input
//               id={`${id}-password`}
//               placeholder="Enter your password"
//               required
//               type="password"
//             />
//           </div>

//           <Button className="w-full mt-4" type="submit">
//             {isLogin ? "Login" : "Sign Up"}
//           </Button>
//         </form>

//         {/* Toggle Link */}
//         <p className="mt-4 text-center text-sm text-muted-foreground">
//           {isLogin ? "New here?" : "Already registered?"}{" "}
//           <span
//             onClick={() => setIsLogin(!isLogin)}
//             className="cursor-pointer text-blue-600 hover:underline"
//           >
//             {isLogin ? "Sign Up" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>
//       </>
//   );
// }





'use client'

import { useState, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WorldMap from "@/components/ui/world-map";

export default function AuthWithMap() {
  const [isLogin, setIsLogin] = useState(false);
  const id = useId();

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-black">

      {/* World Map as background */}
      <div className="absolute inset-0 z-0">
        <WorldMap
          dots={[
            { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } },
            { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } },
            { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } },
            { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } },
            { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
            { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } },
          ]}
        />
      </div>

      {/* Form centered */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border bg-white dark:bg-black p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-black dark:text-white">{isLogin ? "Login" : "Sign Up"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Enter your credentials to log in."
                : "We just need a few details to get you started."}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor={`${id}-name`}>Full Name</Label>
                <Input id={`${id}-name`} placeholder="Matt Welsh" required type="text" />
              </div>
            )}

            <div>
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="hi@yourcompany.com" required type="email" />
            </div>

            <div>
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                required
                type="password"
              />
            </div>

            <Button className="w-full mt-4" type="submit">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle Link */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "New here?" : "Already registered?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="cursor-pointer text-blue-600 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
