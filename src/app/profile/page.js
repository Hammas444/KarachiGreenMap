'use client'

import { useState, useEffect, useCallback } from 'react'
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Trees, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { useAuth } from '@/context/AuthContext'

const InfoCard = ({ icon, label, value, editing, onChange, readOnly, placeholder }) => (
  <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition">
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        {editing && !readOnly ? (
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full text-slate-800 font-medium bg-white border-2 border-green-300 focus:border-green-600 outline-none rounded px-2 py-1" />
        ) : (
          <p className="text-slate-800 font-medium">{value || placeholder || '-'}</p>
        )}
      </div>
    </div>
  </div>
)

export default function ProfilePage() {
  const { user, profile, updateProfile, uploadAvatar, loading: authLoading, supabase } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [stats, setStats] = useState({ total: 0, verified: 0 })
  const [form, setForm] = useState({ full_name: '', phone: '', location: '', bio: '', avatar_url: null })

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', location: profile.location || '', bio: profile.bio || '', avatar_url: profile.avatar_url })
  }, [profile])

  const fetchStats = useCallback(async () => {
    if (!user || !supabase) return
    const { data } = await supabase.from('trees').select('status').eq('user_id', user.id)
    if (data) setStats({ total: data.length, verified: data.filter(t => t.status === 'verified').length })
  }, [user, supabase])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg({ type: '', text: '' })
    try {
      const { url, error } = await uploadAvatar(file)
      if (error) throw error
      setForm(f => ({ ...f, avatar_url: url }))
      setMsg({ type: 'success', text: 'Avatar uploaded!' })
    } catch { setMsg({ type: 'error', text: 'Upload failed' }) }
    setUploading(false)
    setTimeout(() => setMsg({ type: '', text: '' }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const { error } = await updateProfile({ full_name: form.full_name, phone: form.phone, location: form.location, bio: form.bio })
      if (error) throw error
      setMsg({ type: 'success', text: 'Profile saved!' })
      setEditing(false)
    } catch { setMsg({ type: 'error', text: 'Save failed' }) }
    setSaving(false)
    setTimeout(() => setMsg({ type: '', text: '' }), 3000)
  }

  const handleCancel = () => {
    setForm({ full_name: profile?.full_name || '', phone: profile?.phone || '', location: profile?.location || '', bio: profile?.bio || '', avatar_url: profile?.avatar_url })
    setEditing(false)
    setMsg({ type: '', text: '' })
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"><div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>
  }

  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'
  const initials = form.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <Link href="/dashboard" className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 shadow-md hover:bg-white transition">
        <IconArrowLeft className="h-5 w-5" /><span className="font-medium">Back</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        {msg.text && <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>{msg.text}</div>}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-[#1B5E20] via-[#4CAF50] to-[#81C784]">
            <div className="absolute top-4 right-4 flex gap-2">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="bg-white/90 hover:bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                  <Edit2 size={16} />Edit
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} className="bg-white/90 hover:bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={handleCancel} disabled={saving} className="bg-white/90 hover:bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                    <X size={16} />Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="relative px-8 pb-8">
            <div className="absolute -top-20 left-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#AED581]">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">{initials}</div>
                  )}
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}
                </div>
                {editing && (
                  <label className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer shadow-lg">
                    <Camera size={20} />
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-24">
              <div className="mb-6">
                {editing ? (
                  <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your name" className="text-3xl font-bold text-slate-800 border-b-2 border-green-300 focus:border-green-600 outline-none w-full" />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile?.full_name || 'Your Name'}</h1>
                    <p className="text-lg text-slate-600">{user?.email}</p>
                  </>
                )}
              </div>

              <div className="mb-8">
                {editing ? (
                  <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." className="w-full text-slate-700 border-2 border-green-300 focus:border-green-600 outline-none rounded-lg p-3 resize-none" rows={3} />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{profile?.bio || 'No bio yet.'}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <InfoCard icon={<Mail size={20} className="text-green-600" />} label="Email" value={user?.email || ''} readOnly />
                <InfoCard icon={<Phone size={20} className="text-green-600" />} label="Phone" value={form.phone} editing={editing} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="Add phone" />
                <InfoCard icon={<MapPin size={20} className="text-green-600" />} label="Location" value={form.location} editing={editing} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="Add location" />
                <InfoCard icon={<Trees size={20} className="text-green-600" />} label="Trees Planted" value={`${stats.total} total (${stats.verified} verified)`} readOnly />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 flex items-center gap-3 text-slate-700">
                <Calendar size={20} className="text-green-600" />
                <span className="font-medium">Joined:</span>
                <span>{joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
