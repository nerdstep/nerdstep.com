import { useMemo } from 'react'
import { useHexagonParticles } from '@/hooks/useHexagonParticles'
import { useHexagons } from '@/hooks/useHexagons'

export type HexagonGridProps = {
  particleCount?: number
  minDurationMs?: number
  maxDurationMs?: number
  radius?: number
  trailCount?: number
  trailSampleMs?: number
  trailMaxOpacity?: number
  glow?: boolean
}

export function HexagonGrid({
  particleCount = 7,
  minDurationMs,
  maxDurationMs,
  radius = 0.9,
  trailCount = 48,
  trailSampleMs,
  trailMaxOpacity = 0.25,
  glow = true,
}: HexagonGridProps) {
  const { hexagons, viewBox, scale, vertices, vertexNeighbors } = useHexagons()

  const particleRadius = useMemo(() => radius * scale, [radius, scale])

  const { getCircleRef, getTrailPathRef } = useHexagonParticles(
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
        </defs>
        {/* Render hexagon outlines */}
        {hexagons.map((hex, i) => (
          <path
            key={i}
            d={hex.pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-muted-foreground/10"
          />
        ))}
        {Array.from({ length: particleCount }).map((_, i) => (
          <g key={i}>
            {/* sparkline trail */}
            <path
              ref={getTrailPathRef(i)}
              fill="none"
              stroke="currentColor"
              strokeWidth={particleRadius * 0.55}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0}
            />
            {/* head with optional glow */}
            <circle
              ref={getCircleRef(i)}
              r={particleRadius}
              fill="currentColor"
              className="text-muted-foreground transition-opacity duration-500"
              filter={glow ? 'url(#particleGlow)' : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
