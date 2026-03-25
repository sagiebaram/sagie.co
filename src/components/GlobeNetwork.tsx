'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Globe = dynamic(() => import('react-globe.gl').then((mod) => mod.default) as any, {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background-card">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-globe-cyan rounded-full animate-spin" />
    </div>
  ),
}) as any

interface City {
  id: string
  name: string
  lat: number
  lng: number
  members: number
  isChapter: boolean
}

interface Arc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color: [string, string]
}

const MOCK_CITIES: readonly City[] = [
  { id: 'mia', name: 'Miami', lat: 25.7617, lng: -80.1918, members: 82, isChapter: true },
  { id: 'nyc', name: 'New York', lat: 40.7128, lng: -74.006, members: 45, isChapter: false },
  { id: 'lon', name: 'London', lat: 51.5074, lng: -0.1278, members: 24, isChapter: false },
  { id: 'tlv', name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, members: 38, isChapter: false },
]

const MOCK_ARCS: readonly Arc[] = [
  { startLat: 25.7617, startLng: -80.1918, endLat: 40.7128, endLng: -74.006, color: ['#00ffff', '#0055ff'] },
  { startLat: 40.7128, startLng: -74.006, endLat: 51.5074, endLng: -0.1278, color: ['#0055ff', '#00ffff'] },
  { startLat: 51.5074, startLng: -0.1278, endLat: 32.0853, endLng: 34.7818, color: ['#00ffff', '#0055ff'] },
  { startLat: 32.0853, startLng: 34.7818, endLat: 25.7617, endLng: -80.1918, color: ['#0055ff', '#00ffff'] },
]

export function GlobeNetwork() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] })
  
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const handleDismiss = () => {
    setSelectedCity(null)
    globeRef.current?.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 800)
  }

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
    )
      .then((res) => res.json())
      .then(setCountries)
      .catch((err: unknown) => console.error('Failed to fetch country polygons:', err))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = Math.max(400, width * 0.5)
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls()
      const camera = globeRef.current.camera()

      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.8
        controls.enableZoom = true

        controls.addEventListener('change', () => {
          const altitude = globeRef.current?.camera().position.distanceTo(controls.target) / globeRef.current?.getGlobeRadius() - 1
          if (altitude !== undefined) {
            setIsZoomedIn(altitude < 1.8)
          }
        })
      }

      globeRef.current.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 2000)

      const timeout = setTimeout(() => {
        if (controls && camera) {
          controls.maxDistance = camera.position.distanceTo(controls.target)
        }
      }, 2100)

      return () => clearTimeout(timeout)
    }
    return undefined
  }, [])

  const ringsData = useMemo(
    () =>
      MOCK_CITIES.filter((c) => c.isChapter).map((c) => ({
        lat: c.lat,
        lng: c.lng,
        maxR: 18,
        propagationSpeed: 1.2,
        repeatPeriod: 1400,
      })),
    [],
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex justify-center items-center min-h-[400px] bg-transparent border border-border-subtle mt-px"
    >
      <div
        className="relative"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maskImage: 'radial-gradient(circle, black 40%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)',
        }}
      >
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeColor="#020d18"
          showAtmosphere={true}
          atmosphereColor="#00ccff"
          atmosphereAltitude={0.35}
          polygonsData={countries.features}
          polygonCapColor={() => 'rgba(0,0,0,0)'}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={() => 'rgba(255,255,255,0.35)'}
          pointsData={[...MOCK_CITIES]}
          pointColor={(d: any) => {
            if (hoveredCity === d.id) return '#ffffff'
            if (d.isChapter) return '#00ffff'
            return hoveredCity ? 'rgba(0,255,255,0.3)' : '#00ffff'
          }}
          pointAltitude={0.02}
          pointRadius={(d: any) => {
            if (hoveredCity === d.id) return 0.8
            return d.isChapter ? 0.6 : 0.3
          }}
          pointsMerge={false}
          ringsData={ringsData}
          ringColor={() => (t: number) => `rgba(0,255,255,${1 - t})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={[...MOCK_ARCS]}
          arcColor={(arc: any) => {
            if (!hoveredCity) return arc.color
            const isConnected =
              (arc.startLat === MOCK_CITIES.find(c => c.id === hoveredCity)?.lat) ||
              (arc.endLat === MOCK_CITIES.find(c => c.id === hoveredCity)?.lat)
            return isConnected
              ? ['#00ffff', '#ffffff']
              : ['rgba(0,85,255,0.15)', 'rgba(0,255,255,0.15)']
          }}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcAltitudeAutoScale={0.3}
          arcStroke={1.2}
          onPointHover={(point: any) => setHoveredCity(point ? point.id : null)}
          onPointClick={(point: any) => {
            const city = MOCK_CITIES.find(c => c.id === point.id)
            if (city) {
              setSelectedCity(prev => prev?.id === city.id ? null : city)
              globeRef.current?.pointOfView(
                { lat: point.lat, lng: point.lng, altitude: 1.4 },
                800
              )
            }
          }}
          htmlElementsData={[...MOCK_CITIES]}
          htmlElement={(d: any) => {
            const el = document.createElement('div')
            const showMembers = isZoomedIn
            el.innerHTML = `
              <div style="font-family: var(--font-bebas-neue, sans-serif); display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); padding-bottom: 6px; pointer-events: auto; cursor: pointer;">
                <div style="font-size: 24px; letter-spacing: 0.1em; line-height: 1; ${
                  d.isChapter ? 'color: #00ffff;' : 'color: rgba(255,255,255,0.8);'
                }">${d.isChapter ? '★ ' : ''}${d.name}</div>
                <div style="font-family: var(--font-dm-sans, sans-serif); font-size: 11px; color: rgba(0,255,255,0.6); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px; transition: opacity 0.3s; opacity: ${
                  showMembers ? '1' : '0'
                };">${d.members} Members</div>
              </div>
            `
            el.onclick = () => {
              if (globeRef.current) {
                const city = MOCK_CITIES.find(c => c.id === d.id) || null
                setSelectedCity(prev => prev?.id === city?.id ? null : city)
                globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.4 }, 800)
              }
            }
            el.onmouseenter = () => setHoveredCity(d.id)
            el.onmouseleave = () => setHoveredCity(null)
            return el
          }}
        />
      </div>

      {selectedCity && (
        <div
          className="absolute bottom-6 left-6 z-10 border border-border-default bg-background-card p-4"
          style={{ minWidth: '180px' }}
        >
          <div
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: selectedCity.isChapter ? '#00ffff' : 'var(--text-muted)' }}
          >
            {selectedCity.isChapter ? '★ Active Chapter' : 'Community Members'}
          </div>
          <div
            className="font-display text-2xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {selectedCity.name}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {selectedCity.members} Members
          </div>
          {selectedCity.isChapter && (
            <div
              className="text-xs mt-3 uppercase tracking-widest"
              style={{ color: '#00ffff', borderTop: '0.5px solid rgba(0,255,255,0.2)', paddingTop: '8px' }}
            >
              Live · {selectedCity.name}
            </div>
          )}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-3 text-xs"
            style={{ color: 'var(--text-ghost)' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
