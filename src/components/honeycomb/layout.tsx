import { motion, useReducedMotion } from 'motion/react'
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

const FLOWER_HEX = 210
const STACK_HEX = 195
const STACK_HEX_WIDTH = 'clamp(8rem, calc(57.143vw - 1.267rem), 12.1875rem)'
const STACK_HEX_HEIGHT = 'clamp(6.928rem, calc(49.486vw - 1.097rem), 10.554rem)'
const HEX_GAP = 4
const HEX_HEIGHT_RATIO = 0.866
const LG_QUERY = '(min-width: 64rem)'
const MORPH_MS = 600
const ENTRANCE_MS = 1200

// The wide flower and narrow stack contain the same cells, regrouped.
const flowerColumns: HoneycombCellId[][] = [
  ['logo'],
  ['recipes', 'page'],
  ['parsers', 'intro', 'other'],
  ['socials', 'now'],
  ['thesis'],
]
const stackColumns: HoneycombCellId[][] = [
  ['intro', 'recipes', 'parsers', 'socials', 'thesis'],
  ['logo', 'page', 'other', 'now'],
]
const layoutVars = (size: number, height?: string) =>
  ({
    '--hex-w': `${size}px`,
    '--hex-h': height ?? `${size * HEX_HEIGHT_RATIO}px`,
    '--hex-gap': `${HEX_GAP}px`,
  }) as CSSProperties

const flowerVars = layoutVars(FLOWER_HEX)
const stackVars = {
  ...layoutVars(STACK_HEX, STACK_HEX_HEIGHT),
  '--hex-w': STACK_HEX_WIDTH,
} as CSSProperties

/** Tiles flat-top hexagons into interlocking vertical columns. */
function HexColumns({ columns }: { columns: ReactNode[][] }) {
  return (
    <div className="flex items-center justify-center">
      {columns.map((hexes, index) => (
        <div
          key={index}
          className={cn(
            'flex flex-col items-center gap-(--hex-gap)',
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
function MorphingHoneycomb({
  renderCell,
  reducedMotion,
}: MorphingHoneycombProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const flowerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<
    Partial<Record<HoneycombCellId, HTMLDivElement | null>>
  >({})
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
      const stackHexWidth =
        measuredStackHex?.getBoundingClientRect().width ?? STACK_HEX
      const hexWidth = FLOWER_HEX + (stackHexWidth - FLOWER_HEX) * progress
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
        const x =
          fromX +
          (toRect.left + toRect.width / 2 - base.left - fromX) * progress
        const y =
          fromY + (toRect.top + toRect.height / 2 - base.top - fromY) * progress
        element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      const height =
        flower.offsetHeight +
        (stack.offsetHeight - flower.offsetHeight) * progress
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
    window.addEventListener('resize', onResize)

    return () => {
      query.removeEventListener('change', onBreakpoint)
      window.removeEventListener('resize', onResize)
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
          className="absolute top-0 left-0"
        >
          {renderCell(id, false)}
        </div>
      ))}
    </div>
  )
}

function StaticHoneycomb({
  renderCell,
  reducedMotion,
}: MorphingHoneycombProps) {
  const columnsFor = (columns: HoneycombCellId[][]) =>
    columns.map((column) => column.map((id) => renderCell(id, true)))

  return (
    <motion.div
      className="w-full py-4"
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.07, delayChildren: 0.1 },
        },
      }}
    >
      <div className="hidden lg:block" style={flowerVars}>
        <HexColumns columns={columnsFor(flowerColumns)} />
      </div>
      <div className="lg:hidden" style={stackVars}>
        <HexColumns columns={columnsFor(stackColumns)} />
      </div>
    </motion.div>
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
