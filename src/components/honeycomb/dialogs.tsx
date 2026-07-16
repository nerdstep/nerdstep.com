import { IconArrowUpRight, IconPlus } from '@tabler/icons-react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { otherProjects, type Project } from '@/lib/projects'
import { cn } from '@/lib/utils'
import { projectKindLabel } from './catalog'
import { HexFill, hexCellVariants, hexStyle } from './hex-cell'

const statusDotColor: Record<Project['status'], string> = {
  live: 'bg-emerald-500',
  wip: 'bg-amber-500',
}

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  wip: 'In progress',
}

interface OtherProjectsHexProps {
  hue: number
  entrance: boolean
}

export function OtherProjectsHex({ hue, entrance }: OtherProjectsHexProps) {
  const motionProps = entrance
    ? ({ variants: hexCellVariants } as const)
    : ({ initial: false } as const)

  return (
    <Dialog>
      <motion.div
        className="relative shrink-0 bg-border/45 in-data-suppress-hover-motion:transition-none transition-colors duration-200 has-[button:focus-visible]:z-10 has-[button:focus-visible]:bg-(--hex-accent) has-[button:hover]:bg-(--hex-accent)"
        style={hexStyle(hue)}
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
                className="hex-hover-accent-dark hex-hover-ink size-3.5 text-muted-foreground/60 in-data-suppress-hover-motion:transition-none transition-all duration-200 group-hover:rotate-90 group-focus-visible:rotate-90 sm:size-4"
              />
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

interface ProjectDetailDialogProps {
  project: Project | null
  hue: number
  open: boolean
  onClose: () => void
  triggerId?: string
}

/** Controlled project dialog used by both cell clicks and deep links. */
export function ProjectDetailDialog({
  project,
  hue,
  open,
  onClose,
  triggerId,
}: ProjectDetailDialogProps) {
  return (
    <Dialog
      open={open}
      triggerId={triggerId}
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
                  {projectKindLabel[project.kind]}
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

            <DialogDescription
              className="space-y-3 text-pretty text-muted-foreground text-sm leading-relaxed"
              render={<div />}
            >
              {Array.isArray(project.summary)
                ? project.summary.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))
                : (project.summary ?? project.description)}
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
                            className="wrap-break-word max-w-full rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-foreground/80 text-xs"
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
                  In progress
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
