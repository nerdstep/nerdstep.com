import { IconArrowUpRight } from '@tabler/icons-react'

import { siteConfig } from '@/lib/config'
import { siteProject } from '@/lib/projects'

import { Anchor } from './ui/anchor'

const builtAt = new Date(__BUILD_DATE__)
const formatMonth = (month: 'long' | 'short') =>
  new Intl.DateTimeFormat('en-US', { month, year: 'numeric', timeZone: 'UTC' }).format(builtAt)

function Updated({ month, className }: { month: 'long' | 'short'; className?: string }) {
  return (
    <span className={className}>
      Updated <time dateTime={__BUILD_DATE__}>{formatMonth(month)}</time>
    </span>
  )
}

/** Thin dot between footer items; hidden where the items wrap onto their own line. */
function Separator({ className }: { className?: string }) {
  return (
    <span aria-hidden className={className}>
      ·
    </span>
  )
}

/**
 * One quiet line. The site is part of the evidence: it runs on the same stack
 * as the projects and its source is public, and the build date shows it's kept up.
 */
export function Footer() {
  // One line from `lg`, where it fits. Below that, two balanced lines: who and
  // when, then what it's built with and the source. Under 360px each item gets
  // its own line. "Updated" sits in a different spot in each layout, and only
  // one of the two is ever displayed.
  return (
    <footer className="p-4">
      <div className="container flex flex-col items-center gap-1 type-meta whitespace-nowrap text-muted-foreground lg:flex-row lg:justify-center lg:gap-x-2.5">
        <span className="flex flex-col items-center gap-x-2.5 min-[360px]:flex-row">
          <span>
            &copy; {builtAt.getUTCFullYear()} {siteConfig.copyright}
          </span>
          <Separator className="hidden min-[360px]:inline lg:hidden" />
          <Updated month="short" className="lg:hidden" />
        </span>
        <Separator className="hidden lg:inline" />
        <span className="flex flex-col items-center gap-x-2.5 min-[360px]:flex-row">
          <span>
            Built <span className="hidden lg:inline">with TanStack Start </span>on Cloudflare
            Workers
          </span>
          <Separator className="hidden min-[360px]:inline" />
          <Anchor
            aria-label="Source code for nerdstep.com on GitHub"
            className="inline-flex items-center gap-0.5 font-normal text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
            href={siteProject.url}
          >
            Source
            <IconArrowUpRight aria-hidden className="size-3.5" />
          </Anchor>
          <Separator className="hidden lg:inline" />
          <Updated month="long" className="hidden lg:inline" />
        </span>
      </div>
    </footer>
  )
}
