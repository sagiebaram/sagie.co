'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface CircuitPoint {
  x: number
  y: number
  active: boolean
  activatedAt: number
}

interface CircuitPath {
  points: CircuitPoint[]
  segmentLengths: number[]
  totalLength: number
  pulseOffset: number
  pulseSpeed: number
  pulseDelay: number
  waitingToRestart: boolean
  restartAt: number
}

interface CircuitColors {
  line: string
  pulse: string
  dot: string
  dotActive: string
}

const DARK_COLORS: CircuitColors = {
  line: 'rgba(192, 192, 192, 0.08)',
  pulse: 'rgba(224, 224, 220, 0.35)',
  dot: 'rgba(192, 192, 192, 0.12)',
  dotActive: 'rgba(224, 224, 220, 0.5)',
}

const LIGHT_COLORS: CircuitColors = {
  line: 'rgba(58, 58, 56, 0.07)',
  pulse: 'rgba(10, 10, 10, 0.2)',
  dot: 'rgba(58, 58, 56, 0.1)',
  dotActive: 'rgba(10, 10, 10, 0.3)',
}

const PULSE_LENGTH = 40
const DOT_ACTIVE_DURATION = 300

function generatePaths(w: number, h: number): CircuitPath[] {
  const count = Math.min(60, Math.floor((w * h) / 28000))
  const paths: CircuitPath[] = []

  for (let i = 0; i < count; i++) {
    const points: CircuitPoint[] = []
    const segmentCount = 4 + Math.floor(Math.random() * 6)

    // Start from a random edge
    const edge = Math.floor(Math.random() * 4)
    let x: number, y: number
    switch (edge) {
      case 0: x = 0; y = Math.random() * h; break
      case 1: x = w; y = Math.random() * h; break
      case 2: x = Math.random() * w; y = 0; break
      default: x = Math.random() * w; y = h; break
    }
    points.push({ x, y, active: false, activatedAt: 0 })

    // Pick initial direction: 0=right, 1=down, 2=left, 3=up
    let dir = Math.floor(Math.random() * 4)

    for (let s = 0; s < segmentCount; s++) {
      const len = 80 + Math.random() * 140
      let nx = x, ny = y

      switch (dir) {
        case 0: nx = x + len; break
        case 1: ny = y + len; break
        case 2: nx = x - len; break
        case 3: ny = y - len; break
      }

      // Clamp to canvas
      nx = Math.max(0, Math.min(w, nx))
      ny = Math.max(0, Math.min(h, ny))

      x = nx
      y = ny
      points.push({ x, y, active: false, activatedAt: 0 })

      // Turn 90 degrees (randomly left or right)
      if (dir === 0 || dir === 2) {
        dir = Math.random() > 0.5 ? 1 : 3
      } else {
        dir = Math.random() > 0.5 ? 0 : 2
      }
    }

    // Compute segment lengths and total
    const segmentLengths: number[] = []
    let totalLength = 0
    for (let j = 1; j < points.length; j++) {
      const dx = points[j]!.x - points[j - 1]!.x
      const dy = points[j]!.y - points[j - 1]!.y
      const len = Math.sqrt(dx * dx + dy * dy)
      segmentLengths.push(len)
      totalLength += len
    }

    paths.push({
      points,
      segmentLengths,
      totalLength,
      pulseOffset: Math.random() * totalLength,
      pulseSpeed: 120 + Math.random() * 60,
      pulseDelay: 500 + Math.random() * 2000,
      waitingToRestart: false,
      restartAt: 0,
    })
  }

  return paths
}

function getPositionOnPath(
  points: CircuitPoint[],
  segmentLengths: number[],
  offset: number
): { x: number; y: number } {
  let remaining = offset
  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i]!
    const p0 = points[i]!
    const p1 = points[i + 1]!
    if (remaining <= segLen) {
      const t = remaining / segLen
      return {
        x: p0.x + (p1.x - p0.x) * t,
        y: p0.y + (p1.y - p0.y) * t,
      }
    }
    remaining -= segLen
  }
  const last = points[points.length - 1]!
  return { x: last.x, y: last.y }
}

