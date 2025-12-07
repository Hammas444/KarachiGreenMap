'use client'

import { useRef, useEffect, useState, memo, useCallback } from 'react'
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'U61Q3cnFHasU5kc4OEcv'

const STATUS_COLORS = {
  verified: { color: '#4CAF50', label: 'Verified' },
  pending: { color: '#FFC107', label: 'Pending' },
  rejected: { color: '#F44336', label: 'Rejected' }
}

function MapTilerMap({ center = [67.0011, 24.8607], zoom = 13, trees = [] }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [ready, setReady] = useState(false)

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    config.apiKey = MAPTILER_KEY

    const initMap = (mapCenter) => {
      const map = new Map({
        container: containerRef.current,
        style: MapStyle.STREETS,
        center: mapCenter,
        zoom,
        navigationControl: true,
        fullscreenControl: true,
        scaleControl: true
      })

      mapRef.current = map

      // User location marker
      const el = document.createElement('div')
      el.innerHTML = `<img src="/TreeMarker.gif" alt="You" style="width:50px;height:50px;object-fit:contain;transform:translate(-50%,-100%)"/>`
      
      new Marker({ draggable: true, element: el })
        .setLngLat(mapCenter)
        .setPopup(new Popup().setHTML(`<b>Your Location</b>`))
        .addTo(map)

      setReady(true)
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => initMap([pos.coords.longitude, pos.coords.latitude]),
      () => initMap(center)
    )

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update tree markers
  useEffect(() => {
    if (!ready || !mapRef.current) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    trees.forEach(tree => {
      if (!tree.latitude || !tree.longitude) return

      const { color, label } = STATUS_COLORS[tree.status] || STATUS_COLORS.pending

      const el = document.createElement('div')
      el.innerHTML = `
        <div style="width:28px;height:28px;background:${color};border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.3);cursor:pointer">
          <span style="font-size:14px">🌳</span>
        </div>
      `

      const popup = new Popup({ maxWidth: '260px' }).setHTML(`
        <div style="font-family:system-ui">
          <b style="color:#2E7D32">${tree.tree_name || 'Tree'}</b>
          ${tree.photo_url ? `<img src="${tree.photo_url}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin:8px 0"/>` : ''}
          <div style="font-size:12px;margin-top:4px">
            <span style="background:${color}20;color:${color};padding:2px 8px;border-radius:10px;font-weight:600">${label}</span>
          </div>
          ${tree.description ? `<p style="font-size:12px;color:#666;margin-top:6px">${tree.description}</p>` : ''}
          <p style="font-size:11px;color:#999;margin-top:6px">📍 ${tree.address || `${tree.latitude.toFixed(4)}, ${tree.longitude.toFixed(4)}`}</p>
        </div>
      `)

      const marker = new Marker({ element: el })
        .setLngLat([tree.longitude, tree.latitude])
        .setPopup(popup)
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [trees, ready])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }} />
}

export default memo(MapTilerMap)
