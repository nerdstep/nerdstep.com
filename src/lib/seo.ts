import { siteConfig } from './config'
import { createSeoBuilder, type SeoPageInput } from './seo/index'

// JPEG for the social card: link previews don't all accept WebP.
const DEFAULT_SOCIAL_IMAGE = {
  alt: 'The nerdstep.com honeycomb, with cells for Mostly Recipes, Mostly Page, Mostly Garden, open source projects, and Justin Williams',
  url: '/img/hotlink-ok/nerdstep-screenshot.jpg',
  width: 1200,
  height: 630,
}

const buildSeoHead = createSeoBuilder({
  applicationName: siteConfig.name,
  defaultDescription: siteConfig.description,
  defaultImage: DEFAULT_SOCIAL_IMAGE,
  locale: 'en_US',
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
  // The page background (slate-950); the site is dark-only.
  themeColor: '#020617',
  twitterCreator: `@${siteConfig.social.x}`,
  twitterSite: `@${siteConfig.social.x}`,
})

/**
 * Builds complete route head metadata for nerdstep.com pages.
 */
export function seoHead(input: SeoPageInput) {
  return buildSeoHead(input)
}

/**
 * Builds route meta tags for nerdstep.com pages.
 */
export function seo(input: SeoPageInput) {
  return seoHead(input).meta
}
