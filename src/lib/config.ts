import type { Entries } from 'type-fest'
import { iconMap } from '@/lib/icon-map'

export interface SiteConfig {
  name: string
  url: string
  metadataBase: URL
  title: string
  description: string
  keywords: string
  copyright: string
  language: string
  textDirection: string
  image?: string
  manifest: string
  social: {
    github: string
    linkedin: string
    x: string
  }
  icons: {
    icon: string
    shortcut: string
    apple: string
  }
}

export const BASE_URL = 'https://nerdstep.com'

export const siteConfig = {
  name: 'nerdstep',
  url: BASE_URL,
  metadataBase: new URL(BASE_URL),
  title: 'nerdstep',
  description:
    'Justin Williams is a full-stack software engineer in Oakland, California.',
  keywords: '',
  copyright: 'Justin Williams',
  language: 'en',
  textDirection: 'ltr',
  image: `${BASE_URL}/img/nerdstep-icon.svg`,
  manifest: `${BASE_URL}/site.webmanifest`,
  social: {
    github: 'nerdstep',
    linkedin: 'jwilliams42',
    x: 'n3rdstep',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
} as const satisfies SiteConfig

const { social } = siteConfig

// Order by display preference
export const socialLinks = {
  //linkedin: 'https://www.linkedin.com/in/jwilliams42',
  x: `https://x.com/${social.x}`,
  github: `https://github.com/${social.github}`,
} as const satisfies Partial<Record<keyof typeof iconMap, string>>

const socialLinkEntries = Object.entries(socialLinks) as Entries<
  typeof socialLinks
>

export const socialLinkLitems = socialLinkEntries.map(([key, url]) => ({
  key,
  url,
  label: iconMap[key].label,
  icon: iconMap[key].icon,
}))
