'use client'

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import type { CityData } from '@/lib/members'
import type { ChapterPin } from './GlobeClient'
import type { GlobePoint, GlobeArc, GlobeRing, GeoJsonFeatureCollection } from '@/types/globe'
import type { GlobeMethods, GlobeProps } from 'react-globe.gl'

// react-globe.gl types don't include globeColor (runtime-only prop from three-globe)
type ExtendedGlobeProps = GlobeProps & { globeColor?: string }
type GlobeComponent = React.FC<ExtendedGlobeProps & { ref?: React.MutableRefObject<GlobeMethods | undefined> }>

const Globe = dynamic(
  () => import('react-globe.gl').then((mod) => mod.default as unknown as GlobeComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background-card">
        <div className="w-8 h-8 border-2 border-border-subtle border-t-globe-cyan rounded-full animate-spin" />
      </div>
    ),
  },
)

interface ThreeObject3D {
  geometry?: { dispose(): void }
  material?: ThreeMaterial | ThreeMaterial[]
}

interface ThreeMaterial {
  dispose(): void
  [key: string]: unknown
}

export function GlobeNetwork({ cities, chapterPins = [] }: { cities: CityData[]; chapterPins?: ChapterPin[] }) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const cancelledRef = useRef(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMobile, setIsMobile] = useState(false)
  const [countries, setCountries] = useState<GeoJsonFeatureCollection>({ features: [] })

  const [altitude, setAltitude] = useState(2.2)
  const isZoomedIn = altitude < 1.8

  // Atmosphere shrinks as you zoom in: 0.25 at altitude 2.2+, down to 0.05 at altitude 1.0
  const atmosphereAlt = Math.min(0.25, Math.max(0.05, (altitude - 1.0) * 0.17))

  const globeColors = {
    globeColor: '#000000',
    showAtmosphere: true,
    atmosphereColor: '#ffffff',
    atmosphereAltitude: atmosphereAlt,
    polygonCapColor: () => 'rgba(0,0,0,0)',
    polygonSideColor: () => 'rgba(0,0,0,0)',
    polygonStrokeColor: () => 'rgba(255,255,255,0.35)',
    pointColor: (d: object) => {
      const point = d as GlobePoint
      if (point.isChapterPin && point.chapterStatus !== 'Active') return 'rgba(255,255,255,0.45)'
      return point.isChapter ? '#ffffff' : 'rgba(255,255,255,0.3)'
    },
    arcColorConnected: ['#ffffff', '#ffffff'] as [string, string],
    arcColorIdle: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.15)'] as [string, string],
    ringColor: () => (t: number) => `rgba(255,255,255,${1 - t})`,
  }
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)

  const handleSelect = (city: CityData | null) => {
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
  const selectedCityRef = useRef(selectedCity)

  useLayoutEffect(() => {
    handleSelectRef.current = handleSelect
    selectedCityRef.current = selectedCity
  })

  useEffect(() => {
    fetch('/data/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then(setCountries)
      .catch((err: unknown) => console.error('Failed to fetch country polygons:', err))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const mobile = width < 768
        setIsMobile(mobile)
        const height = mobile ? Math.max(350, width * 0.9) : Math.max(500, width * 0.75)
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

      // Dispose Three.js resources to prevent memory leaks
      const globe = globeRef.current
      if (!globe) return

      const renderer = globe.renderer?.()
      const scene = globe.scene?.()
      const controls = globe.controls?.()

      if (controls) {
        controls.autoRotate = false
        controls.dispose?.()
      }

      if (scene) {
        scene.traverse((object: unknown) => {
          const obj = object as ThreeObject3D
          if (obj.geometry) {
            obj.geometry.dispose()
          }
          if (obj.material) {
            const materials = Array.isArray(obj.material)
              ? obj.material
              : [obj.material]
            for (const material of materials) {
              for (const key of Object.keys(material)) {
                const value = material[key]
                if (value && typeof value === 'object' && typeof (value as { dispose?: unknown }).dispose === 'function') {
                  (value as { dispose(): void }).dispose()
                }
              }
              material.dispose()
            }
          }
        })
      }

      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss?.()
      }
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

      // Mobile: enable touch gestures for rotate + pinch-to-zoom
      if (isMobile) {
        controls.enableRotate = true
        controls.enablePan = true
        controls.touches = { ONE: 0 /* ROTATE */, TWO: 2 /* DOLLY_PAN */ }
      }

      controls.addEventListener('change', () => {
        if (globeRef.current) {
          const pov = globeRef.current.pointOfView()
          if (pov && typeof pov.altitude === 'number') {
            setAltitude(pov.altitude)
          }
        }
      })
    }

    globeRef.current.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 2000)

    setTimeout(() => {
      if (controls && camera) {
        controls.maxDistance = camera.position.distanceTo(controls.target)
        controls.minDistance = 200 // prevent zooming close enough to hit the fade edge
      }
    }, 2100)
  }

  // Merge chapter pins into the city list for rendering
  // Chapter pins that don't overlap with member cities get added as extra points
  const allPoints = useMemo((): GlobePoint[] => {
    const memberCityIds = new Set(cities.map((c) => c.id))
    const extraChapterPoints: GlobePoint[] = chapterPins
      .filter((cp) => !memberCityIds.has(cp.id))
      .map((cp) => ({
        id: cp.id,
        name: cp.name,
        lat: cp.lat,
        lng: cp.lng,
        members: cp.members,
        isChapter: cp.isChapter,
        isChapterPin: true,
        chapterStatus: cp.chapterStatus,
      }))
    return [...cities, ...extraChapterPoints]
  }, [cities, chapterPins])

  const ringsData = useMemo(
    (): GlobeRing[] =>
      chapterPins.filter((cp) => cp.chapterStatus === 'Active').map((cp) => ({
        lat: cp.lat,
        lng: cp.lng,
        maxR: 14 + Math.log10(Math.max(cp.members, 1) + 1) * 6,
        propagationSpeed: 1.2,
        repeatPeriod: 1400,
      })),
    [chapterPins],
  )

  // Generate arcs connecting all locations
  const arcsData = useMemo((): GlobeArc[] => {
    if (allPoints.length < 2) return []
    const arcs: GlobeArc[] = []
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        arcs.push({
          startLat: allPoints[i]!.lat,
          startLng: allPoints[i]!.lng,
          endLat: allPoints[j]!.lat,
          endLng: allPoints[j]!.lng,
        })
      }
    }
    return arcs
  }, [allPoints])

  useEffect(() => {
    // Imperatively update the labels to bypass globe.gl's re-rendering logic
    const labels = document.querySelectorAll('.globe-zoom-label')
    labels.forEach((label) => {
      (label as HTMLElement).style.opacity = isZoomedIn ? '1' : '0'
    })
  }, [isZoomedIn])

  // Mobile: imperatively highlight city labels on hover/selection
  useEffect(() => {
    if (!isMobile) return
    const activeId = hoveredCity || selectedCity?.id
    const labels = document.querySelectorAll<HTMLElement>('[data-city-id]')
    labels.forEach((el) => {
      const id = el.getAttribute('data-city-id')
      const nameEl = el.querySelector<HTMLElement>('.globe-city-name')
      if (!nameEl) return
      if (id === activeId) {
        nameEl.style.color = 'var(--text-primary)'
      } else if (activeId) {
        nameEl.style.color = 'var(--text-dim)'
      } else {
        nameEl.style.color = nameEl.getAttribute('data-default-color') || 'var(--text-secondary)'
      }
    })
  }, [hoveredCity, selectedCity, isMobile])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible flex justify-center items-center min-h-[350px] md:min-h-[500px] bg-transparent"
      style={isMobile ? { touchAction: 'none' } : undefined}
      role="img"
      aria-label="Interactive globe showing SAGIE community locations worldwide"
    >
      <div
        className="relative z-0"
        style={{
          ...(isMobile ? { touchAction: 'none' } : {}),
          width: dimensions.width,
          height: dimensions.height,
          maskImage: isZoomedIn ? 'none' : `radial-gradient(circle, black ${30 + Math.min(altitude, 2.5) * 5}%, transparent ${60 + Math.min(altitude, 2.5) * 6}%)`,
          WebkitMaskImage: isZoomedIn ? 'none' : `radial-gradient(circle, black ${30 + Math.min(altitude, 2.5) * 5}%, transparent ${60 + Math.min(altitude, 2.5) * 6}%)`,
          transition: 'mask-image 0.5s ease, -webkit-mask-image 0.5s ease',
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
          {...(isMobile ? { onGlobeClick: ({ lat, lng }: { lat: number; lng: number }) => {
            // Mobile: find nearest city within 15° and select it
            let nearest: GlobePoint | null = null
            let minDist = Infinity
            for (const p of allPoints) {
              const dLat = p.lat - lat
              const dLng = p.lng - lng
              const dist = dLat * dLat + dLng * dLng
              if (dist < minDist) {
                minDist = dist
                nearest = p
              }
            }
            if (nearest && minDist < 15 * 15) {
              handleSelect(selectedCity?.id === nearest.id ? null : nearest)
            } else {
              handleSelect(null)
            }
          }} : {})}
          polygonsData={countries.features}
          polygonCapColor={globeColors.polygonCapColor}
          polygonSideColor={globeColors.polygonSideColor}
          polygonStrokeColor={globeColors.polygonStrokeColor}
          pointsData={allPoints}
          pointColor={(d: object) => {
            const point = d as GlobePoint
            // Desktop: highlight on hover only. Mobile: highlight on hover or selection.
            const activeId = isMobile ? (hoveredCity || selectedCity?.id) : hoveredCity
            if (activeId === point.id) return '#ffffff'
            return activeId
              ? 'rgba(255,255,255,0.15)'
              : globeColors.pointColor(d)
          }}
          pointAltitude={0.010}
          pointRadius={0.1}
          pointsMerge={false}
          ringsData={ringsData}
          ringColor={globeColors.ringColor}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={arcsData}
          arcColor={(d: object) => {
            const arc = d as GlobeArc
            // Desktop: highlight on hover only. Mobile: highlight on hover or selection.
            const activeId = isMobile ? (hoveredCity || selectedCity?.id) : hoveredCity
            if (!activeId) return globeColors.arcColorIdle
            const city = allPoints.find(c => c.id === activeId)
            const isConnected =
              arc.startLat === city?.lat || arc.endLat === city?.lat
            return isConnected ? globeColors.arcColorConnected : globeColors.arcColorIdle
          }}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcAltitudeAutoScale={0.3}
          arcStroke={0.3}
          {...(isMobile ? { lineHoverPrecision: 4 } : {})}
          onPointHover={(point: object | null) => {
            const p = point as GlobePoint | null
            setHoveredCity(p ? p.id : null)
          }}
          onPointClick={(point: object) => {
            const p = point as GlobePoint
            const city = allPoints.find(c => c.id === p.id)
            if (city) {
              handleSelect(selectedCity?.id === city.id ? null : city)
            }
          }}
          htmlElementsData={allPoints}
          htmlElement={(d: object) => {
            const point = d as GlobePoint
            const el = document.createElement('div')

            if (isMobile) {
              // Mobile: data attributes for imperative label highlighting + touch handling
              const defaultColor = point.isChapter ? 'var(--text-primary)' : 'var(--text-secondary)'
              el.setAttribute('data-city-id', point.id)
              el.innerHTML = `
                <div style="font-family: var(--font-bebas-neue, sans-serif); display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); padding-bottom: 6px; pointer-events: auto; touch-action: none; cursor: pointer;">
                  <div class="globe-city-name" data-default-color="${defaultColor}" style="font-size: 16px; letter-spacing: 0.1em; line-height: 1; color: ${defaultColor}; transition: color 0.15s;">${point.isChapter ? '★ ' : ''}${point.name}</div>
                  <div class="globe-zoom-label" style="font-family: var(--font-dm-sans, sans-serif); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px; transition: opacity 0.3s; opacity: 0;">${point.members} Members</div>
                </div>
              `
              const handleTap = (e: MouseEvent | TouchEvent) => {
                e.stopPropagation()
                e.preventDefault()
                const city = allPoints.find(c => c.id === point.id) || null
                const prev = selectedCityRef.current
                handleSelectRef.current(prev?.id === city?.id ? null : city)
              }
              el.addEventListener('touchend', handleTap, { passive: false })
              el.onclick = handleTap as (e: MouseEvent) => void
            } else {
              // Desktop: original behavior
              el.innerHTML = `
                <div style="font-family: var(--font-bebas-neue, sans-serif); display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); padding-bottom: 6px; pointer-events: auto; cursor: pointer;">
                  <div style="font-size: 24px; letter-spacing: 0.1em; line-height: 1; ${
                    point.isChapter ? 'color: var(--text-primary);' : 'color: var(--text-secondary);'
                  }">${point.isChapter ? '★ ' : ''}${point.name}</div>
                  <div class="globe-zoom-label" style="font-family: var(--font-dm-sans, sans-serif); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 4px; transition: opacity 0.3s; opacity: 0;">${point.members} Members</div>
                </div>
              `
              el.onclick = (e: MouseEvent) => {
                e.stopPropagation()
                const city = allPoints.find(c => c.id === point.id) || null
                const prev = selectedCityRef.current
                handleSelectRef.current(prev?.id === city?.id ? null : city)
              }
            }
            el.onmouseenter = () => setHoveredCity(point.id)
            el.onmouseleave = () => setHoveredCity(null)
            return el
          }}
        />
      </div>

      {/* Info card */}
      {selectedCity && (
        <div
          className={isMobile
            ? "absolute z-20 border border-border-default bg-background-card bottom-16 left-1/2 -translate-x-1/2 p-3 max-w-[200px]"
            : "absolute bottom-6 left-6 z-20 border border-border-default bg-background-card p-4"
          }
          style={isMobile ? undefined : { maxWidth: '240px' }}
        >
          <div
            className="text-label uppercase tracking-widest mb-2"
            style={{ color: selectedCity.isChapter ? 'var(--silver)' : 'var(--text-muted)' }}
          >
            {selectedCity.isChapter ? 'Active Chapter' : 'Community Hub'}
          </div>
          <div className={`font-display ${isMobile ? 'text-body' : 'text-manifesto'}`} style={{ color: 'var(--text-primary)' }}>
            {selectedCity.name}
          </div>
          <div className="text-caption mt-1" style={{ color: 'var(--text-muted)' }}>
            {selectedCity.members} Members
          </div>
          <div
            className="text-label mt-3 uppercase tracking-widest"
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
            aria-label="Close city details"
            className="absolute top-2 right-3 text-label cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            &#x2715;
          </button>
        </div>
      )}

      {/* Legend */}
      {isMobile ? (
        <div
          className="absolute z-20 bottom-2 left-0 right-0 flex gap-3 overflow-x-auto px-4 py-2"
        >
          {allPoints.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(selectedCity?.id === city.id ? null : city)}
              className="flex items-center gap-1.5 shrink-0"
              style={{
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                opacity: hoveredCity && hoveredCity !== city.id ? 0.4 : 1,
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: city.isChapter ? 'var(--text-primary)' : 'var(--text-dim)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: hoveredCity === city.id || selectedCity?.id === city.id
                    ? 'var(--text-primary)'
                    : city.isChapter
                      ? 'var(--silver)'
                      : 'var(--text-muted)',
                  transition: 'color 0.15s',
                }}
              >
                {city.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="absolute bottom-6 right-6 z-20"
          style={{ minWidth: '160px' }}
        >
          {allPoints.map((city) => (
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
                  color: hoveredCity === city.id || selectedCity?.id === city.id
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
                  color: hoveredCity === city.id ? 'var(--text-secondary)' : 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  marginLeft: 'auto',
                }}
              >
                {city.members}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
