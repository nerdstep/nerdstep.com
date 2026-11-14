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

// The featured product cells in the honeycomb flower.
export const projects: Project[] = [
  {
    name: 'mostly.recipes',
    slug: 'mostly-recipes',
    domain: 'mostly.recipes',
    url: 'https://mostly.recipes',
    status: 'live',
    kind: 'product',
    description: 'Private recipe collection, meal planner, and grocery list',
    summary: [
      'Mostly Recipes is a local-first recipe app I built because saving recipes from the web is usually a mess. Paste a recipe link and you get back a clean, searchable copy in your own private collection, with the ads, pop-ups, and life stories left behind.',
      'Recipes can come in from almost anywhere. You can clip them with the Recipe Clipper for Chrome, have ChatGPT or Claude save one straight from a conversation, or type one in by hand. Chef AI can transcribe a photographed recipe card and turn pasted text or a social post into a structured recipe.',
      "From there it's built for actually cooking, with a focused Cook Mode and timers, serving scaling and unit conversion, a weekly meal planner, and a Grocery List organized by aisle that combines ingredients across recipes. Everything is stored on your device first and keeps working offline.",
    ],
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare Workers/D1/R2/KV'],
  },
  {
    name: 'mostly.page',
    slug: 'mostly-page',
    domain: 'mostly.page',
    url: 'https://mostly.page',
    status: 'live',
    kind: 'product',
    description: 'Customizable local-first start page',
    summary: [
      'Mostly Page is a customizable start page that brings together everything you care about in one simple dashboard.',
      'Like the rest of the mostly.* family, it is local-first, so your page lives on your device and is yours to arrange.',
    ],
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare Workers/D1/R2/KV'],
  },
  {
    name: 'mostly.garden',
    slug: 'mostly-garden',
    domain: 'mostly.garden',
    url: 'https://mostly.garden',
    status: 'live',
    kind: 'product',
    description: 'Vegetable garden planner',
    summary: [
      'Mostly Garden is a vegetable garden planner that shows what fits before you plant. You lay out your beds at their real size and place each crop at the spacing it needs, with crowding marked as you go.',
      'It covers 60 crops and over 3,400 varieties, shows which neighbors help or hurt each plant along with the evidence behind each claim, and previews your beds as a pixel-art garden drawn to scale, from seedlings to maturity.',
      'Like the rest of the mostly.* family, it is local-first, so your first garden is saved right in the browser with no account needed.',
    ],
    role: 'creator',
    stack: ['TypeScript', 'React', 'TanStack', 'Cloudflare Workers/D1/R2/KV'],
  },
]

// Listed by the honeycomb's "open source" cell; each opens its own detail dialog.
export const openSourceProjects: Project[] = [
  {
    name: 'recipe-scrapers',
    slug: 'recipe-scrapers',
    domain: 'github.com/recipe-scrapers/recipe-scrapers',
    url: 'https://github.com/recipe-scrapers/recipe-scrapers',
    status: 'live',
    kind: 'oss',
    description: 'Structured recipe extraction for TypeScript',
    summary: [
      'Recipe Scrapers is an open-source TypeScript library for extracting and validating structured recipe data from HTML.',
      "It's a spiritual port of the Python recipe-scrapers package, rebuilt around TypeScript, modern JavaScript tooling, and a strongly typed API.",
      'I built it to power the import pipeline for mostly.recipes, while keeping it useful as a standalone package for other projects.',
    ],
    role: 'creator / maintainer',
    stack: ['Bun', 'TypeScript'],
  },
  {
    name: 'startune',
    slug: 'startune',
    domain: 'github.com/nerdstep/startune',
    url: 'https://github.com/nerdstep/startune',
    status: 'live',
    kind: 'oss',
    description: 'Organize, prune, and rediscover your GitHub stars',
    summary: [
      "StarTune sorts your GitHub stars into GitHub Lists, clears out the dead ones, shows what's taking off, finds the gems you forgot about, and tracks how your own repos are doing.",
      'It runs entirely on your own Cloudflare account as a single Worker, with D1 for storage, Workers AI for list and cruft suggestions, and a daily cron for trending data.',
    ],
    role: 'creator',
    stack: ['TypeScript', 'React', 'Hono', 'Cloudflare Workers/D1', 'Workers AI'],
  },
  {
    name: 'manifesto',
    slug: 'manifesto',
    domain: 'github.com/nerdstep/manifesto',
    url: 'https://github.com/nerdstep/manifesto',
    status: 'live',
    kind: 'oss',
    description: 'Drop an SVG, get every icon asset a website needs',
    summary: [
      'Manifesto is a Windows desktop app for generating website icons. Drop in an SVG and it creates the favicons, touch and maskable icons, a web app manifest, and the <head> tags to paste into your site.',
      "It handles each platform's easy-to-miss quirks, and its previews use the same bytes written to disk, so what you see is what ships.",
    ],
    role: 'creator',
    stack: ['TypeScript', 'Bun', 'Electrobun', 'Preact'],
  },
  {
    name: 'ismjs',
    slug: 'ismjs',
    domain: 'github.com/ismjs/ismjs',
    url: 'https://github.com/ismjs/ismjs',
    status: 'live',
    kind: 'oss',
    description: 'TypeScript codec for U.S. Government security markings',
    summary: [
      'ismjs is a dependency-free TypeScript codec for Information Security Markings (ISM), the Banner Lines and Portion Marks used to label classified and controlled information in U.S. government systems.',
      'It parses, formats, canonicalizes, and validates classic IC, CUI, and Commingled Markings, and ships as ESM, CommonJS, and a self-contained file for air-gapped networks.',
    ],
    role: 'creator',
    stack: ['TypeScript'],
  },
]

export const intro = {
  name: 'Justin Williams',
  role: 'Software Engineer',
  location: 'SF Bay Area, CA',
}
