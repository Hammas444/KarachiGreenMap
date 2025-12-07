'use client'

import { useState, useEffect, Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function AuthForm() {
  const [mode, setMode] = useState('login') // login | signup | forgot | reset
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '' })
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp, resetPassword, updatePassword, user, profile, loading: authLoading } = useAuth()

  useEffect(() => {
    if (searchParams.get('reset') === 'true') setMode('reset')
  }, [searchParams])

  useEffect(() => {
    // Redirect if logged in - don't wait for profile, just go to dashboard
    if (!authLoading && user) {
      const destination = profile?.role === 'admin' ? '/admin' : '/dashboard'
      router.push(destination)
    }
  }, [user, profile, authLoading, router])

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    setLoading(true)

    try {
      if (mode === 'reset') {
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match')
        const { error } = await updatePassword(form.password)
        if (error) throw error
        setMsg({ type: 'success', text: 'Password updated! Redirecting...' })
        setTimeout(() => setMode('login'), 2000)
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(form.email)
        if (error) throw error
        setMsg({ type: 'success', text: 'Reset email sent! Check inbox.' })
        setTimeout(() => setMode('login'), 3000)
      } else if (mode === 'login') {
        const { error } = await signIn(form.email, form.password)
        if (error) throw error
      } else {
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters')
        const { error } = await signUp(form.email, form.password, form.fullName)
        if (error) throw error
        setMsg({ type: 'success', text: 'Account created! Check email to verify.' })
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const titles = { login: 'Login', signup: 'Sign Up', forgot: 'Forgot Password', reset: 'Reset Password' }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8">
        {msg.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
            {msg.text}
          </div>
        )}

        <h1 className="text-2xl font-bold text-center mb-2">{titles[mode]}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === 'login' && 'Enter your credentials to continue'}
          {mode === 'signup' && 'Create your account to get started'}
          {mode === 'forgot' && 'Enter your email for reset link'}
          {mode === 'reset' && 'Enter your new password'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={form.fullName} onChange={update('fullName')} required />
            </div>
          )}

          {mode !== 'reset' && (
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
            <div>
              <Label>{mode === 'reset' ? 'New Password' : 'Password'}</Label>
              <Input type="password" placeholder="••••••••" value={form.password} onChange={update('password')} required minLength={6} />
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={update('confirmPassword')} required />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button type="button" onClick={() => { setMode('forgot'); setMsg({ type: '', text: '' }) }} className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? 'Please wait...' : titles[mode]}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {mode === 'login' && (
            <>New here? <button onClick={() => { setMode('signup'); setMsg({ type: '', text: '' }) }} className="text-green-600 hover:underline">Sign Up</button></>
          )}
          {mode === 'signup' && (
            <>Have an account? <button onClick={() => { setMode('login'); setMsg({ type: '', text: '' }) }} className="text-green-600 hover:underline">Login</button></>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button onClick={() => { setMode('login'); setMsg({ type: '', text: '' }) }} className="text-green-600 hover:underline">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>}>
      <AuthForm />
    </Suspense>
  )
}
