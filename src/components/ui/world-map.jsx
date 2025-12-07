'use client'

// Lightweight world map - just a simple decorative background
// Removed heavy animations that caused freezing

export default function WorldMap() {
  return (
    <div className="w-full h-full opacity-10 pointer-events-none select-none">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" className="text-green-600" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#grid)" />
      </svg>
    </div>
  )
}
