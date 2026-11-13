import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'

import { siteConfig } from '@/lib/config'

const { title } = siteConfig

const imageProps = {
  alt: title,
  src: '/img/nerdstep-logo.svg',
  height: 45,
  width: 202,
  animate: 'animate',
  initial: 'initial',
  variants: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
    },
  },
  transition: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
  whileHover: {
    scale: 1.05,
  },
  whileTap: {
    scale: 0.95,
  },
} as const

export function Logo() {
  const location = useLocation()

  return (
    <span className="logo-glow relative flex place-items-center before:absolute before:h-8 before:w-[480px] before:-translate-x-1/3 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-32 after:w-60 after:-translate-x-1/4 after:blur-2xl after:content-[''] before:lg:h-16">
      {location.pathname === '/' ? (
        <motion.img
          {...imageProps}
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        />
      ) : (
        <Link to="/">
          <motion.img {...imageProps} className="dark:invert" />
        </Link>
      )}
    </span>
  )
}
