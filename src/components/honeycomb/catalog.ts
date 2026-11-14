import type { Project } from '@/lib/projects'

/** Canonical identities shared by cell content and formation geometry. */
export const honeycombCellIds = [
  'logo',
  'recipes',
  'page',
  'oss',
  'intro',
  'garden',
  'socials',
  'now',
  'thesis',
] as const

export type HoneycombCellId = (typeof honeycombCellIds)[number]

/** Element id of the open-source cell; its drawer returns focus here. */
export const OPEN_SOURCE_TRIGGER_ID = 'open-source'

/** User-facing project-kind copy shared by cells and drawers. */
export const projectKindLabel: Record<Project['kind'], string> = {
  product: 'product',
  oss: 'open source',
  personal: 'personal',
}
