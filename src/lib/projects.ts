/**
 * Projects and intro copy for the home page.
 */

export type ProjectStatus = 'live' | 'wip'
export type ProjectKind = 'product' | 'oss' | 'personal'

export interface Project {
  name: string
  /** URL-safe id; drives the `?p=<slug>` detail deep-link. */
  slug?: string
  domain: string
  url?: string
  /** Separate repo link, when the primary `url` isn't already GitHub. */
  repo?: string
  status: ProjectStatus
  kind: ProjectKind
  /** Short one-liner shown on the hex. */
  description: string
  /** 2-3 sentence writeup shown in the detail dialog. */
  summary?: string
  /** Your relationship to the project, e.g. "creator & maintainer". */
  role?: string
  /** Tech tags shown in the detail meta row. */
  stack?: string[]
}

const hanstinWedding: Project = {
  name: 'hanstin wedding',
  domain: 'hanstinwedding.nerdstep.com',
  url: 'https://hanstinwedding.nerdstep.com',
  status: 'live',
  kind: 'personal',
  description: 'Our wedding site (2023)',
}

// The three cells that render in the honeycomb flower.
export const projects: Project[] = [
  {
    name: 'mostly.recipes',
    slug: 'mostly-recipes',
    domain: 'mostly.recipes',
    url: 'https://mostly.recipes',
    status: 'live',
    kind: 'product',
    description: 'Personal recipe manager and meal planner',
    summary:
      'Save any recipe from around the web and cook from a clean, ad-free view — no ten-paragraph life story before the ingredients. Import by URL, organize into collections, and plan meals for the week.',
    role: 'creator & maintainer',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare'],
  },
  {
    name: 'mostly.page',
    slug: 'mostly-page',
    domain: 'mostly.page',
    status: 'wip',
    kind: 'product',
    description: 'The next thing in the mostly.* family',
    summary:
      'The next thing in the mostly.* family — still under construction. Replace this with the real pitch once it is ready to share.',
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare'],
  },
  {
    name: 'recipe-scrapers',
    slug: 'recipe-scrapers',
    domain: 'github.com/recipe-scrapers/recipe-scrapers',
    url: 'https://github.com/recipe-scrapers/recipe-scrapers',
    status: 'live',
    kind: 'oss',
    description: 'Recipe scraping library for TypeScript',
    summary:
      'An open-source TypeScript library that extracts structured recipe data — ingredients, steps, yield, timing — from hundreds of cooking sites. It powers the import pipeline behind mostly.recipes.',
    role: 'creator & maintainer',
    stack: ['Bun', 'TypeScript'],
  },
]

// Shown in the honeycomb's "other projects" dialog
export const otherProjects: Project[] = [
  hanstinWedding,
  {
    name: 'nerdstep.com',
    domain: 'github.com/nerdstep/nerdstep.com',
    url: 'https://github.com/nerdstep/nerdstep.com',
    status: 'live',
    kind: 'oss',
    description: 'This site -- TanStack Start on Cloudflare Workers',
  },
]

export const intro = {
  name: 'Justin Williams',
  role: 'Software Engineer',
  location: 'SF Bay Area, CA',
}
