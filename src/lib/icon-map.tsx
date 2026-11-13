import { IconBrandGithubFilled, IconBrandLinkedin, IconBrandXFilled } from '@tabler/icons-react'

import type { IconElement } from '@/types'

export type IconConfig = {
  label: string
  icon: IconElement
}

export type IconMap = Record<string, IconConfig>

export const iconMap = {
  github: {
    label: 'Github',
    icon: IconBrandGithubFilled,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: IconBrandLinkedin,
  },
  x: {
    label: 'X',
    icon: IconBrandXFilled,
  },
} as const satisfies IconMap
