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
}

const MOCK_CITIES: readonly City[] = [
  { id: 'mia', name: 'Miami', lat: 25.7617, lng: -80.1918, members: 82, isChapter: true },
  { id: 'nyc', name: 'New York', lat: 40.7128, lng: -74.006, members: 45, isChapter: false },
  { id: 'lon', name: 'London', lat: 51.5074, lng: -0.1278, members: 24, isChapter: false },
  { id: 'tlv', name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, members: 38, isChapter: false },
]

const MOCK_ARCS: readonly Arc[] = [
  { startLat: 25.7617, startLng: -80.1918, endLat: 40.7128, endLng: -74.006 },
  { startLat: 40.7128, startLng: -74.006, endLat: 51.5074, endLng: -0.1278 },
  { startLat: 51.5074, startLng: -0.1278, endLat: 32.0853, endLng: 34.7818 },
  { startLat: 32.0853, startLng: 34.7818, endLat: 25.7617, endLng: -80.1918 },
]

export function GlobeNetwork() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cancelledRef = useRef(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] })
  
  const globeColors = {
    globeColor: '#000000',
    showAtmosphere: true,
    atmosphereColor: '#ffffff',
    atmosphereAltitude: 0.25,
    polygonCapColor: () => 'rgba(0,0,0,0)',
    polygonSideColor: () => 'rgba(0,0,0,0)',
    polygonStrokeColor: () => 'rgba(255,255,255,0.35)',
    pointColor: (d: any) => d.isChapter ? '#ffffff' : 'rgba(255,255,255,0.3)',
    arcColorConnected: ['#ffffff', '#ffffff'] as [string, string],
    arcColorIdle: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.15)'] as [string, string],
    ringColor: () => (t: number) => `rgba(255,255,255,${1 - t})`,
  }

  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const handleSelect = (city: City | null) => {
    setSelectedCity(city)
    const controls = globeRef.current?.controls()
    if (city) {
      if (controls) controls.autoRotate = false
      globeRef.current?.pointOfView(
        { lat: city.lat, lng: city.lng, altitude: 1.4 },
        800
      )
    } else {
      if (controls) controls.autoRotate = true
      globeRef.current?.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 800)
    }
  }

  // Refs so imperative DOM click handlers always use latest values
  const handleSelectRef = useRef(handleSelect)
  handleSelectRef.current = handleSelect
  const selectedCityRef = useRef(selectedCity)
  selectedCityRef.current = selectedCity

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
    cancelledRef.current = false
    return () => {
      cancelledRef.current = true
    }
  }, [])

  const initGlobe = (retries = 0) => {
    if (cancelledRef.current) return
    if (!globeRef.current) {
      if (retries >= 50) return  // max 5 seconds (50 x 100ms)
      setTimeout(() => initGlobe(retries + 1), 100)
      return
    }
    const controls = globeRef.current.controls()
    const camera = globeRef.current.camera()

    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.8
      controls.enableZoom = true

      controls.addEventListener('change', () => {
        if (globeRef.current) {
          const pov = globeRef.current.pointOfView()
          if (pov && typeof pov.altitude === 'number') {
            setIsZoomedIn(pov.altitude < 1.8)
          }
        }
      })
    }

    globeRef.current.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 2000)

    setTimeout(() => {
      if (controls && camera) {
        controls.maxDistance = camera.position.distanceTo(controls.target)
      }
    }, 2100)
  }

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

  useEffect(() => {
    // Imperatively update the labels to bypass globe.gl's re-rendering logic
    const labels = document.querySelectorAll('.globe-zoom-label')
    labels.forEach((label) => {
      (label as HTMLElement).style.opacity = isZoomedIn ? '1' : '0'
    })
  }, [isZoomedIn])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible flex justify-center items-center min-h-[400px] bg-transparent border border-border-subtle mt-px"
    >
      <div
        className="relative z-0"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maskImage: isZoomedIn ? 'none' : 'radial-gradient(circle, black 40%, transparent 75%)',
          WebkitMaskImage: isZoomedIn ? 'none' : 'radial-gradient(circle, black 40%, transparent 75%)',
          transition: 'mask-image 0.3s ease',
        }}
      >
        <Globe
          ref={globeRef}
          onGlobeReady={initGlobe}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeColor={globeColors.globeColor}
          showAtmosphere={globeColors.showAtmosphere}
          atmosphereColor={globeColors.atmosphereColor}
          atmosphereAltitude={globeColors.atmosphereAltitude}
          polygonsData={countries.features}
          polygonCapColor={globeColors.polygonCapColor}
          polygonSideColor={globeColors.polygonSideColor}
          polygonStrokeColor={globeColors.polygonStrokeColor}
          pointsData={[...MOCK_CITIES]}
          pointColor={(d: any) => {
            if (hoveredCity === d.id) return '#ffffff'
            return hoveredCity
              ? 'rgba(255,255,255,0.15)'
              : globeColors.pointColor(d)
          }}
          pointAltitude={0.02}
          pointRadius={(d: any) => {
            if (hoveredCity === d.id) return 0.8
            return d.isChapter ? 0.6 : 0.3
          }}
          pointsMerge={false}
          ringsData={ringsData}
          ringColor={globeColors.ringColor}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={[...MOCK_ARCS]}
          arcColor={(arc: any) => {
            if (!hoveredCity) return globeColors.arcColorIdle
            const city = MOCK_CITIES.find(c => c.id === hoveredCity)
            const isConnected =
              arc.startLat === city?.lat || arc.endLat === city?.lat
            return isConnected ? globeColors.arcColorConnected : globeColors.arcColorIdle
          }}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcAltitudeAutoScale={0.3}
          arcStroke={0.5}
          onPointHover={(point: any) => setHoveredCity(point ? point.id : null)}
          onPointClick={(point: any) => {
            const city = MOCK_CITIES.find(c => c.id === point.id)
            if (city) {
              handleSelect(selectedCity?.id === city.id ? null : city)
            }
          }}
          htmlElementsData={[...MOCK_CITIES]}
          htmlElement={(d: any) => {
            const el = document.createElement('div')
            el.innerHTML = `
              <div style="font-family: var(--font-bebas-neue, sans-serif); display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); padding-bottom: 6px; pointer-events: auto; cursor: pointer;">
                <div style="font-size: 24px; letter-spacing: 0.1em; line-height: 1; ${
                  d.isChapter ? 'color: var(--text-primary);' : 'color: var(--text-secondary);'
                }">${d.isChapter ? '★ ' : ''}${d.name}</div>
                <div class="globe-zoom-label" style="font-family: var(--font-dm-sans, sans-serif); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px; transition: opacity 0.3s; opacity: 0;">${d.members} Members</div>
              </div>
            `
            el.onclick = (e: MouseEvent) => {
              e.stopPropagation()
              const city = MOCK_CITIES.find(c => c.id === d.id) || null
              const prev = selectedCityRef.current
              handleSelectRef.current(prev?.id === city?.id ? null : city)
            }
            el.onmouseenter = () => setHoveredCity(d.id)
            el.onmouseleave = () => setHoveredCity(null)
            return el
          }}
        />
      </div>

      {/* Info card — bottom left */}
      {selectedCity && (
        <div
          className="absolute bottom-6 left-6 z-20 border border-border-default bg-background-card p-4"
          style={{ maxWidth: '240px' }}
        >
          <div
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: selectedCity.isChapter ? 'var(--silver)' : 'var(--text-muted)' }}
          >
            {selectedCity.isChapter ? 'Active Chapter' : 'Community Hub'}
          </div>
          <div className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {selectedCity.name}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {selectedCity.members} Members
          </div>
          <div
            className="text-xs mt-3 uppercase tracking-widest"
            style={{
              color: selectedCity.isChapter ? 'var(--text-primary)' : 'var(--text-dim)',
              borderTop: '0.5px solid var(--border-subtle)',
              paddingTop: '8px',
            }}
          >
            {selectedCity.isChapter ? 'Live' : 'Coming Soon'} &middot; {selectedCity.name}
          </div>
          <button
            onClick={() => handleSelect(null)}
            className="absolute top-2 right-3 text-xs cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            &#x2715;
          </button>
        </div>
      )}

      {/* Legend */}
      <div
        className="absolute bottom-6 right-6 z-20"
        style={{ minWidth: '160px' }}
      >
        {MOCK_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => handleSelect(selectedCity?.id === city.id ? null : city)}
            onMouseEnter={() => setHoveredCity(city.id)}
            onMouseLeave={() => setHoveredCity(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'opacity 0.15s',
              opacity: hoveredCity && hoveredCity !== city.id ? 0.4 : 1,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: city.isChapter ? 'var(--text-primary)' : 'var(--text-dim)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: selectedCity?.id === city.id
                  ? 'var(--text-primary)'
                  : city.isChapter
                    ? 'var(--silver)'
                    : 'var(--text-muted)',
                transition: 'color 0.15s',
              }}
            >
              {city.name}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                marginLeft: 'auto',
              }}
            >
              {city.members}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
