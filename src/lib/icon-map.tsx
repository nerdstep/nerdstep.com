import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandXFilled,
} from '@tabler/icons-react'
import type { JSX } from 'react'

export type IconConfig = {
  label: string
  icon: JSX.Element
}

export type IconMap = Record<string, IconConfig>

export const iconMap = {
  github: {
    label: 'Github',
    icon: <IconBrandGithubFilled />,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: <IconBrandLinkedin />,
  },
  x: {
    label: 'X',
    icon: <IconBrandXFilled />,
  },
} as const satisfies IconMap
