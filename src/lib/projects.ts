/**
 * Projects and intro copy for the home page.
 */

export type ProjectStatus = 'live' | 'wip'
export type ProjectKind = 'product' | 'oss' | 'personal'
export type ProjectSummary = string | readonly string[]

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
  /** One or more paragraphs shown in the detail dialog. */
  summary?: ProjectSummary
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

export const siteProject: Project = {
  name: 'nerdstep.com',
  domain: 'nerdstep.com',
  url: 'https://github.com/nerdstep/nerdstep.com',
  status: 'live',
  kind: 'oss',
  description: 'Personal site built on the Cloudflare developer platform',
  summary:
    'My personal corner of the web. The site is open source and built as a TanStack Start application deployed to Cloudflare Workers.',
  role: 'creator',
  stack: ['TypeScript', 'React', 'TanStack Start', 'Cloudflare Workers'],
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
    summary: [
      'Mostly Recipes is a local-first recipe app I built because saving recipes from the web is usually a mess.',
      "You paste in a URL, and it extracts the recipe into a clean, editable format, with all of the details saved to your local device. The app works offline, avoids the usual ads and clutter, and keeps the recipe data under the user's control.",
      "It also includes AI-assisted imports for recipes that don't follow a standard format, generated cover images, and a meal planner for organizing what to cook throughout the week.",
    ],
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare Workers/D1/R2/KV'],
  },
  {
    name: 'mostly.page',
    slug: 'mostly-page',
    domain: 'mostly.page',
    status: 'wip',
    kind: 'product',
    description: 'The next thing in the mostly.* family',
    summary: 'The next thing in the mostly.* family — under construction.',
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare Workers/D1/R2/KV'],
  },
  {
    name: 'recipe-scrapers',
    slug: 'recipe-scrapers',
    domain: 'github.com/recipe-scrapers/recipe-scrapers',
    url: 'https://github.com/recipe-scrapers/recipe-scrapers',
    status: 'live',
    kind: 'oss',
    description: 'Recipe scraping library for TypeScript',
    summary: [
      'Recipe Scrapers is an open-source TypeScript library for extracting structured recipe data from cooking sites.',
      "It's a spiritual port of the Python recipe-scrapers package, rebuilt around TypeScript, modern JavaScript tooling, and a strongly typed API.",
      'I built it to power the import pipeline for mostly.recipes, while keeping it useful as a standalone package for other projects.',
    ],
    role: 'creator / maintainer',
    stack: ['Bun', 'TypeScript'],
  },
]

// Shown in the honeycomb's "other projects" dialog.
export const otherProjects: Project[] = [hanstinWedding]

export const intro = {
  name: 'Justin Williams',
  role: 'Software Engineer',
  location: 'SF Bay Area, CA',
}
