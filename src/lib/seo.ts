import { SiteConfig } from "./config"

export const seo = ({
  title,
  description,
  keywords,
  image,
}: SiteConfig) => {
  // @TODO set theme-color
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: '@n3rdstep' },
    { name: 'twitter:site', content: '@n3rdstep' },
    { name: 'og:type', content: 'website' },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    ...(image
      ? [
          { name: 'twitter:image', content: image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'og:image', content: image },
        ]
      : []),
  ]

  return tags
}
