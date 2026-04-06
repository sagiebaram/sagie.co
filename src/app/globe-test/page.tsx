'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'


const Globe = dynamic(() => import('react-globe.gl').then((mod) => mod.default) as any, {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
}) as any

// ── Data ──
const CITIES = [
  { id: 'miami', name: 'Miami', lat: 25.7617, lng: -80.1918, members: 120, isChapter: true },
  { id: 'new-york', name: 'New York', lat: 40.7128, lng: -74.006, members: 85, isChapter: true },
  { id: 'dallas', name: 'Dallas', lat: 32.7767, lng: -96.797, members: 45, isChapter: false },
  { id: 'tel-aviv', name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, members: 200, isChapter: true },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198, members: 30, isChapter: false },
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lng: 55.2708, members: 60, isChapter: true },
  { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278, members: 70, isChapter: true },
  { id: 'los-angeles', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, members: 50, isChapter: false },
  { id: 'san-francisco', name: 'San Francisco', lat: 37.7749, lng: -122.4194, members: 40, isChapter: false },
  { id: 'chicago', name: 'Chicago', lat: 41.8781, lng: -87.6298, members: 35, isChapter: false },
  { id: 'austin', name: 'Austin', lat: 30.2672, lng: -97.7431, members: 25, isChapter: false },
  { id: 'boston', name: 'Boston', lat: 42.3601, lng: -71.0589, members: 20, isChapter: false },
]
const CHAPTERS = CITIES.filter((c) => c.isChapter)

// ── Full config ──
interface Cfg {
  // Globe surface
  globeColor: string
  globeImage: string
  showGlobe: boolean
  showGraticules: boolean
  // Atmosphere
  showAtmosphere: boolean
  atmoColor: string
  atmoAlt: number
  // Polygons
  strokeColor: string
  fillColor: string
  polygonAlt: number
  // Points
  pointColor: string
  pointSize: number
  pointAlt: number
  pointRes: number
  // Arcs
  arcMode: 'all' | 'chapters' | 'nearest' | 'none'
  arcColor: string
  arcStroke: number
  arcSpeed: number
  arcDashLen: number
  arcDashGap: number
  arcAltScale: number
  // Rings
  rings: boolean
  ringMaxR: number
  ringSpeed: number
  ringRepeat: number
  // Labels (3D text)
  showLabels: boolean
  labelSize: number
  labelColor: string
  labelAlt: number
  labelDotSize: number
  // Hex bins
  showHexBins: boolean
  hexRes: number
  hexMargin: number
  hexAltScale: number
  hexTopColor: string
  hexSideColor: string
  // Heatmap
  showHeatmap: boolean
  heatmapBandwidth: number
  heatmapTopAlt: number
  heatmapBaseAlt: number
  heatmapSaturation: number
  // Hex polygons (alternative borders)
  showHexPolygons: boolean
  hexPolyRes: number
  hexPolyMargin: number
  hexPolyAlt: number
  hexPolyColor: string
  hexPolyDots: boolean
  // Camera
  rotateSpeed: number
  camAlt: number
  camLat: number
  // Mask
  mask: 'radial' | 'none' | 'vignette'
}

const GLOBE_IMAGES: Record<string, string> = {
  none: '',
  'earth-night': '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg',
  'earth-blue': '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg',
  'earth-dark': '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg',
  'earth-water': '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png',
  'earth-topology': '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png',
}

const DEFAULT_CFG: Cfg = {
  globeColor: '#000000', globeImage: '', showGlobe: true, showGraticules: false,
  showAtmosphere: true, atmoColor: '#ffffff', atmoAlt: 0.25,
  strokeColor: 'rgba(255,255,255,0.35)', fillColor: 'rgba(0,0,0,0)', polygonAlt: 0.01,
  pointColor: '#ffffff', pointSize: 0.5, pointAlt: 0.02, pointRes: 6,
  arcMode: 'all', arcColor: 'rgba(255,255,255,0.15)', arcStroke: 0.3, arcSpeed: 3000,
  arcDashLen: 0.4, arcDashGap: 0.2, arcAltScale: 0.3,
  rings: true, ringMaxR: 14, ringSpeed: 1.2, ringRepeat: 1400,
  showLabels: false, labelSize: 0.6, labelColor: '#ffffff', labelAlt: 0.01, labelDotSize: 0.3,
  showHexBins: false, hexRes: 3, hexMargin: 0.4, hexAltScale: 0.5, hexTopColor: '#ffffff', hexSideColor: 'rgba(255,255,255,0.2)',
  showHeatmap: false, heatmapBandwidth: 3, heatmapTopAlt: 0.05, heatmapBaseAlt: 0.001, heatmapSaturation: 1,
  showHexPolygons: false, hexPolyRes: 3, hexPolyMargin: 0.3, hexPolyAlt: 0.01, hexPolyColor: 'rgba(255,255,255,0.1)', hexPolyDots: false,
  rotateSpeed: 0.8, camAlt: 2.2, camLat: 30, mask: 'radial',
}

