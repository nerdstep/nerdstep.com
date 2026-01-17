import { useCallback, useEffect, useMemo, useRef } from 'react'

export type EasingFn = (t: number) => number

export interface UseHexagonParticlesOptions {
  /**
   * Number of particles to animate
   * @default 1
   */
  count?: number
  /**
   * Minimum duration for particle movement between vertices in milliseconds
   * @default 1200
   */
  minDurationMs?: number
  /**
   * Maximum duration for particle movement between vertices in milliseconds
   * @default 2200
   */
  maxDurationMs?: number
  /**
   * Radius of each particle
   * @default 2.5
   */
  radius?: number
  /**
   * If true, particles will avoid backtracking to the previous vertex
   */
  avoidBacktrack?: boolean
  /**
   * Easing function for particle movement between vertices
   */
  easing?: EasingFn
  /** If true, avoid reversing direction (prefer forward-only). */
  forwardOnly?: boolean
  /** Minimum dot(prevDir, nextDir) to accept; 0 = no more than 90° turn. */
  forwardMinDot?: number
  /**
   * Number of trail particles to create for each main particle
   * @default 30
   */
  trailCount?: number
  /**
   * Milliseconds between trail samples
   * @default 40
   */
  trailSampleMs?: number
  /**
   * Maximum opacity for trail paths
   * @default 0.35
   */
  trailMaxOpacity?: number
}

export interface UseHexagonParticlesResult {
  getCircleRef: (index: number) => (el: SVGCircleElement | null) => void
  getTrailPathRef: (index: number) => (el: SVGPathElement | null) => void
  getGradientRef: (
    index: number,
  ) => (el: SVGLinearGradientElement | null) => void
  radius: number
}

// Per-particle animation state
type ParticleState = {
  prev: number
  curr: number
  next: number | null
  progress: number
  lastTs: number | null
  duration: number
  sampleAcc: number
  trail: Array<{ x: number; y: number }>
}

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const randomInt = (n: number) => Math.floor(Math.random() * n)

