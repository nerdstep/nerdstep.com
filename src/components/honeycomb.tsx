/**
 * Honeycomb home layout -- hex-shaped glass cells interlocked into a hive.
 * Flat-top hexes (matching the background grid) tile in vertical columns:
 * a 1-2-3-2-1 hexagon flower with the profile dead center on large screens,
 * collapsing to a 5-4 interlocked pair below `lg`.
 */
import { IconArrowUpRight, IconMapPin, IconPlus } from '@tabler/icons-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Social } from '@/components/social'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { intro, otherProjects, type Project, projects } from '@/lib/projects'
import { cn } from '@/lib/utils'

const GOLDEN_ANGLE = 137.508
const HUE_SEED = 210 // site's blue family

// Each cell gets its own hue, spaced by the golden angle for pleasing
// separation. A single `--hex-hue` per cell drives everything: the tinted glass
// surface, the bright hover/focus rim, and the contrast-safe label text — so
// the honeycomb reads as one iridescent ramp rather than nine unrelated colors.
const hueFor = (i: number) => Math.round(HUE_SEED + i * GOLDEN_ANGLE) % 360

// flat-top hexagon (matches the background grid); height = width * sqrt(3)/2
const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

const kindLabel: Record<Project['kind'], string> = {
  product: 'product',
  oss: 'open source',
  personal: 'personal',
}

const cell = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
} as const

// Frosted glass fill for a hex interior. The surface is a NEUTRAL glass — a
// light frost in light mode, near-black smoky glass in dark — so the cell's hue
// stays an accent, not the material. Two layers: (1) the neutral translucent
// glass; (2) a top-left specular sheen fading into a whisper of the cell hue at
// the far corner. `--hex-hue` is inherited; the rest of the accent lives in the
// hover/focus rim and the label text.
//
// Perf: `backdrop-filter` re-blurs every frame because the particle backdrop is
// always animating, and it's costliest on the weakest GPUs. So the blur is
// gated to `lg` (the desktop flower); below `lg` (the mobile/tablet layout) the
// fill is simply more opaque and unfiltered — visually near-identical at that
// size, far cheaper on phones.
function HexFill() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0.5 bg-[oklch(0.96_0.006_256/0.88)] lg:bg-[oklch(0.96_0.006_256/0.7)] lg:backdrop-blur-md dark:bg-[oklch(0.17_0.012_264/0.84)] lg:dark:bg-[oklch(0.17_0.012_264/0.64)]"
        style={{ clipPath: HEX_CLIP }}
      />
      <span
        aria-hidden
        className="absolute inset-0.5 bg-linear-to-br from-white/50 via-transparent to-[hsl(var(--hex-hue)_70%_55%/0.06)] dark:from-white/12 dark:to-[hsl(var(--hex-hue)_80%_62%/0.12)]"
        style={{ clipPath: HEX_CLIP }}
      />
    </>
  )
}

function Hex({
  children,
  hue = HUE_SEED,
  href,
  onSelect,
  interactive,
  label,
  entrance = true,
}: {
  children: ReactNode
  hue?: number
  href?: string
  onSelect?: () => void
  interactive?: boolean
  label?: string
  /**
   * Whether this cell plays the staggered scale/fade entrance. The static
   * first-paint tree uses it; the crossfade layers render at rest (`false`) so
   * they don't replay the entrance when they take over.
   */
  entrance?: boolean
}) {
  // One hue per cell drives the tinted glass (via --hex-hue), the vivid
  // hover/focus rim, and the label text colour.
  const style = {
    width: 'var(--hex-w)',
    height: 'var(--hex-h)',
    clipPath: HEX_CLIP,
    '--hex-hue': hue,
    '--hex-accent': 'hsl(var(--hex-hue) 70% 55%)',
  } as CSSProperties

  // A clip-path hexagon clips any rectangular focus ring or box-shadow, so
  // focus reuses the accent rim (carrying the cell's colour) and adds a z-10
  // lift so the focused cell pops above its overlapping neighbours at the
  // seams — a visible, keyboard-only signal distinct from a resting cell.
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

  // Entrance mode plays the staggered scale/fade; at-rest mode renders the cell
  // in its final state (used by the crossfade layers, which must not re-run the
  // entrance when they take over from the static first-paint tree).
  const motionProps = entrance
    ? ({ variants: cell } as const)
    : ({ initial: false } as const)

  if (onSelect) {
    return (
      <motion.button
        aria-label={label}
        className={cn(outerClass, 'group text-inherit')}
        onClick={onSelect}
        style={style}
        type="button"
        {...motionProps}
      >
        {inner}
      </motion.button>
    )
  }

  return href ? (
    <motion.a
      aria-label={label}
      className={cn(
        outerClass,
        'group cursor-pointer font-normal text-inherit no-underline hover:no-underline',
      )}
      href={href}
      rel="noopener noreferrer"
      style={style}
      target="_blank"
      {...motionProps}
    >
      {inner}
    </motion.a>
  ) : (
    <motion.div className={outerClass} style={style} {...motionProps}>
      {inner}
    </motion.div>
  )
}

