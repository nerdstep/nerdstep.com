import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandTwitterFilled,
} from '@tabler/icons-react'

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
  twitter: {
    label: 'Twitter',
    icon: <IconBrandTwitterFilled />,
  },
} as const satisfies IconMap
