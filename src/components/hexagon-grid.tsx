import { useReducedMotion } from 'motion/react'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import { useHexagonParticles } from '@/hooks/use-hexagon-particles'
import { UNIT_HEX_HEIGHT, useHexagons } from '@/hooks/use-hexagons'
import { useHexLattice } from '@/lib/hex-lattice'
import { cn } from '@/lib/utils'

const GOLDEN_ANGLE = 137.508 // degrees

// Lattice used on pages without a honeycomb, centered in the viewport.
const FALLBACK_HEX_WIDTH = 210
const FALLBACK_GAP = 4

// Extents grow in steps so small size changes (a scale step animating, the
// morph) don't rebuild the lattice and restart the particles every frame.
const EXTENT_STEP = 4

// Ambient glow diameter, in lattice cells.
const GLOW_SIZE = 2.4

export type HexagonGridProps = {
  particleCount?: number
  minDurationMs?: number
  maxDurationMs?: number
  /** Particle head radius as a fraction of a lattice cell's width. */
  radius?: number
  trailCount?: number
  trailSampleMs?: number
  trailMaxOpacity?: number
  cellMaxOpacity?: number
  glow?: boolean
  colors?: string[]
  randomizeColors?: boolean
  colorSaturation?: number
  colorLightness?: number
}

interface Box {
  /** Page (document) offset of the grid's top-left corner. */
  left: number
  top: number
  width: number
  height: number
}

/**
 * Background hex lattice. On the home page it draws the honeycomb's own
 * lattice: same cell size, with shared edges running down the middle of the
 * gaps between honeycomb cells, so each honeycomb cell sits in one lattice
 * cell. The lattice is built once in unit coordinates and placed with a single
 * transform, so following the honeycomb's morph only updates one attribute.
 */