function IntroHex({ hue, entrance }: { hue: number; entrance?: boolean }) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <div className="size-18 rounded-full border-2 border-gray-600/50">
        <img
          alt="profile"
          className="tilt rounded-full"
          height="100%"
          src="/img/profile.webp"
          width="100%"
        />
      </div>
      <span className="mt-2 font-bold tracking-tight sm:text-base">
        {intro.name}
      </span>
      <span className="mt-0.5 text-muted-foreground text-sm">{intro.role}</span>
    </Hex>
  )
}

function ProjectHex({
  project,
  hue,
  onSelect,
  entrance,
}: {
  project: Project
  hue: number
  onSelect: (slug: string) => void
  entrance?: boolean
}) {
  return (
    <Hex
      hue={hue}
      entrance={entrance}
      onSelect={
        project.slug ? () => onSelect(project.slug as string) : undefined
      }
      label={`Open ${project.name} details`}
    >
      <span className="hex-kind font-medium text-[0.8125rem] lowercase tracking-tight">
        {kindLabel[project.kind]}
      </span>
      <span className="mt-1 flex items-center gap-1 font-semibold text-sm tracking-tight sm:text-base">
        {project.name}
        <IconPlus
          aria-hidden
          className="size-3.5 text-muted-foreground/60 transition-all duration-200 group-hover:rotate-90 group-hover:text-(--hex-accent) sm:size-4"
        />
      </span>
      {project.status === 'wip' ? (
        <span className="mt-1.5 rounded-full border border-amber-500/50 px-2 py-0.5 font-medium text-[11px] text-amber-700 tracking-wide dark:text-amber-400">
          coming soon
        </span>
      ) : (
        <span className="mt-1.5 hidden text-muted-foreground text-xs leading-snug lg:line-clamp-2">
          {project.description}
        </span>
      )}
    </Hex>
  )
}

function SocialsHex({ hue, entrance }: { hue: number; entrance?: boolean }) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <span className="hex-kind mb-2 font-medium text-[0.8125rem] lowercase tracking-tight">
        connect
      </span>
      <Social />
    </Hex>
  )
}

function NowHex({ hue, entrance }: { hue: number; entrance?: boolean }) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <IconMapPin aria-hidden className="size-5 text-muted-foreground/60" />
      <span className="mt-1 font-medium">{intro.location}</span>
      <span className="mt-0.5 text-muted-foreground text-sm">
        working at <span className="font-semibold">ValidaTek</span>
      </span>
    </Hex>
  )
}

function LogoHex({ hue, entrance }: { hue: number; entrance?: boolean }) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <img
        alt="nerdstep"
        className="w-[85%] dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/img/nerdstep-logo.svg"
      />
    </Hex>
  )
}

function ThesisHex({ hue, entrance }: { hue: number; entrance?: boolean }) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <p className="text-balance font-medium text-sm leading-snug sm:text-base">
        Building personal,{' '}
        <span className="text-sky-500 dark:text-sky-400">mostly</span> useful
        things for the web.
      </p>
    </Hex>
  )
}

const statusDotColor: Record<Project['status'], string> = {
  live: 'bg-emerald-500',
  wip: 'bg-amber-500',
}

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  wip: 'In progress',
}

