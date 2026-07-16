import type { Project } from '@/lib/projects'

/** Canonical identities shared by cell content and formation geometry. */
export const honeycombCellIds = [
  'logo',
  'recipes',
  'page',
  'parsers',
  'intro',
  'other',
  'socials',
  'now',
  'thesis',
] as const

export type HoneycombCellId = (typeof honeycombCellIds)[number]

/** User-facing project-kind copy shared by cells and dialogs. */
export const projectKindLabel: Record<Project['kind'], string> = {
  product: 'product',
  oss: 'open source',
  personal: 'personal',
}
