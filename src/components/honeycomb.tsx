/**
 * Honeycomb home layout -- hex-shaped glass cells interlocked into a hive.
 *
 * This file is the module's public interface. Cell presentation, content,
 * dialogs, and responsive formation mechanics live in focused implementation
 * modules under `./honeycomb`.
 */
import { useNavigate, useSearch } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'

import { openSourceProjects, type Project, projects, siteProject } from '@/lib/projects'

import { OPEN_SOURCE_TRIGGER_ID } from './honeycomb/catalog'
import { FEATURED_HUES, HoneycombCell, OSS_HUE, SITE_HUE } from './honeycomb/cells'
import { HoneycombLayout } from './honeycomb/layout'

// The dialogs (and Base UI's dialog with them) load in their own chunk. Nothing
// needs them until a cell is clicked or a `?p=` link opens one.
const loadDialogs = () => import('./honeycomb/dialogs')
const OpenSourceDialog = lazy(() =>
  loadDialogs().then((module) => ({ default: module.OpenSourceDialog })),
)
const ProjectDetailDialog = lazy(() =>
  loadDialogs().then((module) => ({ default: module.ProjectDetailDialog })),
)

interface DeepLinkable {
  project: Project
  hue: number
  /** Element that opened the dialog and gets focus back when it closes. */
  triggerId: string
}

// Every project reachable through `?p=<slug>`: featured cells open their own
// dialog, open-source projects open from the open-source cell's list.
const deepLinkable: DeepLinkable[] = [
  ...projects.map((project, index) => ({
    project,
    hue: FEATURED_HUES[index] ?? OSS_HUE,
    triggerId: `project-${project.slug}`,
  })),
  ...openSourceProjects.map((project) => ({
    project,
    hue: OSS_HUE,
    triggerId: OPEN_SOURCE_TRIGGER_ID,
  })),
].filter((entry) => entry.project.slug)

export function Honeycomb() {
  const [siteDialogOpen, setSiteDialogOpen] = useState(false)
  const [openSourceOpen, setOpenSourceOpen] = useState(false)
  const navigate = useNavigate({ from: '/' })
  const { p } = useSearch({ from: '/' })
  const selected = p ? deepLinkable.find((entry) => entry.project.slug === p) : undefined
  // Keep showing the last project while its dialog animates closed, and keep
  // `triggerId` controlled (never back to undefined) so focus returns to it.
  const [lastSelected, setLastSelected] = useState(selected)
  if (selected && selected !== lastSelected) {
    setLastSelected(selected)
  }
  const shown = selected ?? lastSelected
  // Mount the dialogs the first time one is wanted, then keep them mounted so
  // they can animate closed.
  const [dialogsMounted, setDialogsMounted] = useState(false)
  if (!dialogsMounted && (siteDialogOpen || openSourceOpen || selected)) {
    setDialogsMounted(true)
  }

  const openProject = (slug: string) => {
    setOpenSourceOpen(false)
    void navigate({ search: (previous) => ({ ...previous, p: slug }) })
  }
  const closeProject = () => {
    void navigate({ search: (previous) => ({ ...previous, p: undefined }) })
  }

  // Fetch the dialog chunk once the page is idle so the first click is instant.
  useEffect(() => {
    if (typeof requestIdleCallback === 'function') {
      const handle = requestIdleCallback(() => void loadDialogs())
      return () => cancelIdleCallback(handle)
    }
    const timeout = setTimeout(() => void loadDialogs(), 2000)
    return () => clearTimeout(timeout)
  }, [])

  // Remove stale deep links so renamed or mistyped project slugs do not linger.
  useEffect(() => {
    if (p && !selected) {
      void navigate({
        search: (previous) => ({ ...previous, p: undefined }),
        replace: true,
      })
    }
  }, [p, selected, navigate])

  return (
    <>
      <HoneycombLayout
        renderCell={(id, entrance) => (
          <HoneycombCell
            key={id}
            id={id}
            entrance={entrance && id !== 'logo'}
            onSelectProject={openProject}
            onSelectSite={() => setSiteDialogOpen(true)}
            onSelectOpenSource={() => setOpenSourceOpen(true)}
          />
        )}
      />
      {dialogsMounted && (
        <Suspense fallback={null}>
          <OpenSourceDialog
            hue={OSS_HUE}
            open={openSourceOpen}
            onOpenChange={setOpenSourceOpen}
            onSelectProject={openProject}
          />
          <ProjectDetailDialog
            project={shown?.project ?? null}
            hue={shown?.hue ?? OSS_HUE}
            open={selected !== undefined}
            onClose={closeProject}
            triggerId={shown?.triggerId ?? null}
          />
          <ProjectDetailDialog
            project={siteProject}
            hue={SITE_HUE}
            open={siteDialogOpen}
            onClose={() => setSiteDialogOpen(false)}
            triggerId="site-about"
          />
        </Suspense>
      )}
    </>
  )
}
