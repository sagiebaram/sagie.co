'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Globe = dynamic(() => import('react-globe.gl').then((mod) => mod.default) as any, {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface-elevated">
      <div className="w-8 h-8 border-2 border-border-faint border-t-globe-cyan rounded-full animate-spin" />
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
        maxR: 12,
        propagationSpeed: 1,
        repeatPeriod: 1500,
      })),
    [],
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex justify-center items-center min-h-[400px] bg-surface-globe border border-border-faint mt-px"
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
          globeColor="var(--color-surface-globe)"
          showAtmosphere
          atmosphereColor="var(--color-globe-cyan)"
          atmosphereAltitude={0.25}
          polygonsData={countries.features}
          polygonCapColor={() => 'rgba(0,0,0,0)'}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={() => 'var(--color-globe-cyan)'}
          pointsData={[...MOCK_CITIES]}
          pointColor={() => 'var(--color-globe-cyan)'}
          pointAltitude={0.02}
          pointRadius={(d: any) => (d.isChapter ? 0.6 : 0.3)}
          pointsMerge={false}
          ringsData={ringsData}
          ringColor={() => (t: number) => `rgba(0,255,255,${1 - t})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          arcsData={[...MOCK_ARCS]}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcAltitudeAutoScale={0.3}
          arcStroke={1}
          htmlElementsData={[...MOCK_CITIES]}
          htmlElement={(d: any) => {
            const el = document.createElement('div')
            el.innerHTML = `
              <div style="color: #fff; font-family: var(--font-bebas-neue, sans-serif); display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); padding-bottom: 6px; pointer-events: none; text-shadow: 0 0 10px var(--color-globe-cyan), 0 0 20px var(--color-globe-cyan), 0 0 30px var(--color-globe-blue);">
                <div style="font-size: 24px; letter-spacing: 0.1em; line-height: 1;">${d.name}</div>
                <div style="font-family: var(--font-dm-sans, sans-serif); font-size: 11px; color: var(--color-globe-label); text-transform: uppercase; letter-spacing: var(--tracking-mid);">${d.members} Members</div>
                ${d.isChapter ? `<div style="font-family: var(--font-dm-sans, sans-serif); font-size: 9px; color: var(--color-globe-cyan); letter-spacing: 0.25em; text-transform: uppercase; margin-top: 4px; font-weight: bold;">\u2605 Active Chapter</div>` : ''}
              </div>
            `
            return el
          }}
        />
      </div>
    </div>
  )
}
