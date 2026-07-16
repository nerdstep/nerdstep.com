/**
 * Honeycomb home layout -- hex-shaped glass cells interlocked into a hive.
 *
 * This file is the module's public interface. Cell presentation, content,
 * dialogs, and responsive formation mechanics live in focused implementation
 * modules under `./honeycomb`.
 */
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { projects, siteProject } from '@/lib/projects'
import { HoneycombCell, SITE_HUE } from './honeycomb/cells'
import { ProjectDetailDialog } from './honeycomb/dialogs'
import { HUE_SEED, hueFor } from './honeycomb/hex-cell'
import { HoneycombLayout } from './honeycomb/layout'

export function Honeycomb() {
  const [siteDialogOpen, setSiteDialogOpen] = useState(false)
  const navigate = useNavigate({ from: '/' })
  const { p } = useSearch({ from: '/' })
  const selectedIndex = projects.findIndex((project) => project.slug === p)
  const selectedProject = selectedIndex >= 0 ? projects[selectedIndex] : null

  const openProject = (slug: string) => {
    void navigate({ search: (previous) => ({ ...previous, p: slug }) })
  }
  const closeProject = () => {
    void navigate({ search: (previous) => ({ ...previous, p: undefined }) })
  }

  // Remove stale deep links so renamed or mistyped project slugs do not linger.
  useEffect(() => {
    if (p && selectedIndex < 0) {
      void navigate({
        search: (previous) => ({ ...previous, p: undefined }),
        replace: true,
      })
    }
  }, [p, selectedIndex, navigate])

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
          />
        )}
      />
      <ProjectDetailDialog
        project={selectedProject}
        hue={selectedIndex >= 0 ? hueFor(selectedIndex) : HUE_SEED}
        open={selectedProject !== null}
        onClose={closeProject}
        triggerId={
          selectedProject?.slug ? `project-${selectedProject.slug}` : undefined
        }
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