interface Preset extends Partial<Cfg> { name: string; desc: string }

const PRESETS: Record<string, Preset> = {
  current: {
    name: 'Current', desc: 'Production globe — pure black, white outlines, all-to-all arcs',
  },
  minimal: {
    name: 'Minimal', desc: 'No arcs, no rings, ghost borders — pure dot map',
    atmoAlt: 0.12, strokeColor: 'rgba(255,255,255,0.06)', pointSize: 0.6, pointAlt: 0.03,
    arcMode: 'none', rings: false, rotateSpeed: 0.5, camAlt: 2.4, camLat: 20,
  },
  cyber: {
    name: 'Cyan Tech', desc: 'Cyan glow, navy globe, chapter arcs',
    globeColor: '#0a1628', atmoColor: '#00d4ff', atmoAlt: 0.30,
    strokeColor: 'rgba(0,212,255,0.25)', fillColor: 'rgba(0,212,255,0.03)',
    pointColor: '#00d4ff', pointSize: 0.6, pointAlt: 0.03,
    arcMode: 'chapters', arcColor: 'rgba(0,212,255,0.2)', arcStroke: 0.4, arcSpeed: 2500,
    rotateSpeed: 0.6, camAlt: 2.0, camLat: 25,
  },
  warm: {
    name: 'Gold Network', desc: 'Warm gold tones — premium feel',
    globeColor: '#111111', atmoColor: '#f0c040', atmoAlt: 0.20,
    strokeColor: 'rgba(255,255,255,0.15)', fillColor: 'rgba(255,255,255,0.02)',
    pointColor: '#f0c040', arcMode: 'chapters', arcColor: 'rgba(240,192,64,0.2)', arcStroke: 0.35, arcSpeed: 3500,
  },
  violet: {
    name: 'Violet Haze', desc: 'Purple atmosphere, violet strokes',
    globeColor: '#0a0a1a', atmoColor: '#a78bfa', atmoAlt: 0.28,
    strokeColor: 'rgba(167,139,250,0.25)', fillColor: 'rgba(167,139,250,0.03)',
    pointColor: '#a78bfa', pointSize: 0.55, pointAlt: 0.025,
    arcMode: 'nearest', arcColor: 'rgba(167,139,250,0.2)', arcStroke: 0.35, arcSpeed: 2800,
    rotateSpeed: 0.7, camAlt: 2.1, camLat: 25,
  },
  clean: {
    name: 'Clean White', desc: 'No mask, no arcs — let the globe breathe',
    globeColor: '#0d1117', atmoAlt: 0.18,
    strokeColor: 'rgba(255,255,255,0.15)', fillColor: 'rgba(255,255,255,0.02)',
    pointSize: 0.45, pointAlt: 0.015,
    arcMode: 'none', rings: false, rotateSpeed: 1.0, camAlt: 2.5, camLat: 15, mask: 'none',
  },
  dense: {
    name: 'Dense Network', desc: 'Heavy arcs, big points — network density',
    atmoAlt: 0.22, pointSize: 0.8, pointAlt: 0.04,
    arcStroke: 0.5, arcSpeed: 2000, rotateSpeed: 0.6, camAlt: 1.9,
  },
  emerald: {
    name: 'Emerald Glow', desc: 'Green atmosphere, chapter arcs',
    globeColor: '#0a0a0a', atmoColor: '#00ff88', atmoAlt: 0.22,
    strokeColor: 'rgba(255,255,255,0.15)', fillColor: 'rgba(0,255,136,0.02)',
    pointColor: '#00ff88', pointSize: 0.55, pointAlt: 0.025,
    arcMode: 'chapters', arcColor: 'rgba(0,255,136,0.15)', arcStroke: 0.35, arcSpeed: 3200,
    rotateSpeed: 0.7, camLat: 25,
  },
  textured: {
    name: 'Earth Night', desc: 'Real earth texture with labeled chapters',
    globeImage: '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg',
    globeColor: '#000000', atmoColor: '#4fc3f7', atmoAlt: 0.15,
    strokeColor: 'transparent', fillColor: 'rgba(0,0,0,0)',
    pointColor: '#ffffff', pointSize: 0.5, pointAlt: 0.03,
    showLabels: true, labelColor: '#ffffff', labelSize: 0.5, labelAlt: 0.015,
    arcMode: 'chapters', arcColor: 'rgba(255,255,255,0.2)', arcStroke: 0.3, arcSpeed: 3000,
    rings: true, rotateSpeed: 0.5, camAlt: 2.0, camLat: 25, mask: 'none',
  },
  heatmap: {
    name: 'Heatmap', desc: 'Member density heatmap overlay',
    showHeatmap: true, heatmapBandwidth: 4, heatmapTopAlt: 0.08,
    globeColor: '#0a0a1a', atmoColor: '#ff6b6b', atmoAlt: 0.18,
    strokeColor: 'rgba(255,255,255,0.06)', fillColor: 'rgba(0,0,0,0)',
    pointColor: '#ffffff', pointSize: 0.3, arcMode: 'none', rings: false,
    rotateSpeed: 0.5, camAlt: 2.0, camLat: 25,
  },
  hexworld: {
    name: 'Hex World', desc: 'Hexagonal country borders with hex bins',
    showHexPolygons: true, hexPolyRes: 3, hexPolyMargin: 0.3, hexPolyAlt: 0.006, hexPolyColor: 'rgba(255,255,255,0.08)',
    showHexBins: true, hexRes: 3, hexMargin: 0.4, hexAltScale: 1.0, hexTopColor: '#00d4ff', hexSideColor: 'rgba(0,212,255,0.3)',
    globeColor: '#0a0a1a', atmoColor: '#00d4ff', atmoAlt: 0.20,
    strokeColor: 'transparent', fillColor: 'rgba(0,0,0,0)',
    pointColor: '#00d4ff', pointSize: 0.3, arcMode: 'none', rings: false,
    rotateSpeed: 0.6, camAlt: 2.0, camLat: 25,
  },
}

