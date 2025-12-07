'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase/client'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = useMemo(() => getSupabase(), [])

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) {
        console.error('Profile fetch error:', error)
        return null
      }
      return data
    } catch (e) {
      console.error('Profile fetch exception:', e)
      return null
    }
  }, [supabase])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: 'No user' }
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    if (!error && data) setProfile(data)
    return { data, error }
  }, [user, supabase])

  const uploadAvatar = useCallback(async (file) => {
    if (!user) return { error: 'No user' }
    const path = `avatars/${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) return { error }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ avatar_url: publicUrl })
    return { url: publicUrl }
  }, [user, supabase, updateProfile])

  const signUp = useCallback((email, password, fullName) => 
    supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  , [supabase])

  const signIn = useCallback((email, password) => 
    supabase.auth.signInWithPassword({ email, password })
  , [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) { setUser(null); setProfile(null) }
    return { error }
  }, [supabase])

  const resetPassword = useCallback((email) => 
    supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth?reset=true` })
  , [supabase])

  const updatePassword = useCallback((newPassword) => 
    supabase.auth.updateUser({ password: newPassword })
  , [supabase])

  useEffect(() => {
    let mounted = true
    
    const init = async () => {
      try {
        // Handle OAuth callback code in URL
        const params = new URLSearchParams(window.location.search)
        if (params.get('code')) {
          // Exchange code for session
          await supabase.auth.exchangeCodeForSession(params.get('code'))
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname)
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted && session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user.id)
          setProfile(p)
        }
      } catch (e) {
        console.error('Auth init error:', e)
      }
      if (mounted) setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      console.log('Auth event:', event)
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [supabase, fetchProfile])

  const value = useMemo(() => ({
    user, profile, loading, supabase, signUp, signIn, signOut, 
    resetPassword, updatePassword, updateProfile, uploadAvatar,
    isAdmin: profile?.role === 'admin'
  }), [user, profile, loading, supabase, signUp, signIn, signOut, resetPassword, updatePassword, updateProfile, uploadAvatar])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