export function useHexagonParticles(
  vertices: Array<{ x: number; y: number }>,
  vertexNeighbors: number[][],
  opts: UseHexagonParticlesOptions = {},
): UseHexagonParticlesResult {
  const {
    count = 1,
    minDurationMs = 1200,
    maxDurationMs = 2200,
    radius = 2.5,
    avoidBacktrack = true,
    easing = easeInOutQuad,
    trailCount = 30,
    trailSampleMs = 40,
    trailMaxOpacity = 0.35,
    forwardOnly = true,
    forwardMinDot = 0,
  } = opts

  // Imperative store for circle elements
  const circlesRef = useRef<Array<SVGCircleElement | null>>([])
  const trailsPathRef = useRef<Array<SVGPathElement | null>>([])
  const gradientsRef = useRef<Array<SVGLinearGradientElement | null>>([])
  const statesRef = useRef<ParticleState[]>([])
  const rafRef = useRef<number | null>(null)

  const getCircleRef = useCallback(
    (index: number) => (el: SVGCircleElement | null) => {
      circlesRef.current[index] = el
    },
    [],
  )

  const getTrailPathRef = useCallback(
    (index: number) => (el: SVGPathElement | null) => {
      trailsPathRef.current[index] = el
    },
    [],
  )

  const getGradientRef = useCallback(
    (index: number) => (el: SVGLinearGradientElement | null) => {
      gradientsRef.current[index] = el
    },
    [],
  )

  const randomDuration = useCallback(
    () => minDurationMs + Math.random() * (maxDurationMs - minDurationMs),
    [minDurationMs, maxDurationMs],
  )

  const pickNextVertex = useCallback(
    (from: number, previous: number): number | null => {
      const nbrs = vertexNeighbors[from] ?? []
      if (nbrs.length === 0) {
        return null
      }

      // Step 1: avoid immediate backtrack
      let pool =
        avoidBacktrack && previous >= 0
          ? nbrs.filter((i) => i !== previous)
          : [...nbrs]

      // Step 2: forward-only constraint based on angle to previous direction
      if (forwardOnly && previous >= 0 && vertices.length > 0) {
        const prevP = vertices[previous]
        const currP = vertices[from]
        const vx = currP.x - prevP.x
        const vy = currP.y - prevP.y
        const vlen = Math.hypot(vx, vy) || 1
        const ux = vx / vlen
        const uy = vy / vlen

        const constrained = pool.filter((cand) => {
          const nextP = vertices[cand]
          const wx = nextP.x - currP.x
          const wy = nextP.y - currP.y
          const wlen = Math.hypot(wx, wy) || 1
          const dot = (wx / wlen) * ux + (wy / wlen) * uy
          return dot >= forwardMinDot
        })
        if (constrained.length > 0) {
          pool = constrained
        }
      }

      const arr = pool.length > 0 ? pool : nbrs
      return arr[randomInt(arr.length)] ?? null
    },
    [vertexNeighbors, avoidBacktrack, forwardOnly, forwardMinDot, vertices],
  )

  // Reset or initialize particles when inputs change
  const particleCount = Math.max(0, count || 0)
  const verticesStable = vertices

  useEffect(() => {
    if (verticesStable.length === 0) {
      return
    }

    // Initialize particle states
    statesRef.current = new Array(particleCount).fill(0).map(() => {
      const curr = randomInt(verticesStable.length)
      const next = pickNextVertex(curr, -1)
      return {
        prev: -1,
        curr,
        next,
        progress: 0,
        lastTs: null,
        duration: randomDuration(),
        sampleAcc: 0,
        trail: [],
      }
    })

    // Place circles initially and hide until positioned
    for (let i = 0; i < particleCount; i++) {
      const circle = circlesRef.current[i]
      if (!circle) {
        continue
      }
      circle.style.opacity = '0'
      const p = verticesStable[statesRef.current[i].curr]
      circle.setAttribute('cx', String(p.x))
      circle.setAttribute('cy', String(p.y))
      // Fade in on next frame
      requestAnimationFrame(() => {
        circle.style.opacity = '1'
      })
      const path = trailsPathRef.current[i]
      if (path) {
        path.setAttribute('opacity', '0')
      }
      const grad = gradientsRef.current[i]
      if (grad) {
        grad.setAttribute('gradientUnits', 'userSpaceOnUse')
      }
    }

    const step = (ts: number) => {
      let anyActive = false
      for (let i = 0; i < particleCount; i++) {
        const state = statesRef.current[i]
        const circle = circlesRef.current[i]
        if (!circle || state.next == null) {
          continue
        }

        anyActive = true

        if (state.lastTs == null) {
          state.lastTs = ts
        }
        const delta = ts - state.lastTs
        state.lastTs = ts
        state.progress += delta / state.duration
        state.sampleAcc += delta

        const t = Math.min(state.progress, 1)
        const eased = easing(t)
        const start = verticesStable[state.curr]
        const target = verticesStable[state.next]
        const cx = start.x + (target.x - start.x) * eased
        const cy = start.y + (target.y - start.y) * eased
        circle.setAttribute('cx', String(cx))
        circle.setAttribute('cy', String(cy))

        // Update trail on a fixed cadence (sparkline path)
        if (state.sampleAcc >= trailSampleMs) {
          state.sampleAcc = 0
          state.trail.unshift({ x: cx, y: cy })
          if (state.trail.length > trailCount) {
            state.trail.length = trailCount
          }
          const path = trailsPathRef.current[i]
          if (path) {
            if (state.trail.length > 1) {
              const d =
                'M ' +
                state.trail
                  .map((p, idx) => `${idx === 0 ? '' : 'L '}${p.x} ${p.y}`)
                  .join(' ')
              path.setAttribute('d', d)
              path.setAttribute('opacity', String(trailMaxOpacity))
              const head = state.trail[0]
              const tail = state.trail.at(-1)
              const grad = gradientsRef.current[i]
              if (grad && head && tail) {
                grad.setAttribute('x1', String(tail.x))
                grad.setAttribute('y1', String(tail.y))
                grad.setAttribute('x2', String(head.x))
                grad.setAttribute('y2', String(head.y))
              }
            } else {
              path.setAttribute('opacity', '0')
            }
          }
        }

        if (state.progress >= 1) {
          state.prev = state.curr
          state.curr = state.next
          circle.setAttribute('cx', String(verticesStable[state.curr].x))
          circle.setAttribute('cy', String(verticesStable[state.curr].y))
          state.next = pickNextVertex(state.curr, state.prev)
          state.progress = 0
          state.lastTs = ts
          state.duration = randomDuration()
          // leave a dot at the vertex when arriving
          state.trail.unshift({
            x: verticesStable[state.curr].x,
            y: verticesStable[state.curr].y,
          })
          if (state.trail.length > trailCount) {
            state.trail.length = trailCount
          }
          const path = trailsPathRef.current[i]
          if (path) {
            if (state.trail.length > 1) {
              const d =
                'M ' +
                state.trail
                  .map((p, idx) => `${idx === 0 ? '' : 'L '}${p.x} ${p.y}`)
                  .join(' ')
              path.setAttribute('d', d)
              path.setAttribute('opacity', String(trailMaxOpacity))
              const head = state.trail[0]
              const tail = state.trail.at(-1)
              const grad = gradientsRef.current[i]
              if (grad && head && tail) {
                grad.setAttribute('x1', String(tail.x))
                grad.setAttribute('y1', String(tail.y))
                grad.setAttribute('x2', String(head.x))
                grad.setAttribute('y2', String(head.y))
              }
            } else {
              path.setAttribute('opacity', '0')
            }
          }
        }
      }

      if (anyActive) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = null
    }
  }, [
    verticesStable,
    particleCount,
    randomDuration,
    pickNextVertex,
    easing,
    trailCount,
    trailMaxOpacity,
    trailSampleMs,
  ])

  return useMemo(
    () => ({ getCircleRef, getTrailPathRef, getGradientRef, radius }),
    [getCircleRef, getTrailPathRef, getGradientRef, radius],
  )
}
