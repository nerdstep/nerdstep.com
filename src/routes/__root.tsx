import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { domAnimation, LazyMotion } from 'motion/react'

import { ErrorPage } from '@/components/error-page'
import { Footer } from '@/components/footer'
import { HexagonGrid } from '@/components/hexagon-grid'
import { NotFound } from '@/components/not-found'
import { siteConfig } from '@/lib/config'
import { seoHead } from '@/lib/seo'

import css from '@/styles/index.css?url'

const { language = 'en', textDirection = 'ltr' } = siteConfig

function RootDocument({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="dark bg-background" dir={textDirection} lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="relative flex min-h-screen min-w-0 flex-col bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    // Components use the slim `m` instead of `motion`, so only the animation
    // features are bundled. `strict` throws if a full `motion` component sneaks in.
    <LazyMotion features={domAnimation} strict>
      <HexagonGrid />
      <main className="container flex flex-auto pt-24 pb-8 md:pt-28">
        <Outlet />
      </main>
      <Footer />
    </LazyMotion>
  )
}

export const Route = createRootRoute({
  head: () => {
    const routeSeo = seoHead({
      // Names the person as well as the site, for tabs, search results, and shared links.
      title: `Justin Williams · ${siteConfig.name}`,
      path: '/',
    })

    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'minimum-scale=1, initial-scale=1, width=device-width',
        },
        ...routeSeo.meta,
      ],
      links: [
        { rel: 'stylesheet', href: css },
        // `sizes` on the ICO lets browsers that support SVG favicons prefer the SVG.
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        ...routeSeo.links,
      ],
    }
  },
  component: RootLayout,
  errorComponent: ({ error, reset }: ErrorComponentProps) => (
    <main className="container flex min-h-screen py-8">
      <ErrorPage error={error} onRetry={reset} />
    </main>
  ),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})
