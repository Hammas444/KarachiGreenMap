'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import QRCode from 'qrcode'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'U61Q3cnFHasU5kc4OEcv'
const DEFAULT_LOCATION = [24.8607, 67.0011]

// Debounce helper
const debounce = (fn, ms = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// Live Camera Component
const LiveCamera = memo(({ onCapture, onClose }) => {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        console.error('Camera error:', e)
        onClose()
      }
    }
    start()
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [onClose])

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    onCapture(canvas.toDataURL('image/jpeg', 0.8))
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button onClick={capture} className="bg-green-600 hover:bg-green-700"><Camera className="mr-2 h-4 w-4" />Capture</Button>
        <Button variant="outline" onClick={onClose} className="bg-white/90">Cancel</Button>
      </div>
    </div>
  )
})
LiveCamera.displayName = 'LiveCamera'

// Location picker for Leaflet
let LeafletComponents = null

export default function AddTreeDialog({ open, setOpen, onTreeAdded }) {
  const { user, profile, supabase } = useAuth()
  const [treeName, setTreeName] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [address, setAddress] = useState('')
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [leafletReady, setLeafletReady] = useState(false)

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return
    import('react-leaflet').then(mod => {
      LeafletComponents = mod
      import('leaflet').then(L => {
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
        })
        setLeafletReady(true)
      })
    })
  }, [])

  // Get user location
  useEffect(() => {
    if (open) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      )
    }
  }, [open])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLocation = useCallback(debounce(async (q) => {
    if (q.length < 3) return setSuggestions([])
    try {
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${MAPTILER_KEY}&limit=5`)
      const data = await res.json()
      setSuggestions(data.features?.map(f => ({
        label: f.place_name,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]
      })) || [])
    } catch { setSuggestions([]) }
  }), [])

  const selectSuggestion = (s) => {
    setLocation([s.lat, s.lng])
    setAddress(s.label)
    setSearch(s.label)
    setSuggestions([])
  }

  const handleSave = async () => {
    if (!user || !treeName.trim() || !photo) {
      setError('Please fill tree name and capture a photo')
      return
    }
    setSaving(true)
    setError(null)

    try {
      // Upload photo
      const photoBlob = await fetch(photo).then(r => r.blob())
      const photoPath = `trees/${user.id}/${Date.now()}.jpg`
      const { error: uploadErr } = await supabase.storage.from('tree-photos').upload(photoPath, photoBlob, { contentType: 'image/jpeg' })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl: photoUrl } } = supabase.storage.from('tree-photos').getPublicUrl(photoPath)

      // Insert tree
      const { data: tree, error: treeErr } = await supabase
        .from('trees')
        .insert({
          user_id: user.id,
          tree_name: treeName.trim(),
          description: description.trim() || null,
          latitude: location[0],
          longitude: location[1],
          address: address || null,
          photo_url: photoUrl,
          status: 'pending'
        })
        .select()
        .single()
      if (treeErr) throw treeErr

      // Generate QR
      try {
        const qrData = await QRCode.toDataURL(`${window.location.origin}/tree/${tree.id}`, { width: 300 })
        const qrBlob = await fetch(qrData).then(r => r.blob())
        const qrPath = `${tree.id}.png`
        await supabase.storage.from('qr-codes').upload(qrPath, qrBlob, { contentType: 'image/png', upsert: true })
        const { data: { publicUrl: qrUrl } } = supabase.storage.from('qr-codes').getPublicUrl(qrPath)
        await supabase.from('trees').update({ qr_code_url: qrUrl }).eq('id', tree.id)
        tree.qr_code_url = qrUrl
      } catch {}

      // Update profile
      await supabase.from('profiles').update({ trees_planted: (profile?.trees_planted || 0) + 1 }).eq('id', user.id)

      setSuccess(true)
      onTreeAdded?.(tree)
      setTimeout(() => { reset(); setOpen(false) }, 1500)
    } catch (e) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setTreeName('')
    setDescription('')
    setPhoto(null)
    setAddress('')
    setSearch('')
    setSuggestions([])
    setError(null)
    setSuccess(false)
  }

  const LocationPicker = leafletReady && LeafletComponents ? ({ loc, setLoc, setAddr }) => {
    const { useMapEvents, Marker } = LeafletComponents
    
    function Picker() {
      useMapEvents({
        click: async (e) => {
          setLoc([e.latlng.lat, e.latlng.lng])
          try {
            const res = await fetch(`https://api.maptiler.com/geocoding/${e.latlng.lng},${e.latlng.lat}.json?key=${MAPTILER_KEY}`)
            const data = await res.json()
            setAddr(data.features?.[0]?.place_name || '')
          } catch {}
        }
      })
      return loc ? <Marker position={loc} /> : null
    }
    return <Picker />
  } : null

  return (
    <Dialog open={open} onOpenChange={v => !saving && (v ? null : (reset(), setOpen(false)))}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add a New Tree</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">Tree submitted! Pending verification.</div>}
          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

          <div>
            <Label>Your Name</Label>
            <Input value={profile?.full_name || user?.email || ''} readOnly className="bg-gray-50" />
          </div>

          <div>
            <Label>Tree Name *</Label>
            <Input value={treeName} onChange={e => setTreeName(e.target.value)} placeholder="Neem, Banyan, Mango..." disabled={saving} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={180} placeholder="Details about the tree..." disabled={saving} />
            <p className="text-right text-xs text-gray-400">{180 - description.length} left</p>
          </div>

          <div>
            <Label>Photo *</Label>
            {!showCamera && !photo && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowCamera(true)} disabled={saving}>
                <Camera className="mr-2 h-4 w-4" /> Take Photo
              </Button>
            )}
            {showCamera && <LiveCamera onCapture={img => { setPhoto(img); setShowCamera(false) }} onClose={() => setShowCamera(false)} />}
            {photo && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Tree" className="w-full h-48 object-cover rounded-lg border-2 border-green-500" />
                {!saving && (
                  <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700">
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <Label>Search Location</Label>
            <Input value={search} onChange={e => { setSearch(e.target.value); searchLocation(e.target.value) }} placeholder="Search park, zoo..." disabled={saving} />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-40 overflow-auto shadow-lg">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">{s.label}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Label>Address</Label>
            <Input value={address} readOnly className="bg-gray-50" placeholder="Click map or search" />
          </div>

          <div>
            <Label>Coordinates</Label>
            <Input value={`${location[0].toFixed(6)}, ${location[1].toFixed(6)}`} readOnly className="bg-gray-50 font-mono text-sm" />
          </div>

          {leafletReady && LeafletComponents && (
            <div>
              <Label>Pick on Map *</Label>
              <p className="text-xs text-gray-400 mb-2">Click to select location</p>
              <LeafletComponents.MapContainer center={location} zoom={15} style={{ height: 200, width: '100%' }} className="rounded-lg border">
                <LeafletComponents.TileLayer url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`} />
                <LocationPicker loc={location} setLoc={setLocation} setAddr={setAddress} />
              </LeafletComponents.MapContainer>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => { reset(); setOpen(false) }} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || success} className="bg-green-600 hover:bg-green-700">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : success ? 'Done!' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
