/**
 * Honeycomb home layout -- hex-shaped glass cells interlocked into a hive.
 *
 * This file is the module's public interface. Cell presentation, content,
 * dialogs, and responsive formation mechanics live in focused implementation
 * modules under `./honeycomb`.
 */
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { openSourceProjects, type Project, projects, siteProject } from '@/lib/projects'

import { FEATURED_HUES, HoneycombCell, OSS_HUE, SITE_HUE } from './honeycomb/cells'
import { OPEN_SOURCE_TRIGGER_ID, OpenSourceDialog, ProjectDetailDialog } from './honeycomb/dialogs'
import { HoneycombLayout } from './honeycomb/layout'

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

  const openProject = (slug: string) => {
    setOpenSourceOpen(false)
    void navigate({ search: (previous) => ({ ...previous, p: slug }) })
  }
  const closeProject = () => {
    void navigate({ search: (previous) => ({ ...previous, p: undefined }) })
  }

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
      <OpenSourceDialog
        hue={OSS_HUE}
        open={openSourceOpen}
        onOpenChange={setOpenSourceOpen}
        onSelectProject={openProject}
      />
      <ProjectDetailDialog
        project={selected?.project ?? null}
        hue={selected?.hue ?? OSS_HUE}
        open={selected !== undefined}
        onClose={closeProject}
        triggerId={selected?.triggerId}
      />
      <ProjectDetailDialog
        project={siteProject}
        hue={SITE_HUE}
        open={siteDialogOpen}
        onClose={() => setSiteDialogOpen(false)}
        triggerId="site-about"
      />
    </>
  )
}
