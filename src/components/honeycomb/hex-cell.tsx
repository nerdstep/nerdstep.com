import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const GOLDEN_ANGLE = 137.508

export const HUE_SEED = 210

export const hueFor = (index: number) =>
  Math.round(HUE_SEED + index * GOLDEN_ANGLE) % 360

// Flat-top hexagon (matching the background grid).
export const HEX_CLIP =
  'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

export const hexCellVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
} as const

export const hexStyle = (hue: number): CSSProperties =>
  ({
    width: 'var(--hex-w)',
    height: 'var(--hex-h)',
    clipPath: HEX_CLIP,
    '--hex-hue': hue,
    '--hex-accent': 'hsl(var(--hex-hue) 70% 55%)',
  }) as CSSProperties

/**
 * Frosted fill shared by every honeycomb cell.
 *
 * The surface stays in the background grid's tonal family. The cell hue is
 * reserved for labels and the hover/focus rim, where it reads as an accent
 * instead of changing the perceived material from cell to cell.
 *
 * Backdrop blur is desktop-only because the animated particle background makes
 * it expensive on mobile GPUs. Smaller layouts use a more opaque fill instead.
 */
export function HexFill() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0.5 bg-[oklch(0.965_0.004_264.7/0.88)] lg:bg-[oklch(0.965_0.004_264.7/0.7)] lg:backdrop-blur-md dark:bg-[oklch(0.2_0.038_264.7/0.84)] lg:dark:bg-[oklch(0.2_0.038_264.7/0.64)]"
        style={{ clipPath: HEX_CLIP }}
      />
      <span
        aria-hidden
        className="absolute inset-0.5 bg-linear-to-br from-white/50 via-transparent to-foreground/6 dark:from-white/12 dark:to-foreground/10"
        style={{ clipPath: HEX_CLIP }}
      />
    </>
  )
}

interface HexProps {
  children: ReactNode
  id?: string
  hue?: number
  href?: string
  onSelect?: () => void
  interactive?: boolean
  label?: string
  /** Disable the staggered first-paint animation for morphing cells. */
  entrance?: boolean
}

/** Renders the visual, interaction, and accessibility contract for one cell. */
export function Hex({
  children,
  id,
  hue = HUE_SEED,
  href,
  onSelect,
  interactive,
  label,
  entrance = true,
}: HexProps) {
  const isInteractive = Boolean(href || onSelect || interactive)
  const outerClass = cn(
    'relative block shrink-0 bg-border transition-colors duration-200',
    isInteractive &&
      'hover:bg-(--hex-accent) focus-visible:z-10 focus-visible:bg-(--hex-accent) focus-visible:outline-none',
    isInteractive && 'cursor-pointer',
  )
  const inner = (
    <>
      <HexFill />
      <span className="absolute inset-0 flex flex-col items-center justify-center px-[15%] text-center">
        {children}
      </span>
    </>
  )
  const motionProps = entrance
    ? ({ variants: hexCellVariants } as const)
    : ({ initial: false } as const)

  if (onSelect) {
    return (
      <motion.button
        id={id}
        aria-label={label}
        className={cn(outerClass, 'group text-inherit')}
        onClick={onSelect}
        style={hexStyle(hue)}
        type="button"
        {...motionProps}
      >
        {inner}
      </motion.button>
    )
  }

  if (href) {
    return (
      <motion.a
        id={id}
        aria-label={label}
        className={cn(
          outerClass,
          'group cursor-pointer font-normal text-inherit no-underline hover:no-underline',
        )}
        href={href}
        rel="noopener noreferrer"
        style={hexStyle(hue)}
        target="_blank"
        {...motionProps}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.div className={outerClass} style={hexStyle(hue)} {...motionProps}>
      {inner}
    </motion.div>
  )
}
