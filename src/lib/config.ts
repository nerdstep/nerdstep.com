import { iconMap } from '@/lib/icon-map'
import { ThemeColorDescriptor } from 'next/dist/lib/metadata/types/metadata-types'
import { Entries } from 'type-fest'

export const themeColor: ThemeColorDescriptor[] = [
  { media: '(prefers-color-scheme: light)', color: 'transparent' },
  { media: '(prefers-color-scheme: dark)', color: 'transparent' },
]

export const siteConfig = {
  name: 'nerdstep',
  url: 'https://www.nerdstep.com',
  title: 'nerdstep',
  description:
    'Justin Williams is a full-stack software engineer in Oakland, California.',
  copyright: 'Justin Williams',
  language: 'en',
  textDirection: 'ltr',
} as const

export const twitterHandle = 'n3rdstep'

// Order by display preference
export const socialLinks = {
  //linkedin: 'https://www.linkedin.com/in/jwilliams42',
  twitter: `https://twitter.com/${twitterHandle}`,
  github: 'https://github.com/nerdstep',
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
