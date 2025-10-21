'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/config'

const { title } = siteConfig

export function Logo() {
  const pathname = usePathname()
  return (
    <span className="before:-translate-x-1/3 after:-z-20 after:-translate-x-1/4 relative flex place-items-center before:absolute before:h-[32px] before:w-[480px] before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:h-[128px] after:w-[240px] after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] lg:before:h-[64px] dark:after:from-sky-900 dark:after:via-blue-600 dark:after:opacity-40 dark:before:bg-linear-to-br dark:before:from-transparent dark:before:to-blue-700 dark:before:opacity-10">
      {pathname === '/' ? (
        <img
          alt={title}
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          height={45}
          src="/img/nerdstep-logo.svg"
          width={202}
        />
      ) : (
        <Link href="/">
          <img
            alt={title}
            className="dark:invert"
            height={45}
            src="/img/nerdstep-logo.svg"
            width={202}
          />
        </Link>
      )}
    </span>
  )
}
