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

import { FEATURED_HUES, HoneycombCell, OSS_HUE, SITE_HUE } from './honeycomb/cells'
import { type GlowHues, HoneycombLayout } from './honeycomb/layout'

// The dialogs (and Base UI's dialog with them) load in their own chunk. Nothing
// needs them until a cell is clicked or a `?p=` link opens one.
const loadDialogs = () => import('./honeycomb/dialogs')
const OpenSourceDialog = lazy(() =>
  loadDialogs().then((module) => ({ default: module.OpenSourceDialog })),
)
const ProjectDetailDialog = lazy(() =>
  loadDialogs().then((module) => ({ default: module.ProjectDetailDialog })),
)

// Project cells cast a soft glow of their color onto the background.
const glowHues: GlowHues = {
  recipes: FEATURED_HUES[0],
  page: FEATURED_HUES[1],
  garden: FEATURED_HUES[2],
  oss: OSS_HUE,
}

interface FeaturedEntry {
  project: Project
  hue: number
  /** Element that opened the dialog and gets focus back when it closes. */
  triggerId: string
}

// Every project is reachable through `?p=<slug>`. Featured cells open their own
// detail dialog; open-source projects open the open-source list with that
// project expanded.
const featured: FeaturedEntry[] = projects
  .filter((project) => project.slug)
  .map((project, index) => ({
    project,
    hue: FEATURED_HUES[index] ?? OSS_HUE,
    triggerId: `project-${project.slug}`,
  }))
const openSourceSlugs = new Set(openSourceProjects.map((project) => project.slug))

export function Honeycomb() {
  const [siteDialogOpen, setSiteDialogOpen] = useState(false)
  const [openSourceOpen, setOpenSourceOpen] = useState(false)
  const navigate = useNavigate({ from: '/' })
  const { p } = useSearch({ from: '/' })

  const selected = p ? featured.find((entry) => entry.project.slug === p) : undefined
  // Keep showing the last project while its dialog animates closed, and keep
  // `triggerId` controlled (never back to undefined) so focus returns to it.
  const [lastSelected, setLastSelected] = useState(selected)
  if (selected && selected !== lastSelected) {
    setLastSelected(selected)
  }
  const shown = selected ?? lastSelected

  const expandedOss = p && openSourceSlugs.has(p) ? p : null
  const openSourceShown = openSourceOpen || expandedOss !== null
  // Likewise keep the expanded project open while the list animates closed.
  const [lastExpanded, setLastExpanded] = useState(expandedOss)
  if (expandedOss !== null && expandedOss !== lastExpanded) {
    setLastExpanded(expandedOss)
  }

  // Mount the dialogs the first time one is wanted, then keep them mounted so
  // they can animate closed.
  const [dialogsMounted, setDialogsMounted] = useState(false)
  if (!dialogsMounted && (siteDialogOpen || openSourceShown || selected)) {
    setDialogsMounted(true)
  }

  const setProjectParam = (slug: string | null, replace = false) => {
    void navigate({ search: (previous) => ({ ...previous, p: slug ?? undefined }), replace })
  }
  // Expanding or collapsing replaces the history entry, so Back leaves the list
  // instead of stepping through every project that was opened in it.
  const expandOpenSource = (slug: string | null) => {
    setOpenSourceOpen(true)
    setLastExpanded(slug)
    setProjectParam(slug, true)
  }
  const setOpenSourceDialog = (open: boolean) => {
    setOpenSourceOpen(open)
    if (!open && expandedOss) {
      setProjectParam(null, true)
    }
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
    if (p && !selected && !expandedOss) {
      void navigate({
        search: (previous) => ({ ...previous, p: undefined }),
        replace: true,
      })
    }
  }, [p, selected, expandedOss, navigate])

  return (
    <>
      <HoneycombLayout
        glowHues={glowHues}
        renderCell={(id, entrance) => (
          <HoneycombCell
            key={id}
            id={id}
            entrance={entrance}
            onSelectProject={(slug) => setProjectParam(slug)}
            onSelectSite={() => setSiteDialogOpen(true)}
            onSelectOpenSource={() => setOpenSourceOpen(true)}
          />
        )}
      />
      {dialogsMounted && (
        <Suspense fallback={null}>
          <OpenSourceDialog
            hue={OSS_HUE}
            open={openSourceShown}
            onOpenChange={setOpenSourceDialog}
            expanded={openSourceShown ? expandedOss : lastExpanded}
            onExpandedChange={expandOpenSource}
          />
          <ProjectDetailDialog
            project={shown?.project ?? null}
            hue={shown?.hue ?? OSS_HUE}
            open={selected !== undefined}
            onClose={() => setProjectParam(null)}
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
