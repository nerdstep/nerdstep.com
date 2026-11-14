import { Accordion } from '@base-ui/react/accordion'
import { IconArrowUpRight, IconPlus } from '@tabler/icons-react'
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { openSourceProjects, type Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

import { OPEN_SOURCE_TRIGGER_ID, projectKindLabel } from './catalog'
import { ProjectIcon } from './project-icon'

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

// Dialogs are `sm:max-w-2xl` (42rem) with 1rem padding on each side.
const SCREENSHOT_SIZES = '(min-width: 640px) 640px, calc(100vw - 4rem)'

const primaryLinkLabel = (project: Project) =>
  project.kind === 'oss' ? 'View on GitHub' : 'Visit live'

function ProjectStatus({ project, className }: { project: Project; className?: string }) {
  return (
    <span
      className={cn('flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground', className)}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', statusDotColor[project.status])} />
      {statusLabel[project.status]}
    </span>
  )
}

/**
 * Everything about a project below its title: screenshot, summary, role and
 * stack, and links. Shared by the product dialog and the open-source panels.
 */
function ProjectBody({
  project,
  describesDialog = false,
}: {
  project: Project
  /** Mark the summary as the dialog's accessible description. */
  describesDialog?: boolean
}) {
  const summary: ReactNode = Array.isArray(project.summary)
    ? project.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
    : (project.summary ?? project.description)
  const summaryClass = 'space-y-3 text-sm leading-relaxed text-pretty text-muted-foreground'

  return (
    <>
      {project.screenshot ? (
        <img
          alt={project.screenshot.alt}
          className="h-auto w-full rounded-lg border border-border bg-muted/40"
          decoding="async"
          height={project.screenshot.height}
          sizes={SCREENSHOT_SIZES}
          src={project.screenshot.src}
          srcSet={project.screenshot.srcSet}
          width={project.screenshot.width}
        />
      ) : null}

      {describesDialog ? (
        <DialogDescription className={summaryClass} render={<div />}>
          {summary}
        </DialogDescription>
      ) : (
        <div className={summaryClass}>{summary}</div>
      )}

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
  )
}

interface OpenSourceDialogProps {
  hue: number
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Slug of the expanded project, or null when all are collapsed. */
  expanded: string | null
  onExpandedChange: (slug: string | null) => void
}

/**
 * The open-source projects as an accordion: a project expands in place, so
 * there's never a separate view to find your way back from. One at a time, so
 * the list stays short.
 */
export function OpenSourceDialog({
  hue,
  open,
  onOpenChange,
  expanded,
  onExpandedChange,
}: OpenSourceDialogProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  // Once a project has expanded, bring it into view if its panel runs past the
  // bottom of the dialog (e.g. opening a lower one while an upper one closes).
  useEffect(() => {
    if (!open || !expanded) {
      return
    }
    const timeout = setTimeout(() => {
      const popup = popupRef.current
      const item = popup?.querySelector<HTMLElement>(`[data-project="${expanded}"]`)
      if (!popup || !item) {
        return
      }
      if (item.getBoundingClientRect().bottom > popup.getBoundingClientRect().bottom) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        item.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
      }
    }, 250)
    return () => clearTimeout(timeout)
  }, [open, expanded])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} triggerId={OPEN_SOURCE_TRIGGER_ID}>
      <DialogContent ref={popupRef} className="sm:max-w-2xl" style={dialogAccentStyle(hue)}>
        <div>
          <DialogTitle className="text-xl font-semibold tracking-tight">Open source</DialogTitle>
          <span aria-hidden className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)" />
        </div>
        <DialogDescription>Libraries and tools I build in the open.</DialogDescription>
        <Accordion.Root
          className="flex flex-col divide-y divide-border"
          value={expanded ? [expanded] : []}
          onValueChange={(value) => onExpandedChange((value[0] as string | undefined) ?? null)}
        >
          {openSourceProjects.map((project) =>
            project.slug ? (
              <Accordion.Item key={project.slug} value={project.slug} data-project={project.slug}>
                <Accordion.Header className="m-0">
                  <Accordion.Trigger className="group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-3 rounded-md px-2 py-3 text-left text-inherit hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                    <ProjectIcon project={project} className="mt-0.5 size-9" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{project.name}</span>
                        <IconPlus
                          aria-hidden
                          className="size-3.5 text-muted-foreground/70 transition-transform duration-200 group-data-panel-open:rotate-45"
                        />
                        <ProjectStatus project={project} className="ml-auto" />
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {project.description}
                      </span>
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                  <div className="flex flex-col gap-4 pt-1 pb-5">
                    <ProjectBody project={project} />
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            ) : null,
          )}
        </Accordion.Root>
      </DialogContent>
    </Dialog>
  )
}

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
  // Focus the dialog itself on open. The first tabbable element is the link at
  // the bottom, and focusing it scrolled tall dialogs past the title and
  // screenshot. Screen readers still announce the title; Tab reaches the links.
  const popupRef = useRef<HTMLDivElement>(null)

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
        ref={popupRef}
        className="sm:max-w-2xl"
        initialFocus={popupRef}
        style={dialogAccentStyle(hue)}
      >
        {project ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <ProjectIcon project={project} className="mt-1 size-11" />
                <div>
                  <span className="hex-kind text-[0.8125rem] font-medium tracking-tight lowercase">
                    {projectKindLabel[project.kind]}
                  </span>
                  <DialogTitle className="mt-0.5 text-xl font-semibold tracking-tight">
                    {project.name}
                  </DialogTitle>
                  <span
                    aria-hidden
                    className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)"
                  />
                </div>
              </div>
              <ProjectStatus project={project} className="mt-1 mr-8" />
            </div>
            <ProjectBody project={project} describesDialog />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
