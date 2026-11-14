import { IconMapPin, IconPlus } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import { Social } from '@/components/social'
import { intro, openSourceProjects, type Project, projects } from '@/lib/projects'

import { type HoneycombCellId, OPEN_SOURCE_TRIGGER_ID, projectKindLabel } from './catalog'
import { Hex, hueFor } from './hex-cell'
import { ProjectIcon } from './project-icon'

interface ContentCellProps {
  hue: number
  entrance: boolean
}

function IntroHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <img
        alt="profile"
        className="rounded-full border-2 border-gray-600/50"
        height={80}
        src="/img/profile-sm.jpg"
        width={80}
      />
      <span className="mt-2 font-bold tracking-tight sm:text-base">{intro.name}</span>
      <span className="text-xs text-muted-foreground">{intro.role}</span>
    </Hex>
  )
}

function ProjectHex({
  project,
  hue,
  onSelect,
  entrance,
}: ContentCellProps & {
  project: Project
  onSelect: (slug: string) => void
}) {
  const slug = project.slug

  return (
    <Hex
      id={slug ? `project-${slug}` : undefined}
      hue={hue}
      entrance={entrance}
      onSelect={slug ? () => onSelect(slug) : undefined}
      label={`Open ${project.name} details`}
    >
      {/* The app icon says more than a "product" label repeated on every cell. */}
      {project.icon ? (
        <ProjectIcon project={project} className="size-8 sm:size-9" />
      ) : (
        <span className="hex-kind text-[0.8125rem] font-medium tracking-tight lowercase">
          {projectKindLabel[project.kind]}
        </span>
      )}
      <span className="mt-2 flex max-w-full min-w-0 flex-wrap items-center justify-center gap-1 text-sm font-semibold tracking-tight wrap-break-word sm:text-base">
        {project.name}
        <IconPlus
          aria-hidden
          className="hex-hover-accent size-3.5 text-muted-foreground/60 transition-all duration-200 group-hover:rotate-90 group-focus-visible:rotate-90 in-data-suppress-hover-motion:transition-none sm:size-4"
        />
      </span>
      {project.status === 'wip' && (
        <span className="mt-1.5 rounded-full border border-amber-500/50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-amber-400">
          coming soon
        </span>
      )}
    </Hex>
  )
}

function OpenSourceHex({ hue, entrance, onSelect }: ContentCellProps & { onSelect: () => void }) {
  return (
    <Hex
      id={OPEN_SOURCE_TRIGGER_ID}
      hue={hue}
      entrance={entrance}
      onSelect={onSelect}
      label="Open the open source projects list"
    >
      <span className="hex-kind text-[0.8125rem] font-medium tracking-tight lowercase">
        {projectKindLabel.oss}
      </span>
      <span className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold tracking-tight sm:text-base">
        {openSourceProjects.length} projects
        <IconPlus
          aria-hidden
          className="hex-hover-accent size-3.5 text-muted-foreground/60 transition-all duration-200 group-hover:rotate-90 group-focus-visible:rotate-90 in-data-suppress-hover-motion:transition-none sm:size-4"
        />
      </span>
    </Hex>
  )
}

function SocialsHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <span className="hex-kind mb-2 text-[0.8125rem] font-medium tracking-tight lowercase">
        connect
      </span>
      <Social />
    </Hex>
  )
}

function StatusHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <IconMapPin aria-hidden className="size-5 text-muted-foreground/60" />
      <span className="mt-1 font-medium">{intro.location}</span>
      <span className="mt-0.5 text-sm text-muted-foreground">
        working at{' '}
        <a
          className="font-semibold"
          href="https://validatek.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          ValidaTek
        </a>
      </span>
    </Hex>
  )
}

function LogoHex({ hue, entrance, onSelect }: ContentCellProps & { onSelect: () => void }) {
  return (
    <Hex
      id="site-about"
      hue={hue}
      entrance={entrance}
      label="About nerdstep.com"
      onSelect={onSelect}
    >
      <img
        alt=""
        className="drop-shadow-[0_0_0.3rem_#ffffff70] invert"
        src="/img/nerdstep-logo.svg"
      />
    </Hex>
  )
}

function ThesisHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <p className="text-sm leading-snug text-balance sm:text-base">
        Building{' '}
        <a
          className="font-medium text-sky-400 italic"
          href="https://mostly.global"
          target="_blank"
          rel="noopener noreferrer"
        >
          mostly
        </a>{' '}
        useful things for the web
      </p>
    </Hex>
  )
}

interface HoneycombCellProps {
  id: HoneycombCellId
  entrance: boolean
  onSelectProject: (slug: string) => void
  onSelectSite: () => void
  onSelectOpenSource: () => void
}

type HoneycombCellRenderer = (props: Omit<HoneycombCellProps, 'id'>) => ReactNode

export const SITE_HUE = hueFor(4)

// Project hues are picked to fit each project rather than generated.
const RED = 355
const BLUE = 210
const GREEN = 130
const PURPLE = 270

export const OSS_HUE = PURPLE
/** Hue per featured project, by index in `projects`; shared with its detail drawer. */
export const FEATURED_HUES = [
  RED, // mostly.recipes
  BLUE, // mostly.page
  GREEN, // mostly.garden
] as const

const cellRenderer: Record<HoneycombCellId, HoneycombCellRenderer> = {
  logo: ({ entrance, onSelectSite }) => (
    <LogoHex hue={SITE_HUE} entrance={entrance} onSelect={onSelectSite} />
  ),
  recipes: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={FEATURED_HUES[0]}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[0]}
    />
  ),
  page: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={FEATURED_HUES[1]}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[1]}
    />
  ),
  oss: ({ entrance, onSelectOpenSource }) => (
    <OpenSourceHex hue={OSS_HUE} entrance={entrance} onSelect={onSelectOpenSource} />
  ),
  intro: ({ entrance }) => <IntroHex hue={hueFor(5)} entrance={entrance} />,
  garden: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={FEATURED_HUES[2]}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[2]}
    />
  ),
  socials: ({ entrance }) => <SocialsHex hue={hueFor(6)} entrance={entrance} />,
  now: ({ entrance }) => <StatusHex hue={hueFor(7)} entrance={entrance} />,
  thesis: ({ entrance }) => <ThesisHex hue={hueFor(8)} entrance={entrance} />,
}

/** Maps a stable layout identity to its cell content. */
export function HoneycombCell({ id, ...props }: HoneycombCellProps) {
  return cellRenderer[id](props)
}
