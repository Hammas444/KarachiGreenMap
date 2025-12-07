'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    if (user && profile) {
      // Logged in - go to dashboard
      router.replace(profile.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      // Not logged in - go to auth
      router.replace('/auth')
    }
  }, [user, profile, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" />
    </div>
  )
}