// ── Palettes ──
const P = {
  globe: ['#000000', '#0a0a1a', '#0d1117', '#0a1628', '#111111', '#1a0a0a'],
  atmo: ['#ffffff', '#00d4ff', '#4fc3f7', '#a78bfa', '#f0c040', '#ff6b6b', '#00ff88'],
  stroke: ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.06)', 'rgba(0,212,255,0.25)', 'rgba(167,139,250,0.25)', 'transparent'],
  fill: ['rgba(0,0,0,0)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)', 'rgba(0,212,255,0.03)', 'rgba(167,139,250,0.03)'],
  point: ['#ffffff', '#00d4ff', '#4fc3f7', '#a78bfa', '#f0c040', '#ff6b6b', '#00ff88'],
  arc: ['rgba(255,255,255,0.15)', 'rgba(0,212,255,0.2)', 'rgba(167,139,250,0.2)', 'rgba(240,192,64,0.2)', 'rgba(255,107,107,0.2)', 'rgba(0,255,136,0.15)'],
  solid: ['#ffffff', '#00d4ff', '#4fc3f7', '#a78bfa', '#f0c040', '#ff6b6b', '#00ff88', '#C0C0C0'],
  hexPoly: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.15)', 'rgba(0,212,255,0.1)', 'rgba(167,139,250,0.1)', 'rgba(0,255,136,0.08)'],
}