function OtherProjectsHex({
  hue,
  entrance = true,
}: {
  hue: number
  entrance?: boolean
}) {
  const style = {
    width: 'var(--hex-w)',
    height: 'var(--hex-h)',
    clipPath: HEX_CLIP,
    '--hex-hue': hue,
    '--hex-accent': 'hsl(var(--hex-hue) 70% 55%)',
  } as CSSProperties

  const motionProps = entrance
    ? ({ variants: cell } as const)
    : ({ initial: false } as const)

  return (
    <Dialog>
      <motion.div
        className="relative shrink-0 bg-border transition-colors duration-200 has-[button:focus-visible]:z-10 has-[button:focus-visible]:bg-(--hex-accent) has-[button:hover]:bg-(--hex-accent)"
        style={style}
        {...motionProps}
      >
        <HexFill />
        <DialogTrigger>
          <button
            className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center px-[15%] text-center outline-none"
            type="button"
          >
            <span className="flex items-center gap-1 font-semibold text-sm tracking-tight sm:text-base">
              Other projects
              <IconPlus
                aria-hidden
                className="size-3.5 text-muted-foreground/60 transition-all duration-200 group-hover:rotate-90 group-hover:text-(--hex-accent) sm:size-4"
              />
            </span>
            <span className="mt-1.5 text-muted-foreground text-xs">
              +{otherProjects.length} more →
            </span>
          </button>
        </DialogTrigger>
      </motion.div>

      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Other projects</DialogTitle>
        <p className="text-muted-foreground text-sm">
          Smaller and older side work.
        </p>
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {otherProjects.map((project) => {
            const RowTag = project.url ? 'a' : 'div'
            return (
              <li key={project.name}>
                <RowTag
                  className={cn(
                    'group -mx-2 block rounded-md px-2 py-3 text-inherit no-underline',
                    project.url
                      ? 'hover:bg-muted/60 hover:no-underline focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      : 'cursor-default',
                  )}
                  {...(project.url
                    ? {
                        href: project.url,
                        rel: 'noopener noreferrer',
                        target: '_blank',
                      }
                    : {})}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                      {project.name}
                    </span>
                    {project.url ? (
                      <IconArrowUpRight
                        aria-hidden
                        className="size-3.5 text-muted-foreground/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    ) : null}
                    <span className="ml-auto flex items-center gap-1.5 text-muted-foreground text-xs">
                      <span
                        aria-hidden
                        className={cn(
                          'size-1.5 rounded-full',
                          statusDotColor[project.status],
                        )}
                      />
                      {statusLabel[project.status]}
                    </span>
                  </span>
                  <span className="mt-1 block text-muted-foreground text-sm">
                    {project.description}
                  </span>
                </RowTag>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

const primaryLinkLabel = (project: Project) =>
  project.kind === 'oss' ? 'View on GitHub' : 'Visit live'

// Controlled detail dialog for a project hex. Opened programmatically by the
// honeycomb (click or `?p=<slug>` deep-link), so there's no trigger. The cell's
// hue is the single accent (the kind label + a hairline under the header); the
// primary CTA stays neutral `foreground` for guaranteed contrast, since a
// filled accent button would fail WCAG on the lighter hues.
function ProjectDetailDialog({
  project,
  hue,
  open,
  onClose,
}: {
  project: Project | null
  hue: number
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose()
        }
      }}
    >
      <DialogContent
        className="sm:max-w-lg"
        style={{ '--hex-hue': hue } as CSSProperties}
      >
        {project ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="hex-kind font-medium text-[0.8125rem] lowercase tracking-tight">
                  {kindLabel[project.kind]}
                </span>
                <DialogTitle className="mt-0.5 font-semibold text-xl tracking-tight">
                  {project.name}
                </DialogTitle>
                <span
                  aria-hidden
                  className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)"
                />
              </div>
              <span className="mt-1 mr-8 flex shrink-0 items-center gap-1.5 text-muted-foreground text-xs">
                <span
                  aria-hidden
                  className={cn(
                    'size-1.5 rounded-full',
                    statusDotColor[project.status],
                  )}
                />
                {statusLabel[project.status]}
              </span>
            </div>

            <DialogDescription className="text-pretty text-muted-foreground text-sm leading-relaxed">
              {project.summary ?? project.description}
            </DialogDescription>

            {project.role || (project.stack?.length ?? 0) > 0 ? (
              <dl className="flex flex-col gap-3 border-border border-t pt-4">
                {project.role ? (
                  <div className="flex items-baseline gap-3 text-sm">
                    <dt className="w-12 shrink-0 text-muted-foreground text-xs">
                      role
                    </dt>
                    <dd className="font-medium">{project.role}</dd>
                  </div>
                ) : null}
                {project.stack && project.stack.length > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <dt className="w-12 shrink-0 text-muted-foreground text-xs">
                      stack
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-foreground/80 text-xs"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {project.url ? (
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 font-medium text-background text-sm no-underline transition-transform hover:-translate-y-px hover:no-underline focus-visible:outline-none focus-visible:ring-(--hex-accent) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  href={project.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {primaryLinkLabel(project)}
                  <IconArrowUpRight aria-hidden className="size-4" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3.5 py-2 font-medium text-amber-700 text-sm dark:text-amber-400">
                  In progress — not live yet
                </span>
              )}
              {project.repo ? (
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 font-medium text-sm no-underline transition-colors hover:bg-muted/60 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={project.repo}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                  <IconArrowUpRight aria-hidden className="size-4" />
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

// Flat-top hexes tile as vertical columns: adjacent columns overlap
// horizontally by a quarter hex width, and because neighboring columns differ
// in height by one cell, items-center offsets them by half a hex so cells
// nestle into their neighbors' notches. Columns of 1-2-3-2-1 form a big
// hexagon; 5-4 forms a compact interlocked pair.
//
// The seam: for a UNIFORM gap `g` on all six sides of every hexagon, the two
// spacings are not the same number. Stacked neighbours share a flat edge, so
// their gap is simply `g`. Diagonal neighbours (adjacent columns) meet on a
// slanted edge, so their centres separate along that diagonal — which works out
// to `0.866·g` (√3/2) of extra horizontal distance on top of the -0.25 overlap.
// Hence the two different multipliers below; they must move together, so both
// derive from `--hex-gap`.
function HexColumns({ cols }: { cols: ReactNode[][] }) {
  return (
    <div className="flex items-center justify-center">
      {cols.map((hexes, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center gap-(--hex-gap)',
            i > 0 && 'ml-[calc(var(--hex-w)*-0.25+var(--hex-gap)*0.866)]',
          )}
        >
          {hexes}
        </div>
      ))}
    </div>
  )
}

type CellId =
  | 'logo'
  | 'recipes'
  | 'page'
  | 'parsers'
  | 'intro'
  | 'other'
  | 'socials'
  | 'now'
  | 'thesis'

// The wide flower (1-2-3-2-1) and the narrow pair (5-4) hold the SAME nine
// cells, only regrouped.
const flowerCols: CellId[][] = [
  ['logo'],
  ['recipes', 'page'],
  ['parsers', 'intro', 'other'],
  ['socials', 'now'],
  ['thesis'],
]
const stackCols: CellId[][] = [
  ['intro', 'recipes', 'parsers', 'socials', 'thesis'],
  ['logo', 'page', 'other', 'now'],
]

const CELL_IDS: CellId[] = [
  'logo',
  'recipes',
  'page',
  'parsers',
  'intro',
  'other',
  'socials',
  'now',
  'thesis',
]

// A content-free clone of a formation: same column tiling and hex sizing as the
// real thing, so each placeholder's box reports exactly where that cell sits in
// this layout. Rendered invisibly; the morph reads these boxes for geometry.
function MeasureGrid({ cols }: { cols: CellId[][] }) {
  return (
    <HexColumns
      cols={cols.map((col) =>
        col.map((id) => (
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

// FIXED hex size per formation — hexes no longer scale with the viewport (the
// fluid shrink on resize read as awkward). The flower is generous on desktop;
// the narrow 5-4 stack is a touch smaller so it fits a phone (its width is
// ~1.75·size, so 195 stays inside ~360px). The collapse tweens between the two.
const FLOWER_HEX = 210
const STACK_HEX = 195

// Uniform seam between neighbouring cells, on all six sides. `HexColumns` reads
// this for both the stacked gap and the diagonal (0.866·gap) column spacing.
const HEX_GAP = 4

const flowerVars = {
  '--hex-w': `${FLOWER_HEX}px`,
  '--hex-h': `${FLOWER_HEX * 0.866}px`,
  '--hex-gap': `${HEX_GAP}px`,
} as CSSProperties

const stackVars = {
  '--hex-w': `${STACK_HEX}px`,
  '--hex-h': `${STACK_HEX * 0.866}px`,
  '--hex-gap': `${HEX_GAP}px`,
} as CSSProperties

// The collapse plays as ONE timed, eased animation the moment the `lg`
// breakpoint (1024px) is crossed — not continuously with the drag.
const LG_QUERY = '(min-width: 64rem)'
const MORPH_MS = 600

export function Honeycomb() {
  // Skip the staggered scale/fade entrance for users who prefer reduced motion;
  // the honeycomb renders in its final state immediately.
  const prefersReducedMotion = useReducedMotion()

  // A single project detail dialog, driven by the `?p=<slug>` search param
  // so it deep-links and works with the back button. Project hexes set the
  // param; closing clears it.
  const navigate = useNavigate({ from: '/' })
  const { p } = useSearch({ from: '/' })
  const selectedIndex = projects.findIndex((project) => project.slug === p)
  const selected = selectedIndex >= 0 ? projects[selectedIndex] : null

  const openProject = (slug: string) => {
    void navigate({ search: (prev) => ({ ...prev, p: slug }) })
  }
  const closeProject = () => {
    void navigate({ search: (prev) => ({ ...prev, p: undefined }) })
  }

  // Silently drop a stale/unknown ?p so a typo'd or removed slug doesn't
  // linger.
  useEffect(() => {
    if (p && selectedIndex < 0) {
      void navigate({
        search: (prev) => ({ ...prev, p: undefined }),
        replace: true,
      })
    }
  }, [p, selectedIndex, navigate])

  // Renders one cell by id. `entrance` gates the staggered scale/fade
  // (used only by the static first-paint tree; the crossfade layers render
  // at rest).
  const cellFor = (id: CellId, entrance: boolean): ReactNode => {
    switch (id) {
      case 'logo':
        return <LogoHex key={id} hue={hueFor(4)} entrance={entrance} />
      case 'recipes':
        return (
          <ProjectHex
            key={id}
            hue={hueFor(0)}
            entrance={entrance}
            onSelect={openProject}
            project={projects[0]}
          />
        )
      case 'page':
        return (
          <ProjectHex
            key={id}
            hue={hueFor(1)}
            entrance={entrance}
            onSelect={openProject}
            project={projects[1]}
          />
        )
      case 'parsers':
        return (
          <ProjectHex
            key={id}
            hue={hueFor(2)}
            entrance={entrance}
            onSelect={openProject}
            project={projects[2]}
          />
        )
      case 'intro':
        return <IntroHex key={id} hue={hueFor(5)} entrance={entrance} />
      case 'other':
        return <OtherProjectsHex key={id} hue={hueFor(3)} entrance={entrance} />
      case 'socials':
        return <SocialsHex key={id} hue={hueFor(6)} entrance={entrance} />
      case 'now':
        return <NowHex key={id} hue={hueFor(7)} entrance={entrance} />
      case 'thesis':
        return <ThesisHex key={id} hue={hueFor(8)} entrance={entrance} />
    }
  }

  const columnsFor = (cols: CellId[][], entrance: boolean) =>
    cols.map((col) => col.map((id) => cellFor(id, entrance)))

  // The static, CSS-breakpoint layout paints first: SSR-correct, works with JS
  // off, no hydration mismatch, and plays the entrance. Once it settles we swap
  // to the width-driven crossfade layers below.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const delay = prefersReducedMotion ? 0 : 1200
    const id = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(id)
  }, [prefersReducedMotion])

  const containerRef = useRef<HTMLDivElement>(null)
  const flowerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Partial<Record<CellId, HTMLDivElement | null>>>({})
  // 0 = flower, 1 = stack. Animated by a timed tween on breakpoint crossing;
  // held in a ref so frames update the DOM without React re-renders.
  const progressRef = useRef(0)

  // Position the nine cells for the current `progress` and size the container
  // to match. Two hidden measurement grids report where each cell sits in each
  // formation (at the live width, so the layout stays centered); we read both
  // centers, interpolate, and write the transform straight to the DOM.
  // Each cell is a single element that glides — no ghosted double vision.
  // The collapse is one eased tween fired the instant the `lg` breakpoint is
  // crossed, so it plays identically no matter how fast the window got there.
  useLayoutEffect(() => {
    if (!mounted) {
      return
    }
    const flower = flowerRef.current
    const stack = stackRef.current
    const container = containerRef.current
    if (!flower || !stack || !container) {
      return
    }

    const apply = () => {
      const progress = progressRef.current
      // Interpolate the visible cells' size between the two fixed formation
      // sizes so they overlay each measurement grid exactly at the endpoints.
      const hexW = FLOWER_HEX + (STACK_HEX - FLOWER_HEX) * progress
      container.style.setProperty('--hex-w', `${hexW}px`)
      container.style.setProperty('--hex-h', `${hexW * 0.866}px`)

      const base = container.getBoundingClientRect()
      for (const id of CELL_IDS) {
        const from = flower.querySelector(`[data-cell="${id}"]`)
        const to = stack.querySelector(`[data-cell="${id}"]`)
        const el = cellRefs.current[id]
        if (!from || !to || !el) {
          continue
        }
        const fr = from.getBoundingClientRect()
        const tr = to.getBoundingClientRect()
        const fx = fr.left + fr.width / 2 - base.left
        const fy = fr.top + fr.height / 2 - base.top
        const cx = fx + (tr.left + tr.width / 2 - base.left - fx) * progress
        const cy = fy + (tr.top + tr.height / 2 - base.top - fy) * progress
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      }
      // Interpolate the container height between the two formations (wide-short
      // ↔ narrow-tall) so content below the honeycomb doesn't jump.
      const fh = flower.offsetHeight
      const sh = stack.offsetHeight
      container.style.height = `${Math.round(fh + (sh - fh) * progress)}px`
    }

    // One eased tween of `progress` toward a target (0 or 1).
    const easeOutQuint = (t: number) => 1 - (1 - t) ** 5
    let tweenRaf = 0
    const tweenTo = (target: number) => {
      cancelAnimationFrame(tweenRaf)
      if (prefersReducedMotion) {
        progressRef.current = target
        apply()
        return
      }
      const start = progressRef.current
      const startedAt = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - startedAt) / MORPH_MS)
        progressRef.current = start + (target - start) * easeOutQuint(t)
        apply()
        if (t < 1) {
          tweenRaf = requestAnimationFrame(step)
        }
      }
      tweenRaf = requestAnimationFrame(step)
    }

    // Initial state matches the current breakpoint — no animation on first paint.
    const query = window.matchMedia(LG_QUERY)
    progressRef.current = query.matches ? 0 : 1
    apply()

    // The collapse: fire the tween only when the breakpoint is actually crossed.
    const onBreakpoint = () => tweenTo(query.matches ? 0 : 1)
    query.addEventListener('change', onBreakpoint)

    // Non-crossing resizes just re-center the current formation (no animation).
    let resizeRaf = 0
    const onResize = () => {
      if (!resizeRaf) {
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0
          apply()
        })
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      query.removeEventListener('change', onBreakpoint)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(tweenRaf)
      cancelAnimationFrame(resizeRaf)
    }
  }, [mounted, prefersReducedMotion])

  return (
    <>
      {mounted ? (
        // Nine cells that travel between formations when the breakpoint
        // crosses. `overflow-clip`: both measurement grids are always laid out
        // (for geometry), so whichever one isn't current spills past the
        // container — the flower is wider than a phone, the stack is taller than
        // the flower. Unclipped, that spill drives real page scrollbars.
        // Clipping is safe because each formation exactly fills the container:
        // both grids start at top-0 and the container height is the
        // interpolation of their heights, so a visible cell can never sit
        // outside it.
        <div
          ref={containerRef}
          className="relative w-full overflow-clip"
          style={flowerVars}
        >
          {/* hidden geometry: the two formations, measured but never shown */}
          <div
            ref={flowerRef}
            aria-hidden
            className="pointer-events-none invisible absolute inset-x-0 top-0 flex justify-center"
            style={flowerVars}
          >
            <MeasureGrid cols={flowerCols} />
          </div>
          <div
            ref={stackRef}
            aria-hidden
            className="pointer-events-none invisible absolute inset-x-0 top-0 flex justify-center"
            style={stackVars}
          >
            <MeasureGrid cols={stackCols} />
          </div>
          {/* the real, interactive cells, positioned by the morph */}
          {CELL_IDS.map((id) => (
            <div
              key={id}
              ref={(el) => {
                cellRefs.current[id] = el
              }}
              className="absolute top-0 left-0"
            >
              {cellFor(id, false)}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="w-full py-4"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.1 },
            },
          }}
        >
          {/* wide honeycomb flower: 1-2-3-2-1 columns, profile dead center */}
          <div className="hidden lg:block" style={flowerVars}>
            <HexColumns cols={columnsFor(flowerCols, true)} />
          </div>
          {/* narrow: two interlocked columns (5 + 4) */}
          <div className="lg:hidden" style={stackVars}>
            <HexColumns cols={columnsFor(stackCols, true)} />
          </div>
        </motion.div>
      )}

      <ProjectDetailDialog
        project={selected}
        hue={selectedIndex >= 0 ? hueFor(selectedIndex) : HUE_SEED}
        open={selected !== null}
        onClose={closeProject}
      />
    </>
  )
}
