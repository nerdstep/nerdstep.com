import { siteConfig } from './config'
import { createSeoBuilder, type SeoPageInput } from './seo/index'

const DEFAULT_SOCIAL_IMAGE = {
  alt: 'screenshot of nerdstep.com',
  url: '/img/hotlink-ok/nerdstep-screenshot.webp',
  width: 1024,
  height: 600,
}

const buildSeoHead = createSeoBuilder({
  applicationName: siteConfig.name,
  defaultDescription: siteConfig.description,
  defaultImage: DEFAULT_SOCIAL_IMAGE,
  locale: 'en_US',
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
  themeColor: '#0f172b',
  twitterCreator: `@${siteConfig.social.x}`,
  twitterSite: `@${siteConfig.social.x}`,
})

/**
 * Builds complete route head metadata for Mostly Recipes pages.
 */
export function seoHead(input: SeoPageInput) {
  return buildSeoHead(input)
}

/**
 * Builds route meta tags for Mostly Recipes pages.
 */
export function seo(input: SeoPageInput) {
  return seoHead(input).meta
}