// ── Arc / Ring / Label / Hex generators ──
function makeArcs(mode: Cfg['arcMode']) {
  if (mode === 'none') return []
  const arcs: { startLat: number; startLng: number; endLat: number; endLng: number }[] = []
  const src = mode === 'chapters' ? CHAPTERS : CITIES
  if (mode === 'all' || mode === 'chapters') {
    for (let i = 0; i < src.length; i++) {
      for (let j = i + 1; j < src.length; j++) {
        const source = src[i]
        const target = src[j]
        if (source && target) {
          arcs.push({ startLat: source.lat, startLng: source.lng, endLat: target.lat, endLng: target.lng })
        }
      }
    }
  } else {
    const seen = new Set<string>()
    for (const c of CITIES) {
      CITIES.filter((o) => o.id !== c.id)
        .map((o) => ({ ...o, d: Math.hypot(o.lat - c.lat, o.lng - c.lng) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach((n) => {
          const k = [c.id, n.id].sort().join('|')
          if (!seen.has(k)) { seen.add(k); arcs.push({ startLat: c.lat, startLng: c.lng, endLat: n.lat, endLng: n.lng }) }
        })
    }
  }
  return arcs
}

// ── UI primitives ──
function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-5 h-5 rounded border border-white/15 transition-transform hover:scale-110"
      style={{
        background: color === 'transparent' || color === 'rgba(0,0,0,0)'
          ? 'repeating-conic-gradient(#333 0% 25%, #555 0% 50%) 50%/8px 8px' : color,
        outline: selected ? '2px solid #C0C0C0' : 'none', outlineOffset: '2px',
      }} title={color} />
  )
}

function SwatchRow({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) {
  return <div className="flex gap-1.5 flex-wrap">{colors.map((c) => <Swatch key={c} color={c} selected={value === c} onClick={() => onChange(c)} />)}</div>
}

function Sl({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-[#6E6D69] min-w-[70px]">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="flex-1 h-1 accent-[#C0C0C0]" />
      <span className="text-[11px] text-[#B0AFAB] min-w-[36px] text-right tabular-nums">{display}</span>
    </div>
  )
}

function Btn<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[]; value: T; onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 text-[11px] tracking-wide border transition-all cursor-pointer ${
            value === o.value ? 'bg-[#C0C0C0] text-[#0C0C0C] border-[#C0C0C0]'
              : 'bg-[#0C0C0C] text-[#B0AFAB] border-white/15 hover:text-white hover:border-[#C0C0C0]'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`flex items-center gap-2 text-[11px] transition-all cursor-pointer ${value ? 'text-white' : 'text-[#6E6D69]'}`}>
      <span className={`w-3 h-3 rounded-sm border ${value ? 'bg-[#C0C0C0] border-[#C0C0C0]' : 'border-white/25'}`} />
      {label}
    </button>
  )
}

function H4({ children }: { children: string }) {
  return <h4 className="text-[10px] uppercase tracking-[0.18em] text-[#6E6D69] mt-2">{children}</h4>
}

function Section({ title, children, collapsed, onToggle }: { title: string; children: React.ReactNode; collapsed: boolean; onToggle: () => void }) {
  return (
    <div>
      <button onClick={onToggle} className="flex items-center gap-2 w-full text-left cursor-pointer group">
        <span className="text-[10px] text-[#6E6D69] group-hover:text-white transition-colors">{collapsed ? '▸' : '▾'}</span>
        <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#B0AFAB] group-hover:text-white transition-colors font-medium">{title}</h3>
      </button>
      {!collapsed && <div className="flex flex-col gap-2 mt-2 ml-3">{children}</div>}
    </div>
  )
}

// ── Page ──
export default function GlobeTestPage() {
  const globeRef = useRef<any>(null)
  const [cfg, setCfg] = useState<Cfg>({ ...DEFAULT_CFG })
  const [activePreset, setActivePreset] = useState('current')
  const [countries, setCountries] = useState<any[]>([])
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const set = useCallback((patch: Partial<Cfg>) => setCfg((prev) => ({ ...prev, ...patch })), [])
  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    fetch('/data/ne_110m_admin_0_countries.geojson')
      .then((r) => r.json()).then((d) => setCountries(d.features)).catch(console.warn)
  }, [])

  useEffect(() => {
    const update = () => setDims({ w: Math.max(400, window.innerWidth - 340), h: window.innerHeight - 56 })
    update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const g = globeRef.current; if (!g) return
    const c = g.controls(); if (c) { c.autoRotate = true; c.autoRotateSpeed = cfg.rotateSpeed; c.enableZoom = true }
  }, [cfg.rotateSpeed])

  useEffect(() => {
    globeRef.current?.pointOfView({ lat: cfg.camLat, lng: -40, altitude: cfg.camAlt }, 800)
  }, [cfg.camAlt, cfg.camLat])

  const loadPreset = (key: string) => {
    const p = PRESETS[key]; if (!p) return
    const { name: _, desc: __, ...overrides } = p
    setCfg({ ...DEFAULT_CFG, ...overrides })
    setActivePreset(key)
  }

  const arcsData = useMemo(() => makeArcs(cfg.arcMode), [cfg.arcMode])

  const ringsData = useMemo(() => {
    if (!cfg.rings) return []
    return CHAPTERS.map((c) => ({
      lat: c.lat, lng: c.lng,
      maxR: cfg.ringMaxR + Math.log10(Math.max(c.members, 1) + 1) * 6,
      propagationSpeed: cfg.ringSpeed, repeatPeriod: cfg.ringRepeat,
    }))
  }, [cfg.rings, cfg.ringMaxR, cfg.ringSpeed, cfg.ringRepeat])

  const labelsData = useMemo(() => {
    if (!cfg.showLabels) return []
    return CITIES.map((c) => ({ lat: c.lat, lng: c.lng, text: c.name, size: c.isChapter ? cfg.labelSize : cfg.labelSize * 0.7 }))
  }, [cfg.showLabels, cfg.labelSize])

  const hexBinData = useMemo(() => {
    if (!cfg.showHexBins) return []
    return CITIES.map((c) => ({ lat: c.lat, lng: c.lng, weight: c.members }))
  }, [cfg.showHexBins])

  const heatmapData = useMemo(() => {
    if (!cfg.showHeatmap) return []
    return [{ points: CITIES.map((c) => ({ lat: c.lat, lng: c.lng, weight: c.members / 200 })) }]
  }, [cfg.showHeatmap])

  const hexPolyData = useMemo(() => {
    if (!cfg.showHexPolygons) return []
    return countries
  }, [cfg.showHexPolygons, countries])

  const ringColorFn = useCallback(() => {
    const c = cfg.pointColor
    if (c === '#ffffff') return (t: number) => `rgba(255,255,255,${1 - t})`
    const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16)
    return (t: number) => `rgba(${r},${g},${b},${1 - t})`
  }, [cfg.pointColor])

  const maskStyle = cfg.mask === 'radial' ? 'radial-gradient(circle, black 42%, transparent 72%)'
    : cfg.mask === 'vignette' ? 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 90%)' : 'none'

  const preset = PRESETS[activePreset]

  return (
    <div className="flex h-screen bg-[#0C0C0C] text-[#EDECEA]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* ── Sidebar ── */}
      <div className="w-[320px] min-w-[320px] bg-[#141414] border-r border-white/15 overflow-y-auto p-4 flex flex-col gap-3 pt-[68px]">

        <Section title="Globe Surface" collapsed={!!collapsed.globe} onToggle={() => toggle('globe')}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.globe} value={cfg.globeColor} onChange={(c) => set({ globeColor: c })} />
          </div>
          <H4>Texture</H4>
          <Btn options={Object.keys(GLOBE_IMAGES).map((k) => ({ label: k === 'none' ? 'None' : k.replace('earth-', ''), value: k }))}
            value={Object.keys(GLOBE_IMAGES).find((k) => GLOBE_IMAGES[k] === cfg.globeImage) || 'none'}
            onChange={(v) => set({ globeImage: GLOBE_IMAGES[v] || '' })} />
          <div className="flex gap-4">
            <Toggle label="Show Globe" value={cfg.showGlobe} onChange={(v) => set({ showGlobe: v })} />
            <Toggle label="Graticules" value={cfg.showGraticules} onChange={(v) => set({ showGraticules: v })} />
          </div>
        </Section>

        <Section title="Atmosphere" collapsed={!!collapsed.atmo} onToggle={() => toggle('atmo')}>
          <Toggle label="Show Atmosphere" value={cfg.showAtmosphere} onChange={(v) => set({ showAtmosphere: v })} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.atmo} value={cfg.atmoColor} onChange={(c) => set({ atmoColor: c })} />
          </div>
          <Sl label="Intensity" value={cfg.atmoAlt} min={0} max={0.5} step={0.01} display={cfg.atmoAlt.toFixed(2)} onChange={(v) => set({ atmoAlt: v })} />
        </Section>

        <Section title="Country Polygons" collapsed={!!collapsed.poly} onToggle={() => toggle('poly')}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Stroke</span>
            <SwatchRow colors={P.stroke} value={cfg.strokeColor} onChange={(c) => set({ strokeColor: c })} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Fill</span>
            <SwatchRow colors={P.fill} value={cfg.fillColor} onChange={(c) => set({ fillColor: c })} />
          </div>
          <Sl label="Altitude" value={cfg.polygonAlt} min={0} max={0.1} step={0.005} display={cfg.polygonAlt.toFixed(3)} onChange={(v) => set({ polygonAlt: v })} />
        </Section>

        <Section title="Points" collapsed={!!collapsed.pts} onToggle={() => toggle('pts')}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.point} value={cfg.pointColor} onChange={(c) => set({ pointColor: c })} />
          </div>
          <Sl label="Size" value={cfg.pointSize} min={0.1} max={1.5} step={0.05} display={cfg.pointSize.toFixed(2)} onChange={(v) => set({ pointSize: v })} />
          <Sl label="Altitude" value={cfg.pointAlt} min={0} max={0.1} step={0.005} display={cfg.pointAlt.toFixed(3)} onChange={(v) => set({ pointAlt: v })} />
          <Sl label="Resolution" value={cfg.pointRes} min={3} max={32} step={1} display={String(cfg.pointRes)} onChange={(v) => set({ pointRes: v })} />
        </Section>

        <Section title="Arcs" collapsed={!!collapsed.arcs} onToggle={() => toggle('arcs')}>
          <Btn options={[
            { label: 'All', value: 'all' as const }, { label: 'Chapters', value: 'chapters' as const },
            { label: 'Nearest 3', value: 'nearest' as const }, { label: 'None', value: 'none' as const },
          ]} value={cfg.arcMode} onChange={(v) => set({ arcMode: v })} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.arc} value={cfg.arcColor} onChange={(c) => set({ arcColor: c })} />
          </div>
          <Sl label="Stroke" value={cfg.arcStroke} min={0.1} max={1.0} step={0.05} display={cfg.arcStroke.toFixed(2)} onChange={(v) => set({ arcStroke: v })} />
          <Sl label="Speed" value={cfg.arcSpeed} min={500} max={8000} step={250} display={String(cfg.arcSpeed)} onChange={(v) => set({ arcSpeed: v })} />
          <Sl label="Dash Len" value={cfg.arcDashLen} min={0.1} max={2} step={0.1} display={cfg.arcDashLen.toFixed(1)} onChange={(v) => set({ arcDashLen: v })} />
          <Sl label="Dash Gap" value={cfg.arcDashGap} min={0} max={2} step={0.1} display={cfg.arcDashGap.toFixed(1)} onChange={(v) => set({ arcDashGap: v })} />
          <Sl label="Alt Scale" value={cfg.arcAltScale} min={0} max={1} step={0.05} display={cfg.arcAltScale.toFixed(2)} onChange={(v) => set({ arcAltScale: v })} />
        </Section>

        <Section title="Rings" collapsed={!!collapsed.rings} onToggle={() => toggle('rings')}>
          <Toggle label="Show Rings" value={cfg.rings} onChange={(v) => set({ rings: v })} />
          <Sl label="Max Radius" value={cfg.ringMaxR} min={2} max={40} step={1} display={String(cfg.ringMaxR)} onChange={(v) => set({ ringMaxR: v })} />
          <Sl label="Speed" value={cfg.ringSpeed} min={0.1} max={5} step={0.1} display={cfg.ringSpeed.toFixed(1)} onChange={(v) => set({ ringSpeed: v })} />
          <Sl label="Repeat (ms)" value={cfg.ringRepeat} min={200} max={5000} step={100} display={String(cfg.ringRepeat)} onChange={(v) => set({ ringRepeat: v })} />
        </Section>

        <Section title="3D Labels" collapsed={!!collapsed.labels} onToggle={() => toggle('labels')}>
          <Toggle label="Show Labels" value={cfg.showLabels} onChange={(v) => set({ showLabels: v })} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.solid} value={cfg.labelColor} onChange={(c) => set({ labelColor: c })} />
          </div>
          <Sl label="Size" value={cfg.labelSize} min={0.1} max={2} step={0.1} display={cfg.labelSize.toFixed(1)} onChange={(v) => set({ labelSize: v })} />
          <Sl label="Altitude" value={cfg.labelAlt} min={0} max={0.1} step={0.005} display={cfg.labelAlt.toFixed(3)} onChange={(v) => set({ labelAlt: v })} />
          <Sl label="Dot Size" value={cfg.labelDotSize} min={0} max={1} step={0.05} display={cfg.labelDotSize.toFixed(2)} onChange={(v) => set({ labelDotSize: v })} />
        </Section>

        <Section title="Hex Bins" collapsed={!!collapsed.hex} onToggle={() => toggle('hex')}>
          <Toggle label="Show Hex Bins" value={cfg.showHexBins} onChange={(v) => set({ showHexBins: v })} />
          <Sl label="Resolution" value={cfg.hexRes} min={0} max={5} step={1} display={String(cfg.hexRes)} onChange={(v) => set({ hexRes: v })} />
          <Sl label="Margin" value={cfg.hexMargin} min={0} max={0.9} step={0.05} display={cfg.hexMargin.toFixed(2)} onChange={(v) => set({ hexMargin: v })} />
          <Sl label="Alt Scale" value={cfg.hexAltScale} min={0} max={3} step={0.1} display={cfg.hexAltScale.toFixed(1)} onChange={(v) => set({ hexAltScale: v })} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Top</span>
            <SwatchRow colors={P.solid} value={cfg.hexTopColor} onChange={(c) => set({ hexTopColor: c })} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Side</span>
            <SwatchRow colors={P.arc} value={cfg.hexSideColor} onChange={(c) => set({ hexSideColor: c })} />
          </div>
        </Section>

        <Section title="Heatmap" collapsed={!!collapsed.heat} onToggle={() => toggle('heat')}>
          <Toggle label="Show Heatmap" value={cfg.showHeatmap} onChange={(v) => set({ showHeatmap: v })} />
          <Sl label="Bandwidth" value={cfg.heatmapBandwidth} min={0.5} max={10} step={0.5} display={cfg.heatmapBandwidth.toFixed(1)} onChange={(v) => set({ heatmapBandwidth: v })} />
          <Sl label="Top Alt" value={cfg.heatmapTopAlt} min={0.01} max={0.3} step={0.01} display={cfg.heatmapTopAlt.toFixed(2)} onChange={(v) => set({ heatmapTopAlt: v })} />
          <Sl label="Base Alt" value={cfg.heatmapBaseAlt} min={0} max={0.05} step={0.001} display={cfg.heatmapBaseAlt.toFixed(3)} onChange={(v) => set({ heatmapBaseAlt: v })} />
          <Sl label="Saturation" value={cfg.heatmapSaturation} min={0} max={3} step={0.1} display={cfg.heatmapSaturation.toFixed(1)} onChange={(v) => set({ heatmapSaturation: v })} />
        </Section>

        <Section title="Hex Polygons" collapsed={!!collapsed.hexPoly} onToggle={() => toggle('hexPoly')}>
          <Toggle label="Show Hex Borders" value={cfg.showHexPolygons} onChange={(v) => set({ showHexPolygons: v })} />
          <Sl label="Resolution" value={cfg.hexPolyRes} min={1} max={6} step={1} display={String(cfg.hexPolyRes)} onChange={(v) => set({ hexPolyRes: v })} />
          <Sl label="Margin" value={cfg.hexPolyMargin} min={0} max={0.9} step={0.05} display={cfg.hexPolyMargin.toFixed(2)} onChange={(v) => set({ hexPolyMargin: v })} />
          <Sl label="Altitude" value={cfg.hexPolyAlt} min={0} max={0.1} step={0.002} display={cfg.hexPolyAlt.toFixed(3)} onChange={(v) => set({ hexPolyAlt: v })} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6E6D69] min-w-[70px]">Color</span>
            <SwatchRow colors={P.hexPoly} value={cfg.hexPolyColor} onChange={(c) => set({ hexPolyColor: c })} />
          </div>
          <Toggle label="Use Dots" value={cfg.hexPolyDots} onChange={(v) => set({ hexPolyDots: v })} />
        </Section>

        <Section title="Camera" collapsed={!!collapsed.cam} onToggle={() => toggle('cam')}>
          <Sl label="Rotation" value={cfg.rotateSpeed} min={0} max={3} step={0.1} display={cfg.rotateSpeed.toFixed(1)} onChange={(v) => set({ rotateSpeed: v })} />
          <Sl label="Altitude" value={cfg.camAlt} min={1.2} max={4} step={0.1} display={cfg.camAlt.toFixed(1)} onChange={(v) => set({ camAlt: v })} />
          <Sl label="Latitude" value={cfg.camLat} min={-60} max={60} step={5} display={String(cfg.camLat)} onChange={(v) => set({ camLat: v })} />
        </Section>

        <Section title="Mask" collapsed={!!collapsed.mask} onToggle={() => toggle('mask')}>
          <Btn options={[
            { label: 'Radial Fade', value: 'radial' as const },
            { label: 'None', value: 'none' as const },
            { label: 'Vignette', value: 'vignette' as const },
          ]} value={cfg.mask} onChange={(v) => set({ mask: v })} />
        </Section>
      </div>

      {/* ── Globe ── */}
      <div className="flex-1 relative flex items-center justify-center">
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0C0C0C]/85 backdrop-blur-xl border-b border-white/15 flex items-center justify-between px-10">
          <span className="text-lg font-bold tracking-[0.15em]">SAGIE — Globe Tester</span>
          <div className="flex gap-0.5 overflow-x-auto">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button key={key} onClick={() => loadPreset(key)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                  activePreset === key ? 'text-white border-white/15 bg-white/5' : 'text-[#6E6D69] border-transparent hover:text-white'
                }`}>{p.name}</button>
            ))}
          </div>
        </nav>

        <div className="absolute top-[72px] left-6 z-10 pointer-events-none">
          <div className="text-xl font-bold tracking-wide">{preset?.name}</div>
          <div className="text-[12px] text-[#6E6D69] max-w-[260px] leading-relaxed">{preset?.desc}</div>
        </div>

        <div style={{ maskImage: maskStyle, WebkitMaskImage: maskStyle, transition: 'mask-image 0.3s' }}>
          <Globe
            ref={globeRef}
            width={dims.w}
            height={dims.h}
            backgroundColor="rgba(0,0,0,0)"
            // Globe surface
            globeColor={cfg.globeColor}
            globeImageUrl={cfg.globeImage || null}
            showGlobe={cfg.showGlobe}
            showGraticules={cfg.showGraticules}
            // Atmosphere
            showAtmosphere={cfg.showAtmosphere}
            atmosphereColor={cfg.atmoColor}
            atmosphereAltitude={cfg.atmoAlt}
            // Polygons
            polygonsData={countries}
            polygonCapColor={() => cfg.fillColor}
            polygonSideColor={() => 'rgba(0,0,0,0)'}
            polygonStrokeColor={() => cfg.strokeColor}
            polygonAltitude={cfg.polygonAlt}
            // Points
            pointsData={CITIES}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => cfg.pointColor}
            pointAltitude={(d: any) => cfg.pointAlt + (d.members / 200) * 0.04}
            pointRadius={(d: any) => (d.isChapter ? cfg.pointSize + 0.1 : cfg.pointSize) + Math.log10(Math.max(d.members, 1) + 1) * 0.4}
            pointResolution={cfg.pointRes}
            pointsMerge={false}
            // Arcs
            arcsData={arcsData}
            arcColor={() => [cfg.arcColor, cfg.arcColor]}
            arcDashLength={cfg.arcDashLen}
            arcDashGap={cfg.arcDashGap}
            arcDashAnimateTime={cfg.arcSpeed}
            arcAltitudeAutoScale={cfg.arcAltScale}
            arcStroke={cfg.arcStroke}
            // Rings
            ringsData={ringsData}
            ringColor={ringColorFn}
            ringMaxRadius="maxR"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"
            // Labels
            labelsData={labelsData}
            labelText="text"
            labelSize="size"
            labelColor={() => cfg.labelColor}
            labelAltitude={cfg.labelAlt}
            labelIncludeDot={true}
            labelDotRadius={cfg.labelDotSize}
            labelResolution={3}
            // Hex bins
            hexBinPointsData={hexBinData}
            hexBinPointLat="lat"
            hexBinPointLng="lng"
            hexBinPointWeight="weight"
            hexBinResolution={cfg.hexRes}
            hexMargin={cfg.hexMargin}
            hexAltitude={(d: any) => d.sumWeight * 0.001 * cfg.hexAltScale}
            hexTopColor={() => cfg.hexTopColor}
            hexSideColor={() => cfg.hexSideColor}
            hexBinMerge={false}
            // Heatmap
            heatmapsData={heatmapData}
            heatmapPointLat="lat"
            heatmapPointLng="lng"
            heatmapPointWeight="weight"
            heatmapBandwidth={cfg.heatmapBandwidth}
            heatmapTopAltitude={cfg.heatmapTopAlt}
            heatmapBaseAltitude={cfg.heatmapBaseAlt}
            heatmapColorSaturation={cfg.heatmapSaturation}
            // Hex polygons
            hexPolygonsData={hexPolyData}
            hexPolygonColor={() => cfg.hexPolyColor}
            hexPolygonAltitude={cfg.hexPolyAlt}
            hexPolygonResolution={cfg.hexPolyRes}
            hexPolygonMargin={cfg.hexPolyMargin}
            hexPolygonUseDots={cfg.hexPolyDots}
          />
        </div>
      </div>
    </div>
  )
}
