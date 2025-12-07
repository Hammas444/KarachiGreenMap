'use client'

import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { Trees, MapPin, Users, Check } from 'lucide-react'

const images = [
  'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg',
  'https://images.pexels.com/photos/15286/pexels-photo.jpg',
  'https://images.pexels.com/photos/914682/pexels-photo-914682.jpeg',
  'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg',
]

const features = [
  { icon: Trees, title: 'Track Trees', desc: 'Document every tree you plant with photos and location' },
  { icon: MapPin, title: 'Map Coverage', desc: 'Visualize green coverage across Karachi neighborhoods' },
  { icon: Users, title: 'Community', desc: 'Join fellow citizens in making Karachi greener' },
  { icon: Check, title: 'Verified', desc: 'Admin verification ensures accurate tree records' },
]

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Link href="/dashboard" className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-md bg-white/10 backdrop-blur px-3 py-2 hover:bg-white/20 transition">
        <IconArrowLeft className="h-5 w-5 text-white" />
        <span className="text-white font-medium">Back</span>
      </Link>

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-6">
          Mapping Karachi&apos;s<br />Green Future
        </h1>
        <p className="relative text-xl text-slate-300 max-w-2xl mx-auto">
          Join the movement to document and grow Karachi&apos;s urban forest. Every tree counts.
        </p>
      </div>

      {/* Features */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 backdrop-blur rounded-xl p-6 hover:bg-white/10 transition">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Karachi&apos;s Green Spaces</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Green space ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-16 bg-green-900/20">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-green-400">1000+</p>
            <p className="text-slate-400 mt-1">Trees Planted</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400">500+</p>
            <p className="text-slate-400 mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400">18</p>
            <p className="text-slate-400 mt-1">Districts Covered</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Plant?</h2>
        <p className="text-slate-400 mb-8">Start documenting your contribution to Karachi&apos;s green future</p>
        <Link href="/dashboard" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
