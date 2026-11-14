import { m, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

import { type HoneycombCellId, honeycombCellIds } from './catalog'
import { HEX_ENTRANCE_S } from './hex-cell'

const FLOWER_HEX = 210
const STACK_HEX = 195
const STACK_HEX_WIDTH = 'clamp(8rem, calc(57.143vw - 1.267rem), 12.1875rem)'
const STACK_HEX_HEIGHT = 'clamp(6.928rem, calc(49.486vw - 1.097rem), 10.554rem)'
const HEX_GAP = 4
const HEX_HEIGHT_RATIO = 0.866
const LG_QUERY = '(min-width: 64rem)'
const MORPH_MS = 600

// The wide flower and narrow stack contain the same cells, regrouped.
const flowerColumns: HoneycombCellId[][] = [
  ['logo'],
  ['recipes', 'page'],
  ['oss', 'intro', 'garden'],
  ['socials', 'now'],
  ['thesis'],
]
const stackColumns: HoneycombCellId[][] = [
  ['intro', 'recipes', 'oss', 'socials', 'thesis'],
  ['logo', 'page', 'garden', 'now'],
]
// Cells enter one at a time along a path of neighboring cells, starting beside
// the logo (which is painted immediately, since it is the largest image above
// the fold and animating it would delay Largest Contentful Paint). A cell left
// out of a sequence appears without an entrance.
const CASCADE_START_S = 0.1
const CASCADE_INTERVAL_S = 0.09

// Around the flower's ring past the thesis cell, ending on the profile.
const flowerEntrance: HoneycombCellId[] = [
  'recipes',
  'oss',
  'socials',
  'thesis',
  'now',
  'garden',
  'page',
  'intro',
]
// Zigzag down the two stacked columns.
const stackEntrance: HoneycombCellId[] = [
  'intro',
  'recipes',
  'page',
  'oss',
  'garden',
  'socials',
  'now',
  'thesis',
]

/** Seconds each cell waits before entering, by its place in the sequence. */
const cascadeDelays = (sequence: HoneycombCellId[]) =>
  new Map(sequence.map((id, index) => [id, CASCADE_START_S + index * CASCADE_INTERVAL_S]))

/** Orchestration only; delays the wrapped cell's own entrance variants. */
const cascadeVariants = {
  visible: (delay: number) => ({ transition: { delayChildren: delay } }),
}

const layoutVars = (size: number, height?: string) =>
  ({
    '--hex-w': `${size}px`,
    '--hex-h': height ?? `${size * HEX_HEIGHT_RATIO}px`,
    '--hex-gap': `${HEX_GAP}px`,
  }) as CSSProperties

// The flower grows on wide, tall screens by `--hex-scale` (see index.css).
const flowerVars = {
  ...layoutVars(FLOWER_HEX),
  '--hex-w': `calc(${FLOWER_HEX}px * var(--hex-scale))`,
  '--hex-h': `calc(${FLOWER_HEX * HEX_HEIGHT_RATIO}px * var(--hex-scale))`,
} as CSSProperties
const stackVars = {
  ...layoutVars(STACK_HEX, STACK_HEX_HEIGHT),
  '--hex-w': STACK_HEX_WIDTH,
} as CSSProperties

/**
 * Tiles flat-top hexagons into interlocking vertical columns.
 *
 * Columns overlap their neighbors by a quarter hex, so the column boxes ignore
 * the pointer and only each hex's clipped shape receives hover and clicks.
 */
function HexColumns({ columns }: { columns: ReactNode[][] }) {
  return (
    <div className="flex items-center justify-center">
      {columns.map((hexes, index) => (
        <div
          key={index}
          className={cn(
            'pointer-events-none flex flex-col items-center gap-(--hex-gap)',
            index > 0 && 'ml-[calc(var(--hex-w)*-0.25+var(--hex-gap)*0.866)]',
          )}
        >
          {hexes}
        </div>
      ))}
    </div>
  )
}

/** Invisible formation used only to measure each cell's endpoint geometry. */
function MeasureGrid({ columns }: { columns: HoneycombCellId[][] }) {
  return (
    <HexColumns
      columns={columns.map((column) =>
        column.map((id) => (
          <div
            key={id}
            data-cell={id}
            className="shrink-0"
            style={{ width: 'var(--hex-w)', height: 'var(--hex-h)' }}
          />
        )),
      )}
    />
  )
}

type CellRenderer = (id: HoneycombCellId, entrance: boolean) => ReactNode

interface MorphingHoneycombProps {
  renderCell: CellRenderer
  reducedMotion: boolean
}

/**
 * Owns the DOM-measured transition between the desktop flower and mobile
 * stack. Animation frames write directly to cell wrappers to avoid rerendering
 * the entire content tree during the morph.
 */
function MorphingHoneycomb({ renderCell, reducedMotion }: MorphingHoneycombProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const flowerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Partial<Record<HoneycombCellId, HTMLDivElement | null>>>({})
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    const flower = flowerRef.current
    const stack = stackRef.current
    const container = containerRef.current
    if (!flower || !stack || !container) {
      return
    }

    const apply = () => {
      const progress = progressRef.current
      const measuredStackHex = stack.querySelector('[data-cell]')
      const stackHexWidth = measuredStackHex?.getBoundingClientRect().width ?? STACK_HEX
      const measuredFlowerHex = flower.querySelector('[data-cell]')
      const flowerHexWidth = measuredFlowerHex?.getBoundingClientRect().width ?? FLOWER_HEX
      const hexWidth = flowerHexWidth + (stackHexWidth - flowerHexWidth) * progress
      container.style.setProperty('--hex-w', `${hexWidth}px`)
      container.style.setProperty('--hex-h', `${hexWidth * HEX_HEIGHT_RATIO}px`)

      const base = container.getBoundingClientRect()
      for (const id of honeycombCellIds) {
        const from = flower.querySelector(`[data-cell="${id}"]`)
        const to = stack.querySelector(`[data-cell="${id}"]`)
        const element = cellRefs.current[id]
        if (!from || !to || !element) {
          continue
        }

        const fromRect = from.getBoundingClientRect()
        const toRect = to.getBoundingClientRect()
        const fromX = fromRect.left + fromRect.width / 2 - base.left
        const fromY = fromRect.top + fromRect.height / 2 - base.top
        const x = fromX + (toRect.left + toRect.width / 2 - base.left - fromX) * progress
        const y = fromY + (toRect.top + toRect.height / 2 - base.top - fromY) * progress
        element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      const height = flower.offsetHeight + (stack.offsetHeight - flower.offsetHeight) * progress
      container.style.height = `${Math.round(height)}px`
    }

    const easeOutQuint = (progress: number) => 1 - (1 - progress) ** 5
    let tweenFrame = 0
    const tweenTo = (target: number) => {
      cancelAnimationFrame(tweenFrame)
      if (reducedMotion) {
        progressRef.current = target
        apply()
        return
      }

      const start = progressRef.current
      const startedAt = performance.now()
      const step = (now: number) => {
        const elapsed = Math.min(1, (now - startedAt) / MORPH_MS)
        progressRef.current = start + (target - start) * easeOutQuint(elapsed)
        apply()
        if (elapsed < 1) {
          tweenFrame = requestAnimationFrame(step)
        }
      }
      tweenFrame = requestAnimationFrame(step)
    }

    const query = window.matchMedia(LG_QUERY)
    progressRef.current = query.matches ? 0 : 1
    apply()

    // The static entrance layout is replaced by this morphing layout. If the
    // pointer is already over a cell during that handoff, let hover-dependent
    // styles settle for one frame before restoring their transitions. This
    // prevents icons from replaying the same hover animation after remounting.
    const releaseHoverMotionFrame = requestAnimationFrame(() => {
      container.removeAttribute('data-suppress-hover-motion')
    })

    const onBreakpoint = () => tweenTo(query.matches ? 0 : 1)
    query.addEventListener('change', onBreakpoint)

    let resizeFrame = 0
    const onResize = () => {
      if (!resizeFrame) {
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0
          apply()
        })
      }
    }
    // Watch the measurement grids rather than the window. They resize with the
    // viewport and also when a `--hex-scale` step changes the hex size.
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(flower)
    resizeObserver.observe(stack)

    return () => {
      query.removeEventListener('change', onBreakpoint)
      resizeObserver.disconnect()
      cancelAnimationFrame(tweenFrame)
      cancelAnimationFrame(resizeFrame)
      cancelAnimationFrame(releaseHoverMotionFrame)
    }
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      data-suppress-hover-motion=""
      className="relative w-full overflow-clip"
      style={flowerVars}
    >
      <div
        ref={flowerRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex justify-center"
        style={flowerVars}
      >
        <MeasureGrid columns={flowerColumns} />
      </div>
      <div
        ref={stackRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex justify-center"
        style={stackVars}
      >
        <MeasureGrid columns={stackColumns} />
      </div>
      {honeycombCellIds.map((id) => (
        <div
          key={id}
          ref={(element) => {
            cellRefs.current[id] = element
          }}
          className="pointer-events-none absolute top-0 left-0"
        >
          {renderCell(id, false)}
        </div>
      ))}
    </div>
  )
}

const flowerDelays = cascadeDelays(flowerEntrance)
const stackDelays = cascadeDelays(stackEntrance)

// Hand off to the morphing layout only once the farthest cell has fully entered.
const ENTRANCE_MS = Math.ceil(
  (Math.max(...flowerDelays.values(), ...stackDelays.values()) + HEX_ENTRANCE_S) * 1000 + 100,
)

function StaticHoneycomb({ renderCell, reducedMotion }: MorphingHoneycombProps) {
  const columnsFor = (columns: HoneycombCellId[][], delays: Map<HoneycombCellId, number>) =>
    columns.map((column) =>
      column.map((id) => (
        <m.div key={id} custom={delays.get(id) ?? 0} variants={cascadeVariants}>
          {renderCell(id, delays.has(id))}
        </m.div>
      )),
    )

  return (
    <m.div className="w-full py-4" initial={reducedMotion ? false : 'hidden'} animate="visible">
      <div className="hidden lg:block" style={flowerVars}>
        <HexColumns columns={columnsFor(flowerColumns, flowerDelays)} />
      </div>
      <div className="lg:hidden" style={stackVars}>
        <HexColumns columns={columnsFor(stackColumns, stackDelays)} />
      </div>
    </m.div>
  )
}

interface HoneycombLayoutProps {
  renderCell: CellRenderer
}

/**
 * Renders an SSR-safe static formation first, then takes ownership of the
 * breakpoint morph after the entrance animation settles.
 */
export function HoneycombLayout({ renderCell }: HoneycombLayoutProps) {
  const reducedMotion = useReducedMotion() ?? false
  const [morphReady, setMorphReady] = useState(false)

  useEffect(() => {
    const delay = reducedMotion ? 0 : ENTRANCE_MS
    const timeout = setTimeout(() => setMorphReady(true), delay)
    return () => clearTimeout(timeout)
  }, [reducedMotion])

  return morphReady ? (
    <MorphingHoneycomb renderCell={renderCell} reducedMotion={reducedMotion} />
  ) : (
    <StaticHoneycomb renderCell={renderCell} reducedMotion={reducedMotion} />
  )
}
