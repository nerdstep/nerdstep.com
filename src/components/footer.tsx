import { siteConfig, socialLinks, twitterHandle } from '@/lib/config'
import { Anchor } from './ui/anchor'

export function Footer() {
  return (
    <footer className="border-t bg-background/90">
      <div className="container">
        <div className="py-4 text-sm text-muted-foreground md:flex md:items-center md:justify-between md:py-6">
          <div>
            &copy; {siteConfig.copyright} (
            <Anchor
              aria-label={`@${twitterHandle}'s twitter`}
              href={socialLinks.twitter}>
              @{twitterHandle}
            </Anchor>
            )
          </div>
          <div>
            Created with{' '}
            <img
              alt="vercel logo"
              className="inline-block dark:invert"
              height={16}
              src="/img/vercel.svg"
              width={16}
            />{' '}
            <Anchor href="https://nextjs.org/">Next.js</Anchor> and{' '}
            <img
              alt="tailwind logo"
              className="inline-block"
              height={16}
              src="/img/tailwind.svg"
              width={16}
            />{' '}
            <Anchor href="https://tailwindcss.com/">Tailwind CSS</Anchor>
          </div>
        </div>
      </div>
    </footer>
  )
}
