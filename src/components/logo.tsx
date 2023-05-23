'use client'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const { title } = siteConfig

export function Logo() {
  const pathname = usePathname()
  return (
    <span className="relative flex place-items-center before:absolute before:h-[32px] before:w-[480px] before:-translate-x-1/3 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[128px] after:w-[240px] after:-translate-x-1/4 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-blue-600 after:dark:opacity-40 before:lg:h-[64px]">
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
