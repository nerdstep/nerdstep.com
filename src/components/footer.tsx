import { siteConfig, socialLinks } from '@/lib/config'
import { Anchor } from './ui/anchor'

const { copyright, social } = siteConfig

export function Footer() {
  return (
    <footer className="z-10 flex h-16 items-center border-t bg-background/80 md:h-20">
      <div className="container">
        <div className="w-full text-muted-foreground text-sm md:flex md:items-center md:justify-between">
          <div>
            &copy; {copyright} (
            <Anchor
              aria-label={`${social.github} on GitHub`}
              href={socialLinks.github}
            >
              {social.github}
            </Anchor>
            )
          </div>
          <div className="flex items-center gap-1">
            <span>Created with</span>
            <img
              alt="tanstack logo"
              className="inline-block dark:invert"
              height={16}
              src="/img/tanstack-logo-color-100.png"
              width={16}
            />
            <Anchor href="https://tanstack.com/">TanStack</Anchor>
            <span>+</span>
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
