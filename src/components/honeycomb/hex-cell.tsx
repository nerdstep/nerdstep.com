import { m } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const GOLDEN_ANGLE = 137.508

export const HUE_SEED = 210

export const hueFor = (index: number) => Math.round(HUE_SEED + index * GOLDEN_ANGLE) % 360

// Flat-top hexagon (matching the background grid).
export const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

/** Seconds one cell takes to fade and scale in. */
export const HEX_ENTRANCE_S = 0.35

export const hexCellVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: HEX_ENTRANCE_S, ease: [0.4, 0, 0.2, 1] },
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
 * reserved for labels and the hover/focus state, where it reads as an accent
 * instead of changing the perceived material from cell to cell.
 *
 * On hover or focus an accent rim and a soft accent glow from the bottom edge
 * fade in together. Only their `opacity` animates. The rim is its own
 * ring-shaped layer (`.hex-rim`) rather than the cell's background, because a
 * background shows through the translucent fill: fading it while the fill
 * changed made the interior tint swell before settling, a visible bounce.
 *
 * There is deliberately no backdrop blur. The cell's `clip-path` makes it a
 * backdrop root, so a blur here only ever sees the cell's own rim color, never
 * the page behind it. It changed nothing visually but made Chrome flicker
 * when hovering a cell next to another one. Smaller layouts use a more opaque fill.
 */
export function HexFill() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0.5 bg-[oklch(0.2_0.038_264.7/0.84)] lg:bg-[oklch(0.2_0.038_264.7/0.64)]"
        style={{ clipPath: HEX_CLIP }}
      />
      <span
        aria-hidden
        className="absolute inset-0.5 bg-[radial-gradient(ellipse_100%_65%_at_50%_100%,color-mix(in_oklab,var(--hex-accent)_34%,transparent),transparent)] opacity-0 transition-opacity duration-200 group-hover/hex:opacity-100 group-focus-visible/hex:opacity-100 in-data-suppress-hover-motion:transition-none"
        style={{ clipPath: HEX_CLIP }}
      />
      <span
        aria-hidden
        className="hex-rim absolute inset-0 bg-(--hex-accent) opacity-0 transition-opacity duration-200 group-hover/hex:opacity-100 group-focus-visible/hex:opacity-100 in-data-suppress-hover-motion:transition-none"
      />
      {/*
       * Glass optics: a specular highlight near the top over a faint diagonal
       * sheen, plus a bevel (a light line on the top edge, a dark one on the
       * bottom). The inset shadows run along the box, so the hexagon clip
       * leaves them only on its two flat edges.
       */}
      <span
        aria-hidden
        className="absolute inset-0.5 bg-[radial-gradient(ellipse_70%_45%_at_32%_0%,rgb(255_255_255/0.11),transparent_70%),linear-gradient(to_bottom_right,rgb(255_255_255/0.06),transparent_45%,rgb(0_0_0/0.12))] shadow-[inset_0_1px_0_rgb(255_255_255/0.16),inset_0_-1px_0_rgb(0_0_0/0.35)]"
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

/**
 * Renders the visual, interaction, and accessibility contract for one cell.
 *
 * Cell wrappers are rectangles that overlap their neighbors' corners, so they
 * are `pointer-events-none` and the hex opts back in. Its `clip-path` limits
 * hit testing to the hexagon, which leaves no dead zone between cells.
 */
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
    'pointer-events-auto relative block shrink-0 bg-border/45',
    isInteractive && 'group/hex focus-visible:z-10 focus-visible:outline-none',
    isInteractive && 'cursor-pointer',
  )
  const inner = (
    <>
      <HexFill />
      <span className="absolute inset-0 flex flex-col items-center justify-center px-[13%] text-center">
        {/* Content scales with the hex on wide screens; see `--hex-scale`. */}
        <span className="flex w-full zoom-(--hex-scale) flex-col items-center">{children}</span>
      </span>
    </>
  )
  const motionProps = entrance
    ? ({ variants: hexCellVariants } as const)
    : ({ initial: false } as const)

  if (onSelect) {
    return (
      <m.button
        id={id}
        aria-label={label}
        className={cn(outerClass, 'group text-inherit')}
        onClick={onSelect}
        style={hexStyle(hue)}
        type="button"
        {...motionProps}
      >
        {inner}
      </m.button>
    )
  }

  if (href) {
    return (
      <m.a
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
      </m.a>
    )
  }

  return (
    <m.div className={outerClass} style={hexStyle(hue)} {...motionProps}>
      {inner}
    </m.div>
  )
}
