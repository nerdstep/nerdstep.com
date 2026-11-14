import { IconArrowUpRight, IconPlus } from '@tabler/icons-react'
import type { CSSProperties } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { openSourceProjects, type Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

import { projectKindLabel } from './catalog'

const statusDotColor: Record<Project['status'], string> = {
  live: 'bg-emerald-500',
  wip: 'bg-amber-500',
}

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  wip: 'In progress',
}

/** Portaled dialogs sit outside the cell, so they re-derive its accent from the hue. */
const dialogAccentStyle = (hue: number) =>
  ({ '--hex-hue': hue, '--hex-accent': 'hsl(var(--hex-hue) 70% 55%)' }) as CSSProperties

/** One project in a dialog list; selecting it opens the project's detail dialog. */
function ProjectRow({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <button
      className="group -mx-2 block w-[calc(100%+1rem)] cursor-pointer rounded-md px-2 py-3 text-left text-inherit hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center gap-2">
        <span className="font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
          {project.name}
        </span>
        <IconPlus
          aria-hidden
          className="size-3.5 text-muted-foreground/70 transition-transform duration-200 group-hover:rotate-90 group-focus-visible:rotate-90"
        />
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            aria-hidden
            className={cn('size-1.5 rounded-full', statusDotColor[project.status])}
          />
          {statusLabel[project.status]}
        </span>
      </span>
      <span className="mt-1 block text-sm text-muted-foreground">{project.description}</span>
    </button>
  )
}

/** Element id of the open-source cell; detail dialogs return focus here. */
export const OPEN_SOURCE_TRIGGER_ID = 'open-source'

interface OpenSourceDialogProps {
  hue: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProject: (slug: string) => void
}

/** Lists the open-source projects; picking one hands off to its detail dialog. */
export function OpenSourceDialog({
  hue,
  open,
  onOpenChange,
  onSelectProject,
}: OpenSourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} triggerId={OPEN_SOURCE_TRIGGER_ID}>
      <DialogContent className="sm:max-w-lg" style={dialogAccentStyle(hue)}>
        <div>
          <DialogTitle className="text-xl font-semibold tracking-tight">Open source</DialogTitle>
          <span aria-hidden className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)" />
        </div>
        <p className="text-sm text-muted-foreground">Libraries and tools I build in the open.</p>
        <ul className="flex flex-col divide-y divide-border">
          {openSourceProjects.map((project) => {
            const slug = project.slug
            return slug ? (
              <li key={slug}>
                <ProjectRow project={project} onSelect={() => onSelectProject(slug)} />
              </li>
            ) : null
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
  /** Always pass a value (null for none); Base UI warns if it switches to undefined. */
  triggerId: string | null
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
      <DialogContent className="sm:max-w-lg" style={dialogAccentStyle(hue)}>
        {project ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="hex-kind text-[0.8125rem] font-medium tracking-tight lowercase">
                  {projectKindLabel[project.kind]}
                </span>
                <DialogTitle className="mt-0.5 text-xl font-semibold tracking-tight">
                  {project.name}
                </DialogTitle>
                <span aria-hidden className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)" />
              </div>
              <span className="mt-1 mr-8 flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  aria-hidden
                  className={cn('size-1.5 rounded-full', statusDotColor[project.status])}
                />
                {statusLabel[project.status]}
              </span>
            </div>

            <DialogDescription
              className="space-y-3 text-sm leading-relaxed text-pretty text-muted-foreground"
              render={<div />}
            >
              {Array.isArray(project.summary)
                ? project.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                : (project.summary ?? project.description)}
            </DialogDescription>

            {project.role || (project.stack?.length ?? 0) > 0 ? (
              <dl className="flex flex-col gap-3 border-t border-border pt-4">
                {project.role ? (
                  <div className="flex items-baseline gap-3 text-sm">
                    <dt className="w-12 shrink-0 text-xs text-muted-foreground">role</dt>
                    <dd className="font-medium">{project.role}</dd>
                  </div>
                ) : null}
                {project.stack && project.stack.length > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <dt className="w-12 shrink-0 text-xs text-muted-foreground">stack</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="max-w-full rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium wrap-break-word text-foreground/80"
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
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background no-underline transition-transform hover:-translate-y-px hover:no-underline focus-visible:ring-2 focus-visible:ring-(--hex-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  href={project.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {primaryLinkLabel(project)}
                  <IconArrowUpRight aria-hidden className="size-4" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3.5 py-2 text-sm font-medium text-amber-400">
                  In progress
                </span>
              )}
              {project.repo ? (
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium no-underline transition-colors hover:bg-muted/60 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
