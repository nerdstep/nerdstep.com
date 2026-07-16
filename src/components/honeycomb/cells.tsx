import { IconMapPin, IconPlus } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { Social } from '@/components/social'
import { intro, type Project, projects } from '@/lib/projects'
import { type HoneycombCellId, projectKindLabel } from './catalog'
import { OtherProjectsHex } from './dialogs'
import { Hex, hueFor } from './hex-cell'

interface ContentCellProps {
  hue: number
  entrance: boolean
}

function IntroHex({ hue, entrance }: ContentCellProps) {
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
      <span className="text-muted-foreground text-xs">{intro.role}</span>
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
      hue={hue}
      entrance={entrance}
      onSelect={slug ? () => onSelect(slug) : undefined}
      label={`Open ${project.name} details`}
    >
      <span className="hex-kind font-medium text-[0.8125rem] lowercase tracking-tight">
        {projectKindLabel[project.kind]}
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

function SocialsHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <span className="hex-kind mb-2 font-medium text-[0.8125rem] lowercase tracking-tight">
        connect
      </span>
      <Social />
    </Hex>
  )
}

function NowHex({ hue, entrance }: ContentCellProps) {
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

function LogoHex({
  hue,
  entrance,
  onSelect,
}: ContentCellProps & { onSelect: () => void }) {
  return (
    <Hex
      hue={hue}
      entrance={entrance}
      label="About nerdstep.com"
      onSelect={onSelect}
    >
      <img
        alt="nerdstep"
        className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/img/nerdstep-logo.svg"
      />
    </Hex>
  )
}

function ThesisHex({ hue, entrance }: ContentCellProps) {
  return (
    <Hex hue={hue} entrance={entrance}>
      <p className="text-balance text-sm leading-snug sm:text-base">
        Building{' '}
        <span className="font-medium text-sky-500 italic dark:text-sky-400">
          mostly
        </span>{' '}
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
}

type HoneycombCellRenderer = (
  props: Omit<HoneycombCellProps, 'id'>,
) => ReactNode

export const SITE_HUE = hueFor(4)

const cellRenderer: Record<HoneycombCellId, HoneycombCellRenderer> = {
  logo: ({ entrance, onSelectSite }) => (
    <LogoHex hue={SITE_HUE} entrance={entrance} onSelect={onSelectSite} />
  ),
  recipes: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={hueFor(0)}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[0]}
    />
  ),
  page: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={hueFor(1)}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[1]}
    />
  ),
  parsers: ({ entrance, onSelectProject }) => (
    <ProjectHex
      hue={hueFor(2)}
      entrance={entrance}
      onSelect={onSelectProject}
      project={projects[2]}
    />
  ),
  intro: ({ entrance }) => <IntroHex hue={hueFor(5)} entrance={entrance} />,
  other: ({ entrance }) => (
    <OtherProjectsHex hue={hueFor(3)} entrance={entrance} />
  ),
  socials: ({ entrance }) => <SocialsHex hue={hueFor(6)} entrance={entrance} />,
  now: ({ entrance }) => <NowHex hue={hueFor(7)} entrance={entrance} />,
  thesis: ({ entrance }) => <ThesisHex hue={hueFor(8)} entrance={entrance} />,
}

/** Maps a stable layout identity to its cell content. */
export function HoneycombCell({ id, ...props }: HoneycombCellProps) {
  return cellRenderer[id](props)
}
