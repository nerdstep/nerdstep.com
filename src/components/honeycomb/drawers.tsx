import { Accordion } from '@base-ui/react/accordion'
import { IconArrowUpRight, IconPlus, IconX } from '@tabler/icons-react'
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
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

/** Portaled drawers sit outside the cell, so they re-derive its accent from the hue. */
const accentStyle = (hue: number) =>
  ({ '--hex-hue': hue, '--hex-accent': 'hsl(var(--hex-hue) 70% 55%)' }) as CSSProperties

// Side drawers are 40rem wide with 1.25rem padding; bottom sheets span the screen.
const SCREENSHOT_SIZES = '(min-width: 640px) 600px, calc(100vw - 2.5rem)'

const primaryLinkLabel = (project: Project) =>
  project.kind === 'oss' ? 'View on GitHub' : 'Visit live'

function ProjectStatus({ project, className }: { project: Project; className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1.5 type-label text-muted-foreground',
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', statusDotColor[project.status])} />
      {statusLabel[project.status]}
    </span>
  )
}

/** The short accent bar under a drawer title, in the cell's hue. */
function AccentBar() {
  return <span aria-hidden className="mt-2 block h-0.5 w-9 rounded-full bg-(--hex-accent)" />
}

interface ProjectDrawerShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Always pass a value (null for none); Base UI warns if it switches to undefined. */
  triggerId: string | null
  hue: number
  /** Title block, kept in view above the scrolling body. */
  header: ReactNode
  children: ReactNode
  bodyRef?: React.Ref<HTMLDivElement>
}

/**
 * Drawer frame shared by the project and open-source drawers. It slides in
 * from the right on wider screens and up as a swipeable sheet on phones. The
 * header (title and close) stays put while only the body scrolls.
 */
function ProjectDrawerShell({
  open,
  onOpenChange,
  triggerId,
  hue,
  header,
  children,
  bodyRef,
}: ProjectDrawerShellProps) {
  const wide = useMediaQuery('(min-width: 640px)')

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      triggerId={triggerId}
      swipeDirection={wide ? 'right' : 'down'}
      showSwipeHandle={!wide}
    >
      <DrawerContent
        className="border-border data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-2.5rem)] data-[swipe-axis=x]:sm:[--drawer-content-width:40rem]"
        style={accentStyle(hue)}
      >
        <DrawerHeader className="flex-row items-start justify-between gap-4 border-b border-border p-5 text-left group-data-[swipe-axis=y]/drawer-popup:text-left">
          {header}
          <DrawerClose
            render={<Button variant="ghost" size="icon-sm" className="-mt-1 -mr-1 shrink-0" />}
          >
            <IconX />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        <div
          ref={bodyRef}
          className="flex min-h-0 flex-1 scrollbar-thin flex-col gap-4 overflow-y-auto overscroll-contain p-5"
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Everything about a project below its title: screenshot, summary, role and
 * stack, and links. Shared by the project drawer and the open-source panels.
 */
function ProjectBody({
  project,
  describesDrawer = false,
}: {
  project: Project
  /** Mark the summary as the drawer's accessible description. */
  describesDrawer?: boolean
}) {
  const summary: ReactNode = Array.isArray(project.summary)
    ? project.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
    : (project.summary ?? project.description)
  // Set for reading: the prose role, brighter than muted text, and lines held
  // to about 65 characters since the drawer is wider than a comfortable
  // measure. (A `ch` cap misleads: it's the width of "0", wider than an
  // average character.)
  const summaryClass = 'max-w-[32rem] space-y-4 type-prose text-pretty text-foreground/85'

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

      {describesDrawer ? (
        <DrawerDescription className={summaryClass} render={<div />}>
          {summary}
        </DrawerDescription>
      ) : (
        <div className={summaryClass}>{summary}</div>
      )}

      {project.role || (project.stack?.length ?? 0) > 0 ? (
        <dl className="flex flex-col gap-3 border-t border-border pt-4">
          {project.role ? (
            <div className="flex items-baseline gap-3 text-sm">
              <dt className="w-12 shrink-0 type-label text-muted-foreground">role</dt>
              <dd className="font-medium">{project.role}</dd>
            </div>
          ) : null}
          {project.stack && project.stack.length > 0 ? (
            <div className="flex items-baseline gap-3">
              <dt className="w-12 shrink-0 type-label text-muted-foreground">stack</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="max-w-full rounded-full border border-border bg-muted/40 px-2 py-0.5 type-label wrap-break-word text-foreground/80"
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

interface OpenSourceDrawerProps {
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
export function OpenSourceDrawer({
  hue,
  open,
  onOpenChange,
  expanded,
  onExpandedChange,
}: OpenSourceDrawerProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  // Once a project has expanded, bring it into view if its panel runs past the
  // bottom of the drawer (e.g. opening a lower one while an upper one closes).
  useEffect(() => {
    if (!open || !expanded) {
      return
    }
    const timeout = setTimeout(() => {
      const body = bodyRef.current
      const item = body?.querySelector<HTMLElement>(`[data-project="${expanded}"]`)
      if (!body || !item) {
        return
      }
      if (item.getBoundingClientRect().bottom > body.getBoundingClientRect().bottom) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        item.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
      }
    }, 250)
    return () => clearTimeout(timeout)
  }, [open, expanded])

  return (
    <ProjectDrawerShell
      open={open}
      onOpenChange={onOpenChange}
      triggerId={OPEN_SOURCE_TRIGGER_ID}
      hue={hue}
      bodyRef={bodyRef}
      header={
        <div>
          <DrawerTitle className="type-title">Open source</DrawerTitle>
          <AccentBar />
          <DrawerDescription className="mt-3">
            Libraries and tools I build in the open.
          </DrawerDescription>
        </div>
      }
    >
      <Accordion.Root
        className="-mt-2 flex flex-col divide-y divide-border"
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
                      <span className="type-name text-foreground">{project.name}</span>
                      <IconPlus
                        aria-hidden
                        className="size-3.5 text-muted-foreground/70 transition-transform duration-200 group-data-panel-open:rotate-45"
                      />
                      <ProjectStatus project={project} className="ml-auto" />
                    </span>
                    <span className="mt-1 block text-sm text-pretty text-muted-foreground">
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
    </ProjectDrawerShell>
  )
}

interface ProjectDetailDrawerProps {
  project: Project | null
  hue: number
  open: boolean
  onClose: () => void
  /** Always pass a value (null for none); Base UI warns if it switches to undefined. */
  triggerId: string | null
}

/** Controlled project drawer used by both cell clicks and deep links. */
export function ProjectDetailDrawer({
  project,
  hue,
  open,
  onClose,
  triggerId,
}: ProjectDetailDrawerProps) {
  return (
    <ProjectDrawerShell
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose()
        }
      }}
      triggerId={triggerId}
      hue={hue}
      header={
        project ? (
          <div className="flex min-w-0 items-start gap-3.5">
            <ProjectIcon project={project} className="mt-1 size-11" />
            <div className="min-w-0">
              <span className="flex items-center gap-3">
                <span className="hex-kind type-label lowercase">
                  {projectKindLabel[project.kind]}
                </span>
                <ProjectStatus project={project} />
              </span>
              <DrawerTitle className="mt-0.5 type-title">{project.name}</DrawerTitle>
              <AccentBar />
            </div>
          </div>
        ) : null
      }
    >
      {project ? <ProjectBody project={project} describesDrawer /> : null}
    </ProjectDrawerShell>
  )
}