export function HexagonGrid({
  particleCount: requestedParticleCount = 7,
  minDurationMs = 1800,
  maxDurationMs = 3400,
  radius = 0.016,
  trailCount = 48,
  trailSampleMs,
  trailMaxOpacity = 0.25,
  cellMaxOpacity = 0.08,
  glow = true,
  colors,
  randomizeColors = true,
  colorSaturation = 70,
  colorLightness = 60,
}: HexagonGridProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) {
      return
    }
    // Fires once on observe, then whenever the page area changes size.
    const observer = new ResizeObserver(() => {
      const rect = svg.getBoundingClientRect()
      setBox({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })
    })
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  const lattice = useHexLattice()
  const hexWidth = lattice?.hexWidth ?? FALLBACK_HEX_WIDTH
  const gap = lattice?.gap ?? FALLBACK_GAP
  // A lattice cell spans a honeycomb cell plus half the gap on every side.
  const unit = hexWidth + (2 * gap) / Math.sqrt(3)
  // Anchor cell center in the grid's own pixels; centered when there's no honeycomb.
  let originX = 0
  let originY = 0
  if (box) {
    originX = lattice ? lattice.originX - box.left : box.width / 2
    originY = lattice ? lattice.originY - box.top : box.height / 2
  }

  // Enough columns and rows on each side of the anchor to cover the box.
  const reachX = box ? Math.max(originX, box.width - originX) : 0
  const reachY = box ? Math.max(originY, box.height - originY) : 0
  const extent = {
    columns: Math.ceil((reachX / (unit * 0.75) + 1) / EXTENT_STEP) * EXTENT_STEP,
    rows: Math.ceil((reachY / (unit * UNIT_HEX_HEIGHT) + 1) / EXTENT_STEP) * EXTENT_STEP,
  }
  const { hexagons, vertices, vertexNeighbors } = useHexagons(
    box ? extent : { columns: 0, rows: -1 },
  )

  // Respect prefers-reduced-motion: keep the static hex cells, drop the
  // continuously-animating particles/trails entirely.
  const prefersReducedMotion = useReducedMotion()
  const particleCount = prefersReducedMotion ? 0 : requestedParticleCount

  // The lattice is drawn in unit coordinates (one cell wide), so a radius
  // given as a fraction of a cell scales with the honeycomb.
  const particleRadius = radius

  // Lattice cells a honeycomb cell sits in get no shading, so the gaps between
  // honeycomb cells read as one even channel instead of two random shades.
  const occupied = new Set<string>()
  if (lattice) {
    for (const cell of lattice.cells) {
      const k = Math.round((cell.x - lattice.originX) / unit / 0.75)
      const j = Math.round(
        (cell.y - lattice.originY) / unit / UNIT_HEX_HEIGHT - (Math.abs(k) % 2) / 2,
      )
      occupied.add(`${k}:${j}`)
    }
  }

  const particleColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return Array.from({ length: particleCount }).map((_, i) => colors[i % colors.length])
    }
    if (randomizeColors) {
      const seed = (particleCount * 23) % 360
      // use golden angle step for pleasing separation
      const step = GOLDEN_ANGLE
      return Array.from({ length: particleCount }).map(
        (_, i) =>
          `hsl(${Math.round(seed + i * step) % 360} ${colorSaturation}% ${colorLightness}%)`,
      )
    }
    return Array.from({ length: particleCount }).map(() => 'currentColor')
  }, [colors, randomizeColors, particleCount, colorSaturation, colorLightness])

  const { getCircleRef, getTrailPathRef, getGradientRef } = useHexagonParticles(
    vertices,
    vertexNeighbors,
    {
      count: box ? particleCount : 0,
      minDurationMs,
      maxDurationMs,
      radius: particleRadius,
      trailCount,
      trailSampleMs,
      trailMaxOpacity,
    },
  )

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700',
        box ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/*
       * Ambient light: a soft glow of each project's color behind its cell,
       * drifting slowly. The honeycomb's translucent cells pick it up unevenly,
       * which is what makes them read as glass. Gradients and transforms only.
       */}
      {box &&
        lattice?.cells.map((cell, index) =>
          cell.glowHue === undefined ? null : (
            <div
              key={cell.id}
              aria-hidden
              className="ambient-glow"
              style={
                {
                  left: cell.x - box.left,
                  top: cell.y - box.top,
                  width: unit * GLOW_SIZE,
                  height: unit * GLOW_SIZE,
                  '--glow-hue': cell.glowHue,
                  // Desynchronize the drifts so the glows don't move in step.
                  animationDelay: `${-index * 9}s`,
                } as CSSProperties
              }
            />
          ),
        )}
      <svg
        ref={svgRef}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="particleGlow" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceGraphic" stdDeviation={particleRadius * 0.9} result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {Array.from({ length: particleCount }).map((_, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`trailGrad-${i}`}
              ref={getGradientRef(i)}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={particleColors[i]} stopOpacity={0} />
              <stop offset="1" stopColor={particleColors[i]} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <g transform={`translate(${originX} ${originY}) scale(${unit})`}>
          {/* Lattice cells: randomly shaded fill + hairline outline */}
          {hexagons.map((hex) => (
            <path
              key={`${hex.k}:${hex.j}`}
              d={hex.pathData}
              fillOpacity={occupied.has(`${hex.k}:${hex.j}`) ? 0 : hex.shade * cellMaxOpacity}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="fill-foreground stroke-muted-foreground/10"
            />
          ))}
          {Array.from({ length: particleCount }).map((_, i) => (
            <g key={i}>
              {/* sparkline trail */}
              <path
                ref={getTrailPathRef(i)}
                fill="none"
                stroke={`url(#trailGrad-${i})`}
                strokeWidth={particleRadius * 0.55}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0}
              />
              {/* head with optional glow */}
              <circle
                ref={getCircleRef(i)}
                r={particleRadius}
                fill={particleColors[i]}
                className="text-muted-foreground transition-opacity duration-500"
                filter={glow ? 'url(#particleGlow)' : undefined}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
