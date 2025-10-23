import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { siteConfig } from '@/lib/config'

const { title } = siteConfig

export function Logo() {
  const location = useLocation()

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

  return (
    <span className="before:-translate-x-1/3 after:-z-20 after:-translate-x-1/4 relative flex place-items-center before:absolute before:h-[32px] before:w-[480px] before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:h-[128px] after:w-[240px] after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] lg:before:h-[64px] dark:after:from-sky-900 dark:after:via-blue-600 dark:after:opacity-40 dark:before:bg-linear-to-br dark:before:from-transparent dark:before:to-blue-700 dark:before:opacity-10">
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
