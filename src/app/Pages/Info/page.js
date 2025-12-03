'use client'

import React from 'react'
import { LampContainer } from '@/components/ui/lamp'
import { motion } from 'motion/react'
import Carousel from "@/components/ui/carousel";
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

const page = () => {

const images = [
    "https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://images.pexels.com/photos/15286/pexels-photo.jpg",
    "https://images.pexels.com/photos/35196/water-plant-green-fine-layers.jpg",
    "https://cdn.dribbble.com/userupload/11381141/file/original-70e18d7e23d96dd72d34dc291d7c2270.png?resize=1024x768&vertical=center",
    "https://images.pexels.com/photos/914682/pexels-photo-914682.jpeg",
    "https://assets.aceternity.com/flip-text.png",
    "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg",
    "https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg",
    "https://cdn.dribbble.com/userupload/23704100/file/original-b633cdc16aff4e381ca6d5c58dd7932c.gif",
    "https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg",
    "https://images.pexels.com/photos/1995730/pexels-photo-1995730.jpeg",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeox1Tv5k2ydyJnCXhVIjKJN9x3xmOcFGc8g&s",
    "https://images.pexels.com/photos/790452/pexels-photo-790452.jpeg",
    "https://cdn.dribbble.com/userupload/18090157/file/original-9aadfbb0082768196a6f7c6a8c9995fc.jpeg?resize=1024x1255&vertical=center",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];

const slideData = [
    {
      title: "Street Trees of Karachi",
      src: "https://images.unsplash.com/photo-1698404327936-720a24d7d274?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    },
    {
      title: "Neighbourhood Park Greens",
      src: "https://images.unsplash.com/photo-1561045797-cd0aa7fe6022?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    },
    {
      title: "Urban Tree Canopy",
      src: "https://images.unsplash.com/photo-1638396242179-e36a3511210a?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    },
    {
      title: "Green Belt & Footpath Trees",
      src: "https://images.unsplash.com/photo-1668009219418-4ece0d9e36c4?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eSUyMHBhcmt8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
    },
    
  ];

  return (
    <div className="relative w-full h-full">

      {/* Back Arrow Button */}
      <Link href="/Pages/UserDashboard" className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 shadow-md hover:bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700 transition">
        <IconArrowLeft className="h-5 w-5 text-black dark:text-white" />
        <span className="text-black dark:text-white font-medium">Back</span>
      </Link>

     

      {/* Lamp Section */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-linear-to-br from-emerald-400 to-green-600 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
         Mapping Karachi’s  <br /> Green Future
        </motion.h1>
      </LampContainer>




 <div className=" rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>

 {/* Carousel */}
      <div className="relative overflow-hidden w-full h-full py-20">
        <Carousel slides={slideData} />
      </div>






    </div>
  )
}

export default page
