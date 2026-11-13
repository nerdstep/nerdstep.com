import { siteConfig, socialLinks } from '@/lib/config'

import { Anchor } from './ui/anchor'

const { copyright, social } = siteConfig

export function Footer() {
  return (
    <footer className="flex items-center p-4">
      <div className="container text-center text-muted-foreground text-sm">
        &copy; {copyright} (
        <Anchor aria-label={`${social.github} on GitHub`} href={socialLinks.github}>
          {social.github}
        </Anchor>
        )
      </div>
    </footer>
  )
}
