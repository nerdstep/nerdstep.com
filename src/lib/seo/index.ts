import { isString, isUndefined } from 'es-toolkit'
import { normalizeStringList, normalizeText } from '../text'

export type SeoMetaDescriptor =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string }

export type SeoLinkDescriptor =
  | { rel: 'canonical'; href: string }
  | { rel: string; href: string; sizes?: string; type?: string }

export type SeoRobots =
  | string
  | {
      follow?: boolean
      index?: boolean
      unavailableAfter?: string
    }

export interface SeoImage {
  alt?: string
  height?: number
  url: string
  width?: number
}

export type SeoPath = `/${string}`

export interface SeoSiteConfig {
  applicationName: string
  defaultDescription: string
  defaultImage: string | SeoImage
  locale?: string
  siteName: string
  siteUrl: string
  themeColor?: string
  titleTemplate?: string | ((title: string) => string)
  twitterCreator?: string
  twitterSite?: string
}

export interface SeoPageInput {
  description?: string
  image?: string | SeoImage
  keywords?: readonly string[] | string
  path: SeoPath
  robots?: SeoRobots
  title: string
  type?: 'article' | 'profile' | 'website'
}

export interface SeoHead {
  links: SeoLinkDescriptor[]
  meta: SeoMetaDescriptor[]
}

/**
 * Creates an app-scoped SEO builder from shared Mostly metadata rules.
 */
export function createSeoBuilder(siteConfig: SeoSiteConfig) {
  return (pageInput: SeoPageInput) =>
    buildSeoHead({ page: pageInput, site: siteConfig })
}

/**
 * Builds route metadata and canonical links from site defaults plus page input.
 */
export function buildSeoHead({
  page,
  site,
}: {
  page: SeoPageInput
  site: SeoSiteConfig
}): SeoHead {
  const title = formatTitle(page.title, site.titleTemplate)
  const description = page.description ?? site.defaultDescription
  const image = resolveImage(page.image ?? site.defaultImage, site.siteUrl)
  const canonicalUrl = resolveRequiredUrl(page.path, site.siteUrl)
  const keywords = formatKeywords(page.keywords)
  const robots = formatRobots(page.robots)

  return {
    meta: compactMeta([
      { title },
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'application-name', content: site.applicationName },
      { name: 'apple-mobile-web-app-title', content: site.applicationName },
      { name: 'theme-color', content: site.themeColor },
      { name: 'robots', content: robots },
      { property: 'og:type', content: page.type ?? 'website' },
      { property: 'og:site_name', content: site.siteName },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:locale', content: site.locale },
      { property: 'og:image', content: image?.url },
      { property: 'og:image:alt', content: image?.alt },
      { property: 'og:image:width', content: formatNumber(image?.width) },
      { property: 'og:image:height', content: formatNumber(image?.height) },
      {
        name: 'twitter:card',
        content: image ? 'summary_large_image' : 'summary',
      },
      { name: 'twitter:site', content: site.twitterSite },
      { name: 'twitter:creator', content: site.twitterCreator },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:image', content: image?.url },
      { name: 'twitter:image:alt', content: image?.alt },
    ]),
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }
}

function compactMeta(
  descriptors: Array<
    | SeoMetaDescriptor
    | { name: string; content: string | undefined }
    | { property: string; content: string | undefined }
  >,
): SeoMetaDescriptor[] {
  return descriptors.filter((descriptor): descriptor is SeoMetaDescriptor => {
    if ('content' in descriptor) {
      return (
        !isUndefined(descriptor.content) &&
        normalizeText(descriptor.content) !== ''
      )
    }

    return true
  })
}

function formatKeywords(keywords: readonly string[] | string | undefined) {
  if (isUndefined(keywords) || isString(keywords)) {
    return keywords
  }

  const formatted = normalizeStringList([...keywords]).join(', ')

  return formatted.length > 0 ? formatted : undefined
}

function formatNumber(value: number | undefined) {
  return isUndefined(value) ? undefined : String(value)
}

function formatRobots(robots: SeoRobots | undefined) {
  if (isUndefined(robots) || isString(robots)) {
    return robots
  }

  const directives = [
    robots.index === false ? 'noindex' : 'index',
    robots.follow === false ? 'nofollow' : 'follow',
  ]

  if (robots.unavailableAfter) {
    directives.push(`unavailable_after: ${robots.unavailableAfter}`)
  }

  return directives.join(', ')
}

function formatTitle(title: string, template: SeoSiteConfig['titleTemplate']) {
  if (!template) {
    return title
  }

  if (!isString(template)) {
    return template(title)
  }

  return template.includes('%s') ? template.replace('%s', title) : title
}

function resolveImage(
  image: SeoImage | string | undefined,
  siteUrl: string | undefined,
): SeoImage | undefined {
  if (!image) {
    return undefined
  }

  if (isString(image)) {
    return { url: resolveUrl(image, siteUrl) ?? image }
  }

  return {
    ...image,
    url: resolveUrl(image.url, siteUrl) ?? image.url,
  }
}

function resolveUrl(value: string | undefined, siteUrl: string | undefined) {
  const normalizedValue = normalizeText(value)

  if (normalizedValue.length === 0) {
    return undefined
  }

  try {
    return new URL(normalizedValue).toString()
  } catch {
    if (!siteUrl) {
      return normalizedValue
    }

    return new URL(normalizedValue, siteUrl).toString()
  }
}

function resolveRequiredUrl(value: string, siteUrl: string) {
  return new URL(value, siteUrl).toString()
}
