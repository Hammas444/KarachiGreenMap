'use client'

// Simplified lamp component - removed heavy animations
export function LampContainer({ children, className = '' }) {
  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center bg-slate-950 w-full rounded-md ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default function LampDemo() {
  return (
    <LampContainer>
      <h1 className="text-4xl font-bold text-white">Welcome</h1>
    </LampContainer>
  )
}
