import { siteConfig, socialLinks } from '@/lib/config'
import { Anchor } from './ui/anchor'

const { copyright, social } = siteConfig

export function Footer() {
  return (
    <footer className="flex h-16 items-center border-t bg-background/90 md:h-20">
      <div className="container">
        <div className="w-full text-muted-foreground text-sm md:flex md:items-center md:justify-between">
          <div>
            &copy; {copyright} (
            <Anchor aria-label={`@${social.x} on X`} href={socialLinks.x}>
              @{social.x}
            </Anchor>
            )
          </div>
          <div className="flex items-center gap-1">
            <span>Created with</span>
            <img
              alt="tanstack logo"
              className="inline-block dark:invert"
              height={16}
              src="/img/tanstack-black.svg"
              width={16}
            />
            <Anchor href="https://tanstack.com/">TanStack</Anchor>
            <span>and</span>
            <img
              alt="tailwind logo"
              className="inline-block"
              height={16}
              src="/img/tailwind.svg"
              width={16}
            />
            <Anchor href="https://tailwindcss.com/">Tailwind CSS</Anchor>
          </div>
        </div>
      </div>
    </footer>
  )
}