function drawPulseSegment(
  ctx: CanvasRenderingContext2D,
  points: CircuitPoint[],
  segmentLengths: number[],
  totalLength: number,
  pulseCenter: number,
  color: string
) {
  const halfPulse = PULSE_LENGTH / 2
  const start = Math.max(0, pulseCenter - halfPulse)
  const end = Math.min(totalLength, pulseCenter + halfPulse)
  if (start >= end) return

  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()

  const steps = 12
  const step = (end - start) / steps
  let moved = false
  for (let i = 0; i <= steps; i++) {
    const pos = getPositionOnPath(points, segmentLengths, start + step * i)
    if (!moved) {
      ctx.moveTo(pos.x, pos.y)
      moved = true
    } else {
      ctx.lineTo(pos.x, pos.y)
    }
  }
  ctx.stroke()
}

function draw(
  ctx: CanvasRenderingContext2D,
  paths: CircuitPath[],
  colors: CircuitColors,
  now: number,
  dt: number
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const path of paths) {
    // Update pulse
    if (path.waitingToRestart) {
      if (now >= path.restartAt) {
        path.waitingToRestart = false
        path.pulseOffset = 0
      }
    } else {
      path.pulseOffset += path.pulseSpeed * dt

      // Check if pulse passed any node — activate dots
      let accumulated = 0
      for (let i = 0; i < path.segmentLengths.length; i++) {
        accumulated += path.segmentLengths[i]!
        const dist = Math.abs(path.pulseOffset - accumulated)
        if (dist < PULSE_LENGTH / 2 + 5) {
          const node = path.points[i + 1]
          if (node) { node.active = true; node.activatedAt = now }
        }
      }
      // Also first point
      if (path.pulseOffset < PULSE_LENGTH / 2 + 5) {
        const first = path.points[0]
        if (first) { first.active = true; first.activatedAt = now }
      }

      if (path.pulseOffset > path.totalLength + PULSE_LENGTH) {
        path.waitingToRestart = true
        path.restartAt = now + path.pulseDelay
      }
    }

    // Deactivate dots after duration
    for (const pt of path.points) {
      if (pt.active && now - pt.activatedAt > DOT_ACTIVE_DURATION) {
        pt.active = false
      }
    }

    // Draw base trace
    ctx.strokeStyle = colors.line
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(path.points[0]!.x, path.points[0]!.y)
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i]!.x, path.points[i]!.y)
    }
    ctx.stroke()

    // Draw dots
    for (const pt of path.points) {
      ctx.fillStyle = pt.active ? colors.dotActive : colors.dot
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.active ? 2.5 : 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw pulse
    if (!path.waitingToRestart) {
      drawPulseSegment(
        ctx,
        path.points,
        path.segmentLengths,
        path.totalLength,
        path.pulseOffset,
        colors.pulse
      )
    }
  }
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const animationRef = useRef<number>(0)
  const pathsRef = useRef<CircuitPath[]>([])
  const colorsRef = useRef<CircuitColors>(DARK_COLORS)
  const lastTimeRef = useRef<number>(0)

  colorsRef.current = resolvedTheme === 'light' ? LIGHT_COLORS : DARK_COLORS

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)

    pathsRef.current = generatePaths(w, h)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setupCanvas()

    // If reduced motion, draw static frame and stop
    if (prefersReduced) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas) {
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        ctx.clearRect(0, 0, w, h)
        for (const path of pathsRef.current) {
          ctx.strokeStyle = colorsRef.current.line
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(path.points[0]!.x, path.points[0]!.y)
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i]!.x, path.points[i]!.y)
          }
          ctx.stroke()
          for (const pt of path.points) {
            ctx.fillStyle = colorsRef.current.dot
            ctx.beginPath()
            ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      return
    }

    // Animation loop
    lastTimeRef.current = performance.now()

    function loop(time: number) {
      if (document.hidden) {
        lastTimeRef.current = time
        animationRef.current = requestAnimationFrame(loop)
        return
      }

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = time

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        draw(ctx, pathsRef.current, colorsRef.current, time, dt)
      }

      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setupCanvas()
      }, 150)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [setupCanvas])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
