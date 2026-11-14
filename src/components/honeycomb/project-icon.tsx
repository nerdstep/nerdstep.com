import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

/** A project's app icon. Decorative: the project name always sits beside it. */
export function ProjectIcon({ project, className }: { project: Project; className?: string }) {
  if (!project.icon) {
    return null
  }
  return (
    <img
      alt=""
      className={cn('shrink-0 object-contain', className)}
      decoding="async"
      draggable={false}
      height={64}
      src={project.icon}
      width={64}
    />
  )
}
