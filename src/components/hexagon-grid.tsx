import { useMemo } from 'react'
import { useHexagonParticles } from '@/hooks/use-hexagon-particles'
import { useHexagons } from '@/hooks/use-hexagons'

const GOLDEN_ANGLE = 137.508 // degrees

export type HexagonGridProps = {
  particleCount?: number
  minDurationMs?: number
  maxDurationMs?: number
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

export function HexagonGrid({
  particleCount = 7,
  minDurationMs,
  maxDurationMs,
  radius = 0.9,
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
  const { hexagons, viewBox, scale, vertices, vertexNeighbors } = useHexagons()

  const particleRadius = useMemo(() => radius * scale, [radius, scale])

  const particleColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return Array.from({ length: particleCount }).map(
        (_, i) => colors[i % colors.length],
      )
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
      count: particleCount,
      minDurationMs,
      maxDurationMs,
      radius: particleRadius,
      trailCount,
      trailSampleMs,
      trailMaxOpacity,
    },
  )

  const viewBoxWidth = Math.max(viewBox.width, 1)
  const viewBoxHeight = Math.max(viewBox.height, 1)

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <svg
        role="img"
        aria-label="decorative hexagon grid"
        className="h-full w-full"
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="particleGlow" filterUnits="userSpaceOnUse">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={particleRadius * 0.9}
              result="blur1"
            />
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
        {/* Render hexagon cells: randomly shaded fill + outline, aligned by construction */}
        {hexagons.map((hex, i) => (
          <path
            key={i}
            d={hex.pathData}
            fillOpacity={hex.shade * cellMaxOpacity}
            strokeWidth="0.25"
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
      </svg>
    </div>
  )
}
