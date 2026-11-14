import {
  IconBrandGithubFilled,
  IconBrandLinkedinFilled,
  IconBrandXFilled,
} from '@tabler/icons-react'

import type { IconElement } from '@/types'

export type IconConfig = {
  label: string
  icon: IconElement
}

export type IconMap = Record<string, IconConfig>

export const iconMap = {
  github: {
    label: 'GitHub',
    icon: IconBrandGithubFilled,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: IconBrandLinkedinFilled,
  },
  x: {
    label: 'X',
    icon: IconBrandXFilled,
  },
} as const satisfies IconMap
